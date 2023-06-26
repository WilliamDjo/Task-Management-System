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
import tokens

class User:

    '''User information'''
    active_users = {}

    def __init__(self, name, username, email, password, sys_admin) -> None:

        self.name = name
        self.username = username
        self.email = email
        self.password =   generate_password_hash(password)
        self.sys_admin = sys_admin

    def to_dict(self):
        return {
            'name': self.name,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'sys_admin': self.sys_admin
        }
        

    def add_active_user(email):
        User.active_users['email'] = tokens.generate_jwt_token(email)

    def remove_active_user(email):
        if email in User.active_users:
            del User.active_users[email]


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



#Return login token
def account_register(name, username, email, password, sys_admin):

    #Check if email exists
    email_exists = db.checkUser(email)
    
    print("email_exits")
    print(email_exists)


    if not email_exists['Success']:
        return {'Success': False, 'Message': 'Email already exists.'}

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
    new_user_dict = new_user.to_dict()

    login_token = tokens.generate_jwt_token(email)

    User.add_active_user(email)
    db.addNewUser(new_user_dict)
    del new_user
    return {'Success': True, 'Message': 'User created', 'token': login_token}




def account_login(email, password):

    #Check if email/pw combo matches || Existence is checked in the databse
    email_password_match = db.isValidUser(email, password)
    
    if not email_password_match['Success']:
        return {'Success': False, 'Message': 'Email or Password does not match'}


    #Return token
    login_token = tokens.generate_jwt_token(email)

    User.add_active_user(email)
    return {'Success': True, 'Message': 'Logged in', 'token': login_token}

def account_logout(email):
    pass


if (__name__ == '__main__'):
    
    test_name = 'adam'
    test_password = 'Password123!'
    test_email = 'adam@test.com'
    test_username = 'adam_user'
    test_sys = True

    test_success = account_register(test_name, test_username, test_email, test_password, test_sys)
    
   




    



        

    