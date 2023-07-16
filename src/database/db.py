from re import X
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary, json_util
import json

url = "mongodb+srv://z5272191:QuyvHWVdlycdF84R@zombies.x0az3q5.mongodb.net/?retryWrites=true&w=majority"


def getDB():
    client = MongoClient(url)

    db = client["TaskSystem"]

    return db


def getUserInfoCollection(db: Database) -> Collection:
    return db["user_info"]


def getUserProfileCollection(db: Database) -> Collection:
    return db["user_profile"]


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
        "connections": 1,
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
        "emailNotifications": userProfile["notifications"],
        "organization": userProfile["organization_name"],
        "connections": userProfile["connections"],
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
