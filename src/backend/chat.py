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
    print(chatsRetrvd)
    chatsRetrvd = chatsRetrvd["Chat"]
    chats = []
    for i in chatsRetrvd:
        isSender = False
        if i["sender"] == senderEmail:
            isSender = True
        chats.append(
            {"message": i["message"], "timestamp": i["timestamp"], "sender": isSender}
        )

    return {"Success": True, "Message": "Chats retreived", "Data": chats}


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
