from flask import Flask, request, jsonify
import sys
import os
import account

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
    sys_admin = request.json["sys_admin"]
    email = request.json["email"]
    status = account.account_register(
        first_name, last_name, username, email, password, sys_admin
    )
    return status


@app.route("/login", methods=["POST"])
def login():
    # Request
    email = request.json["email"]
    password = request.json["password"]
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
    update_status = account.update_username(new_username, token)
    return jsonify(update_status)


"""
Update email wrapper function
"""


@app.route("/update/email", methods=["PUT"])
def update_email():
    token = request.json["token"]
    new_email = request.json["email"]
    update_status = account.update_email_account(new_email, token)

    return jsonify(update_status)


"""
Update password
"""


@app.route("/update/password", methods=["PUT"])
def update_password():
    token = request.json["token"]
    new_password = request.json["password"]
    update_status = account.update_password_account(new_password, token)

    return jsonify(update_status)


"""Update notificitons Set true"""


@app.route("/update/notifications", methods=["PUT"])
def server_update_notifications_true():
    token = request.json["token"]
    value = request.json["value"]
    update_status = account.update_notificiation_set(value, token)
    return jsonify(update_status)


@app.route("/getuserprofile", methods=["POST"])
def getuserprofile():
    token = request.json["token"]
    user_profile_info = account.getAccountInfo(token)
    return jsonify(user_profile_info)


@app.route("/getallusers", methods=["POST"])
def getallusers():
    token = request.json["token"]
    users = account.getAllAccounts(token)
    return jsonify(users)


@app.route("/admin/reset", methods=["PUT"])
def server_admin_reset_password():
    token = request.json["token"]
    email_to_reset = request.json["email"]
    new_password = request.json["password"]

    result = account.admin_reset_pw(token, new_password, email_to_reset)
    return jsonify(result)


@app.route("/admin/delete", methods=["DELETE"])
def server_admin_delete_email():
    token = request.json["token"]
    email_to_delete = request.json["email"]

    result = account.admin_delete_acc(token, email_to_delete)
    return jsonify(result)


@app.route("/reset/password", methods=["PUT"])
def reset_password():
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]
    result = account.reset_password(email, username, password)
    return jsonify(result)


if __name__ == "__main__":
    
    
    test_first = "adam"
    test_last = "driver"
    test_password = "Password123!"
    test_email = "adam@test.com"
    test_username = "adam_user"

    account.account_register(test_first, test_last, test_username, test_email, test_password, sys_admin=True)
    app.run()
    server_register()
