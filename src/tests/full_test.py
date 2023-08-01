import email
from re import A
import unittest
import requests
import json
import os
import sys


parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)



from database import db_helper

BASE_URL = "http://127.0.0.1:5000"  # adjust if your app runs on different settings

user_1 = {
    "username": "will_bill_short",
    "password": "Testpass123",
    "first_name": "William",
    "last_name": "Sh",
    "sys_admin": False,
    "email": "willbur@gmail.com",
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
    "username": "AdminUser1",
    "password": "Testpass123",
    "first_name": "Admin",
    "last_name": "Admin",
    "sys_admin": True,
    "email": "adminer@admin.com",
}

task_1 = {
    "title": "Task Title",
    "description": "Task Description",
    "deadline": "2023-31-07",
    "progress": "Not Started",
    "cost_per_hr": 10,
    "assignee": "",
    "estimation_spent_hrs": 0,
    "actual_time_hr": 0,
    "priority": 2,
    "labels": ["Label1", "Label2"],
}

task_2 = {
    "title": "New",
    "description": "New Task Description",
    "deadline": "2023-31-07",
    "progress": "Completed",
    "cost_per_hr": 10,
    "assignee": "",
    "estimation_spent_hrs": 0,
    "actual_time_hr": 0,
    "priority": 2,
    "labels": ["Label1", "Label2"],
}


def clear_db():
    db_helper.clear_collection("user_info")
    db_helper.clear_collection("user_profile")
    db_helper.clear_collection("task_system")
    db_helper.clear_collection("sequence_collection")


