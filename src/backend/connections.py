import hashlib
import sys
import os
import re

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db
import tokens
import password
import account


def getPendingConnections(token):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]
