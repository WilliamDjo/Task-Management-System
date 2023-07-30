# imports
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary, json_util
import json
import os
import sys
import re
from datetime import date, datetime
from database.db import getDB, clear_collection


"""
TESTING: DELETE
"""


"""
Returns the entire collection
"""


def getTaskInfoCollection(db: Database) -> Collection:
    return db["task_system"]


"""
Adds a new task to the task system
"""


def addNewTask(data: dict) -> dict:
    db = getDB()

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
    insert_result = TaskSystemCollection.insert_one(task_info)
    # Get the id of the inserted document
    inserted_id = insert_result.inserted_id

    # Return the inserted task information
    return {"Success": True, "Task_id": task_id}


def getTaskFromID(task_id: str) -> dict:
    db = getDB()

    # Get the collection object for 'TaskSystem' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task = TaskSystemCollection.find_one({"id": task_id})

    # If no user was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "Incorrect task id"}

    data = json.loads(json_util.dumps(task))

    return {"Success": True, "Message": "Task Found", "Data": data}


def updateTaskInfo(task_id: str, data: dict) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task = TaskSystemCollection.find_one({"id": task_id})

    if task is None:
        return {"Success": False, "Message": "No task found with given id"}

    if "token" in data:
        del data["token"]

    result = TaskSystemCollection.update_one({"id": task_id}, {"$set": data})

    return {"Success": True, "Message": "Update successful"}


def deleteTask(task_id: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object database
    TaskSystemCollection = getTaskInfoCollection(db)

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    # Attempt to retrieve the user with the given email
    task = TaskSystemCollection.find_one({"id": task_id})

    # If no user was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "No task found"}

    # If a user was found, delete the user
    TaskSystemCollection.delete_one({"id": task_id})

    # If a user was found, delete the user
    TaskSystemCollection.delete_one({"id": task_id})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "Task deleted successfully"}


def getAllTasks() -> dict:
    # Get the database
    db = getDB()

    TaskSystemCollection = getTaskInfoCollection(db)
    # Get the collection object for 'UserInfo' from the database
    task_infos = TaskSystemCollection.find()
    data = json.loads(json_util.dumps(task_infos))

    return {"Success": True, "Data": data}


# Return all tasks given out by the master
def getTasksGiven(task_master) -> dict:
    db = getDB()
    TaskSystemCollection = getTaskInfoCollection(db)
    task_infos = TaskSystemCollection.find({"task_master": task_master})

    tasks_given = []
    for task_info in task_infos:
        tasks_given.append(task_info)

    if len(tasks_given) == 0:
        return {
            "Success": False,
            "Data": tasks_given,
            "Message": "No tasks given out by task master",
        }
    data = json.loads(json_util.dumps(tasks_given))
    return {"Success": True, "Data": data, "Message": "Successfully Returned"}


# Return all tasks assigned to an assignee
def getTasksAssigned(task_assignee) -> dict:
    db = getDB()
    TaskSystemCollection = getTaskInfoCollection(db)
    task_infos = TaskSystemCollection.find({"assignee": task_assignee})

    tasks_given = []
    for task_info in task_infos:
        tasks_given.append(task_info)

    if len(tasks_given) == 0:
        return {
            "Success": False,
            "Data": tasks_given,
            "Message": "No tasks given to by task assignee",
        }
    
    data = json.loads(json_util.dumps(tasks_given))
    return {"Success": True, "Data": data, "Message": "Successfully Returned"}


def searchTasks(search_string):
    db = getDB()
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
    db = getDB()
    sequence_collection = db["sequence_collection"]

    sequence_name = "task_id"

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
    formatted_id = f"{task_id_prefix}-{next_id:06d}"

    return formatted_id


def reset_counter():
    db = getDB()
    sequence_collection = db["sequence_collection"]
    sequence_name = "task_id"

    # Update the sequence counter to reset it
    sequence_collection.update_one({"_id": sequence_name}, {"$set": {"seq_value": 0}})
