from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

import os
import sys

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

url = "mongodb+srv://z5272191:QuyvHWVdlycdF84R@zombies.x0az3q5.mongodb.net/?retryWrites=true&w=majority"


def getDB():
    client = MongoClient(url)

    db = client["TaskSystem"]

    return db


def getUserInfoCollection(db: Database) -> Collection:
    return db["user_info"]


def getUserProfileCollection(db: Database) -> Collection:
    return db["user_profile"]


def getChatCollection(db: Database) -> Collection:
    return db["task_chats"]


# FOR TESTING ONLY
def clear_collection(collection_name: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object from the database
    collection = db[collection_name]

    # Delete all documents from the collection
    collection.delete_many({})

    # Return a dictionary indicating success
    return {
        "Success": True,
        "Message": f"All documents from {collection_name} deleted successfully",
    }


def print_all_from_collection(collection_name: str):
    # Get the database
    db = getDB()

    # Get the collection object from the database
    collection = db[collection_name]

    # Find all documents in the collection
    documents = collection.find()

    # Loop through the documents and print each one
    for document in documents:
        print(document)


def reset_counter():
    db = getDB()
    sequence_collection = db["sequence_collection"]
    sequence_name = "task_id"

    # Update the sequence counter to reset it
    sequence_collection.update_one({"_id": sequence_name}, {"$set": {"seq_value": 0}})


if __name__ == "__main__":
    clear_collection("task_system")
    clear_collection("user_info")
    clear_collection("user_profile")
    clear_collection("task_chats")
    reset_counter()
