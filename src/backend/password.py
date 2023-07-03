import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from threading import Thread

def send_email(email, otp):
    # Create a new thread to send the email
    def run():
        # Your email credentials
        username = "your-email@example.com"
        password = "your-password"

        # Creating the message
        msg = MIMEMultipart()
        msg['From'] = username
        msg['To'] = email
        msg['Subject'] = "Your OTP"

        # The actual message
        message = f"Your OTP is {otp}"
        msg.attach(MIMEText(message, 'plain'))

        # Login and send the email
        try:
            server = smtplib.SMTP('smtp.example.com', 587)
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
