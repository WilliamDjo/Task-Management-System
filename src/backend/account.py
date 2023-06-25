from crypt import methods
from email.quoprimime import quote
from errno import ESPIPE
import json
from json.tool import main
from time import monotonic_ns
from xmlrpc.client import boolean
import bcrypt
from pymongo import MongoClient
from urllib.parse import quote_plus
from pymongo.server_api import ServerApi
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import ssl
import sys
from flask_pymongo import PyMongo
from flask import Flask, request, jsonify
import os
import re


parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db

class User:
    def __init__(self, name, username, email, password, sys_admin) -> None:

        self.name = name
        self.username = username
        self.email = email
        self.password =   generate_password_hash(password)
        self.sys_admin = sys_admin

    def to_json(self):
        return json.dumps(self.__dict__)



'''Helper Functions'''
def is_email_valid(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
   
    if not re.match(pattern, email):
        return False 

    return True

def is_password_valid(password):

    if (len(password) < 8):
        return False
    
    if not any(char.isupper() for char in password):
        return False
    
    if not any(char.islower() for char in password):
        return False

    if not any(char.isdigit() for char in password):
        return False
    
    return True


def account_register(name, username, email, password, sys_admin):

    #Check if email exists
    email_exists = db.checkUser(email)
    if not email_exists['Success']:
        return {'Success': False, 'Message': 'Email already exists.'}


    #Check if username is valid
    
    #length should be between 4 and 20
    if len(username) < 4  or len(username) > 20:
        return {'Success': False, 'Message': 'Username Too Short'}

    #Regex  match
    regex_pattern = r'^[a-zA-Z0-9_]+$'
    if not re.match(regex_pattern, username):
        return {'Success': False, 'Message': 'Username not valid'}

    #Check if email is valid
    if not is_email_valid(email):
        return {'Success': False, 'Message': 'Email not valid'}

    #Check if password is valid
    if not is_password_valid(password):
        return {'Success': False, 'Message': 'Password not valid'}

    
    #Return true if success | Add user to DB

    new_user = User(name, username, email, password, sys_admin)
    new_user_json = new_user.to_json()

    print(new_user_json)


    return {'Success': True, 'Message': 'User created'}



if (__name__ == '__main__'):
    
    test_name = 'adam'
    test_password = 'Password123!'
    test_email = 'adam@test.com'
    test_username = 'adam_user'
    test_sys = True

    test_success = account_register(test_name, test_username, test_email, test_password, test_sys)
    print(test_success)
   




    



        

    