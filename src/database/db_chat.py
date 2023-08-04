import os
import sys

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)


from .db_helper import getDB, getChatCollection, getUserInfoCollection
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

    id_A = str(userInfo_A["_id"])
    id_B = str(userInfo_B["_id"])

    ids = [id_A, id_B]
    ids = sorted(ids)
    uid = "".join(ids)

    chat = {"_id": uid, "messages": []}
    chatCollection.insert_one(chat)

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
    id_A = str(userInfo_A["_id"])
    id_B = str(userInfo_B["_id"])

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

    id_A = str(userInfo_A["_id"])
    id_B = str(userInfo_B["_id"])

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
    message = {
        "sender": sender,
        "receiver": receiver,
        "message": msg,
        "timestamp": timestamp,
    }

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

    id_A = str(userInfo_A["_id"])
    id_B = str(userInfo_B["_id"])

    ids = [id_A, id_B]
    ids = sorted(ids)
    print(ids)
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

def updateEmailInChats(old_email: str, new_email: str) -> dict:
    try:
        # Establish a database connection and get the database object
        db = getDB()
        chatCollection = getChatCollection(db)

        # Update all the 'sender' fields from old_email to new_email
        chatCollection.update_many(
            {"messages.sender": old_email},
            {"$set": {"messages.$[elem].sender": new_email}},
            array_filters=[{"elem.sender": old_email}]
        )

        # Update all the 'receiver' fields from old_email to new_email
        chatCollection.update_many(
            {"messages.receiver": old_email},
            {"$set": {"messages.$[elem].receiver": new_email}},
            array_filters=[{"elem.receiver": old_email}]
        )

        return {"Success": True, "Message": "Email updated in chats successfully"}
    except Exception as e:
        return {"Success": False, "Message": str(e)}
