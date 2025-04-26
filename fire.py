import requests
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd

# Load your dataset
df = pd.read_csv("forestfires.csv")  # <-- Replace with your actual dataset filename

# Preprocess
scaler = MinMaxScaler()
X = df[["FFMC", "DMC", "DC", "ISI", "temp", "RH", "wind", "rain"]]
y_fire_size = df["Classes"]
y_time = df["SpreadTime"]  # <-- Assume you have spread time in your dataset

X_scaled = scaler.fit_transform(X)

# Split into training sets
X_train, X_test, y_fire_train, y_fire_test = train_test_split(X_scaled, y_fire_size, test_size=0.2, random_state=42)
_, _, y_time_train, y_time_test = train_test_split(X_scaled, y_time, test_size=0.2, random_state=42)

# Models
fire_size_model = RandomForestClassifier()
fire_size_model.fit(X_train, y_fire_train)

time_model = RandomForestRegressor()
time_model.fit(X_train, y_time_train)

# Function to fetch weather data
def fetch_weather_data(city, api_key):
    print(f"Fetching weather data for {city}...")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()

    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"]

    if "rain" in data and "1h" in data["rain"]:
        rain_mm = data["rain"]["1h"]
        rain_condition = "light" if rain_mm < 5 else "heavy"
    else:
        rain_condition = "no rain"

    return temp, humidity, wind_speed, rain_condition

# Predict function
def predict_fire(city_name, api_key):
    # Weather API data
    temp, humidity, wind_speed, rain_condition = fetch_weather_data(city_name, api_key)

    # Take remaining manual inputs
    print("Enter the terrain conditions manually:")
    ffmc = float(input("FFMC (e.g., 85): "))
    dmc = float(input("DMC (e.g., 50): "))
    dc = float(input("DC (e.g., 200): "))
    isi = float(input("ISI (e.g., 15): "))

    # Convert conditions to model input
    if humidity < 30:
        humidity_cat = "dry"
    elif humidity < 60:
        humidity_cat = "not dry"
    else:
        humidity_cat = "wet"

    if wind_speed < 2:
        wind_cat = "low"
    elif wind_speed < 5:
        wind_cat = "moderate"
    else:
        wind_cat = "strong"

    # Mapping humidity
    humidity_map = {"dry": 20, "not dry": 50, "wet": 80}
    wind_map = {"low": 1, "moderate": 3, "strong": 6}
    rain_map = {"no rain": 0, "light": 2, "heavy": 10}

    # Prepare input
    new_data = np.array([
        ffmc,
        dmc,
        dc,
        isi,
        temp,
        humidity_map.get(humidity_cat, 50),
        wind_map.get(wind_cat, 3),
        rain_map.get(rain_condition, 0)
    ]).reshape(1, -1)

    new_data_scaled = scaler.transform(new_data)

    # Prediction
    fire_size_pred = fire_size_model.predict(new_data_scaled)
    time_pred = time_model.predict(new_data_scaled)

    # Results
    print(f"\nThe predicted fire size is: {fire_size_pred[0]}")
    print(f"The predicted time for fire to spread is: {round(time_pred[0], 2)} hours")

    # Map fire size for heatmap
    fire_size_mapping = {"small": 1, "medium": 2, "large": 3}
    fire_size_num = fire_size_mapping.get(fire_size_pred[0], 0)

    sns.heatmap(
        np.array([[fire_size_num, time_pred[0]]]),
        annot=True,
        fmt='.2f',
        cmap='coolwarm',
        xticklabels=["Fire Size (1=Small,2=Medium,3=Large)", "Time Spread (hrs)"],
        yticklabels=["Prediction"]
    )
    plt.title(f"Fire Prediction for {city_name}")
    plt.show()

# ---- MAIN ----
if __name__ == "__main__":
    api_key = "9fc99ada13b22920ee80cc7885bdf8a2"  # <-- Insert your OpenWeather API key here
    city_name = input("Enter the city name: ")
    predict_fire(city_name, api_key)
