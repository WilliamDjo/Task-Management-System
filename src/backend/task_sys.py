import os
import sys
import time
import smtplib
import plotly.graph_objects as go
import plotly.io as pio
from datetime import datetime
from threading import Thread
from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    Table,
    TableStyle,
    PageBreak,
)

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)
import account
import tokens
from database import db_tasks, db, db_helper


"""
Validity 
"""

"""Checks if the provided title string is valid.

    Args:
        title (str): The title string to be validated.

    Returns:
        bool: True if the title string is valid, False otherwise.
"""
def is_title_valid(title: str):
    min_length = 2
    max_length = 100
    allowed_chars = (
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,-_"
    )

    # Check length requirementk
    if len(title) < min_length or len(title) > max_length:
        return False

    # Check character set requirement
    for char in title:
        if char not in allowed_chars:
            return False

    return True

"""Checks if the provided description string is valid.

    Args:
        description (str): The description string to be validated.

    Returns:
        bool: True if the description is valid, False otherwise.
"""
def is_description_valid(description: str):
    min_length = 0
    max_length = 1000

    # Check length requirement
    if len(description) < min_length or len(description) > max_length:
        return False
    return True

"""Checks if the provided deadline is valid.

    Args:
        deadline (datetime): The deadline to be validated.

    Returns:
        bool: True if the deadline is valid (not past), False otherwise.
"""
def is_deadline_valid(deadline):
    current_datetime = datetime.now()
    try:
        # dt = datetime.strptime(deadline, "%Y-%m-%d")
        return deadline.date() >= current_datetime.date()
    except ValueError:
        return False

"""Checks if the provided label is valid.

    Args:
        label (str): The label to be validated.

    Returns:
        bool: True if the label is valid (non-empty and within character limit), False otherwise.
"""
def is_label_valid(label: str):
    if len(label) == 0:
        return False

    if len(label) > 20:
        return False

    return True

"""Checks if the provided assignee is valid.

    Args:
        assignee (str): The assignee's email address to be validated.

    Returns:
        bool: True if the assignee is valid (not found in the database), False otherwise.
"""
def is_assignee_valid(assignee: str):
    res = db.checkUser(assignee)
    if res["Success"]:
        return False

    return True

"""Checks if the provided task progress status is valid.

    Args:
        task_progress (str): The task progress status to be validated.

    Returns:
        bool: True if the task progress status is valid, False otherwise.
"""
def is_progress_status(task_progress: str):
    if task_progress in ["Not Started", "In Progress", "Blocked", "Completed"]:
        return True
    return False


"""
Create tasks
"""

