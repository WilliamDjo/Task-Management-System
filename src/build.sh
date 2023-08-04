#!/bin/bash

docker compose up -d
docker exec src-mongodb-1 mongoimport --host mongodb --db TaskSystem --collection task_system --type json --file /docker-entrypoint-initdb.d/TaskSystem.task_system.json --jsonArray
docker exec src-mongodb-1 mongoimport --host mongodb --db TaskSystem --collection task_chats --type json --file /docker-entrypoint-initdb.d/TaskSystem.task_chats.json --jsonArray
docker exec src-mongodb-1 mongoimport --host mongodb --db TaskSystem --collection user_info --type json --file /docker-entrypoint-initdb.d/TaskSystem.user_info.json --jsonArray
docker exec src-mongodb-1 mongoimport --host mongodb --db TaskSystem --collection user_profile --type json --file /docker-entrypoint-initdb.d/TaskSystem.user_profile.json --jsonArray

# wait for "Compiled successfully!" message in src-frontend-1 logs
docker logs -f src-frontend-1 2>&1 | grep -m 1 "Compiled successfully!"

# print Ready
echo "Ready. Please, go to 'localhost:3000' on your browser."
