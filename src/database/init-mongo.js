// Connect to the TaskSystem database
db = db.getSiblingDB("TaskSystem");

// Create collections
db.createCollection("sequence_collection");
db.createCollection("task_chats");
db.createCollection("task_system");
db.createCollection("user_info");
db.createCollection("user_profile");
