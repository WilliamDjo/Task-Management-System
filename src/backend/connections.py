import os
import sys

# # Try removing this maybe?
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db
import tokens
from database import db_tasks

"""
the Data field in response should be a list of users containing their first_name, last_name, username and email
"""


def getPendingConnections(token):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]

    connections = db.getUserConnections(email)
    # pendingConnections = (
    #     connections["Connections"]["connectionRequests"]
    #     + connections["Connections"]["connectionReceived"]
    # )

    pendingConnections = connections["Connections"]["connectionReceived"]

    to_return = []
    for i in pendingConnections:
        userInfo = db.getSingleUserInformation(i)
        to_return.append(
            {
                "first_name": userInfo["Data"]["first_name"],
                "last_name": userInfo["Data"]["last_name"],
                "email": userInfo["Data"]["email"],
                "username": userInfo["Data"]["username"],
            }
        )
    # print(to_return)
    return {
        "Success": True,
        "Message": "Pending Connections Retrieved",
        "Data": to_return,
    }


def getUserConnections(token):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]

    connections = db.getUserConnections(email)

    connections = connections["Connections"]["connections"]

    to_return = []
    for i in connections:
        userInfo = db.getSingleUserInformation(i)
        if userInfo["Success"]:
            to_return.append(
                {
                    "first_name": userInfo["Data"]["first_name"],
                    "last_name": userInfo["Data"]["last_name"],
                    "email": userInfo["Data"]["email"],
                    "username": userInfo["Data"]["username"],
                    "workload": userInfo["Data"]["workload"],
                }
            )
    return {"Success": True, "Message": "Connections Retrieved", "Data": to_return}


def respondToConnection(token, email_to_respond, accepted):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email_user = valid_jwt["Data"]["email"]

    updateConnection = db.updateConnection(email_user, email_to_respond, accepted)
    return {
        "Success": updateConnection["Success"],
        "Message": updateConnection["Message"],
    }


def AddConnection(token, email_to_connect):
    # Check if the token is valid
    valid_jwt = tokens.check_jwt_token(token)

    # If the token is not valid, return an error message
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    # Extract the email of the user from the token
    email_user = valid_jwt["Data"]["email"]

    # Initiate a new connection
    newConnection = db.addNewConnection(email_user, email_to_connect)

    # Return the result of the connection initiation
    return {
        "Success": newConnection["Success"],
        "Message": newConnection["Message"],
    }


def getConnections(token, email_to_see):
    # Check if the token is valid
    valid_jwt = tokens.check_jwt_token(token)

    # If the token is not valid, return an error message
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    # Extract the email of the user from the token
    email_user = valid_jwt["Data"]["email"]

    userInfo_B = db.getSingleUserInformation(email_to_see)
    userInfo_A = db.getSingleUserInformation(email_user)
    if userInfo_A is False or userInfo_B is False:
        return {
            "Success": "False",
            "Message": "one of the users don't exist",
            "Data": {},
            "Tasks": [],
        }
    isAdmin = userInfo_A["Data"]["SystemAdmin"]
    checkConnection = db.checkConnection(email_to_see, email_user)
    tasks = []
    if checkConnection or isAdmin:
        all_tasks = db_tasks.getTasksAssigned(email_to_see)
        if all_tasks["Success"]:
            for i in all_tasks["Data"]:
                tasks.append(
                    {
                        "id": i["id"],
                        "title": i["title"],
                        "deadline": i["deadline"],
                    }
                )
            tasks = sorted(tasks, key=lambda i: (i["deadline"] is None, i["deadline"]))

    return {
        "Success": "True",
        "Message": "Information Retrieved",
        "Data": {
            "first_name": userInfo_B["Data"]["first_name"],
            "last_name": userInfo_B["Data"]["last_name"],
            "email": userInfo_B["Data"]["email"],
            "username": userInfo_B["Data"]["username"],
            "workload": userInfo_B["Data"]["workload"],
        },
        "Tasks": tasks,
    }
