COMP3900 Project

Project Members -
Akshay
Cameron
Jonathan
Sanyam
William

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

| Route                 | Parameters                                                  | Return Parameters | HTTP Request Type |
| --------------------- | ----------------------------------------------------------- | ----------------- | ----------------- |
| /signup               | username, password, first_name, last_name, sys_admin, email | status            | POST              |
| /login                | email, password                                             | login_success     | POST              |
| /logout               | token                                                       | logout_success    | POST              |
| /update/username      | token, new_username                                         | update_status     | PUT               |
| /update/email         | token, new_email                                            | update_status     | PUT               |
| /update/password      | token, new_password                                         | update_status     | PUT               |
| /update/notifications | token, value                                                | update_status     | PUT               |
| /getuserprofile       | token                                                       | user_profile_info | POST              |
| /getallusers          | token                                                       | users             | POST              |
| /admin/reset          | token, email_to_reset, new_password                         | result            | PUT               |
| /admin/delete         | token, email_to_delete                                      | result            | DELETE            |
| /reset/password       | email, username, password                                   | result            | PUT               |
