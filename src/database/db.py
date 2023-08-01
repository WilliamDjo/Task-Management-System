from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary, json_util
import json
import os
import sys

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from .db_helper import getDB, getUserInfoCollection, getUserProfileCollection


def addNewUser(data: dict) -> dict:
    # Establish a database connection and get the database object
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Create a dictionary with the structure of the user info to be inserted
    user_info = {
        "user": "",
        "email": "",
        "password": "",
        "first_name": "",
        "last_name": "",
        "SystemAdmin": False,
        "workload": 0,
    }

    # Loop over the keys in the input data
    for i in data:
        # If the key exists in user_info, update its value
        if i in user_info:
            user_info[i] = data[i]

    # Loop over the keys in user_info
    for i in user_info:
        # If any key's value is empty, return a dictionary with 'Success': False
        if user_info[i] == "":
            return {"Success": False, "Message": "User does not exist"}

    # Insert the user_info dictionary into the UserInfoCollection
    # and get the result of the insertion
    insert_result = UserInfoCollection.insert_one(user_info)

    # Get the id of the inserted document
    inserted_id = insert_result.inserted_id

    # Create a dictionary with the structure of the user profile to be inserted
    user_profile = {
        "_id": inserted_id,
        "notifications": False,
        "image": Binary(bytes(0)),
        "organization_name": "",
        "connectionCount": 0,
        "connections": {
            "connections": [],
            "connectionRequests": [],
            "connectionReceived": [],
        },
    }

    # Loop over the keys in the input data
    for i in data:
        # If the key exists in user_profile, update its value
        if i in user_profile:
            user_profile[i] = data[i]

    # Get the collection object for 'UserProfile' from the database
    UserProfileCollection = getUserProfileCollection(db)

    # Insert the user_profile dictionary into the UserProfileCollection
    UserProfileCollection.insert_one(user_profile)

    # Return a dictionary with 'Success': True and the 'inserted_id' of the new user
    return {
        "Success": True,
        "inserted_id": str(inserted_id),
        "Message": "User Successfully added",
    }


def isValidUser(email: str, password: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {"Success": False, "Message": "Incorrect password or email"}

    # Check if the provided password matches the stored password
    if user["password"] == password:
        # If it matches, return a dictionary indicating success
        return {"Success": True, "User": user, "Message": "Password matches"}
    else:
        # If it does not match, return a dictionary indicating failure
        return {"Success": False, "Message": "Incorrect password or email"}


def checkUser(email: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure TODO
    if user is None:
        return {"Success": True, "Message": "New User"}
    else:
        return {"Success": False, "Message": "User already exists", "Data": user}


def deleteUser(email: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {"Success": False, "Message": "No user found with given email"}

    # If a user was found, delete the user
    UserInfoCollection.delete_one({"email": email})

    # Get the collection object for 'UserProfile' from the database
    UserProfileCollection = getUserProfileCollection(db)

    # Delete the user profile with the _id we got from user info
    UserProfileCollection.delete_one({"_id": user["_id"]})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "User and User Profile deleted successfully"}


def updateUserInfo(email: str, data: dict) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {"Success": False, "Message": "No user found with given email"}

    # Update the user document with the data from the input dictionary
    UserInfoCollection.update_one({"email": email}, {"$set": data})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "User updated successfully"}


def updateUserProfile(email: str, data: dict) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {"Success": False, "Message": "No user found with given email"}

    UserProfileCollection = getUserProfileCollection(db)

    # Update the user document with the data from the input dictionary
    UserProfileCollection.update_one({"_id": user["_id"]}, {"$set": data})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "User updated successfully"}


