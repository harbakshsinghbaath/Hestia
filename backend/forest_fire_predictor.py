import pandas as pd
import numpy as np
import requests
import folium  
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor


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


def fetch_weather_data(city_name, api_key):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()

    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]
    lat = data["coord"]["lat"]
    lon = data["coord"]["lon"]


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

    return temp, humidity, wind_speed, rain_condition, lat, lon


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


def predict_fire(city_name, api_key):
    print(f"\nFetching weather data for {city_name}...\n")
    temp, humidity, wind_speed, rain_condition, lat, lon = fetch_weather_data(city_name, api_key)

    hum, wind, rain = map_conditions(humidity, wind_speed, rain_condition)

    print(f"Fetched weather:\nTemperature: {temp} °C\nHumidity: {humidity}% ({hum})\nWind Speed: {wind_speed} m/s ({wind})\nRain: {rain}\n")

    ffmc = float(input("Enter FFMC value (e.g., 85): "))
    dmc = float(input("Enter DMC value (e.g., 50): "))
    dc = float(input("Enter DC value (e.g., 200): "))
    isi = float(input("Enter ISI value (e.g., 15): "))

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

    print("\n--- 🔥 Prediction Results ---")
    print(f"🔥 Fire Size Prediction: {fire_size_pred.upper()}")
    print(f"🕒 Estimated Spread Time: {time_pred:.2f} hours ({spread_minutes:.1f} minutes)")


    if time_pred < 0.5:
        speed = "VERY FAST"
    elif time_pred < 1.5:
        speed = "FAST"
    else:
        speed = "SLOW"

    print(f"🚀 Fire Spread Speed: {speed}")


    m = folium.Map(location=[lat, lon], zoom_start=10)

    if fire_size_pred == 'small':
        color = 'green'
        radius = 500
    else:
        color = 'red'
        radius = 1500

    folium.CircleMarker(
        location=[lat, lon],
        radius=radius,
        color=color,
        fill=True,
        fill_opacity=0.6,
        popup=f"🔥 Fire Size: {fire_size_pred.upper()}\n🕒 Spread Time: {time_pred:.2f} hours\n🚀 Speed: {speed}",
    ).add_to(m)

    m.save('fireprediction_map.html')
    print("\n Map generated! Open 'fire_prediction_map.html' to view it.")

if __name__ == "__main__":
    api_key = "9fc99ada13b22920ee80cc7885bdf8a2"  
    city_name = input("Enter the city name: ")
    predict_fire(city_name.lower(), api_key)

