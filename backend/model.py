# model.py

def predict_fire_risk(data):
    """
    data: dict with weather features
    """
    temp = data.get("temperature", 0)
    wind_speed = data.get("wind_speed", 0)
    humidity = data.get("humidity", 0)

    # Simple custom logic (replace with your trained model later)
    risk_score = (temp / 50) + (wind_speed / 100) - (humidity / 100)

    if risk_score > 0.8:
        return "extreme"
    elif risk_score > 0.6:
        return "high"
    elif risk_score > 0.3:
        return "medium"
    else:
        return "low"
.