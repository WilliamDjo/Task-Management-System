from email.message import Message
import hashlib
from json.tool import main
from pickle import NONE
import sys
import os
import re
from account import is_email_valid
from backend.account import getAccountInfo
from backend.password import send_email
from backend.tokens import check_jwt_token
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import ssl

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db_tasks
from tokens import active_tokens
from datetime import datetime
from account import is_email_valid, active_users
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

def is_deadline_valid(deadline):
    current_datetime = datetime.now()
    try:
        dt = datetime.strptime(deadline, "%Y-%m-%d")
        return dt.date() < current_datetime.date()
    except ValueError:
        return False

def is_label_valid(label:str):

    if len(label)  == 0:
        return False
    
    if len(label) > 20:
        return False

    return True 

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

    token = data["token"]
    #Verify account login - check the token
    token_result = check_jwt_token(token)
    if not token_result['Success']:
        return {
            "Success": False, 
            "Message": "No user logged in"
        }

    #Get Task Master Details
    user = getAccountInfo(token)
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

    if task_priority < 1 or task_priority > 3:
        return {
            "Success": False,
            "Message": "The priority is ranked on 3"
        }
    
    task_master = user['Data']['email']

    task_labels = data["labels"]

    if (len(task_labels) > 5):
        return {
            "Success": False,
            "Message": "Too many lables: limited to 5 per task"
        }

    task_assignee = data["assignee"]

    #If assigned to none, default to task master
    if task_assignee == "":
        task_assignee = task_master

    # if not is_assignee_valid(task_assignee):
    #     return {
    #         "Success": False,
    #         "Message": "Assignee is not valid"
    #     }
    
    valid_labels = [label for label in task_labels if is_label_valid(label)]
            
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
        "labels": valid_labels,
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

    return db_tasks.updateTaskInfo(task_id, {"title": title})

def update_task_desc(task_id: str, description: str):
    
    if not is_description_valid(description):
        return {
            "Success": False,
            "Message": "Invalid Description, too long"        
        }

    return db_tasks.updateTaskInfo(task_id,  {"description": description})

def update_task_progress(task_id:str, progress: str):
    
    if not is_progress_status(progress):
        return {
            "Success": False,
            "Message": "Invalid Progress status"        
        }

    return db_tasks.updateTaskInfo(task_id,  {"progress": progress})

def update_task_assignee(task_id: str, email: str):
    
    if not is_assignee_valid(email):
        return {
            "Success": False,
            "Message": "Invalid assignee"        
        }
    #TODO call email notif
    return db_tasks.updateTaskInfo(task_id,  {"assignee": email})

def update_cost(task_id: str, new_cost: int):
    
    if new_cost < 0:
        return {
            "Success": False, 
            "Message": "Cost/hr cannot be negative"
        }
    
    return db_tasks.updateTaskInfo(task_id,  {"cost_per_hr": new_cost})

def update_estimate(task_id: str, new_estimate: int):
    
    if new_estimate < 0:
        return {
            "Success": False, 
            "Message": "Estimate cannot be negative"
        }
    
    return db_tasks.updateTaskInfo(task_id,  {"estimation_spent_hrs": new_estimate})

def update_actual(task_id: str, new_actual: int):
    
    if new_actual < 0:
        return {
            "Success": False, 
            "Message": "Cannot be negative"
        }
    
    return db_tasks.updateTaskInfo(task_id,  {"actual_time_hr": new_actual})

def update_priority(task_id: str, new_priority: int):
    
    if new_priority < 1 or new_priority > 3:
        
        return {
            "Success": False, 
            "Message": "Priority is randked on 3, update failed"        
        }

    return db_tasks.updateTaskInfo(task_id,  {"priority": new_priority})
    
def update_details(task_id: str, new_data: dict):

    token_result = check_jwt_token(new_data['token'])
    if not token_result['Success']:
        return {
            "Success": False, 
            "Message": "No user logged in"
        }

    #title 
    if not is_title_valid(new_data['title']):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100"        
        }

    #description
    if not is_description_valid(new_data['description']):
        return {
            "Success": False,
            "Message": "Invalid Description, too long"        
        }

    #deadline #TODO

    #Progress
    if not is_progress_status(new_data['progress']):
        return {
            "Success": False,
            "Message": "Invalid Progress status"        
        }
    
    #Assignee TODO
    # if not is_assignee_valid(new_data['assignee']):
    #     return {
    #         "Success": False,
    #         "Message": "Invalid assignee"        
    #     }
    # #TODO call email notif

    #cost_pr_hr
    if new_data['cost_per_hr'] < 0:
        return {
            "Success": False, 
            "Message": "Cost/hr cannot be negative"
        }
    
    #Estimate
    if new_data['estimation_spent_hrs'] < 0:
        return {
            "Success": False, 
            "Message": "estimation_spent_hrs cannot be negative"
        }

    
    #Actual Time
    if new_data['actual_time_hr'] < 0:
        return {
            "Success": False, 
            "Message": "actual_time_hr cannot be negative"
        }

    #Priority
    if new_data['priority'] < 1 or new_data['priority'] > 3:
        
        return {
            "Success": False, 
            "Message": "Priority is randked on 3, update failed"        
        }

    #labels: TODO


    return db_tasks.updateTaskInfo(task_id, new_data)

'''
Delete
'''
def delete_task(token:str, task_id:str):

    token_result = check_jwt_token(token)
    if not token_result['Success']:
        return {
            "Success": False, 
            "Message": "No user logged in"
        }
    
    return db_tasks.deleteTask(task_id)

'''
Assignee 
'''
def assign_task(token:str,task_id:str, assignee_email:str):

    token_result = check_jwt_token(token)
    if not token_result['Success']:
        return {
            "Success": False, 
            "Message": "No user logged in"
        }

    is_assignee_valid(assignee_email)

    #TODO: send email



    update_task_assignee(task_id, assignee_email)

def send_task_notification(assignee_email, task_title):
    
    sender_email = "zombies3900w11a@gmx.com"
    sender_password = "wEvZ28Xm9b3uviN"

    subject = "New Task Assignment"

    message = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                    }}
                    .container {{
                        width: 400px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }}
                    h1 {{
                        text-align: center;
                        color: #333;
                    }}
                    p {{
                        text-align: center;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 4px;
                        margin-top: 20px;
                    }}
                    .button:hover {{
                        background-color: #0056b3;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>New Task Assignment</h1>
                    <p>Hello,</p>
                    <p>You have been assigned a new task: <strong>{task_title}</strong>.</p>
                    <p>Please click the button below to access your task details:</p>
                    <p><a class="button" href="https://yourwebsite.com/tasks">View Task</a></p>
                </div>
            </body>
        </html>
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = assignee_email
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "html"))

    smtp_server = "mail.gmx.com"
    smtp_port = 587

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)  # Corrected variable name
        server.sendmail(sender_email, assignee_email, msg.as_string())
        server.quit()
        print("Email sent successfully!")

    except Exception as e:
        print(f"Error: {e}")

'''
LABELS
'''

def get_labels(task_id: str):

    dict = db_tasks.getTaskFromID(task_id)
    labels = dict["labels"]

    return labels

def add_label(task_id:str, new_label: str):

    curr_labels = get_labels(task_id)
    curr_labels.append(new_label)
    db_tasks.updateTaskInfo(task_id, {"labels": curr_labels})
    

def get_task_details(token:str, task_id:str):

    #check token
    token_result = check_jwt_token(token)
    if not token_result['Success']:
        return {
            "Success": False, 
            "Message": "No user logged in"
        }

    

    return db_tasks.getTaskFromID(task_id)










