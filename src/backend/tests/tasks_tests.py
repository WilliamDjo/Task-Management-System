import os
import sys
import unittest

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

import task_sys 
from account import account_register, account_login, active_users
from database.db import clear_collection
from tokens import active_tokens

def test_regiser():

    first_name = "John"
    last_name = "Doe"
    username = "johndoe"
    email = "johndoe@example.com"
    password = "Password123!"
    sys_admin = False
    result = account_register(first_name, last_name, username, email, password, sys_admin)
    return result['token']


def test_login():
    email = "johndoe@example.com"
    password = "Password123!"
    result = account_login(email, password)

    return result['token']

def create_task_for_test():

    clear_db()
    token = test_regiser()
    data = {
        "token": token,
        "title": "Task Title",
        "description": "Task Description",
        "deadline": "2023-31-07",
        "progress": "Not Started",
        "cost_per_hr": 10,
        "estimation_spent_hrs": 0,
        "actual_time_hr": 0,
        "priority": 2,
        "labels": ["Label1", "Label2"]
    }
    result = task_sys.create_task(data)
    return result['task_id']

def clear_db():
    clear_collection('user_info')
    clear_collection('task_system')
    clear_collection('sequence_collection')

class CreateTaskTestCase(unittest.TestCase):
    
    def test_create_task_with_valid_data(self):
        clear_db()
        token = test_regiser()

        data = {
            
            "token": token,
            "title": "Task Title",
            "description": "Task Description",
            "deadline": "2023-31-07",
            "progress": "Not Started",
            "cost_per_hr": 10,
            "estimation_spent_hrs": 0,
            "actual_time_hr": 0,
            "priority": 2,
            "labels": ["Label1", "Label2"]
        }

        result = task_sys.create_task(data)
       
        if not result["Success"]:
            print(result)

        self.assertTrue(result["Success"])

    def test_update_task_title_with_valid_title(self):

        title = "New Task Title"
        task_id = create_task_for_test()

        result = task_sys.update_task_title(task_id, title)

        if not result["Success"]:
            print(result)

        self.assertTrue(result["Success"])

    def test_update_task_desc_with_valid_description(self):
        
        task_id = create_task_for_test()
        description = "New Task Description"

        result = task_sys.update_task_desc(task_id, description)

        if not result["Success"]:
            print(result)


        self.assertTrue(result["Success"])

    def test_update_cost_with_valid_cost(self):
        task_id = create_task_for_test()
        new_cost = 10

        result = task_sys.update_cost(task_id, new_cost)

        self.assertTrue(result["Success"])

if __name__ == "__main__":
    unittest.main()
