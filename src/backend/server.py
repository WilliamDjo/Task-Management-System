import json
from flask import Flask, request, jsonify
import sys
import os
import account
from backend.account import update_username


""" Accessing Other Files"""
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

"""Flask Set up"""
app = Flask(__name__)


@app.route("/signup", methods=["POST"])
def server_register():
    username = request.json["username"]
    password = request.json["password"]
    name = request.json["name"]
    email = request.json["email"]
    sys_admin = request.json["sys_admin"]
    status = account.account_register(name, username, email, password, sys_admin)
    return status


@app.route("/login", methods=["POST"])
def login():
    # Request
    email = request.json["email"]
    password = request.json["password"]
    print(email)
    print(password)
    # Log the user
    login_success = account.account_login(email, password)

    # return the log in success details
    return jsonify(login_success)


@app.route("/logout", methods=["POST"])
def logout():
    # Request
    token = request.json["token"]
    logout_success = account.account_logout(token)
    # return the logout details
    return jsonify(logout_success)



@app.route("/update/username", methods=["PUT"])
def update_useranme():

    token = request.json["token"]
    new_username = request.json["username"]
    update_status = account.update_username(new_username)

    return jsonify(update_status)

if __name__ == "__main__":
    app.run()
    test_name = "adam"
    test_password = "password"
    test_email = "adam@test.com"
    test_username = "adam_user"

    account.account_register(test_username, test_email, test_password, sys_admin=True)
    server_register()