'''
class SignupEndpointTest(unittest.TestCase):
    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = "http://127.0.0.1:5000"

    def test_successful_signup(self):
        clear_db()
        # Prepare the data for a successful signup
        data = user_1

        # Make the POST request to the signup endpoint
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Signup request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertIn("Token", response_data, "Token key not found in response")
        self.assertIn("Sys_admin", response_data, "Sys_admin key not found in response")

        # Check if the signup was successful
        self.assertTrue(response_data["Success"], "Signup was not successful")

        # Check if the token is not empty
        self.assertNotEqual(response_data["Token"], "", "Token is empty")


class LoginEndpointTest(unittest.TestCase):

    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register a test user before running the login tests
        clear_db()
        self.register_test_user()

    def register_test_user(self):
        data = user_1

        response = requests.post(self.base_url + "/signup", json=data)
        response_data = response.json()
        self.assertEqual(response_data['Success'], True)

    def test_successful_login(self):
        # Prepare data for a successful login
        data = {
            "email": user_1['email'],
            "password":user_1['password'],
        }

        # Make the POST request to the login endpoint
        response = requests.post(self.base_url + "/login", json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Login request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertIn("Token", response_data, "Token key not found in response")
        self.assertIn("Sys_admin", response_data, "Sys_admin key not found in response")

        self.assertTrue(response_data["Success"], "Login was not successful")

        self.assertNotEqual(response_data["Token"], "", "Token is empty")

    def test_invalid_credentials(self):
        # Prepare data with invalid credentials
        data = {
            "email": "testuser@example.com",
            "password": "InvalidPassword123!",
        }
        response = requests.post(self.base_url + "/login", json=data)

        # self.assertEqual(response.status_code, 401, "Login request should fail with invalid credentials")

        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertFalse(response_data["Success"], "Login should not be successful with invalid credentials")


    def test_nonexistent_user(self):
        # Prepare data with an email that does not exist in the system
        data = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123!",
        }
        response = requests.post(self.base_url + "/login", json=data)
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the login was not successful
        self.assertFalse(response_data["Success"], "Login should not be successful with nonexistent user")

class LogoutEndpointTest(unittest.TestCase):

    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        clear_db()
        # Register and login a test user before running the logout tests
        self.token = self.register_and_login_test_user()

    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_logout(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Make the POST request to the logout endpoint with authentication headers
        response = requests.post(self.base_url + "/logout", headers=headers)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Logout request failed")

        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        self.assertTrue(response_data["Success"], "Logout was not successful")

    def test_unauthorized_logout(self):
        # No authentication token provided, intentionally causing an unauthorized logout attempt
        headers = {}

        # Make the POST request to the logout endpoint without authentication headers
        response = requests.post(self.base_url + "/logout", headers=headers)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Logout request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the logout was not successful
        self.assertFalse(response_data["Success"], "Logout should not be successful without authentication")
    

    def test_invalid_token_format(self):
        headers = {
            "Authorization": "InvalidTokenFormat " + self.token
        }

        response = requests.post(self.base_url + "/logout", headers=headers)
        self.assertEqual(response.status_code, 400, "Logout request should fail with invalid token format")

        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the logout was not successful
        self.assertFalse(response_data["Success"], "Logout should not be successful with invalid token format")

    def test_no_token_provided(self):
    
        headers = {}
        response = requests.post(self.base_url + "/logout", headers=headers)
        self.assertEqual(response.status_code, 401, "Logout request should fail without authentication")
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertFalse(response_data["Success"], "Logout should not be successful without authentication")

class UpdateUsernameEndpointTest(unittest.TestCase):

    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        clear_db()
        # Register and login a test user before running the update_username tests
        self.token = self.register_and_login_test_user()

   
    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_username_update(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for updating the username
        data = {
            "username": "newusername"
        }

        # Make the PUT request to the update/username endpoint with authentication headers
        response = requests.put(self.base_url + "/update/username", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Username update request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the username update was successful
        self.assertTrue(response_data["Success"], "Username update was not successful")

    def test_unauthorized_username_update(self):
        # No authentication token provided, intentionally causing an unauthorized username update attempt
        headers = {}

        # Prepare data for updating the username
        data = {
            "username": "newusername"
        }

        # Make the PUT request to the update/username endpoint without authentication headers
        response = requests.put(self.base_url + "/update/username", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Username update request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the username update was not successful
        self.assertFalse(response_data["Success"], "Username update should not be successful without authentication")

    def test_invalid_token_format(self):
        # Prepare the authentication headers with an invalid token format
        headers = {
            "Authorization": "InvalidTokenFormat " + self.token
        }

        # Prepare data for updating the username
        data = {
            "username": "newusername"
        }

        # Make the PUT request to the update/username endpoint with an invalid token format
        response = requests.put(self.base_url + "/update/username", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 400 - Bad Request)
        self.assertEqual(response.status_code, 400, "Username update request should fail with invalid token format")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the username update was not successful
        self.assertFalse(response_data["Success"], "Username update should not be successful with invalid token format")

class UpdateEmailEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        self.base_url = BASE_URL
        # Register and login a test user before running the update_email tests
        self.token = self.register_and_login_test_user()

   
    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token


    def test_successful_email_update(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for updating the email
        data = {
            "email": "newemail@example.com"
        }

        # Make the PUT request to the update/email endpoint with authentication headers
        response = requests.put(self.base_url + "/update/email", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Email update request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the email update was successful
        self.assertTrue(response_data["Success"], "Email update was not successful")

    def test_unauthorized_email_update(self):
        # No authentication token provided, intentionally causing an unauthorized email update attempt
        headers = {}

        # Prepare data for updating the email
        data = {
            "email": "newemail@example.com"
        }

        # Make the PUT request to the update/email endpoint without authentication headers
        response = requests.put(self.base_url + "/update/email", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Email update request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the email update was not successful
        self.assertFalse(response_data["Success"], "Email update should not be successful without authentication")

    def test_invalid_token_format(self):
        # Prepare the authentication headers with an invalid token format
        headers = {
            "Authorization": "InvalidTokenFormat " + self.token
        }

        # Prepare data for updating the email
        data = {
            "email": "newemail@example.com"
        }

        # Make the PUT request to the update/email endpoint with an invalid token format
        response = requests.put(self.base_url + "/update/email", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 400 - Bad Request)
        self.assertEqual(response.status_code, 400, "Email update request should fail with invalid token format")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the email update was not successful
        self.assertFalse(response_data["Success"], "Email update should not be successful with invalid token format")


class UpdatePasswordEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the update_password tests
        self.token = self.register_and_login_test_user()

      
    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_password_update(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for updating the password
        data = {
            "password": "NewSecurePassword123!"
        }

        # Make the PUT request to the update/password endpoint with authentication headers
        response = requests.put(self.base_url + "/update/password", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Password update request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the password update was successful
        self.assertTrue(response_data["Success"], "Password update was not successful")

    def test_unauthorized_password_update(self):
        # No authentication token provided, intentionally causing an unauthorized password update attempt
        headers = {}

        # Prepare data for updating the password
        data = {
            "password": "NewSecurePassword123!"
        }

        # Make the PUT request to the update/password endpoint without authentication headers
        response = requests.put(self.base_url + "/update/password", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Password update request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the password update was not successful
        self.assertFalse(response_data["Success"], "Password update should not be successful without authentication")

    def test_invalid_token_format(self):
        # Prepare the authentication headers with an invalid token format
        headers = {
            "Authorization": "InvalidTokenFormat " + self.token
        }

        # Prepare data for updating the password
        data = {
            "password": "NewSecurePassword123!"
        }

        # Make the PUT request to the update/password endpoint with an invalid token format
        response = requests.put(self.base_url + "/update/password", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 400 - Bad Request)
        self.assertEqual(response.status_code, 400, "Password update request should fail with invalid token format")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the password update was not successful
        self.assertFalse(response_data["Success"], "Password update should not be successful with invalid token format")

class UpdateNotificationsEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        self.base_url = BASE_URL
        # Register and login a test user before running the update_notifications tests
        self.token = self.register_and_login_test_user()


    def register_and_login_test_user(self):
        data = user_1
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_notification_update(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for updating the notification settings (value = True)
        data = {
            "value": True
        }

        # Make the PUT request to the update/notifications endpoint with authentication headers
        response = requests.put(self.base_url + "/update/notifications", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Notification update request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the notification update was successful
        self.assertTrue(response_data["Success"], "Notification update was not successful")

    def test_unauthorized_notification_update(self):
        # No authentication token provided, intentionally causing an unauthorized notification update attempt
        headers = {}

        # Prepare data for updating the notification settings (value = True)
        data = {
            "value": True
        }

        # Make the PUT request to the update/notifications endpoint without authentication headers
        response = requests.put(self.base_url + "/update/notifications", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Notification update request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the notification update was not successful
        self.assertFalse(response_data["Success"], "Notification update should not be successful without authentication")


class GetUserProfileEndpointTest(unittest.TestCase):
    def setUp(self):
        clear_db()
        self.base_url = BASE_URL
        # Register and login a test user before running the update_notifications tests
        self.token = self.register_and_login_test_user()

    def register_and_login_test_user(self):
        data = user_1
        response = requests.post(self.base_url + "/signup", json=data)

        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")

        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_get_user_profile(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Make the GET request to the getuserprofile endpoint with authentication headers
        response = requests.get(self.base_url + "/getuserprofile", headers=headers)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Get user profile request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertIn("Data", response_data, "Data key not found in response")

        # Check if the getuserprofile was successful
        self.assertTrue(response_data["Success"], "Get user profile was not successful")

    def test_unauthorized_get_user_profile(self):
        # No authentication token provided, intentionally causing an unauthorized getuserprofile attempt
        headers = {}

        # Make the GET request to the getuserprofile endpoint without authentication headers
        response = requests.get(self.base_url + "/getuserprofile", headers=headers)


        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the getuserprofile was not successful
        self.assertFalse(response_data["Success"], "Get user profile should not be successful without authentication")



class GetAllUsersEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the getallusers tests
        self.token = self.register_and_login_test_user()

    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)


        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")


        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

  
    def test_successful_get_all_users(self):
        # Prepare the authentication headers with the token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Make the POST request to the getallusers endpoint with authentication headers
        response = requests.post(self.base_url + "/getallusers", headers=headers)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Get all users request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        self.assertIn("Data", response_data, "Data key not found in response")

        # Check if the getallusers was successful
        self.assertTrue(response_data["Success"], "Get all users was not successful")

    def test_unauthorized_get_all_users(self):
        # No authentication token provided, intentionally causing an unauthorized getallusers attempt
        headers = {}

        # Make the POST request to the getallusers endpoint without authentication headers
        response = requests.post(self.base_url + "/getallusers", headers=headers)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 401, "Get all users request should fail without authentication")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the getallusers was not successful
        self.assertFalse(response_data["Success"], "Get all users should not be successful without authentication")


class AdminResetPasswordEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        self.base_url = BASE_URL
        self.admin_token = self.register_and_login_test_admin()
        self.user_token = self.register_and_login_test_user()

    def register_and_login_test_admin(self):
            # Prepare data for registering a test user
            data = admin_1
            # Make the POST request to register the test user
            response = requests.post(self.base_url + "/signup", json=data)

            self.assertEqual(response.status_code, 200, "Test user registration failed")

            response_data = response.json()
            token = response_data["Token"]
            return token


    def register_and_login_test_user(self):

            data = user_1
            response = requests.post(self.base_url + "/signup", json=data)

            self.assertEqual(response.status_code, 200, "Test user registration failed")

            response_data = response.json()
            token = response_data["Token"]
            return token


    def test_successful_admin_reset_password(self):
        # Prepare the authentication headers with the admin token
        headers = {
            "Authorization": "Bearer " + self.admin_token
        }

        # Prepare data for admin reset password
        data = {
            "token": self.admin_token,  # Sending the admin token in the request JSON (can also be in headers)
            "email": user_1['email'],  # Email of the user whose password needs to be reset
            "password": "NewSecurePassword123!"  # New password for the user
        }

        # Make the PUT request to the admin/reset endpoint with authentication headers and data
        response = requests.put(self.base_url + "/admin/reset", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Admin reset password request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the admin reset password was successful
        self.assertTrue(response_data["Success"], "Admin reset password was not successful")

    def test_unauthorized_admin_reset_password(self):
        # Prepare the authentication headers with the user token (intentionally causing an unauthorized attempt)
        headers = {
            "Authorization": "Bearer " + self.user_token
        }

        # Prepare data for admin reset password
        data = {
            "token": self.user_token,  # Sending the admin token in the request JSON (can also be in headers)
            "email": user_1['email'],  # Email of the user whose password needs to be reset
            "password": "NewSecurePassword123!"  # New password for the user
        }

        # Make the PUT request to the admin/reset endpoint with user token (unauthorized)
        response = requests.put(self.base_url + "/admin/reset", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 200, "Admin reset password request should fail with unauthorized user token")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the admin reset password was not successful
        self.assertFalse(response_data["Success"], "Admin reset password should not be successful with unauthorized user token")
 
class AdminDeleteEmailEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        self.base_url = BASE_URL
        # Register and login a test admin before running the admin_delete_email tests
        self.admin_token = self.register_and_login_test_admin()
        # Register and login a test user before running the admin_delete_email tests
        self.user_token = self.register_and_login_test_user()

    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1


        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)


        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")


        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def register_and_login_test_admin(self):
        # Prepare data for registering a test user
        data = admin_1


        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/signup", json=data)


        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")


        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_admin_delete_email(self):
        # Prepare the authentication headers with the admin token
        headers = {
            "Authorization": "Bearer " + self.admin_token
        }

        # Prepare data for admin delete email
        data = {
            "email": user_1['email']  # Email of the user to be deleted
        }

        # Make the DELETE request to the admin/delete endpoint with authentication headers and data
        response = requests.delete(self.base_url + "/admin/delete", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Admin delete email request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the admin delete email was successful
        self.assertTrue(response_data["Success"], "Admin delete email was not successful")

    def test_unauthorized_admin_delete_email(self):
        # Prepare the authentication headers with the user token (intentionally causing an unauthorized attempt)
        headers = {
            "Authorization": "Bearer " + self.user_token
        }

        # Prepare data for admin delete email
        data = {
            "email": user_1['email']
        }

        # Make the DELETE request to the admin/delete endpoint with user token (unauthorized)
        response = requests.delete(self.base_url + "/admin/delete", headers=headers, json=data)

        # Check if the request was unsuccessful (status code 401 - Unauthorized)
        self.assertEqual(response.status_code, 200, "Admin delete email request should fail with unauthorized user token")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the admin delete email was not successful
        self.assertFalse(response_data["Success"], "Admin delete email should not be successful with unauthorized user token")

class ResetPasswordEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        self.register_and_login_test_user()


    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        response = requests.post(self.base_url + "/signup", json=data)

        self.assertEqual(response.status_code, 200, "Test user registration failed")

        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_reset_password(self):
        # Prepare data for reset password
        data = {
            "email": user_1["email"]  # Email of the user whose password needs to be reset
        }

        # Make the PUT request to the reset/password endpoint with data
        response = requests.put(self.base_url + "/reset/password", json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Reset password request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")

        # Check if the reset password was successful
        self.assertTrue(response_data["Success"], "Reset password was not successful")




class CreateTaskEndpointTest(unittest.TestCase):

    def setUp(self):
        clear_db()
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the create_task tests
        self.token = self.register_and_login_test_user()

    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1
        response = requests.post(self.base_url + "/signup", json=data)
        self.assertEqual(response.status_code, 200, "Test user registration failed")
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_create_task(self):
        # Prepare the authentication headers with the user token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for creating a task
        data = task_1

        # Make the POST request to the task/create endpoint with authentication headers and data
        response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Create task request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        # self.assertIn("Message", response_data, "Message key not found in response")
        # Include other expected keys in the response as needed

        # Check if the create task was successful
        response_data = response.json()
        self.assertTrue(response_data["Success"], "Create task was not successful")
    

class GetAssignedTasksToCurrEndpointTest(unittest.TestCase):

    def setUp(self):
        # clear_db()
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the get_assigned_tasks_to_curr tests
        self.token = self.register_and_login_test_user()


    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/login", json=data)
        
        # Check if the user registration was successful (status code 200)
        # self.assertEqual(response.status_code, 200, "Test user registration failed")
        response_data = response.json()
        token = response_data["Token"]

        headers = {
            "Authorization": "Bearer " + token
        }

        # Prepare data for creating a task
        data = task_1

        # Make the POST request to the task/create endpoint with authentication headers and data
        response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        # self.assertEqual(response.status_code, 200, "Create task request failed")

        # Extract the token from the login response
        response_data = response.json()

        return token


    def test_successful_get_assigned_tasks_to_curr(self):
        # Prepare the authentication headers with the user token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Make the GET request to the task/getAllAssignedTocurr endpoint with authentication headers
        response = requests.get(self.base_url + "/task/getAllAssignedTocurr", headers=headers)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Get assigned tasks to current user request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        # Include other expected keys in the response as needed

        # Check if getting assigned tasks to current user was successful
        self.assertTrue(response_data["Success"], "Getting assigned tasks to current user was not successful")



class GetAllTasksEndpointTest(unittest.TestCase):
    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the get_all_tasks tests
        self.token = self.register_and_login_test_user()
    
    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1


        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/login", json=data)


        # Check if the user registration was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Test user registration failed")


        # Extract the token from the login response
        response_data = response.json()
        token = response_data["Token"]
        return token

    def test_successful_get_all_tasks(self):
        # Prepare the authentication headers with the user token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Make the GET request to the task/getAll endpoint with authentication headers
        response = requests.get(self.base_url + "/task/getAll", headers=headers)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Get all tasks request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        # self.assertIn("Message", response_data, "Message key not found in response")
        # Include other expected keys in the response as needed

        # Check if getting all tasks was successful
        self.assertTrue(response_data["Success"], "Getting all tasks was not successful")

        # Check if the response contains the task data (assuming the "Data" key exists in the response)
        self.assertIn("Data", response_data, "Data key not found in response")
        tasks_data = response_data["Data"]
        self.assertIsInstance(tasks_data, list, "Data should be a list of tasks")
'''
class UpdateTaskEndpointTest(unittest.TestCase):

    def setUp(self):
        # Assuming the API is running locally on port 5000
        self.base_url = BASE_URL
        # Register and login a test user before running the update_task tests
        self.token, self.task_id = self.register_and_login_test_user()


    def register_and_login_test_user(self):
        # Prepare data for registering a test user
        data = user_1

        # Make the POST request to register the test user
        response = requests.post(self.base_url + "/login", json=data)
        
        # Check if the user registration was successful (status code 200)
        # self.assertEqual(response.status_code, 200, "Test user registration failed")
        response_data = response.json()
        token = response_data["Token"]

        headers = {
            "Authorization": "Bearer " + token
        }

        # Prepare data for creating a task
        data = task_1

        # Make the POST request to the task/create endpoint with authentication headers and data
        response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        # self.assertEqual(response.status_code, 200, "Create task request failed")

        # Extract the token from the login response
        response_data = response.json()
        task_id = response_data['id']
        return token, task_id

    def test_successful_update_task(self):
        # Prepare the authentication headers with the user token
        headers = {
            "Authorization": "Bearer " + self.token
        }

        # Prepare data for updating a task (assuming the task_id exists in the database)
        task_id = self.task_id  # Replace this with a valid task_id
        data = task_2

        # Make the PUT request to the task/update/<task_id> endpoint with authentication headers and data
        response = requests.put(self.base_url + f"/task/update/{task_id}", headers=headers, json=data)

        # Check if the request was successful (status code 200)
        self.assertEqual(response.status_code, 200, "Update task request failed")

        # Check if the response contains the expected keys
        response_data = response.json()
        self.assertIn("Success", response_data, "Success key not found in response")
        self.assertIn("Message", response_data, "Message key not found in response")
        # Include other expected keys in the response as needed

        # Check if updating the task was successful
        print(response_data['Message'])
        self.assertTrue(response_data["Success"], "Updating the task was not successful")

   

