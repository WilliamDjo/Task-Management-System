#imports
from re import X
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary, json_util
import json
from db import clear_collection
from db import getDB

'''
TESTING: DELETE
'''

from datetime import date, datetime


'''
Returns the the entire collection
'''
def getTaskInfoCollection(db: Database) -> Collection:
    return db["task_system"]

'''
Adds a new task to the task system
'''
def addNewTask(data: dict) -> dict:
    db = getDB()

    # Get the collection object for 'TaskSystem' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    # Create a dictionary with the structure of a task to be inserted
    task_info = {
        "id": get_next_task_id(),
        "title": "",
        "description": "",
        "deadline": "",
        "progress": "",
        "assignee": "",
        "cost_per_hr": "",
        "estimation_spent_hrs": "",
        "actual_time_hr": "",
        "priority": "",
        "task_master":"",
        "labels": []
    }

    # Loop over the keys in the input data
    for key in data:
        # If the key exists in task_info, update its value
        if key in task_info:
            task_info[key] = data[key]



    #task
    insert_result = TaskSystemCollection.insert_one(task_info)
    # Get the id of the inserted document
    inserted_id = insert_result.inserted_id

    # Return the inserted task information
    return insert_result

def getTaskFromID(task_id: str) -> dict:
    db = getDB()

    # Get the collection object for 'TaskSystem' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task = TaskSystemCollection.find_one({"id": task_id})

     # If no user was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "Incorrect task id"}

    return {"Success": True, "Message": "Task Found", "data": task}

def updateTaskInfo(task_id: str, data: dict) -> dict:
    #Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)
    
    task = TaskSystemCollection.find_one({"id": task_id})

    if task is None:
        return {"Success": False, "Message": "No task found with given id"}

    result = TaskSystemCollection.update_one({"id": task_id}, {"$set": data})
    return result

def deleteTask(task_id: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    # Attempt to retrieve the user with the given email
    task = TaskSystemCollection.find_one({"id": task_id})

    # If no user was found, return a dictionary indicating failure
    if task is None:
        return {"Success": False, "Message": "No associated task found"}

    # If a user was found, delete the user
    TaskSystemCollection.delete_one({"id": task_id})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "Task deleted successfully"}

def getAllTasks() -> dict:

    #Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    TaskSystemCollection = getTaskInfoCollection(db)

    task_infos = TaskSystemCollection.find()
    data = json.loads(json_util.dumps(task_infos))


    return data
        
counter = 0
'''
Helper function to generate IDs
'''
def get_next_task_id() -> str:
    global counter
    counter = counter + 1

    return counter




if __name__ == '__main__':

    clear_collection("task_system")

    deadline_task = datetime(2023, 3, 12)

    task_info = {
        "title": "Dummy Task",
        "description": "This is a dummy task for testing",
        "deadline": deadline_task,
        "progress": "In Progress",
        "assignee": "John Doe",
        "cost_per_hr": 25,
        "estimation_spent_hrs": 10,
        "actual_time_hr": 6,
        "priority": "High",
        "task_master": "a",
        "labels": ["Testing", "Dummy"]
    }

    deadline_task_test = datetime(2020, 3, 12)

    updated_dict = {        
        "title": "Dummy Task",
        "description": "This is a dummy task for testing",
        "deadline": deadline_task_test,
        "progress": "In Progress",
        "assignee": "jane Doe",
        "cost_per_hr": 25,
        "estimation_spent_hrs": 10,
        "actual_time_hr": 6,
        "task_master": "b",
        "labels": ["Testing", "Dummy"]
    }



    addNewTask(task_info)
    addNewTask(task_info)

    data = getTaskFromID('1')

    print(getAllTasks())



    
