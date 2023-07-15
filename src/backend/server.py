from crypt import methods
from datetime import date
from flask import Flask, request, jsonify
import sys
import os
import account
from backend.task_sys import create_task, update_details, update_task_title
from flask_cors import CORS


""" Accessing Other Files"""
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

"""Flask Set up"""
app = Flask(__name__)
CORS(app)


@app.route("/signup", methods=["POST"])
def server_register():
    username = request.json["username"]
    password = request.json["password"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    sys_admin = request.json["sys_admin"]
    email = request.json["email"]
    status = account.account_register(
        first_name, last_name, username, email, password, sys_admin
    )
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Token": status["token"],
        "Sys_admin": status["sys_admin"],
    }
    return jsonify(to_return)


@app.route("/login", methods=["POST"])
def login():
    # Request
    email = request.json["email"]
    password = request.json["password"]
    # Log the user
    status = account.account_login(email, password)

    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Token": status["token"],
        "Sys_admin": status["sys_admin"],
    }
    return jsonify(to_return)

@app.route("/logout", methods=["POST"])
def logout():
    # Request
    token = request.json["token"]
    status = account.account_logout(token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

@app.route("/update/username", methods=["PUT"])
def update_useranme():
    token = request.json["token"]
    new_username = request.json["username"]
    status = account.update_username(new_username, token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

"""
Update email wrapper function
"""

@app.route("/update/email", methods=["PUT"])
def update_email():
    token = request.json["token"]
    new_email = request.json["email"]
    status = account.update_email_account(new_email, token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Token": status["Token"],
    }
    return jsonify(to_return)

"""
Update password
"""

@app.route("/update/password", methods=["PUT"])
def update_password():
    token = request.json["token"]
    new_password = request.json["password"]
    status = account.update_password_account(new_password, token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

"""Update notificitons Set true"""
@app.route("/update/notifications", methods=["PUT"])
def server_update_notifications_true():
    token = request.json["token"]
    value = request.json["value"]
    status = account.update_notificiation_set(value, token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

@app.route("/getuserprofile", methods=["POST"])
def getuserprofile():
    token = request.json["token"]
    status = account.getAccountInfo(token)

    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    return jsonify(to_return)

@app.route("/getallusers", methods=["POST"])
def getallusers():
    token = request.json["token"]
    status = account.getAllAccounts(token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    return jsonify(to_return)

@app.route("/admin/reset", methods=["PUT"])
def server_admin_reset_password():
    token = request.json["token"]
    email_to_reset = request.json["email"]
    new_password = request.json["password"]

    status = account.admin_reset_pw(token, new_password, email_to_reset)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

@app.route("/admin/delete", methods=["DELETE"])
def server_admin_delete_email():
    token = request.json["token"]
    email_to_delete = request.json["email"]

    status = account.admin_delete_acc(token, email_to_delete)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

@app.route("/reset/password", methods=["PUT"])
def reset_password():
    email = request.json["email"]

    status = account.reset_password(email)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


@app.route("/reset/otp", methods=["POST"])
def check_otp():
    email = request.json["email"]
    otp = request.json["otp"]
    status = account.check_otp(email, otp)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


@app.route("/reset/account", methods=["POST"])
def reset_account():
    email = request.json["email"]
    new_password = request.json["new_password"]
    status = account.change_password(email, new_password)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)

'''
Task based
'''
@app.route("/task/create", methods=["POST"])
def server_create_task():
    data = request.json
    result = create_task(data)
    return jsonify(result)


@app.route("/task/update/<task_id>", methods=["PUT"])
def server_update_task(task_id):
    data = request.json
    result = update_details(task_id, data)
    return jsonify(result)


if __name__ == "__main__":
    
    
    # test_first = "adam"
    # test_last = "driver"
    # test_password = "Password123!"
    # test_email = "adam@test.com"
    # test_username = "adam_user"

    # account.account_register(test_first, test_last, test_username, test_email, test_password, sys_admin=True)
    app.run()
