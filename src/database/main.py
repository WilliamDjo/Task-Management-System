# Commands we should run before doing a demo.

if __name__ == "__main__":
    import db_helper

    db_helper.clear_collection("task_system")
    db_helper.clear_collection("user_info")
    db_helper.clear_collection("user_profile")
    db_helper.reset_counter()