def updateEmail(old_email: str, new_email: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    user = UserInfoCollection.find_one({"email": old_email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Update the user document with the new email
    UserInfoCollection.update_one({"email": old_email}, {"$set": {"email": new_email}})

    # Return a dictionary indicating success
    return {"Success": True, "Message": "Email updated successfully"}


def getSingleUserInformation(email: str) -> dict:
    db = getDB()
    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if userInfo is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id = userInfo["_id"]

    UserProfileCollection = getUserProfileCollection(db)
    userProfile = UserProfileCollection.find_one({"_id": id})
    if userProfile is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # {"name": "", "email": "", "username": "", emailNotifications: false, "organisation": "", "connections": 1}
    user = {
        "first_name": userInfo["first_name"],
        "last_name": userInfo["last_name"],
        "email": userInfo["email"],
        "username": userInfo["user"],
        "workload": userInfo["workload"],
        "SystemAdmin": userInfo["SystemAdmin"],
        "emailNotifications": userProfile["notifications"],
        "organization": userProfile["organization_name"],
        "connections": userProfile["connectionCount"],
    }

    return {"Success": True, "Message": "", "Data": user}


def getAllUserInformation() -> list:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Get all documents in 'UserInfo' collection
    user_infos = UserInfoCollection.find()

    # Get the collection object for 'UserProfile' from the database
    UserProfileCollection = getUserProfileCollection(db)

    # Get all documents in 'UserProfile' collection
    user_profiles = UserProfileCollection.find()

    # Create a dictionary where the keys are user '_id' and the values are user data
    users = {str(user["_id"]): user for user in user_infos}

    # Loop through each user profile
    for profile in user_profiles:
        # Convert the '_id' to string
        user_id = str(profile["_id"])
        if user_id in users:
            # If the user exists in the users dictionary, merge the user profile with the user data
            users[user_id].update(profile)

    # Convert the values of the users dictionary to a list
    merged_data = list(users.values())

    # Convert the list of dictionaries to a JSON string and then back to a list of dictionaries
    # This step ensures that all BSON types are converted to JSON serializable types
    merged_data = json.loads(json_util.dumps(merged_data))

    return merged_data


# email -> the user sending the request
# userConnection -> the user receiving the request
def addNewConnection(email: str, userConnection: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": email})
    userInfo_B = UserInfoCollection.find_one({"email": userConnection})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    UserProfileCollection = getUserProfileCollection(db)

    userProfile_A = UserProfileCollection.find_one({"_id": id_A})
    userProfile_B = UserProfileCollection.find_one({"_id": id_B})

    if userProfile_A is None or userProfile_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Check if user B's email already exists in user A's connectionRequests or connectionReceived
    if (
        userConnection in userProfile_A["connections"]["connectionRequests"]
        or userConnection in userProfile_A["connections"]["connectionReceived"]
    ):
        return {
            "Success": False,
            "Message": "User already exists in connectionRequests or connectionReceived",
        }

    # Check if user A's email already exists in user B's connectionRequests or connectionReceived
    if (
        email in userProfile_B["connections"]["connectionRequests"]
        or email in userProfile_B["connections"]["connectionReceived"]
    ):
        return {
            "Success": False,
            "Message": "User already exists in connectionRequests or connectionReceived",
        }

    # If no such user exists, add the connection
    UserProfileCollection.update_one(
        {"_id": id_A}, {"$addToSet": {"connections.connectionRequests": userConnection}}
    )
    UserProfileCollection.update_one(
        {"_id": id_B}, {"$addToSet": {"connections.connectionReceived": email}}
    )

    return {"Success": True, "Message": "Connection added successfully"}


def updateConnection(email: str, userConnection: str, accepted: bool) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    userInfo_A = UserInfoCollection.find_one({"email": email})
    userInfo_B = UserInfoCollection.find_one({"email": userConnection})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    UserProfileCollection = getUserProfileCollection(db)

    userProfile_A = UserProfileCollection.find_one({"_id": id_A})
    userProfile_B = UserProfileCollection.find_one({"_id": id_B})

    if userProfile_A is None or userProfile_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Check if user B's email exists in user A's connectionRequests or connectionReceived
    if (
        userConnection not in userProfile_A["connections"]["connectionRequests"]
        and userConnection not in userProfile_A["connections"]["connectionReceived"]
    ):
        return {
            "Success": False,
            "Message": "User not found in connectionRequests or connectionReceived",
        }

    # Check if user A's email exists in user B's connectionRequests or connectionReceived
    if (
        email not in userProfile_B["connections"]["connectionRequests"]
        and email not in userProfile_B["connections"]["connectionReceived"]
    ):
        return {
            "Success": False,
            "Message": "User not found in connectionRequests or connectionReceived",
        }

    if accepted:
        # If the connection is accepted, move user B from connectionRequests or connectionReceived of user A to connections
        if userConnection in userProfile_A["connections"]["connectionRequests"]:
            UserProfileCollection.update_one(
                {"_id": id_A},
                {"$pull": {"connections.connectionRequests": userConnection}},
            )
        else:
            UserProfileCollection.update_one(
                {"_id": id_A},
                {"$pull": {"connections.connectionReceived": userConnection}},
            )
        UserProfileCollection.update_one(
            {"_id": id_A},
            {
                "$addToSet": {"connections.connections": userConnection},
                "$inc": {"connectionCount": 1},
            },
        )

        # Do the same for user B
        if email in userProfile_B["connections"]["connectionRequests"]:
            UserProfileCollection.update_one(
                {"_id": id_B}, {"$pull": {"connections.connectionRequests": email}}
            )
        else:
            UserProfileCollection.update_one(
                {"_id": id_B}, {"$pull": {"connections.connectionReceived": email}}
            )
        UserProfileCollection.update_one(
            {"_id": id_B},
            {
                "$addToSet": {"connections.connections": email},
                "$inc": {"connectionCount": 1},
            },
        )
    else:
        # If the connection is not accepted, remove user B from connectionRequests or connectionReceived of user A
        if userConnection in userProfile_A["connections"]["connectionRequests"]:
            UserProfileCollection.update_one(
                {"_id": id_A},
                {"$pull": {"connections.connectionRequests": userConnection}},
            )
        else:
            UserProfileCollection.update_one(
                {"_id": id_A},
                {"$pull": {"connections.connectionReceived": userConnection}},
            )

        # Do the same for user B
        if email in userProfile_B["connections"]["connectionRequests"]:
            UserProfileCollection.update_one(
                {"_id": id_B}, {"$pull": {"connections.connectionRequests": email}}
            )
        else:
            UserProfileCollection.update_one(
                {"_id": id_B}, {"$pull": {"connections.connectionReceived": email}}
            )

    return {"Success": True, "Message": "Connection updated successfully"}


def removeConnection(email: str, userConnection: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": email})
    userInfo_B = UserInfoCollection.find_one({"email": userConnection})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    UserProfileCollection = getUserProfileCollection(db)

    userProfile_A = UserProfileCollection.find_one({"_id": id_A})
    userProfile_B = UserProfileCollection.find_one({"_id": id_B})

    if userProfile_A is None or userProfile_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Check if user B's email exists in user A's connections
    if userConnection not in userProfile_A["connections"]["connections"]:
        return {"Success": False, "Message": "User not found in connections"}

    # Check if user A's email exists in user B's connections
    if email not in userProfile_B["connections"]["connections"]:
        return {"Success": False, "Message": "User not found in connections"}

    # If such user exists, remove the connection
    UserProfileCollection.update_one(
        {"_id": id_A},
        {
            "$pull": {"connections.connections": userConnection},
            "$inc": {"connectionCount": -1},
        },
    )
    UserProfileCollection.update_one(
        {"_id": id_B},
        {"$pull": {"connections.connections": email}, "$inc": {"connectionCount": -1}},
    )

    return {"Success": True, "Message": "Connection removed successfully"}


def getUserConnections(email: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    userInfo = UserInfoCollection.find_one({"email": email})

    # If no user was found, return a dictionary indicating failure
    if userInfo is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id = userInfo["_id"]

    UserProfileCollection = getUserProfileCollection(db)

    userProfile = UserProfileCollection.find_one({"_id": id})

    if userProfile is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Return the user's connections
    return {
        "Success": True,
        "Message": "User connections retrieved successfully",
        "Connections": userProfile["connections"],
    }


def checkConnection(email_A: str, email_B: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given old email
    userInfo_A = UserInfoCollection.find_one({"email": email_A})
    userInfo_B = UserInfoCollection.find_one({"email": email_B})

    # If no user was found, return a dictionary indicating failure
    if userInfo_A is None or userInfo_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    id_A = userInfo_A["_id"]
    id_B = userInfo_B["_id"]

    UserProfileCollection = getUserProfileCollection(db)

    userProfile_A = UserProfileCollection.find_one({"_id": id_A})
    userProfile_B = UserProfileCollection.find_one({"_id": id_B})

    if userProfile_A is None or userProfile_B is None:
        return {"Success": False, "Message": "No user found with the given email"}

    # Check if user B's email exists in user A's connections and vice versa
    if (
        email_B in userProfile_A["connections"]["connections"]
        and email_A in userProfile_B["connections"]["connections"]
    ):
        return {"Success": True, "Message": "Users are connected"}
    else:
        return {"Success": False, "Message": "Users are not connected"}


def searchUser(search_string: str) -> list:
    # Establish a database connection and get the database object
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Define the list of fields you want to search within
    search_fields = ["user", "email", "first_name", "last_name"]

    # Construct the query
    query = [
        {
            "$match": {
                "$or": [
                    {
                        "$expr": {
                            "$regexMatch": {
                                "input": f"${field}",
                                "regex": search_string,
                            }
                        }
                    }
                    for field in search_fields
                ]
            }
        }
    ]

    # Perform the search
    results = list(UserInfoCollection.aggregate(query))

    return results
