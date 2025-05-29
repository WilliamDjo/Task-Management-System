# Task Management System

A full-stack task management platform designed for collaborative team environments. This system facilitates user authentication, task assignment, connection management, and administrative controls through a RESTful API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Structures](#data-structures)
- [Contributors](#contributors)

## Features

- **User Authentication**: Sign up, log in, log out, and manage user profiles
- **Task Management**: Create, assign, and search for tasks
- **Connection System**: Add, respond to, and view user connections
- **Administrative Controls**: Reset passwords and delete users
- **Notification Settings**: Toggle email notifications

## Tech Stack

- **Backend**: Python
- **Frontend**: JavaScript
- **Containerization**: Docker
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Ensure ports 3000, 6969, and 27017 are free
- Docker must be installed and running
- An active internet connection is required

### Build and Run

```bash
cd src/
chmod +x build.sh
sh build.sh
```

Once the terminal displays "Ready. Please, go to 'localhost:3000' on your browser.", the application is up and running.

## API Endpoints

The system exposes several RESTful endpoints for various functionalities:

### Authentication

**Sign Up**: `POST /signup`
- Parameters: `username`, `password`, `first_name`, `last_name`, `sys_admin`, `email`
- Returns: `Success`, `Message`, `Token`, `Sys_admin`

**Login**: `POST /login`
- Parameters: `email`, `password`
- Returns: `Success`, `Message`, `Token`, `Sys_admin`

**Logout**: `POST /logout`
- Parameters: `token`
- Returns: `Success`, `Message`

### Profile Management

**Update Username**: `PUT /update/username`
- Parameters: `token`, `new_username`
- Returns: `Success`, `Message`

**Update Email**: `PUT /update/email`
- Parameters: `token`, `new_email`
- Returns: `Success`, `Message`, `Token`

**Update Password**: `PUT /update/password`
- Parameters: `token`, `new_password`
- Returns: `Success`, `Message`

**Update Notifications**: `PUT /update/notifications`
- Parameters: `token`, `value`
- Returns: `Success`, `Message`

**Get User Profile**: `POST /getuserprofile`
- Parameters: `token`
- Returns: `Success`, `Message`, `Data`

### Administrative Actions

**Get All Users**: `POST /getallusers`
- Parameters: `token`
- Returns: `Success`, `Message`, `Data`

**Reset User Password**: `PUT /admin/reset`
- Parameters: `token`, `email_to_reset`, `new_password`
- Returns: `Success`, `Message`

**Delete User**: `DELETE /admin/delete`
- Parameters: `token`, `email_to_delete`
- Returns: `Success`, `Message`

### Password Reset Workflow

**Initiate Password Reset**: `PUT /reset/password`
- Parameters: `email`
- Returns: `Success`, `Message`

**Verify OTP**: `POST /reset/otp`
- Parameters: `email`, `otp`
- Returns: `Success`, `Message`

**Reset Account Password**: `POST /reset/account`
- Parameters: `email`, `new_password`
- Returns: `Success`, `Message`

### Connection Management

**Get Connections**: `GET /user/connections/`
- Parameters: `token`
- Returns: `Success`, `Message`, List of connections

**Get Pending Connections**: `GET /user/pendingconnections/`
- Parameters: `token`
- Returns: `Success`, `Message`, List of connections

**Respond to Connection**: `POST /user/respondconnection/`
- Parameters: `token`, `email` (responded)
- Returns: `Success`, `Message`

**Add Connection**: `POST /user/addconnection/`
- Parameters: `token`, `email` (to add)
- Returns: `Success`, `Message`

**Get Connection Profile**: `GET /user/getconnection/`
- Parameters: `token`, `email` (to see profile), `connection` (boolean)
- Returns: `Success`, `Message`, `Data` (connection)

### Task Management

**Search Tasks**: `GET /search`
- Parameters: `token`, `search_token`
- Returns: `Success`, `Message`, List of tasks

## Data Structures

### User Profile

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@example.com",
  "username": "john_d",
  "emailNotifications": true,
  "organization": "OpenAI"
}
```

### Connection

A list of user profiles representing connections.

### Task

*Note: The specific structure for tasks is not detailed in the provided information.*

## Contributors

- William
- Akshay
- Jonathan
- Sanyam
- Cameron
