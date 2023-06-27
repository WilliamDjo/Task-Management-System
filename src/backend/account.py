import hashlib
import sys
import os
import re

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db
import tokens

active_users = {}


def generate_password_hash(data):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(data.encode("utf-8"))
    return sha256_hash.hexdigest()


def remove_active_user(email):
    global active_users
    if email in active_users:
        del active_users[email]


def add_active_user(email):
    global active_users
    active_users[email] = tokens.generate_jwt_token(email)


class User:

    """User information"""

    def __init__(
        self, first_name, last_name, username, email, password, sys_admin
    ) -> None:
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.sys_admin = sys_admin

    def to_dict(self):
        return {
            "user": self.username,
            "password": self.password,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "SystemAdmin": self.sys_admin,
        }


"""Helper Functions"""


def is_email_valid(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def is_username_valid(username):
    if len(username) < 4 or len(username) > 20:
        return {"Success": False, "Message": "Username Too Short"}

    regex_pattern = r"^[a-zA-Z0-9_]+$"
    if not re.match(regex_pattern, username):
        return {"Success": False, "Message": "Username not valid"}

    return {"Success": True, "Message": "Username valid"}


"""
8 length minimum
1 upper
1 lower
1 digit
"""


def is_password_valid(password):
    if len(password) < 8:
        return False

    if not any(char.isupper() for char in password):
        return False

    if not any(char.islower() for char in password):
        return False

    if not any(char.isdigit() for char in password):
        return False

    return True


# Return login token
def account_register(first_name, last_name, username, email, password, sys_admin):
    global active_users

    # Check if email exists
    email_exists = db.checkUser(email)

    if not email_exists["Success"]:
        return {"Success": False, "Message": "Email already exists."}

    username_valid = is_username_valid(username)

    if not username_valid["Success"]:
        return username_valid

    # Check if email is valid
    if not is_email_valid(email):
        return {"Success": False, "Message": "Email not valid"}

    # Check if password is valid
    if not is_password_valid(password):
        return {"Success": False, "Message": "Password not valid"}

    # Return true if success | Add user to DB

    new_user = User(first_name, last_name, username, email, password, sys_admin)
    new_user_dict = new_user.to_dict()

    login_token = tokens.generate_jwt_token(email)

    # User.add_active_user(email)
    active_users[email] = login_token  # Make a function for this HERE

    db.addNewUser(new_user_dict)
    del new_user
    return {
        "Success": True,
        "Message": "User created",
        "token": login_token,
        "sys_admin": sys_admin,
    }


def account_login(email, password):
    global active_users

    # Check if email/pw combo matches || Existence is checked in the databse
    password = generate_password_hash(password)
    email_password_match = db.isValidUser(email, password)

    if not email_password_match["Success"]:
        return email_password_match

    userInfo = email_password_match["User"]
    # Return token
    login_token = tokens.generate_jwt_token(email)

    active_users[email] = login_token  # Make a function for this HERE

    return {
        "Success": True,
        "Message": "Logged in",
        "token": login_token,
        "sys_admin": userInfo["SystemAdmin"],
    }


def account_logout(token):
    global active_users
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Logout unsuccessful"}

    email = valid_jwt["Data"]["email"]
    if email in active_users:
        del active_users[email]

    return {"Success": True, "Message": "Logout Successful"}


"""
Updates the username based on token and new_username
"""


def update_username(new_username, token):
    global active_users

    if not is_username_valid(new_username)["Success"]:
        return {"Success": False, "Message": "Username not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_user_dict = {"user": new_username}

    # Update step
    result = db.updateUserInfo(email, new_user_dict)
    return result


"""
Update password
"""


def update_password_account(new_password, token):
    global active_users

    if not is_password_valid(new_password):
        return {"Success": False, "Message": "Password not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]
    print(email)
    print(active_users)
    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_user_dict = {"password": generate_password_hash(new_password)}

    result = db.updateUserInfo(email, new_user_dict)
    return result


"""
Update email on backened
"""


def update_email_account(new_email, token):
    global active_users

    if not is_email_valid(new_email):
        return is_email_valid

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_user_dict = {"email": new_email}

    # new token
    new_token = tokens.generate_jwt_token(new_email)

    result = db.updateUserInfo(email, new_user_dict)

    remove_active_user(email)
    active_users[new_email] = new_token

    return result


"""
Update notfication 
"""


def update_notificiation_set(bool_val, token):
    global active_users

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_dict = {"notifications": bool_val}

    result = db.updateUserProfile(email, new_dict)
    return result


def getAccountInfo(token):
    global active_users

    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.getSingleUserInformation(email)

    return userInformation


def getAllAccounts(token):
    global active_users

    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["Data"]["SystemAdmin"]:
        return {"Succes": False, "Error": "Not an admin"}

    allUserInfo = db.getAllUserInformation()
    print(allUserInfo)
    return {"Succes": True, "Error": "", "Data": allUserInfo}


if __name__ == "__main__":
    db.clear_collection("user_info")
    db.clear_collection("user_profile")
    test_name = "adam"
    test_password = "Password123!"
    new_password = "Password321!0"
    test_email = "adam@test.com"
    test_username = "adam_user"
    test_sys = True

    new_user_test = "new_user_01"
    new_user_email = "new_email@gmail.com"
    test_success = account_register(
        test_name, test_name, test_username, test_email, test_password, test_sys
    )

    update_username(new_user_test, test_success["token"])
    print(update_password_account(new_password, test_success["token"]))

    expected_pass = generate_password_hash(new_password)

    old_pass = generate_password_hash(test_password)

    print(old_pass)

    print(expected_pass)

    """Debug code"""
    db.print_all_from_collection("user_info")
