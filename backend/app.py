from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import requests
import folium  
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# Your entire training code (what you pasted) should be run once here 
df = pd.read_csv('forestfires.csv')
df['Classes'] = df['area'].apply(lambda x: 'small' if x <= 5 else 'large')
df['SpreadTime'] = df['area'] / 30

features = ['FFMC', 'DMC', 'DC', 'ISI', 'temp', 'RH', 'wind', 'rain']
X = df[features]
y_fire_size = df['Classes']
y_time = df['SpreadTime']

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

fire_size_model = RandomForestClassifier()
fire_size_model.fit(X_scaled, y_fire_size)

time_model = RandomForestRegressor()
time_model.fit(X_scaled, y_time)

app = Flask(__name__)

API_KEY = "9fc99ada13b22920ee80cc7885bdf8a2"

# Function to fetch weather
def fetch_weather_data(city_name):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    data = response.json()

    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]

    if "rain" in data:
        rain_1h = data["rain"].get("1h", 0)
        if rain_1h == 0:
            rain_condition = "no rain"
        elif rain_1h < 2:
            rain_condition = "light"
        else:
            rain_condition = "heavy"
    else:
        rain_condition = "no rain"

    lat = data["coord"]["lat"]
    lon = data["coord"]["lon"]

    return temp, humidity, wind_speed, rain_condition, lat, lon

# Mapping function
def map_conditions(humidity, wind_speed, rain_condition):
    if humidity < 30:
        hum = "dry"
    elif 30 <= humidity <= 60:
        hum = "not dry"
    else:
        hum = "wet"

    if wind_speed < 3:
        wind = "low"
    elif 3 <= wind_speed <= 6:
        wind = "moderate"
    else:
        wind = "strong"

    return hum, wind, rain_condition

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    city_name = data.get('city')

    # Fetch weather
    temp, humidity, wind_speed, rain_condition, lat, lon = fetch_weather_data(city_name)
    hum, wind, rain = map_conditions(humidity, wind_speed, rain_condition)

    # Input from user
    ffmc = data.get('FFMC')
    dmc = data.get('DMC')
    dc = data.get('DC')
    isi = data.get('ISI')

    hum_mapping = {"dry": 20, "not dry": 50, "wet": 80}
    wind_mapping = {"low": 2, "moderate": 4.5, "strong": 7}
    rain_mapping = {"no rain": 0, "light": 0.5, "heavy": 5}

    input_data = [[
        ffmc,
        dmc,
        dc,
        isi,
        temp,
        hum_mapping[hum],
        wind_mapping[wind],
        rain_mapping[rain]
    ]]

    input_data_scaled = scaler.transform(input_data)

    fire_size_pred = fire_size_model.predict(input_data_scaled)[0]
    time_pred = time_model.predict(input_data_scaled)[0]

    spread_minutes = time_pred * 60
    if time_pred < 0.5:
        speed = "VERY FAST"
    elif time_pred < 1.5:
        speed = "FAST"
    else:
        speed = "SLOW"

    # Return JSON response
    return jsonify({
        'Fire_Size': fire_size_pred,
        'Spread_Time_Hours': round(time_pred, 2),
        'Spread_Time_Minutes': round(spread_minutes, 1),
        'Speed': speed,
        'Location': {
            'Latitude': lat,
            'Longitude': lon
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
