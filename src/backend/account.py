from lib2to3.pgen2 import token
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
    if email in active_users.values():
        active_users[token]


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

    def add_active_user(email):
        active_users[email] = tokens.generate_jwt_token(email)


"""Helper Functions"""


def is_email_valid(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


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
    # Check if email exists
    email_exists = db.checkUser(email)

    if not email_exists["Success"]:
        return {"Success": False, "Message": "Email already exists."}

    # length should be between 4 and 20
    if len(username) < 4 or len(username) > 20:
        return {"Success": False, "Message": "Username Too Short"}

    # Regex  match
    regex_pattern = r"^[a-zA-Z0-9_]+$"
    if not re.match(regex_pattern, username):
        return {"Success": False, "Message": "Username not valid"}

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
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Logout unsuccessful"}

    email = valid_jwt["Data"]["email"]
    if email in active_users:
        del active_users[email]

    return {"Success": True, "Message": "Logout Successful"}


def getAccountInfo(token):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.getSingleUserInformation(email)

    return userInformation


def getAllAccounts(token):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["SystemAdmin"]:
        return {"Succes": False, "Error": "Not an admin"}
    return {"Succes": True, "Error": "", "Data": userInformation}


if __name__ == "__main__":
    db.clear_collection("user_info")
    test_name = "adam"
    test_password = "Password123!"
    test_email = "adam@test.com"
    test_username = "adam_user"
    test_sys = True

    test_success = account_register(
        test_name, test_username, test_email, test_password, test_sys
    )
    test_login = account_login(test_email, test_password)

    print(test_login)

    """Debug code"""
    db.print_all_from_collection("user_info")
