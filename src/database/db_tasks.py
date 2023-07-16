# imports
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary, json_util
import json
import os
import sys
import re

"""
TESTING: DELETE
"""

from datetime import date, datetime
from database.db import getDB

"""
Returns the the entire collection
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
  
   return {"Success": True, "Task_id": task_id }


def getTaskFromID(task_id: str) -> dict:
   db = getDB()


   # Get the collection object for 'TaskSystem' from the database
   TaskSystemCollection = getTaskInfoCollection(db)


   task = TaskSystemCollection.find_one({"id": task_id})


   # If no user was found, return a dictionary indicating failure
   if task is None:
       return {"Success": False, "Message": "Incorrect task id"}


   return {"Success": True, "Message": "Task Found", "Data": task}


def updateTaskInfo(task_id: str, data: dict) -> dict:
   # Get the database
   db = getDB()


   # Get the collection object for 'UserInfo' from the database
   TaskSystemCollection = getTaskInfoCollection(db)


   task = TaskSystemCollection.find_one({"id": task_id})


   if task is None:
       return {"Success": False, "Message": "No task found with given id"}


   result = TaskSystemCollection.update_one({"id": task_id}, {"$set": data})
   return {"Success": True, "Message": "Update successfull"}


def deleteTask(task_id: str) -> dict:
   # Get the database
   db = getDB()


   # Get the collection object for 'UserInfo' from the database
   TaskSystemCollection = getTaskInfoCollection(db)


   # Attempt to retrieve the user with the given email
   task = TaskSystemCollection.find_one({"id": task_id})


   # If no user was found, return a dictionary indicating failure
   if task is None:
       return {"Success": False, "Message": "No task found"}


   # If a user was found, delete the user
   TaskSystemCollection.delete_one({"id": task_id})


   # Return a dictionary indicating success
   return {"Success": True, "Message": "Task deleted successfully"}


def getAllTasks() -> dict:
   # Get the database
   db = getDB()


   # Get the collection object for 'UserInfo' from the database
   TaskSystemCollection = getTaskInfoCollection(db)


   task_infos = TaskSystemCollection.find()
   data = json.loads(json_util.dumps(task_infos))


   return data


"""
Helper function to generate IDs
"""


def get_next_task_id() -> str:


   db = getDB()
   sequence_collection = db['sequence_collection']


   sequence_name = 'task_id'


   # Find the document for the given sequence name and atomically increment the value
   sequence_doc = sequence_collection.find_one_and_update(
       {'_id': sequence_name},
       {'$inc': {'seq_value': 1}},
       upsert=True,
       return_document=True
   )


   # Retrieve the incremented value from the document
   next_id = sequence_doc['seq_value']


   # Format the task ID with a desired prefix
   task_id_prefix = 'TASK'
   formatted_id = f'{task_id_prefix}-{next_id:06d}'


   return formatted_id


def reset_counter():
   db = getDB()
   sequence_collection = db['sequence_collection']
   sequence_name = 'task_id'


   # Update the sequence counter to reset it
   sequence_collection.update_one(
       {'_id': sequence_name},
       {'$set': {'seq_value': 0}}
   )


if __name__ == "__main__":
  
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
       "labels": ["Testing", "Dummy"],
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
       "labels": ["Testing", "Dummy"],
   }


   addNewTask(task_info)
   addNewTask(task_info)


