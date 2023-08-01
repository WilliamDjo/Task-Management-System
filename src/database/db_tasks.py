from pymongo.database import Database
from pymongo.collection import Collection
from bson import json_util
import json
import re
import os
import sys

# Assuming you are running the script from the parent directory of 'project'
parent_dir = os.path.dirname(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)

import db_helper


"""
Returns the entire collection
"""


def getTaskInfoCollection(db: Database) -> Collection:
    return db["task_system"]


"""
Adds a new task to the task system
"""


def addNewTask(data: dict) -> dict:
    db = db_helper.getDB()

    # Get the collection object for 'TaskSystem' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    # Create a dictionary with the structure of a task to be inserted
    task_id = get_next_task_id()
    task_info = {
        "id": task_id,
        "title": "",
        "description": "",
        "deadline": "",
        "progress": "",
        "assignee": "",
        "cost_per_hr": "",
        "estimation_spent_hrs": "",
        "actual_time_hr": "",
        "priority": "",
        "task_master": "",
        "labels": [],
    }

    # Loop over the keys in the input data
    for key in data:
        # If the key exists in task_info, update its value
        if key in task_info:
            task_info[key] = data[key]

    # task
    TaskSystemCollection.insert_one(task_info)

    # Return the inserted task information
    return {"Success": True, "id": task_id}


def getTaskFromID(task_id: str) -> dict:
    db = db_helper.getDB()

    # Get the collection object for 'TaskSystem' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task = TaskSystemCollection.find_one({"id": task_id})

    task_details = json.loads(json_util.dumps(task))

    # If no user was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "Incorrect task id"}

    return {"Success": True, "Message": "Task Found", "Data": task_details}


def updateTaskInfo(task_id: str, data: dict) -> dict:
    # Get the database
    db = db_helper.getDB()

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task = TaskSystemCollection.find_one({"id": task_id})

    if task is None:
        return {"Success": False, "Message": "No task found with given id"}

    if "token" in data:
        del data["token"]

    TaskSystemCollection.update_one({"id": task_id}, {"$set": data})

    return {"Success": True, "Message": "Update successful"}


def deleteTask(task_id: str) -> dict:
    # Get the database
    db = db_helper.getDB()

    # Get the collection object database
    TaskSystemCollection = getTaskInfoCollection(db)
    # Attempt to retrieve the task with the given task_id
    task = TaskSystemCollection.find_one({"id": task_id})

    # If no task was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "No task found"}

    # If a task was found, delete the task
    TaskSystemCollection.delete_one({"id": task_id})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "Task deleted successfully"}


def getAllTasks() -> dict:
    # Get the database
    db = db_helper.getDB()

    TaskSystemCollection = getTaskInfoCollection(db)
    # Get the collection object for 'UserInfo' from the database
    task_infos = TaskSystemCollection.find()
    data = json.loads(json_util.dumps(task_infos))

    return {"Success": True, "Data": data}


# Return all tasks given out by the master
def getTasksGiven(task_master) -> dict:
    db = db_helper.getDB()
    TaskSystemCollection = getTaskInfoCollection(db)
    task_infos = TaskSystemCollection.find({"task_master": task_master})

    tasks_given = []
    for task_info in task_infos:
        tasks_given.append(task_info)

    if len(tasks_given) == 0:
        return {
            "Success": False,
            "Data": [],
            "Message": "No tasks given out by task master",
        }

    tasks_given_json = json.loads(json_util.dumps(tasks_given))
    return {
        "Success": True,
        "Data": tasks_given_json,
        "Message": "Successfully Returned",
    }


# Return all tasks assigned to an assignee
def getTasksAssigned(task_assignee) -> dict:
    db = db_helper.getDB()
    TaskSystemCollection = getTaskInfoCollection(db)
    task_infos = TaskSystemCollection.find({"assignee": task_assignee})

    tasks_assigned_to = []
    for task_info in task_infos:
        tasks_assigned_to.append(
            {
                "id": task_info["id"],
                "title": task_info["title"],
                "description": task_info["description"],
                "deadline": task_info["deadline"],
                "progress": task_info["progress"],
                "assignee": task_info["assignee"],
                "cost_per_hr": task_info["cost_per_hr"],
                "estimation_spent_hrs": task_info["estimation_spent_hrs"],
                "actual_time_hr": task_info["actual_time_hr"],
                "priority": task_info["priority"],
                "task_master": task_info["task_master"],
                "labels": task_info["labels"],
            }
        )

    if len(tasks_assigned_to) == 0:
        return {
            "Success": False,
            "Data": [],
            "Message": "No tasks given to by task assignee",
        }
    return {
        "Success": True,
        "Data": tasks_assigned_to,
        "Message": "Successfully Returned",
    }


def searchTasks(search_string):
    db = db_helper.getDB()
    TaskSystemCollection = getTaskInfoCollection(db)

    search_regex = re.compile(f".*{search_string}.*", re.IGNORECASE)

    query = {
        "$or": [
            {"id": search_regex},
            {"title": search_string},
            {"description": search_regex},
            {"deadline": search_regex},
            {"progress": search_regex},
            {"assignee": search_regex},
            {"cost_per_hr": search_regex},
            {"estimation_spent_hrs": search_regex},
            {"actual_time_hr": search_regex},
            {"priority": search_regex},
            {"task_master": search_regex},
            {"labels": {"$in": [search_string]}},
        ]
    }
    # perform the query
    results = TaskSystemCollection.find(query)

    return list(results)


"""
Helper function to generate IDs
"""


def get_next_task_id() -> str:
    db = db_helper.getDB()
    sequence_collection = db["sequence_collection"]

    sequence_name = "id"

    # Find the document for the given sequence name and atomically increment the value
    sequence_doc = sequence_collection.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"seq_value": 1}},
        upsert=True,
        return_document=True,
    )

    # Retrieve the incremented value from the document
    next_id = sequence_doc["seq_value"]

    # Format the task ID with a desired prefix
    task_id_prefix = "TASK"
    formatted_id = f"{task_id_prefix}{next_id}"

    return formatted_id