# class DeleteTaskEndpointTest(unittest.TestCase):

#     def setUp(self):
#         # Assuming the API is running locally on port 5000
#         self.base_url = BASE_URL
#         # Register and login a test user before running the delete_task tests
#         self.token, self.task_id = self.register_and_login_test_user()

#     def register_and_login_test_user(self):
#         # Prepare data for registering a test user
#         data = user_1

#         # Make the POST request to register the test user
#         response = requests.post(self.base_url + "/login", json=data)
        
#         # Check if the user registration was successful (status code 200)
#         # self.assertEqual(response.status_code, 200, "Test user registration failed")
#         response_data = response.json()
#         token = response_data["Token"]

#         headers = {
#             "Authorization": "Bearer " + token
#         }

#         # Prepare data for creating a task
#         data = task_1

#         # Make the POST request to the task/create endpoint with authentication headers and data
#         response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

#         # Check if the request was successful (status code 200)
#         # self.assertEqual(response.status_code, 200, "Create task request failed")

#         # Extract the token from the login response
#         response_data = response.json()
#         task_id = response_data['Task_id']
#         return token, task_id

#     def test_successful_delete_task(self):
#         # Prepare the authentication headers with the user token
#         headers = {
#             "Authorization": "Bearer " + self.token
#         }

#         # Assume you have a valid task_id for a task that you want to delete
#         task_id = self.task_id  # Replace this with a valid task_id

