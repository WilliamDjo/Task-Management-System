from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from bson import Binary
from config import url


def getDB():
    client = MongoClient(url)

    db = client['TaskSystem']
    
    return db

def getUserInfoCollection(db: Database) -> Collection:
    return db['user_info']

def getUserProfileCollection(db: Database) -> Collection:
    return db['user_profile']

def addNewUser(data: dict) -> dict:
    # Establish a database connection and get the database object
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Create a dictionary with the structure of the user info to be inserted
    user_info = {
        'user': '',
        'email': '',
        'password': '',
        'Name': '',
        'SystemAdmin': False
    }

    # Loop over the keys in the input data
    for i in data:
        # If the key exists in user_info, update its value
        if i in user_info:
            user_info[i] = data[i]

    # Loop over the keys in user_info
    for i in user_info:
        # If any key's value is empty, return a dictionary with 'Success': False
        if user_info[i] == '':
            return {'Success': False}

    # Insert the user_info dictionary into the UserInfoCollection
    # and get the result of the insertion
    insert_result = UserInfoCollection.insert_one(user_info)

    # Get the id of the inserted document
    inserted_id = insert_result.inserted_id

    # Create a dictionary with the structure of the user profile to be inserted
    user_profile = {
        '_id': inserted_id,
        'notifications': False,
        'image': Binary(bytes(0)),
        'organization_name': ''
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
    return {'Success': True, 'inserted_id': str(inserted_id)}

def isValidUser(email:str, password:str) ->dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({'email': email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {'Success': False, 'Error': 'Incorrect password or email'}

    # Check if the provided password matches the stored password
    if user['password'] == password:
        # If it matches, return a dictionary indicating success
        return {'Success': True, 'User': user}
    else:
        # If it does not match, return a dictionary indicating failure
        return {'Success': False, 'Error': 'Incorrect password or email'}

def checkUser(email:str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({'email': email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {'Success': True, 'Error': ''}
    else :
        return {'Success': False, 'Error': 'User already exists'}

def deleteUser(email: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({'email': email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {'Success': False, 'Error': 'No user found with given email'}

    # If a user was found, delete the user
    UserInfoCollection.delete_one({'email': email})

    # Get the collection object for 'UserProfile' from the database
    UserProfileCollection = getUserProfileCollection(db)

    # Delete the user profile with the _id we got from user info
    UserProfileCollection.delete_one({'_id': user['_id']})

    # Return a dictionary indicating success
    return {'Success': True, 'Message': 'User and User Profile deleted successfully'}

def updateUserInfo(email: str, data: dict) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({'email': email})

    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {'Success': False, 'Error': 'No user found with given email'}

    # Update the user document with the data from the input dictionary
    UserInfoCollection.update_one({'email': email}, {'$set': data})

    # Return a dictionary indicating success
    return {'Success': True, 'Message': 'User updated successfully'}

def updateUserProfile(email: str, data: dict) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object for 'UserInfo' from the database
    UserInfoCollection = getUserInfoCollection(db)

    # Attempt to retrieve the user with the given email
    user = UserInfoCollection.find_one({'email': email})

    
    # If no user was found, return a dictionary indicating failure
    if user is None:
        return {'Success': False, 'Error': 'No user found with given email'}

    UserProfileCollection = getUserProfileCollection(db)


    # Update the user document with the data from the input dictionary
    UserProfileCollection.update_one({'_id': user['_id']}, {'$set': data})

    # Return a dictionary indicating success
    return {'Success': True, 'Message': 'User updated successfully'}

# FOR TESTING ONLY
def clear_collection(collection_name: str) -> dict:
    # Get the database
    db = getDB()

    # Get the collection object from the database
    collection = db[collection_name]

    # Delete all documents from the collection
    collection.delete_many({})

    # Return a dictionary indicating success
    return {'Success': True, 'Message': f'All documents from {collection_name} deleted successfully'}

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