"""Creates a new task with the provided data.

    Args:
        token (str): The token of the user's session.
        data (dict): A dictionary containing the data for the new task, including title, description, deadline, progress, assignee, cost_per_hr, estimation_spent_hrs, actual_time_hr, priority, labels, etc.

    Returns:
        dict: A dictionary containing the result of the task creation operation, including the success status and any relevant messages.
"""
def create_task(token: str, data: dict):
    token = token
    # Verify account login - check the token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    # Get Task Master Details
    user = account.getAccountInfo(token)
    task_title = data["title"]

    if not is_title_valid(task_title):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100",
        }

    task_description = data["description"]

    if not is_description_valid(task_description):
        return {"Success": False, "Message": "Invalid Description, too long"}

    task_deadline = data["deadline"]
    task_deadline_dt = None

    try:
        task_deadline_dt = datetime.strptime(task_deadline, "%Y-%m-%d")

        if not is_deadline_valid(task_deadline_dt):
            return {"Success": False, "Message": "Deadline cannot be in the past"}
        else:
            task_deadline_dt = task_deadline_dt.strftime("%Y-%m-%d %H:%M:%S")

    except ValueError:
        pass

    # If progress is not set, default to not started
    task_progress = data["progress"]

    if task_progress is None:
        task_progress = "Not Started"

    if task_progress not in ["Not Started", "In Progress", "Blocked", "Completed"]:
        return {
            "Success": False,
            "Message": "Error in data recieved (Progress state not valid",
        }

    task_cost = data["cost_per_hr"]
    task_cost = int(task_cost)

    if task_cost is None:
        task_cost = 0

    if task_cost < 0:
        return {"Success": False, "Message": "Cost/H cannot be negative"}

    task_estimate = data["estimation_spent_hrs"]
    task_estimate = int(task_estimate)

    if task_estimate is None:
        task_estimate = 0

    if task_estimate < 0:
        return {"Success": False, "Message": "The estimation cannot be negative"}

    task_actual = data["actual_time_hr"]
    task_actual = int(task_actual)

    if task_actual is None:
        task_actual = 0

    if task_actual < 0:
        return {"Success": False, "Message": "The actual time spent cannot be negative"}

    task_priority = data["priority"]
    task_priority = int(task_priority)

    if task_priority < 1 or task_priority > 3:
        return {"Success": False, "Message": "The priority is ranked on 3"}

    task_master = user["Data"]["email"]

    task_labels = data["labels"]

    if len(task_labels) > 5:
        return {"Success": False, "Message": "Too many lables: limited to 5 per task"}

    task_assignee = data["assignee"]

    # If assigned to none, default to task master
    if task_assignee == "":
        task_assignee = task_master
    else:
        if not is_assignee_valid(task_assignee):
            return {"Success": False, "Message": "Assignee is not valid"}

        # Check if both users are connected
        if not db.checkConnection(task_master, task_assignee):
            return {"Success": False, "Message": "Task Master not connected to Task "}

    curr_workload = account.get_workload(token, email=task_assignee)

    updated_workload = int(curr_workload["Data"]) + int(data["priority"]) * 10

    workload_update = {"workload": updated_workload}

    valid_labels = [label for label in task_labels if is_label_valid(label)]

    new_dict = {
        "title": task_title,
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

    # send_task_notification(task_assignee, task_title)

    # update workload of the assignee
    db.updateUserInfo(task_assignee, workload_update)

    return result


"""
Update Tasks
"""

"""Updates the title of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        title (str): The new title to be set for the task.

    Returns:
        dict: A dictionary containing the result of the title update operation, including the success status and any relevant messages.
"""
def update_task_title(task_id: str, title: str):
    if not is_title_valid(title):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100",
        }

    return db_tasks.updateTaskInfo(task_id, {"title": title})

"""Updates the description of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        description (str): The new description to be set for the task.

    Returns:
        dict: A dictionary containing the result of the description update operation, including the success status and any relevant messages.
"""
def update_task_desc(task_id: str, description: str):
    if not is_description_valid(description):
        return {"Success": False, "Message": "Invalid Description, too long"}

    return db_tasks.updateTaskInfo(task_id, {"description": description})

"""Updates the progress status of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        progress (str): The new progress status to be set for the task.

    Returns:
        dict: A dictionary containing the result of the progress status update operation, including the success status and any relevant messages.
"""
def update_task_progress(task_id: str, progress: str):
    if not is_progress_status(progress):
        return {"Success": False, "Message": "Invalid Progress status"}

    return db_tasks.updateTaskInfo(task_id, {"progress": progress})

"""Updates the assignee of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        email (str): The email address of the new assignee to be set for the task.

    Returns:
        dict: A dictionary containing the result of the assignee update operation, including the success status and any relevant messages.
"""
def update_task_assignee(task_id: str, email: str):
    if not is_assignee_valid(email):
        return {"Success": False, "Message": "Invalid assignee"}

    # Check connections TODO

    return db_tasks.updateTaskInfo(task_id, {"assignee": email})

"""Updates the cost per hour of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        new_cost (int): The new cost per hour to be set for the task.

    Returns:
        dict: A dictionary containing the result of the cost update operation, including the success status and any relevant messages.
"""
def update_cost(task_id: str, new_cost: int):
    if new_cost < 0:
        return {"Success": False, "Message": "Cost/hr cannot be negative"}

    return db_tasks.updateTaskInfo(task_id, {"cost_per_hr": new_cost})

"""Updates the estimation of spent hours for a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        new_estimate (int): The new estimation of spent hours to be set for the task.

    Returns:
        dict: A dictionary containing the result of the estimation update operation, including the success status and any relevant messages.
"""
def update_estimate(task_id: str, new_estimate: int):
    if new_estimate < 0:
        return {"Success": False, "Message": "Estimate cannot be negative"}

    return db_tasks.updateTaskInfo(task_id, {"estimation_spent_hrs": new_estimate})

