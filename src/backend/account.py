import hashlib
import sys
import os
import re

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db
import tokens
import password

active_users = {}

"""
Generates a SHA-256 hash of the provided data.
returns: Hashed string
"""


def generate_password_hash(data):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(data.encode("utf-8"))
    return sha256_hash.hexdigest()


"""
    Removes the user with the specified email from the active users.

    Args:
        email (str): The email of the user to be removed.
"""


def remove_active_user(email):
    global active_users
    if email in active_users:
        del active_users[email]


"""
Adds the user with the specified email to the active users dictionary.

    Args:
        email (str): The email of the user to be added.
"""


def add_active_user(email):
    global active_users
    active_users[email] = tokens.generate_jwt_token(email)


"""Represents user information.

    Attributes:
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        username (str): The username of the user.
        email (str): The email of the user.
        password (str): The hashed password of the user.
        sys_admin (bool): Indicates whether the user is a system administrator.
"""


class User:
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


"""
Validates if the email address is in the correct format.

    Args:
        email (str): The email address to be validated.

    Returns:
        bool: True if the email is valid, False otherwise.
"""


def is_email_valid(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


"""
 Validates if the username meets the required criteria.

    Args:
        username (str): The username to be validated.

    Returns:
        dict: A dictionary indicating the success of the validation and a corresponding message.
"""


def is_username_valid(username):
    if len(username) < 4 or len(username) > 20:
        return {"Success": False, "Message": "Username Too Short"}

    regex_pattern = r"^[a-zA-Z0-9_]+$"
    if not re.match(regex_pattern, username):
        return {"Success": False, "Message": "Username not valid"}

    return {"Success": True, "Message": "Username valid"}


"""
Validates if the password meets the required criteria.

    Args:
        password (str): The password to be validated.

    Returns:
        bool: True if the password is valid, False otherwise.
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


"""Validates if the name meets the required criteria.

    Args:
        name (str): The name to be validated.

    Returns:
        bool: True if the name is valid, False otherwise."""


def is_name_valid(name):
    pattern = r"^[A-Za-z\s'-]+$"
    return re.match(pattern, name) is not None


"""Registers a new user account.

    Args:
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        username (str): The username of the user.
        email (str): The email of the user.
        password (str): The password of the user.
        sys_admin (bool): Indicates whether the user is a system administrator.

    Returns:
        dict: A dictionary indicating the success of the registration and a corresponding message."""


def account_register(first_name, last_name, username, email, password, sys_admin):
    global active_users

    # Check if name is valid:
    if (not is_name_valid(first_name)) or (not is_name_valid(last_name)):
        return {
            "Success": False,
            "Message": "Invalid name.",
            "token": "",
            "sys_admin": "",
        }

    # Check if email exists
    email_exists = db.checkUser(email)

    if not email_exists["Success"]:
        return {
            "Success": False,
            "Message": "Email already exists.",
            "token": "",
            "sys_admin": "",
        }

    username_valid = is_username_valid(username)

    if not username_valid["Success"]:
        return {
            "Success": False,
            "Message": username_valid["Message"],
            "token": "",
            "sys_admin": "",
        }

    # Check if email is valid
    if not is_email_valid(email):
        return {
            "Success": False,
            "Message": "Email not valid",
            "token": "",
            "sys_admin": "",
        }

    # Check if password is valid
    if not is_password_valid(password):
        return {
            "Success": False,
            "Message": "Password not valid",
            "token": "",
            "sys_admin": "",
        }

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


"""
Logs in a user with the provided email and password.

    Args:
        email (str): The email of the user.
        password (str): The password of the user.

    Returns:
        dict: A dictionary indicating the success of the login and a corresponding message.
"""


def account_login(email, password):
    global active_users

    # Check if email/pw combo matches || Existence is checked in the databse
    password = generate_password_hash(password)
    email_password_match = db.isValidUser(email, password)

    if not email_password_match["Success"]:
        return {
            "Success": False,
            "Message": "Email or Password combination does not exist",
            "token": "",
            "sys_admin": "",
        }

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


"""
 Logs out the user with the provided token.

    Args:
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the logout and a corresponding message.
"""


def account_logout(token):
    global active_users
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Logout unsuccessful"}

    email = valid_jwt["Data"]["email"]
    if email in active_users:
        del active_users[email]

    return {"Success": True, "Message": "Logout Successful"}


def update_username(new_username, token):
    global active_users

    if not is_username_valid(new_username)["Success"]:
        return {"Success": False, "Message": "Username not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_user_dict = {"user": new_username}

    # Update step
    result = db.updateUserInfo(email, new_user_dict)

    return {"Success": result["Success"], "Message": result["Message"]}


def update_password_account(new_password, token):
    global active_users

    if not is_password_valid(new_password):
        return {"Success": False, "Message": "Password not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active"}

    new_user_dict = {"password": generate_password_hash(new_password)}

    result = db.updateUserInfo(email, new_user_dict)
    return {"Success": result["Success"], "Message": result["Message"]}


"""
Update email on backened
"""


def update_email_account(new_email, token):
    global active_users

    if not is_email_valid(new_email):
        return {"Success": False, "Message": "Email Does not exist", "Token": ""}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in", "Token": ""}

    email = valid_jwt["Data"]["email"]

    if email not in active_users:
        return {"Success": False, "Message": "User not active", "Token": ""}

    new_user_dict = {"email": new_email}

    # new token
    new_token = tokens.generate_jwt_token(new_email)

    db.updateUserInfo(email, new_user_dict)

    remove_active_user(email)
    active_users[new_email] = new_token

    return {"Success": True, "Message": "Email Changed", "Token": new_token}


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
    return {"Success": False, "Message": "Notifications updated"}


def getAccountInfo(token):
    global active_users

    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in", "Data": ""}
    email = valid_jwt["Data"]["email"]
    userInformation = db.getSingleUserInformation(email)

    return {
        "Success": True,
        "Message": "Account info retrieved",
        "Data": userInformation["Data"],
    }


def getAllAccounts(token):
    global active_users

    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!", "Data": ""}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["Data"]["SystemAdmin"]:
        return {"Success": False, "Message": "Not an admin", "Data": ""}

    allUserInfo = db.getAllUserInformation()
    # print(allUserInfo)
    return {
        "Success": True,
        "Message": "Info retrieved successfully",
        "Data": allUserInfo,
    }


"""
Admin Functions
"""


def admin_reset_pw(token, new_password, reset_email):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["Data"]["SystemAdmin"]:
        return {"Success": False, "Message": "Not an admin"}
    check_pass = is_password_valid(new_password)
    if not check_pass:
        return {"Success": False, "Message": "Password not valid"}
    new_user_dict = {"password": generate_password_hash(new_password)}
    result = db.updateUserInfo(reset_email, new_user_dict)

    remove_active_user(reset_email)

    return {"Success": True, "Message": "Admin reset the password"}


def admin_delete_acc(token, email_to_delete):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["Data"]["SystemAdmin"]:
        return {"Success": False, "Message": "Not an admin"}

    remove_active_user(email_to_delete)
    result = db.deleteUser(email_to_delete)

    return {"Success": False, "Message": "User deleted"}


def reset_password(email):
    userInformation = db.checkUser(email)
    if userInformation["Success"]:
        return {"Success": False, "Message": "User doesn't exists"}
    password.reset_password(email)
    return {"Success": True, "Message": "OTP Sent"}


def check_otp(email, otp):
    userInformation = db.checkUser(email)
    if userInformation["Success"]:
        return {"Success": False, "Message": "User doesn't exists"}
    otp_return = password.check_otp(email, otp)

    return {"Success": otp_return["Success"], "Message": otp_return["Message"]}


def change_password(email, new_password):
    userInformation = db.checkUser(email)
    if userInformation["Success"]:
        return {"Success": False, "Message": "User doesn't exists"}

    if not is_password_valid(new_password):
        return {"Success": False, "Message": "Password not valid"}

    update_password = db.updateUserInfo(
        email, {"password": generate_password_hash(new_password)}
    )

    return {
        "Success": update_password["Success"],
        "Message": update_password["Message"],
    }
