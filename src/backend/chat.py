import os
import sys

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db
import tokens
from database import db_chat
from datetime import datetime


def getChats(token, receiverEmail):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in!", "Data": []}

    senderEmail = valid_jwt["Data"]["email"]
    chatsRetrvd = db_chat.getChats(senderEmail, receiverEmail)
    if not chatsRetrvd["Success"]:
        return {
            "Success": False,
            "Message": "No chat exists between these users",
            "Data": [],
        }

    chatsRetrvd = chatsRetrvd["Chat"]

    # Sort chats based on timestamp in descending order (latest first)
    sorted_chats = sorted(chatsRetrvd, key=lambda x: x["timestamp"], reverse=True)

    chats = []
    for chat in sorted_chats:
        isSender = chat["sender"] == senderEmail
        chats.append(
            {
                "message": chat["message"],
                "timestamp": chat["timestamp"],
                "sender": isSender,
            }
        )

    return {"Success": True, "Message": "Chats retrieved", "Data": chats}


def updateChat(token, receiverEmail, message):
    valid_jwt = tokens.check_jwt_token(token)
    timestamp = datetime.now()
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in!", "Timestamp": ""}

    senderEmail = valid_jwt["Data"]["email"]

    # Add the message using db.AddMessage and do proper error handling
    result = db_chat.addMessage(senderEmail, receiverEmail, message, timestamp)

    if not result["Success"]:
        return {
            "Success": False,
            "Message": "Failed to send message",
            "Timestamp": timestamp,
        }

    return {"Success": True, "Message": "Message Sent", "Timestamp": timestamp}
