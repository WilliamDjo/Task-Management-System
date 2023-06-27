import unittest
from flask import Flask, json
from server import app


class SignupTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_successful_signup(self):
        # Provide test data
        data = {
            'name': 'John Doe',
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


   


if __name__ == '__main__':
    unittest.main()
