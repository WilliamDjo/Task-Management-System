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

admin_1 = {
    "username": "sanyamjain2",
    "password": "Testpass123",
    "first_name": "Admin",
    "last_name": "Admin",
    "sys_admin": True,
    "email": "adminer@admin.com",
}

# # test user registration
# response = requests.post(
#     f"{BASE_URL}/signup",
#     json=user_1,
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]
# headers = {
#     "Authorization": f"Bearer {token}",
# }

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
# headers = {
#     "Authorization": f"Bearer {token}",
# }

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
# headers = {
#     "Authorization": f"Bearer {token}",
# }

# headers = {
#     "Authorization": f"Bearer {token}",
# }

# response = requests.post(f"{BASE_URL}/logout", json={"token": token})
# resp_json = response.json()
# print(resp_json)


# # test user registration
# response = requests.post(
#     f"{BASE_URL}/signup",
#     json=admin_1,
# )
# resp_json = response.json()
# print(resp_json)
# token = resp_json["Token"]
# headers = {
#     "Authorization": f"Bearer {token}",
# }

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
# headers = {
#     "Authorization": f"Bearer {token}",
# }

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
print(headers)
response = requests.post(f"{BASE_URL}/getuserprofile", headers=headers)
resp_json = response.json()
print(resp_json)

data_1 = {
    "title": "For Demo2",
    "description": "Task Description",
    "deadline": "2023-31-07",
    "progress": "Not Started",
    "cost_per_hr": 10,
    "assignee": "sanyamjain1@gmail.com",
    "estimation_spent_hrs": 0,
    "actual_time_hr": 0,
    "priority": 2,
    "labels": ["Label1", "Label2"],
}
data_2 = {
    "title": "For Demo2",
    "description": "Task Description",
    "deadline": "2023-31-07",
    "progress": "Not Started",
    "cost_per_hr": 10,
    "assignee": "sanyamjain2@gmail.com",
    "estimation_spent_hrs": 0,
    "actual_time_hr": 0,
    "priority": 2,
    "labels": ["Label1", "Label2"],
}

response = requests.post(f"{BASE_URL}/task/create", headers=headers, json=data_1)

resp_json = response.json()
print(resp_json)
response = requests.post(f"{BASE_URL}/task/create", headers=headers, json=data_2)

resp_json = response.json()
print(resp_json)
