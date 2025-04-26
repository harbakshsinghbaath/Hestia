import requests

url = 'http://127.0.0.1:5000/predict'

data = {
    'city': 'delhi',
    'FFMC': 85,
    'DMC': 50,
    'DC': 200,
    'ISI': 15
}

response = requests.post(url, json=data)

print(response.json())
