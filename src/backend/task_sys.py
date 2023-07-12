import hashlib
from json.tool import main
import sys
import os
import re
from turtle import title, update
from account import is_email_valid


parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db_tasks
import tokens
from datetime import datetime
from account import is_email_valid
from database.db import checkUser
from database.db import clear_collection

'''
Validity 
'''
def is_title_valid(title : str):
    
    min_length = 2
    max_length = 100
    allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,-_'

    # Check length requirement
    if len(title) < min_length or len(title) > max_length:
        return False

    # Check character set requirement
    for char in title:
        if char not in allowed_chars:
            return False

    return True

def is_description_valid(description: str):
    
    min_length = 0
    max_length = 1000

    # Check length requirement
    if len(description) < min_length or len(description) > max_length:
        return False
    return True

def is_deadline_valid(dt):
    current_datetime = datetime.now()
    return dt < current_datetime

#TODO: Ensure given assignee email is present in connections
def is_assignee_valid(assignee: str):


    #Check if user exists in db
    res = checkUser(assignee)
    if res["Success"]:
        return False
    
    return True

def is_progress_status(task_progress:str):
    if task_progress  in ["Not Started", "In Progress", "Blocked", "Completed"]:
        return True
    return False
'''
Create tasks
'''  
def create_task(data: dict):

    task_title = data["title"]

    if not is_title_valid(task_title):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100"        
        }
    

    task_description  = data["description"]

    if not is_description_valid(task_description):
        return {
            "Success": False,
            "Message": "Invalid Description, too long"        
        }


    task_deadline = data["deadline"]
    task_deadline_dt = None

    try:
        task_deadline_dt = datetime.strptime(task_deadline, "%Y-%m-%d")
        
        if not is_deadline_valid(task_deadline_dt):
            return {
                "Success": False,
                "Message": "Deadline cannot be in the past"
            }

    except ValueError:
        pass


    #If progress is not set, default to not started
    task_progress = data["progress"]

    if task_progress is None:
        task_progress = "Not Started"

    #TODO: debug code to ensure consistency
    if task_progress not in ["Not Started", "In Progress", "Blocked", "Completed"]:
        return {
            "Success": False,
            "Message": "Error in data recieved (Progress state not valid"
        }

    task_assignee  = data["assignee"]

    if not is_assignee_valid(task_assignee):
        return {
            "Success": False,
            "Message": "Assignee email does not exist"
        }

    task_cost = data["cost_per_hr"]
    task_cost = int(task_cost)
    
    if task_cost is None:
        task_cost = 0

    if task_cost < 0:
        return {
            "Success": False,
            "Message": "Cost per hour cannot be negative"
        }

    task_estimate = data["estimation_spent_hrs"]
    task_estimate = int(task_estimate)

    if task_estimate is None:
        task_estimate = 0

    if task_estimate < 0:
        return {
            "Success": False,
            "Message": "The estimation cannot be negative"
        }

    task_actual = data["actual_time_hr"]
    task_actual = int(task_actual)

    if task_actual is None:
        task_actual = 0

    if task_actual < 0:
        return {
            "Success": False,
            "Message": "The actual time spent cannot be negative"
        }


    task_priority = data["priority"]
    task_priority = int(task_priority)
    #TODO: Check priority handling
    if task_priority < 1 or task_priority > 3:
        return {
            "Success": False,
            "Message": "The priority is ranked on 3"
        }

    
    task_master = data["task_master"]

    task_labels = data["labels"]

    new_dict = {
        "title" : task_title,
        "description": task_description,
        "deadline": task_deadline_dt,
        "progress": task_progress,
        "assignee": task_assignee,
        "cost_per_hr": task_cost,
        "estimation_spent_hrs": task_estimate,
        "actual_time_hr": task_actual,
        "priority": task_priority,
        "task_master": task_master,
        "labels": task_labels,
    }

    result = db_tasks.addNewTask(new_dict)

    return result

'''
Update Tasks
'''
def update_task_title( task_id: str, title: str):
    
    if not is_title_valid(title):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100"        
        }

    db_tasks.updateTaskInfo(task_id, {"title": title})

def update_task_desc(task_id: str, description: str):
    
    if not is_description_valid(description):
        return {
            "Success": False,
            "Message": "Invalid Description, too long"        
        }

    db_tasks.updateTaskInfo(task_id,  {"description": description})

def update_task_progress(task_id:str, progress: str):
    
    if not is_progress_status(progress):
        return {
            "Success": False,
            "Message": "Invalid Progress status"        
        }

    db_tasks.updateTaskInfo(task_id,  {"progress": progress})

def update_task_assignee(task_id: str, email: str):
    
    if not is_assignee_valid(email):
        return {
            "Success": False,
            "Message": "Invalid assignee"        
        }
    
    db_tasks.updateTaskInfo(task_id,  {"assignee": email})


'''
Delete
'''

def delete_task(task_id:str):
    db_tasks.deleteTask(task_id)

if __name__ == "__main__":

    clear_collection("task_system")
    db_tasks.reset_counter()

    deadline_task = "2023/03/12"

    task_info = {
        "title": "Dummy Task",
        "description": "This is a dummy task for testing",
        "deadline": deadline_task,
        "progress": "In Progress",
        "assignee": "admin@example.com",
        "cost_per_hr": 25,
        "estimation_spent_hrs": 10,
        "actual_time_hr": 6,
        "priority": 3,
        "task_master": "a",
        "labels": ["Testing", "Dummy"],
    }



    new_task_info = {
        "title": "updated task",
    }

    new_task_description = {
        "description": "updates desc"
    }
    
    task = create_task(task_info)
    update_task_title(task["task_id"], new_task_info["title"])
    update_task_desc(task["task_id"], new_task_description["description"])


    delete_task(task['task_id'])















