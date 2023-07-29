from bson import Binary, json_util
import json
from db_helper import getDB, getChatCollection, getUserInfoCollection
from datetime import datetime


def addNewChat(
    sender: str,
    receiver: str,
) -> dict:
    # Establish a database connection and get the database object
    db = getDB()
    chatCollection = getChatCollection(db)

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": sender})
    userInfo_B = UserInfoCollection.find_one({"email": receiver})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    ids = [id_A, id_B]
    ids = sorted(ids)
    uid = "".join(ids)

    chat = {"_id": uid, "messages": []}
    insert_result = chatCollection.insert_one(chat)

    return {"Success": True, "Message": "Chat creation done"}


def checkChat(
    sender: str,
    receiver: str,
) -> dict:
    # Establish a database connection and get the database object
    db = getDB()
    chatCollection = getChatCollection(db)

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": sender})
    userInfo_B = UserInfoCollection.find_one({"email": receiver})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}
    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    ids = [id_A, id_B]
    ids = sorted(ids)
    uid = "".join(ids)

    # Check if a chat exists with this uid, if it does return true else return false
    chat = chatCollection.find_one({"_id": uid})

    if chat is None:
        return {"Success": False, "Message": "No chat exists between these users"}
    else:
        return {"Success": True, "Message": "A chat exists between these users"}


def addMessage(
    sender: str,
    receiver: str,
    msg: str,
    timestamp: datetime,
) -> dict:
    # Establish a database connection and get the database object
    db = getDB()
    chatCollection = getChatCollection(db)

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": sender})
    userInfo_B = UserInfoCollection.find_one({"email": receiver})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    ids = [id_A, id_B]
    ids = sorted(ids)
    uid = "".join(ids)

    # Check if a chat exists with this uid, if it does, add the message
    chat = chatCollection.find_one({"_id": uid})

    if chat is None:
        # If chat does not exist, create a new chat
        chatResult = addNewChat(sender, receiver)
        if chatResult["Success"]:
            chat = chatCollection.find_one({"_id": uid})
        else:
            return chatResult
    # Create the message
    message = {"sender": id_A, "receiver": id_B, "message": msg, "timestamp": timestamp}

    # Add the message to the chat document
    chatCollection.update_one({"_id": uid}, {"$push": {"messages": message}})

    return {"Success": True, "Message": "Message added successfully"}


def getChats(
    sender: str,
    receiver: str,
) -> dict:
    # Establish a database connection and get the database object
    db = getDB()
    chatCollection = getChatCollection(db)

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": sender})
    userInfo_B = UserInfoCollection.find_one({"email": receiver})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    ids = [id_A, id_B]
    ids = sorted(ids)
    uid = "".join(ids)

    # Check if a chat exists with this uid, if it does, retrieve the chat
    chat = chatCollection.find_one({"_id": uid})

    if chat is None:
        return {"Success": False, "Message": "No chat exists between these users"}
    else:
        # Return the chat messages
        return {
            "Success": True,
            "Message": "Chat retrieved successfully",
            "Chat": chat["messages"],
        }