"""Updates the actual time spent for a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        new_actual (int): The new actual time spent to be set for the task.

    Returns:
        dict: A dictionary containing the result of the actual time update operation, including the success status and any relevant messages.
"""
def update_actual(task_id: str, new_actual: int):
    if new_actual < 0:
        return {"Success": False, "Message": "Cannot be negative"}

    return db_tasks.updateTaskInfo(task_id, {"actual_time_hr": new_actual})

"""Updates the priority of a task with the provided task_id.

    Args:
        task_id (str): The unique identifier of the task to be updated.
        new_priority (int): The new priority to be set for the task.

    Returns:
        dict: A dictionary containing the result of the priority update operation, including the success status and any relevant messages.
"""
def update_priority(task_id: str, new_priority: int):
    if new_priority < 1 or new_priority > 3:
        return {"Success": False, "Message": "Priority is randked on 3, update failed"}

    return db_tasks.updateTaskInfo(task_id, {"priority": new_priority})

    token_result = tokens.check_jwt_token(new_data["token"])
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    # title
    if not is_title_valid(new_data["title"]):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100",
        }

"""Updates the details of a task with the provided task_id.

    Args:
        token (str): The authentication token of the user.
        task_id (str): The unique identifier of the task to be updated.
        new_data (dict): A dictionary containing the new data to update the task with.

    Returns:
        dict: A dictionary containing the result of the update operation, including the success status and any relevant messages.

"""
def update_details(token: str, task_id: str, new_data: dict):
    user_details = account.getAccountInfo(token)

    old_data_response = get_task_details(token, task_id)
    old_data = old_data_response["Data"]

    task_master = user_details["Data"]["email"]

    if not is_title_valid(new_data["title"]):
        return {
            "Success": False,
            "Message": "Invalid Title Format, needs to be > 2 and  < 100",
        }

    if not is_description_valid(new_data["description"]):
        return {"Success": False, "Message": "Invalid Description, too long"}

    if not is_progress_status(new_data["progress"]):
        return {"Success": False, "Message": "Invalid Progress status"}

    task_assignee = new_data["assignee"]
    if task_assignee == "":
        task_assignee = task_master
    else:
        if not is_assignee_valid(new_data["assignee"]):
            return {"Success": False, "Message": "Invalid assignee"}

        if not db.checkConnection(task_master, task_assignee):
            return {"Success": False, "Message": "Users not connected"}

    if new_data["cost_per_hr"] < 0:
        return {"Success": False, "Message": "Cost/hr cannot be negative"}

    if new_data["estimation_spent_hrs"] < 0:
        return {"Success": False, "Message": "estimation_spent_hrs cannot be negative"}

    if new_data["actual_time_hr"] < 0:
        return {"Success": False, "Message": "actual_time_hr cannot be negative"}

    if new_data["priority"] < 1 or new_data["priority"] > 3:
        return {"Success": False, "Message": "Priority is randked on 3, update failed"}

    task_labels = new_data["labels"]
    valid_labels = [label for label in task_labels if is_label_valid(label)]

    old_priority = old_data["priority"]

    prev_assignee_email = old_data["assignee"]
    old_details = db.getSingleUserInformation(prev_assignee_email)
    prev_user_workload = old_details["Data"]["workload"]
    updated_workload = prev_user_workload - 10 * old_priority
    new_workload_details = {"workload": updated_workload}
    db.updateUserInfo(prev_assignee_email, new_workload_details)

    new_priority = new_data["priority"]
    new_assignee = task_assignee
    curr_details = db.getSingleUserInformation(task_assignee)
    curr_user_workload = curr_details["Data"]["workload"]
    new_updated_workload = curr_user_workload + 10 * new_priority
    new_workload_details_assignee = {"workload": new_updated_workload}

    if new_data["progress"] == "Completed":
        completed_workload = curr_user_workload - 10 * new_priority
        completed_workload_details_assignee = {"workload": completed_workload}
        db.updateUserInfo(new_data["assignee"], completed_workload_details_assignee)

    db.updateUserInfo(task_assignee, new_workload_details_assignee)

    return db_tasks.updateTaskInfo(task_id, new_data)


