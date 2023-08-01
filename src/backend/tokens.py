import jwt
import secrets
from datetime import datetime


active_tokens = []
length = 32
secret_key = secrets.token_hex(length // 2)


def generate_jwt_token(email):
    # Define the payload containing the email address
    payload = {"email": email, "timestamp": datetime.utcnow().isoformat()}

    # Generate the JWT token
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    active_tokens.append(token)
    return token


def check_jwt_token(token):
    try:
        # Verify the JWT token using the provided secret key
        decoded_data = jwt.decode(token, secret_key, algorithms=["HS256"])
        if token in active_tokens:
            return {"Success": True, "Data": decoded_data}
    except jwt.ExpiredSignatureError:
        # Handle token expiration error
        print("Token has expired.")
    except jwt.InvalidTokenError:
        # Handle invalid token error
        print("Invalid token.")
    except Exception as e:
        # Handle other exceptions
        print(f"Error occurred while decoding token: {e}")

    return {"Success": False, "Data": None}


def remove_jwt_token(token):
    try:
        # Verify the JWT token using the provided secret key
        decoded_data = jwt.decode(token, secret_key, algorithms=["HS256"])
        if token in active_tokens:
            active_tokens.remove(token)
            return {"Success": True, "Message": "Token has been removed successfully"}
    except jwt.ExpiredSignatureError:
        # Handle token expiration error
        print("Token has expired.")
    except jwt.InvalidTokenError:
        # Handle invalid token error
        print("Invalid token.")
    except Exception as e:
        # Handle other exceptions
        print(f"Error occurred while decoding token: {e}")

    return {"Success": False, "Message": "Failed to remove token"}


if __name__ == "__main__":
    t1 = generate_jwt_token("sanyam")
    t2 = generate_jwt_token("sanyam")
    print(t1)
    print(t2)
    c1 = check_jwt_token(t1)
    c2 = check_jwt_token(t2)
    print(c1)
    print(c2)
    active_tokens.remove(t1)
    c1 = check_jwt_token(t1)
    c2 = check_jwt_token(t2)
    print(c1)
    print(c2)
    active_tokens.remove(t2)
    c1 = check_jwt_token(t1)
    c2 = check_jwt_token(t2)
    print(c1)
    print(c2)
