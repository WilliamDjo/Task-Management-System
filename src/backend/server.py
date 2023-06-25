from flask_pymongo import PyMongo
from flask import Flask, request, jsonify
import sys
import os
import account
from backend.account import account_register
from database import db


''' Accessing Other Files'''
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

'''Flask Set up'''
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://z5272191:QuyvHWVdlycdF84R@zombies.x0az3q5.mongodb.net/?retryWrites=true&w=majority'
mongo = PyMongo(app)




@app.route('/signup', methods=['GET', 'POST'])
def server_register():

    username = request.json['username']
    password = request.json['password']
    name = request.json['name']
    email = request.json['email']
    sys_admin = request.json['sys_admin']
    account_register(name, username, email, password, sys_admin)




if (__name__ == '__main__'):
    
    app.run()
    test_name = 'adam'
    test_password = 'password'
    test_email = 'adam@test.com'
    test_username = 'adam_user'

    account_register(test_username, test_email, test_password, sys_admin=True)
    server_register()