"""
Delete
"""

"""Deletes the task with the provided task_id.

    Args:
        token (str): The authentication token of the user.
        task_id (str): The unique identifier of the task to be deleted.

    Returns:
        dict: A dictionary containing the result of the delete operation, including the success status and any relevant messages.
"""
def delete_task(token: str, task_id: str):
    # token_result = tokens.check_jwt_token(token)
    # if not token_result["Success"]:
    #     return {"Success": False, "Message": "No user logged in"}

    # user_details = account.getAccountInfo(token)
    data_repsonse = get_task_details(token, task_id)
    task_data = data_repsonse["Data"]
    task_assignee = task_data["assignee"]
    curr_details = db.getSingleUserInformation(task_assignee)
    curr_user_workload = curr_details["Data"]["workload"]

    updated_workload = curr_user_workload - 10 * task_data["priority"]

    completed_workload_details_assignee = {"workload": updated_workload}

    db.updateUserInfo(task_assignee, completed_workload_details_assignee)

    return db_tasks.deleteTask(task_id)


"""
Assignee 
"""

"""Assigns the task with the provided task_id to the specified assignee_email.

    Args:
        task_id (str): The unique identifier of the task to be assigned.
        assignee_email (str): The email address of the user to whom the task will be assigned.
"""
def assign_task(task_id: str, assignee_email: str):
    is_assignee_valid(assignee_email)

    # TODO: check if assignee workload permits

    # TODO: send email

    update_task_assignee(task_id, assignee_email)

"""Sends an email notification to the specified assignee_email when a new task is assigned.

    Args:
        assignee_email (str): The email address of the user to whom the task is assigned.
        task_title (str): The title of the newly assigned task.
"""
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


"""
LABELS
"""

""" Gets Labels assigned to a task, accessed via provided task_id
Args:
    task_id (str): The unique identifier of the task.

Returns:
    list: A list containing the labels associated with the task.
"""
def get_labels(task_id: str):
    dict = db_tasks.getTaskFromID(task_id)
    labels = dict["labels"]

    return labels

""" Adds new labels to a task given a task_id and a label
Args:
    task_id (str): The unique identifier of the task to which the label will be added.
    new_label (str): The label to be added to the task.
"""
def add_label(task_id: str, new_label: str):
    curr_labels = get_labels(task_id)
    curr_labels.append(new_label)
    db_tasks.updateTaskInfo(task_id, {"labels": curr_labels})

""" Retrieves task details from the database based on the provided task ID.
    Args:
        token (str): A JWT token representing the user's authentication status.
        task_id (str): The unique identifier of the task to retrieve.
"""
def get_task_details(token: str, task_id: str):
    # check token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    return db_tasks.getTaskFromID(task_id)

""" Retrieves all tasks assigned to a user identified by their email.

    Args:
        token (str): A JWT token representing the user's authentication status.
        email (str): The email address of the user for whom the tasks are to be retrieved.

    Returns:
        dict: A dictionary containing the tasks assigned to the user if successful,
"""
def get_all_tasks_assigned_to(token: str, email: str):
    # check token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    # check if email exists
    db_result = db.getSingleUserInformation(email)

    if not (db_result["Success"]):
        return {"Success": False, "Message": "Email Does not exist"}

    return db_tasks.getTasksAssigned(email)

"""Retrieves all tasks assigned to the currently authenticated user.

    Parameters:
        token (str): A JWT token representing the user's authentication status.
    Returns:
        dict: A dictionary containing the tasks assigned to the user if successful
"""
def get_tasks_assigned_to_curr(token: str):
    # check token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    # Get active user details
    acc_info = account.getAccountInfo(token)

    # db_result = db.getSingleUserInformation(acc_info['email'])

    # if not (db_result["Success"]):
    #     return {"Success": False, "Message": "Email Does not exist"}

    return db_tasks.getTasksAssigned(acc_info["Data"]["email"])

