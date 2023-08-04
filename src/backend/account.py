import hashlib
import re
import os
import sys
import password


parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)
# from src.database import db_helper
from database import db, db_tasks, db_helper
from backend import tokens


""" Generates a SHA-256 hash of the provided data.
returns: Hashed string
"""

def generate_password_hash(data):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(data.encode("utf-8"))
    return sha256_hash.hexdigest()


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


""" Validates if the email address is in the correct format.

    Args:
        email (str): The email address to be validated.

    Returns:
        bool: True if the email is valid, False otherwise.
"""


def is_email_valid(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


""" Validates if the username meets the required criteria.

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


"""Validates if the password meets the required criteria.

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


""" Validates if the name meets the required criteria.

    Args:
        name (str): The name to be validated.

    Returns:
        bool: True if the name is valid, False otherwise.
"""


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

    db.addNewUser(new_user_dict)
    del new_user
    return {
        "Success": True,
        "Message": "User created",
        "token": login_token,
        "sys_admin": sys_admin,
    }


""" Logs in a user with the provided email and password.

    Args:
        email (str): The email of the user.
        password (str): The password of the user.

    Returns:
        dict: A dictionary indicating the success of the login and a corresponding message.
"""


def account_login(email, password):
    # Check if email/pw combo matches || Existence is checked in the databse

    password = generate_password_hash(password)
    email_password_match = db.isValidUser(email, password)


    if not email_password_match["Success"]:
        return {
            "Success": False,
            "Message": "Email or Password combination does not exist",
            "Token": "",
            "sys_admin": "",
        }

    userInfo = email_password_match["User"]
    # Return token
    login_token = tokens.generate_jwt_token(email)

    return {
        "Success": True,
        "Message": "Logged in",
        "Token": login_token,
        "sys_admin": userInfo["SystemAdmin"],
    }


""" Logs out the user with the provided token.

    Args:
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the logout and a corresponding message.
"""


def account_logout(token):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Logout unsuccessful"}

    logout_success = tokens.remove_jwt_token(token)
    if logout_success["Success"]:
        return {"Success": True, "Message": "Logout Successful"}
    return {"Success": False, "Message": "Logout unsuccessful"}

"""Updates the username of the logged-in user with the provided new_username.

    Args:
        new_username (str): The new username to be set for the user.
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the username update and a corresponding message.
"""
def update_username(new_username, token):
    if not is_username_valid(new_username)["Success"]:
        return {"Success": False, "Message": "Username not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in"}

    email = valid_jwt["Data"]["email"]

    new_user_dict = {"user": new_username}

    # Update step
    result = db.updateUserInfo(email, new_user_dict)

    return {"Success": result["Success"], "Message": result["Message"]}


"""Updates the password of the logged-in user's account with the provided new_password.

    Args:
        new_password (str): The new password to be set for the user's account.
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the password update and a corresponding message.
"""
def update_password_account(new_password, token):
    if not is_password_valid(new_password):
        return {"Success": False, "Message": "Password not valid "}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    new_user_dict = {"password": generate_password_hash(new_password)}

    result = db.updateUserInfo(email, new_user_dict)
    return {"Success": result["Success"], "Message": result["Message"]}



"""Updates the email of the logged-in user's account with the provided new_email.

    Args:
        new_email (str): The new email address to be set for the user's account.
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the email update, a corresponding message, and a new token.
"""
def update_email_account(new_email, token):
    if not is_email_valid(new_email):
        return {"Success": False, "Message": "Email Does not exist", "Token": ""}

    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in", "Token": ""}

    email = valid_jwt["Data"]["email"]

    new_user_dict = {"email": new_email}

    # new token
    new_token = tokens.generate_jwt_token(new_email)

    db.updateUserInfo(email, new_user_dict)

    return {"Success": True, "Message": "Email Changed", "Token": new_token}




"""Updates the notification settings of the logged-in user's account.

    Args:
        bool_val (bool): The new value for the notification setting (True or False).
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary indicating the success of the notification update and a corresponding message.
"""
def update_notificiation_set(bool_val, token):
    valid_jwt = tokens.check_jwt_token(token)

    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "user not logged in"}

    email = valid_jwt["Data"]["email"]

    new_dict = {"notifications": bool_val}

    result = db.updateUserProfile(email, new_dict)
    return {"Success": True, "Message": "Notifications updated"}

