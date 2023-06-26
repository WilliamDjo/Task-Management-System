import json
from flask_pymongo import PyMongo
from flask import Flask, request, jsonify
import sys
import os
import account
from backend.account import User, account_login, account_register
from database import db


''' Accessing Other Files'''
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

'''Flask Set up'''
app = Flask(__name__)
# app.config['MONGO_URI'] = 'mongodb+srv://z5272191:QuyvHWVdlycdF84R@zombies.x0az3q5.mongodb.net/?retryWrites=true&w=majority'
# mongo = PyMongo(app)



@app.route('/signup', methods=['POST'])
def server_register():

    username = request.json['username']
    password = request.json['password']
    name = request.json['name']
    email = request.json['email']
    sys_admin = request.json['sys_admin']
    status = account_register(name, username, email, password, sys_admin)

    print(status)
    print("\n\n\n\n")
    return status


@app.route('/login', methods=['POST'])
def login():
    #Request
    email = request.json.get('email')
    password = request.json.get('password')

    #Log the user 
    login_success = account_login(email, password)

    #return the log in success details
    return jsonify(login_success)

'''        
@app.route('/logout', methods=['POST'])
def logout():
    #Request
    token = request.json.get('token')

    #return the logout details
    return jsonify(account_logout(token))
'''


if (__name__ == '__main__'):
    
    app.run()
    test_name = 'adam'
    test_password = 'password'
    test_email = 'adam@test.com'
    test_username = 'adam_user'

    account_register(test_username, test_email, test_password, sys_admin=True)
    server_register()