""" Retrieves all tasks given by a specific user identified by their email.

    Args:
        token (str): A JWT token representing the user's authentication status.
        email (str): The email address of the user for whom the tasks given are to be retrieved.
    
    Returns:
        dict: A dictionary containing the tasks given by the user if successful,
"""
def get_tasks_given_by(token: str, email: str):
    # check token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    # check if email exists
    db_result = db.getSingleUserInformation(email)

    if not (db_result["Success"]):
        return {"Success": False, "Message": "Email Does not exist"}

    return db_tasks.getTasksGiven(email)

""" Retrieves all tasks from the database.

    Args:
        token (str): A JWT token representing the user's authentication status.

    Returns:
        dict: A dictionary containing all tasks if successful, or an error message if failed.
"""
def get_all_tasks(token: str):
    # check token
    token_result = tokens.check_jwt_token(token)
    if not token_result["Success"]:
        return {"Success": False, "Message": "No user logged in"}

    return db_tasks.getAllTasks()

""" Searches for tasks in the database based on the provided search word.

    Args:
        token (str): A JWT token representing the user's authentication status.
        search_word (str): The word to search for within task titles and descriptions.

    Returns:
        dict: A dictionary containing the search results if successful, or an error message if failed.
"""
def search_task(token: str, search_word: str):
    # # check token
    # token_result = tokens.check_jwt_token(token)

    # if not token_result["Success"]:
    #     return {"Success": False, "Message": "No user logged in"}

    dummy_data = [
        {
            "id": "123",
            "title": "ABC",
            "description": "Task",
            "deadline": "2023-09-09",
            "progress": "Not Started",
            "assignee": "",
            "cost_per_hr": 10,
            "estimation_spent_hrs": 10,
            "actual_time_hr": 10,
            "priority": 1,
            "task_master": "test@test.com",
            "labels": [],
        }
    ]
    return {"Success": True, "Message": "Tasks found", "Data": dummy_data}

""" Converts a date string from one format to another.

    Parameters:
        date_str (str): The input date string to be converted.
        in_format (str): The format of the input date string (e.g., 'YYYY-MM-DD').
        out_format (str): The desired format for the output date string.

    Returns:
        str: The date string converted to the specified output format.
"""
def convert_date_format(date_str, in_format, out_format):
    # Converts a date string from one format to another
    date_obj = datetime.strptime(date_str, in_format)
    return date_obj.strftime(out_format)

""" Filters and processes tasks based on their creation dates falling within a specified date range.

    Args:
        temp (list): A list of task dictionaries to be processed.
        start_date (datetime): The start date of the range for filtering tasks.
        end_date (datetime): The end date of the range for filtering tasks.

    Returns:
        list: A list of task dictionaries whose creation dates fall within the specified range.
"""
def process_tasks(temp, start_date, end_date):
    tasks = []
    for i in temp:
        created_date_str = convert_date_format(
            i.get("created", ""), "%d-%m-%Y", "%Y-%m-%d"
        )
        deadline_date_str = convert_date_format(
            i.get("deadline", "").split(" ")[0], "%Y-%m-%d", "%Y-%m-%d"
        )

        # Convert to datetime for comparison
        created_date = datetime.strptime(created_date_str, "%Y-%m-%d")

        # Check if created_date falls in the range
        if start_date <= created_date <= end_date:
            task_info = {
                "id": i.get("id", ""),
                "title": i.get("title", ""),
                "description": i.get("description", ""),
                "created": created_date_str,
                "deadline": deadline_date_str,
                "progress": i.get("progress", ""),
                "assignee": i.get("assignee", ""),
                "cost_per_hr": i.get("cost_per_hr", ""),
                "estimation_spent_hrs": i.get("estimation_spent_hrs", ""),
                "actual_time_hr": i.get("actual_time_hr", ""),
                "priority": i.get("priority", ""),
                "task_master": i.get("task_master", ""),
                "labels": i.get("labels", []),
            }
            tasks.append(task_info)
    return tasks

