import requests
import json


BASE_URL = "http://localhost:5000"  # adjust if your app runs on different settings

user_1 = {
    "username": "sanyamjain1",
    "password": "Testpass123",
    "first_name": "Sanyam",
    "last_name": "Jain",
    "sys_admin": False,
    "email": "sanyamjain1@gmail.com",
}

user_2 = {
    "username": "sanyamjain2",
    "password": "Testpass123",
    "first_name": "Sanyam",
    "last_name": "Jain",
    "sys_admin": False,
    "email": "sanyamjain2@gmail.com",
}

# # test user registration
# response = requests.post(
#     f"{BASE_URL}/signup",
#     json=user_1,
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]
# response = requests.post(f"{BASE_URL}/logout", json={"token": token})
# resp_json = response.json()
# print(resp_json)

# # test login
# response = requests.post(
#     f"{BASE_URL}/login",
#     json={"email": user_1["email"], "password": user_1["password"]},
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]

# # test logout
# response = requests.post(f"{BASE_URL}/logout", json={"token": token})

# # test user registration
# response = requests.post(
#     f"{BASE_URL}/signup",
#     json=user_2,
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]
# response = requests.post(f"{BASE_URL}/logout", json={"token": token})
# resp_json = response.json()
# print(resp_json)

# # test login
# response = requests.post(
#     f"{BASE_URL}/login",
#     json={"email": user_2["email"], "password": user_2["password"]},
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]

# # test logout
# response = requests.post(f"{BASE_URL}/logout", json={"token": token})

response = requests.post(
    f"{BASE_URL}/login",
    json={"email": user_2["email"], "password": user_2["password"]},
)
resp_json = response.json()
token = resp_json["Token"]
print(resp_json)

headers = {
    "Authorization": f"Bearer {token}",
}

response = requests.post(f"{BASE_URL}/getuserprofile", headers=headers)
resp_json = response.json()
print(resp_json)