#         # Make the DELETE request to the task/delete/<task_id> endpoint with authentication headers
#         response = requests.delete(self.base_url + f"/task/delete/{task_id}", headers=headers)

#         # Check if the request was successful (status code 200)
#         self.assertEqual(response.status_code, 200, "Delete task request failed")

#         # Check if the response contains the expected keys
#         response_data = response.json()
#         # Include other expected keys in the response as needed

#         # Check if deleting the task was successful
#         self.assertTrue(response_data["Success"], "Deleting the task was not successful")



# class GetTaskDetailsEndpointTest(unittest.TestCase):

#     def setUp(self):
#         # Assuming the API is running locally on port 5000
#         self.base_url = BASE_URL
#         # Register and login a test user before running the delete_task tests
#         self.token, self.task_id = self.register_and_login_test_user()

#     def register_and_login_test_user(self):
#         # Prepare data for registering a test user
#         data = user_1

#         # Make the POST request to register the test user
#         response = requests.post(self.base_url + "/login", json=data)
        
#         # Check if the user registration was successful (status code 200)
#         # self.assertEqual(response.status_code, 200, "Test user registration failed")
#         response_data = response.json()
#         token = response_data["Token"]

#         headers = {
#             "Authorization": "Bearer " + token
#         }

#         # Prepare data for creating a task
#         data = task_1