""" Generates a PDF report containing task-related information for the user.

    Parameters:
        token (str): A JWT token representing the user's authentication status.
        start_date_str (str): The start date of the date range to filter tasks (format: "YYYY-MM-DD").
        end_date_str (str): The end date of the date range to filter tasks (format: "YYYY-MM-DD").

    Returns:
        dict: A dictionary indicating the success of the report generation.
"""
def generate_report(token, start_date_str, end_date_str):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]
    task_master_tasks = db_tasks.getTasksGiven(email)
    assignee_tasks = db_tasks.getTasksAssigned(email)

    if not task_master_tasks["Success"] and not assignee_tasks["Success"]:
        return {"Success": False, "Message": "No tasks found"}

    tasks = {}

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    if task_master_tasks["Success"]:
        tasks["task_master"] = process_tasks(
            task_master_tasks["Data"], start_date, end_date
        )

    if assignee_tasks["Success"]:
        tasks["assignee"] = process_tasks(assignee_tasks["Data"], start_date, end_date)

    # Generating the actual PDF

    pdf_file_name = "task_report.pdf"
    doc = SimpleDocTemplate(pdf_file_name, pagesize=landscape(letter))

    story = []
    table_style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            (
                "FONTSIZE",
                (0, 0),
                (-1, 0),
                10,
            ),  # Reduce the font size to fit more content
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),  # Align text to top to fit more rows
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.black),
        ]
    )
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    title = Paragraph("Task Report", title_style)
    story.append(title)
    story.append(Spacer(1, 12))

    title2 = Paragraph("As TaskMaster", title_style)
    story.append(title2)
    story.append(Spacer(1, 12))

    plot_functions = [
        plot_priority_vs_time,
        plot_priority_distribution,
        plot_estimated_vs_actual_time,
    ]

    for i, plot_func in enumerate(plot_functions):
        plot = plot_func(tasks["task_master"])
        plot_file_name = f"./plot_{i}.png"
        save_plot_to_image(plot, plot_file_name)
        time.sleep(3)
        img = Image(plot_file_name, width=500, height=300)
        story.append(img)

    data = [
        [
            "Task ID",
            "Title",
            "Description",
            "Created",
            "Deadline",
            "Progress",
            "Assignee",
            "Cost/H",
            "Estd. Time",
            "Actual Time",
            "Priority",
        ]
    ]  # This is the header row

    for item in tasks["task_master"]:
        data.append(
            [
                item.get("id", ""),
                item.get("title", ""),
                item.get("description", ""),
                item.get("created", ""),
                item.get("deadline", ""),
                item.get("progress", ""),
                item.get("assignee", ""),
                item.get("cost_per_hr", ""),
                item.get("estimation_spent_hrs", ""),
                item.get("actual_time_hr", ""),
                item.get("priority", ""),
            ]
        )

    # Create the table
    t = Table(data)

    # Apply styles to the table
    t.setStyle(table_style)

    # Add table to story
    story.append(t)
    story.append(PageBreak())

    title2 = Paragraph("As Assignee", title_style)
    story.append(title2)
    story.append(Spacer(1, 6))

    plot_functions = [
        plot_priority_vs_time,
        plot_priority_distribution,
        plot_estimated_vs_actual_time,
    ]

    for i, plot_func in enumerate(plot_functions):
        plot = plot_func(tasks["assignee"])
        plot_file_name = f"./plot_{i}.png"
        save_plot_to_image(plot, plot_file_name)
        time.sleep(3)
        img = Image(plot_file_name, width=500, height=300)
        story.append(img)

    data = [
        [
            "Task ID",
            "Title",
            "Description",
            "Created",
            "Deadline",
            "Progress",
            "Cost/H",
            "Estd. Time",
            "Actual Time",
            "Priority",
            "Task Master",
        ]
    ]  # This is the header row

    for item in tasks["assignee"]:
        data.append(
            [
                item.get("id", ""),
                item.get("title", ""),
                item.get("description", ""),
                item.get("created", ""),
                item.get("deadline", ""),
                item.get("progress", ""),
                item.get("cost_per_hr", ""),
                item.get("estimation_spent_hrs", ""),
                item.get("actual_time_hr", ""),
                item.get("priority", ""),
                item.get("task_master", ""),
            ]
        )

    # Create the table
    t = Table(data)

    # Apply styles to the table
    t.setStyle(table_style)

    # Add table to story
    story.append(t)

    doc.build(story)
    print(f"PDF generated successfully: {pdf_file_name}")
    send_email(email, pdf_file_name)
    return {"Success": True, "Message": "Done!"}

