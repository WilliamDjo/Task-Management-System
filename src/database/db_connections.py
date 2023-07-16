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


def getUserConnectionsCollection(db: Database) -> Collection:
    return db["user_connections"]


"""
{
'_id':
'connectionRequested':,
'connectionReceived':,
'connections'
}
"""