#         # Make the POST request to the task/create endpoint with authentication headers and data
#         response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

#         # Check if the request was successful (status code 200)
#         # self.assertEqual(response.status_code, 200, "Create task request failed")

#         # Extract the token from the login response
#         response_data = response.json()
#         task_id = response_data['id']
#         print("task id: ")
#         print(task_id)
#         return token, task_id


#     def test_successful_get_task_details(self):
#         # Prepare the authentication headers with the user token
#         headers = {
#             "Authorization": "Bearer " + self.token,
#             "task_id": self.task_id 
#         }


#         # Make the GET request to the task/get endpoint with authentication headers
#         response = requests.get(self.base_url + "/task/get", headers=headers)

#         # Check if the request was successful (status code 200)
#         self.assertEqual(response.status_code, 200, "Get task details request failed")

#         # Check if the response contains the expected keys
#         response_data = response.json()
#         self.assertIn("Success", response_data, "Success key not found in response")
#         self.assertIn("Message", response_data, "Message key not found in response")
#         # Include other expected keys in the response as needed
    

#         # Check if getting the task details was successful
#         self.assertTrue(response_data["Success"], "Getting the task details was not successful")

#         # Check if the response contains the task details (assuming the "Data" key exists in the response)
#         self.assertIn("Data", response_data, "Data key not found in response")
#         task_details = response_data["Data"]
#         # Optionally, check if the task_details have the expected keys and values