""" Saves a Plotly plot to an image file.

    Args:
        plot: The Plotly plot object to be saved as an image.
        file_name (str): The name of the image file to be created (e.g., "plot.png").

    Returns:
        None: This function does not return any value.
"""
def save_plot_to_image(plot, file_name):
    image_bytes = pio.to_image(plot, format="png")
    with open(file_name, "wb") as f:
        f.write(image_bytes)

""" Creates a Pie chart to visualize the breakdown of actual time by task priority.

    Args:
        tasks (list): A list of task dictionaries, where each dictionary represents a task.
                      Each task dictionary should contain a 'priority' key to determine the priority level,
                      and an 'actual_time_hr' key to determine the actual time spent on the task.

    Returns:
        go.Figure: A Plotly Figure object representing the Pie chart.
"""
def plot_priority_vs_time(tasks):
    priority_time = {1: 0, 2: 0, 3: 0}
    for task in tasks:
        priority = task.get("priority")
        time = float(task.get("actual_time_hr", 0))
        priority_time[priority] += time

    labels = ["Low", "Medium", "High"]
    values = list(priority_time.values())

    fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.3)])
    fig.update_layout(title_text="Breakdown of actual time by task priority")
    return fig

""" Creates a Pie chart to visualize the breakdown of actual time by task priority.

    Parameters:
        tasks (list): A list of task dictionaries, where each dictionary represents a task.
                      Each task dictionary should contain a 'priority' key to determine the priority level,
                      and an 'actual_time_hr' key to determine the actual time spent on the task.

    Returns:
        go.Figure: A Plotly Figure object representing the Pie chart.
"""
def plot_priority_distribution(tasks):
    priority_count = {1: 0, 2: 0, 3: 0}
    for task in tasks:
        priority = task.get("priority")
        priority_count[priority] += 1

    labels = ["Low", "Medium", "High"]
    values = list(priority_count.values())

    fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.3)])
    fig.update_layout(title_text="Distribution of tasks by priority")
    return fig

""" Creates a Pie chart to visualize the comparison between tasks completed within estimated time and those that were not.

    Args:
        tasks (list): A list of task dictionaries, where each dictionary represents a task.
                      Each task dictionary should contain 'estimation_spent_hrs' and 'actual_time_hr' keys
                      to represent the estimated and actual time spent on the task, respectively.

    Returns:
        go.Figure: A Plotly Figure object representing the Pie chart.
"""
def plot_estimated_vs_actual_time(tasks):
    within_estimated, not_within_estimated = 0, 0
    for task in tasks:
        estimated_time = float(task.get("estimation_spent_hrs", 0))
        actual_time = float(task.get("actual_time_hr", 0))
        if actual_time <= estimated_time:
            within_estimated += 1
        else:
            not_within_estimated += 1

    labels = ["Within Estimated Time", "Not Within Estimated Time"]
    values = [within_estimated, not_within_estimated]

    fig = go.Figure(data=[go.Pie(labels=labels, values=values, hole=0.3)])
    fig.update_layout(
        title_text="Tasks completed within estimated time vs those which were not"
    )
    return fig

""" Sends an email with an attached PDF report to the specified email address.

    Parameters:
        email (str): The recipient's email address.
        pdf_file_name (str): The name of the PDF file to be attached.

    Returns:
        None: This function does not return any value.

"""
def send_email(email, pdf_file_name):
    # Create a new thread to send the email
    def run():
        # Your email credentials
        username = "zombies3900w11a@gmx.com"
        password = "wEvZ28Xm9b3uviN"
        smtp_server = "mail.gmx.com"
        smtp_port = 587

        # Creating the message
        msg = MIMEMultipart()
        msg["From"] = username
        msg["To"] = email
        msg["Subject"] = "Your Task Report"

        # The actual message
        message = "Please find attached your task report."
        msg.attach(MIMEText(message, "plain"))

        # Attach the PDF
        with open(pdf_file_name, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())

        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename= {pdf_file_name}",
        )

        msg.attach(part)

        # Login and send the email
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(username, password)
            text = msg.as_string()
            server.sendmail(username, email, text)
            server.quit()
            print("Email sent successfully!")
        except Exception as e:
            print(f"Error: {e}")

    # Start the thread
    thread = Thread(target=run)
    thread.start()
