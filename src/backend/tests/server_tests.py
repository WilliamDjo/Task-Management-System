import imp
from optparse import check_choice
import unittest
import sys
import os
from flask import Flask, json




""" Accessing Other Files"""
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from server import app
from database.db import clear_collection
from tokens import check_jwt_token
from account import active_users

class SignupTest(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_successful_signup(self):
        # Provide test data
        data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    def test_invalid_name_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'John',
            'last_name' : 'Doe123',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_invalid_name_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'John21',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_invalid_password_signup(self):

        clear_collection('user_info')
        data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'pa',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)
    
    def test_invalid_email_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'ibalid 12#@fm.com',  # Invalid email format
            'password': 'password123',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_invalid_username_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'j',  # Username too short
            'email': 'john@example.com',
            'password': 'password123',
            'sys_admin': False
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_sys_admin_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'Admin',
            'last_name' : 'User',
            'username': 'adminuser',
            'email': 'admin@example.com',
            'password': 'Admin123!',
            'sys_admin': True
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)


    def test_sys_admin_invalid_signup(self):
        clear_collection('user_info')
        data = {
            'first_name': 'Admin',
            'last_name' : 'User123',
            'username': 'adminuser',
            'email': 'admin@example.com',
            'password': 'Admin123!',
            'sys_admin': True
        }

        # Send a POST request
        response = self.app.post('/signup', data=json.dumps(data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class LoginTests(unittest.TestCase):
    
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_valid_login(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    def test_invalid_email_login(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with invalid email
        login_data = {
            'email': 'invalid_email',  # Invalid email format
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains an error message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    
    def test_invalid_password_login(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with invalid password
        login_data = {
            'email': 'john@example.com',
            'password': 'wrong_password'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains an error message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


    def test_inactive_user_login(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'password123',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Logout the user
        logout_data = {
            'token': 'user_token'  # Provide an invalid token to simulate logout
        }

        self.app.post('/logout', data=json.dumps(logout_data), content_type='application/json')

        # Login with inactive user
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains an error message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class LogoutTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_valid_logout(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login the user
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        login_response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')
        login_response_data = json.loads(login_response.data)
        token = login_response_data['token']

        # Logout the user
        logout_data = {
            'token': token
        }
        response = self.app.post('/logout', data=json.dumps(logout_data), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        assert(token not in [active_users.values])

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    #returns error code 500: TODO: check
    def test_invalid_token_logout(self):
        clear_collection('user_info')
        # Logout with invalid token
        logout_data = {
            'token': 'invalid_token'
        }
        response = self.app.post('/logout', data=json.dumps(logout_data), content_type='application/json')

        # Assert the response status code is 500
        self.assertEqual(response.status_code, 500)

        # Assert the response contains an error message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class UpdateUsernameTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_update_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_username = {
            'token': 'token',
            'new_username': 'username'
        }
        response = self.app.put('/update/username', data=json.dumps(updated_username), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    def test_update_invalid_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_username = {
            'token': token,
            'new_username': 'j' #username too short
        }
        response = self.app.put('/update/username', data=json.dumps(updated_username), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_update_same_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_username = {
            'token': 'token',
            'new_username': 'johndoe' #username is unchanged
        }
        response = self.app.put('/update/username', data=json.dumps(updated_username), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class UpdateEmailTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_update_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_email = {
            'token': token,
            'new_email': 'email@email.com'
        }
        response = self.app.put('/update/email', data=json.dumps(updated_email), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    def test_update_invalid_email(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_email = {
            'token': token,
            'email': 'invalid_email',  # Invalid email format
        }
        response = self.app.put('/update/email', data=json.dumps(updated_email), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_update_same_email(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_email = {
            'token': token,
            'email': 'john@example.com' #email is unchanged
        }
        response = self.app.put('/update/emal', data=json.dumps(updated_email), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class UpdatePasswordTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_update_password(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_password = {
            'token': token,
            'new_password': 'password'
        }
        response = self.app.put('/update/password', data=json.dumps(updated_password), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)

    def test_update_invalid_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_password = {
            'token': token,
            'new_password': 'p' #password too short
        }
        response = self.app.put('/update/password', data=json.dumps(updated_password), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)

    def test_update_same_username(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_password = {
            'token': token,
            'new_password': 'Password123!'
        }
        response = self.app.put('/update/password', data=json.dumps(updated_password), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], False)


class UpdateNotifsTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_update_notifs(self):
        clear_collection('user_info')
        # Register a user
        register_data = {
            'first_name': 'John',
            'last_name' : 'Doe',
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'Password123!',
            'sys_admin': False
        }
        self.app.post('/signup', data=json.dumps(register_data), content_type='application/json')

        # Login with valid credentials
        login_data = {
            'email': 'john@example.com',
            'password': 'Password123!'
        }
        response = self.app.post('/login', data=json.dumps(login_data), content_type='application/json')

        # Update with new credentials
        updated_notifs = {
            'token': token,
            'value': value
        }
        response = self.app.put('/update/notifications', data=json.dumps(updated_notifs), content_type='application/json')

        # Assert the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert the response contains a success message
        response_data = json.loads(response.data)
        self.assertEqual(response_data['Success'], True)


if __name__ == '__main__':
    unittest.main()