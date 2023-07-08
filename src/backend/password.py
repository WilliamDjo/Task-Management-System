import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from threading import Thread
import os
import sys
import random

parent_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_folder)

from database import db

reset_otps = []


def reset_password(email):
    # Check if email exists
    email_exists = db.checkUser(email)

    if email_exists["Success"]:
        return {"Success": False, "Message": "Email doesn't exist"}

    for i in reset_otps:
        if i["email"] == email:
            return {"Success": False, "Message": "OTP already sent"}

    random_number = random.randint(100000, 999999)
    send_email(email, random_number)
    reset_otps.append({"email": email, "otp": random_number})


def check_otp(email, otp):
    temp = None
    for i in reset_otps:
        if i["email"] == email and i["otp"] == otp:
            temp = i
    if temp is not None:
        reset_otps.remove(temp)
        return {"Success": True, "Message": ""}
    else:
        return {"Success": False, "Message": "OTP did not match"}


def send_email(email, otp):
    # Create a new thread to send the email
    def run():
        # Your email credentials
        username = "your-email@example.com"
        password = "your-password"

        # Creating the message
        msg = MIMEMultipart()
        msg["From"] = username
        msg["To"] = email
        msg["Subject"] = "Your OTP"

        # The actual message
        message = f"Your OTP is {otp}"
        msg.attach(MIMEText(message, "plain"))

        # Login and send the email
        try:
            server = smtplib.SMTP("smtp.example.com", 587)
            server.starttls()
            server.login(username, password)
            text = msg.as_string()
            server.sendmail(username, email, text)
            server.quit()
            print("Email sent successfully!")
        except Exception as e:
            print(f"Error: {e}")

    # Start the thread
    thread = Thread(target=run)
    thread.start()