"""Retrieves the account information of the logged-in user.

    Args:
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary containing the account information of the user.
"""
def getAccountInfo(token):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "User not logged in", "Data": ""}
    email = valid_jwt["Data"]["email"]

    userInformation = db.getSingleUserInformation(email)
    data = userInformation["Data"]

    # todo: rem
    # del data["connections"]
    return {
        "Success": True,
        "Message": "Account info retrieved",
        "Data": data,
    }

"""Retrieves information for all user accounts in the system (only accessible to system administrators).

    Args:
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary containing information for all user accounts.
"""
def getAllAccounts(token):
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


"""Resets the password for a user account by an admin.

    Args:
        token (str): The token of the admin's session.
        new_password (str): The new password to be set for the user account.
        reset_email (str): The email address of the user account to reset the password for.

    Returns:
        dict: A dictionary indicating the success of the password reset and a corresponding message.
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

    return {"Success": True, "Message": "Admin reset the password"}

"""Deletes a user account by an admin.

    Args:
        token (str): The token of the admin's session.
        email_to_delete (str): The email address of the user account to be deleted.

    Returns:
        dict: A dictionary indicating the success of the account deletion and a corresponding message.
"""
def admin_delete_acc(token, email_to_delete):
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error!"}
    email = valid_jwt["Data"]["email"]
    userInformation = db.checkUser(email)

    if not userInformation["Data"]["SystemAdmin"]:
        return {"Success": False, "Message": "Not an admin"}

    result = db.deleteUser(email_to_delete)

    return {"Success": True, "Message": "User deleted"}

"""Resets the password for a user account by sending an OTP (One-Time Password).

    Args:
        email (str): The email address of the user account for which the password will be reset.

    Returns:
        dict: A dictionary indicating the success of sending the OTP and a corresponding message.
"""
def reset_password(email):
    userInformation = db.checkUser(email)
    if userInformation["Success"]:
        return {"Success": False, "Message": "User doesn't exists"}
    password.reset_password(email)
    return {"Success": True, "Message": "OTP Sent"}

"""Verifies the validity of the provided OTP for a user account.

    Args:
        email (str): The email address of the user account for which the OTP will be verified.
        otp (str): The One-Time Password to be checked for validity.

    Returns:
        dict: A dictionary indicating the success of the OTP verification and a corresponding message.
"""
def check_otp(email, otp):
    userInformation = db.checkUser(email)
    if userInformation["Success"]:
        return {"Success": False, "Message": "User doesn't exists"}
    otp_return = password.check_otp(email, otp)

    return {"Success": otp_return["Success"], "Message": otp_return["Message"]}

"""Changes the password for a user account.

    Args:
        email (str): The email address of the user account for which the password will be changed.
        new_password (str): The new password to be set for the user account.

    Returns:
        dict: A dictionary indicating the success of the password change and a corresponding message.
"""
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

'''
Debugging tools, creation of test data
'''
def add_sys_admin():
    first_name = "Sys"
    last_name = "Admin"
    username = "I_am_sys_admin"
    email = "sysAdmin@gmmail.com"
    password = "PassWord123!"
    sys_admin = True
    return account_register(first_name, last_name, username, email, password, sys_admin)


# testing code: DO NOT USE
def add_sys_admin():
    first_name = "Sys"
    last_name = "Admin"
    username = "I_am_sys_admin"
    email = "sysAdmin@gmmail.com"
    password = "PassWord123!"
    sys_admin = True
    return account_register(first_name, last_name, username, email, password, sys_admin)


"""
Workload Computation
"""

"""Retrieves the workload information for a user account.

    Args:
        token (str): The token of the user's session.
        email (str): The email address of the user account for which the workload will be retrieved.

    Returns:
        dict: A dictionary containing the workload information for the user account.
"""
def get_workload(token, email):
    # check active token
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error in active token!"}

    account = db.getSingleUserInformation(email)

    curr_workload = account["Data"]["workload"]
    return {"Success": True, "Data": curr_workload}

"""Retrieves the workload information for the current user account.

    Args:
        token (str): The token of the user's session.

    Returns:
        dict: A dictionary containing the workload information for the current user account.
"""
def get_workload_curr(token):
    # check active token
    valid_jwt = tokens.check_jwt_token(token)
    if not valid_jwt["Success"]:
        return {"Success": False, "Message": "Error in active token!"}

    user_info = getAccountInfo(token)

    if not user_info["Success"]:
        return {"Success": False, "Message": "User not found"}

    result = {"Success": True, "Data": user_info["Data"]["workload"]}