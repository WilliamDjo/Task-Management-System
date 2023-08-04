COMP3900 Project

Project Members -
Akshay
Cameron
Jonathan
Sanyam
William

# BUILD INSTRUCTIONS

### Ports - 3000,6969 and 27017 should be free and the system should be connected to the internet. Docker is a requirement to run this

> cd src/

> chmod +x build.sh

> sh build.sh


# Git Workflow

## To create a new branch

> git checkout main

> git checkout -b "User/diary" # For weekly diary
> git checkout -b "User/feature/ISSUE NUMBER"

## Before opening a pull request.

> git checkout main

> git pull --prune

> git checkout "branch-name"

> git rebase main

follow any prompts from the rebase

> git push -f origin "branch-name"

# Route Table

| Route                     | Parameters                                                  | Return Parameters                        | HTTP Request Type |
| ------------------------- | ----------------------------------------------------------- | ---------------------------------------- | ----------------- |
| /signup                   | username, password, first_name, last_name, sys_admin, email | Success, Message, Token, Sys_admin       | POST              |
| /login                    | email, password                                             | Success, Message, Token, Sys_admin       | POST              |
| /logout                   | token                                                       | Success, Message                         | POST              |
| /update/username          | token, new_username                                         | Success, Message                         | PUT               |
| /update/email             | token, new_email                                            | Success, Message, Token                  | PUT               |
| /update/password          | token, new_password                                         | Success, Message                         | PUT               |
| /update/notifications     | token, value                                                | Success, Message                         | PUT               |
| /getuserprofile           | token                                                       | Success, Message, Data                   | POST              |
| /getallusers              | token                                                       | Success, Message, Data                   | POST              |
| /admin/reset              | token, email_to_reset, new_password                         | Success, Message                         | PUT               |
| /admin/delete             | token, email_to_delete                                      | Success, Message                         | DELETE            |
| /reset/password           | email                                                       | Success, Message                         | PUT               |
| /reset/otp                | email, otp                                                  | Success, Message                         | POST              |
| /reset/account            | email, new_password                                         | Success, Message                         | POST              |
| /user/connections/        | token                                                       | Success, Message ,(List of _connection_) | GET               |
| /user/pendingconnections/ | token                                                       | Success, Message ,(List of _connection_) | GET               |
| /user/respondconnection/  | token, email(responded)                                     | Success, Message                         | POST              |
| /user/addconnection/      | token, email(to add)                                        | Success, Message                         | POST              |
| /user/getconnection/      | token, email(to see profile), connection(boolean)           | Success,Message, Data( _connection_)     | GET               |
| /search                   | token, search_token                                         | Success,Message,(List of _task_)         | GET               |

# Data Structures

## userprofile

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

## connection

A list of tasks will also be here

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

## task

```json
Here goes your json object definition
```
