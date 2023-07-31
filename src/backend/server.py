from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import account
import task_sys
import connections
import sys 
import os
import sys

# """ Accessing Other Files"""
parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)
import account
import task_sys
import connections

import chat

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
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    status = account.account_logout(token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


@app.route("/update/username", methods=["PUT"])
def update_useranme():
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
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
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
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
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
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
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    value = request.json["value"]
    status = account.update_notificiation_set(value, token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


@app.route("/getuserprofile", methods=["POST"])
def getuserprofile():
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    status = account.getAccountInfo(token)

    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    print(to_return)
    return jsonify(to_return)


@app.route("/getallusers", methods=["POST"])
def getallusers():
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
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
    token = ""

    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
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


"""
Task based
"""


@app.route("/task/create", methods=["POST"])
def server_create_task():
    auth_header = request.headers.get("Authorization")
    token = ""
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    data = request.json
    result = task_sys.create_task(token, data)
    return jsonify(result)


@app.route("/task/update/<task_id>", methods=["PUT"])
def server_update_task(task_id):
    auth_header = request.headers.get("Authorization")
    token = ""
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    data = request.json
    result = task_sys.update_details(token, task_id, data)
    return jsonify(result)


@app.route("/task/delete/<task_id>", methods=["DELETE"])
def server_delete_task(task_id):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    result = task_sys.delete_task(token, task_id)
    return jsonify(result)


@app.route("/task/get", methods=["GET"])
def server_get_task_details():
    task_id = request.headers.get("task_id")
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    result = task_sys.get_task_details(token, task_id)

    return jsonify(result)


@app.route("/task/getAll", methods=["GET"])
def server_get_all():
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    result = task_sys.get_all_tasks(token)
    return jsonify(result)


@app.route("/task/getAllAssignedTo/<email>", methods=["GET"])
def server_get_all_tasks_assigned_to(email):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    result = task_sys.get_all_tasks_assigned_to(token, email)

    return jsonify(result)


@app.route("/task/getAllAssignedTocurr", methods=["GET"])
def server_get_tasks_assigned_to_current():
    
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    
    
    result = task_sys.get_tasks_assigned_to_curr(token)
    return jsonify(result)



@app.route("/task/getTasksGivenBy/<email>", methods=["GET"])
def server_get_all_tasks(email):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    result = task_sys.get_tasks_given_by(token, email)

    return jsonify(result)


"""
Connections based
"""


@app.route("/user/connections", methods=["POST"])
def get_user_connections():
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    status = connections.getUserConnections(token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    return jsonify(to_return)


@app.route("/user/pendingconnections", methods=["GET"])
def get_user_pending_connections():
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    status = connections.getPendingConnections(token)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    return jsonify(to_return)


@app.route("/user/respondconnection/<email>", methods=["POST"])
def respond_to_connection(email):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    accepted = request.json["accepted"]
    status = connections.respondToConnection(token, email, accepted)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


@app.route("/user/addconnection/<email>/", methods=["POST", "OPTIONS"])
@cross_origin()
def initiate_connection(email):
    if request.method == "OPTIONS":
        return _build_preflight_response()

    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    status = connections.AddConnection(token, email)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
    }
    return jsonify(to_return)


def _build_preflight_response():
    response = jsonify({})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    return response


@app.route("/user/getconnection/<email>", methods=["GET"])
def get_specific_connection(email):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    status = connections.getConnections(token, email)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
        "Tasks": status["Tasks"],
    }
    return jsonify(to_return)


@app.route("/chat/<email>", methods=["GET", "POST"])
def get_chats(email):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401

    if request.method == "POST":
        message = request.json["message"]
        status = chat.updateChat(token, email, message)
        to_return = {
            "Success": status["Success"],
            "Message": status["Message"],
            "Timestamp": status["Timestamp"],
        }
        return jsonify(to_return)

    status = chat.getChats(token, email)
    to_return = {
        "Success": status["Success"],
        "Message": status["Message"],
        "Data": status["Data"],
    }
    return jsonify(to_return)


@app.route("/report/<start_date>/<end_date>", methods=["GET"])
def get_report(start_date, end_date):
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400
        # Now, the variable 'token' contains the token passed in the 'Authorization' header.
        # You can use this token to perform your operations.
    else:
        return {"Success": False, "Message": "No token provided"}, 401
    return



@app.route("/user/getWorkload", methods=["GET"])
def get_workload_for_user():
    
    token = ""
    auth_header = request.headers.get("Authorization")
    if auth_header:
        bearer, _, token = auth_header.partition(" ")
        if bearer.lower() != "bearer":
            return {"Success": False, "Message": "Invalid token format"}, 400

    else:
        return {"Success": False, "Message": "No token provided"}, 401
    

    

if __name__ == "__main__":
    app.run()