# class CreateTaskEndpointTest(unittest.TestCase):

#     def setUp(self):
#         # Assuming the API is running locally on port 5000
#         self.base_url = BASE_URL
#         # Register and login a test user before running the create_task tests
#         self.token = self.register_and_login_test_user()

#     def register_and_login_test_user(self):
#         # Prepare data for registering a test user
#         data = user_1
#         response = requests.post(self.base_url + "/login", json=data)
#         self.assertEqual(response.status_code, 200, "Test user registration failed")
#         response_data = response.json()
#         token = response_data["Token"]
#         return token

#     def test_successful_create_task(self):
#         # Prepare the authentication headers with the user token
#         headers = {
#             "Authorization": "Bearer " + self.token
#         }

#         # Prepare data for creating a task
#         data = task_1

#         # Make the POST request to the task/create endpoint with authentication headers and data
#         response = requests.post(self.base_url + "/task/create", headers=headers, json=data)

#         # Check if the request was successful (status code 200)
#         self.assertEqual(response.status_code, 200, "Create task request failed")

#         # Check if the response contains the expected keys
#         response_data = response.json()
#         self.assertIn("Success", response_data, "Success key not found in response")
#         # self.assertIn("Message", response_data, "Message key not found in response")
#         # Include other expected keys in the response as needed

#         # Check if the create task was successful
#         response_data = response.json()
#         self.assertTrue(response_data["Success"], "Create task was not successful")
    

if __name__ == "__main__":
    unittest.main()
