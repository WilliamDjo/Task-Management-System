import json
from flask import Flask, request, jsonify
import sys
import os
import account
from backend.account import update_email_account, update_notificiation_set, update_password_account, update_username


""" Accessing Other Files"""
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

"""Flask Set up"""
app = Flask(__name__)


@app.route("/signup", methods=["POST"])
def server_register():
    username = request.json["username"]
    password = request.json["password"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]

    email = request.json["email"]
    sys_admin = request.json["sys_admin"]
    status = account.account_register(
        first_name, last_name, username, email, password, sys_admin
    )
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


'''
Update email wrapper function
'''
@app.route("/update/email", methods=["PUT"])
def update_email():
    token = request.json["token"]
    new_email = request.json["email"]
    update_status = update_email_account(new_email)

    return jsonify(update_status)




'''
Update password
'''
@app.route("/update/password", methods=["PUT"])
def update_password():
    token = request.json["token"]
    new_password = request.json["password"]
    update_status = update_password_account(new_password, token)

    return jsonify(update_status)


'''Update notificitons Set true'''
@app.route("/update/notifications", methods=["PUT"])
def server_update_notifications_true():
    token = request.json['token']
    value = request.json['value']
    update_status = update_notificiation_set(value, token)
    return jsonify(update_status)
    
@app.route("/getuserprofile", methods=["GET"])
def getuserprofile():
    token = request.json["token"]
    user_profile_info = account.getAccountInfo(token)
    return jsonify(user_profile_info)


@app.route("/getallusers", methods=["GET"])
def getallusers():
    token = request.json["token"]
    users = account.getAllAccounts(token)
    return jsonify(users)


if __name__ == "__main__":
    app.run()
    test_name = "adam"
    test_password = "password"
    test_email = "adam@test.com"
    test_username = "adam_user"

    account.account_register(test_username, test_email, test_password, sys_admin=True)
    server_register()
