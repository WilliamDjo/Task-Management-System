from db import *

clear_collection('user_info')
clear_collection('user_profile')

user_info = {
        'user': 'BL4NK',
        'email': 'sanyamjain00@gmail.com',
        'password': 'salt123',
        'Name': 'Sanyam',
        'SystemAdmin': False,
        'organization_name':'CACACACAC'
    }
a = addNewUser(user_info)
print(a)

a = isValidUser(user_info['email'], user_info['password'])
print(a)
a = isValidUser(user_info['email'], 'salt456')
print(a)
a = isValidUser('sanymjain00@gmail.com', user_info['password'])
print(a)
a = isValidUser('sanymjain00@gmail.com', 'abc')
print(a)
a = checkUser('sanyamjain00@gmail.com')
print(a)

a = checkUser('sanymmmjain00@gmail.com')
print(a)

user_info = {
        'user': 'BL41NK',
        'password': 'salt1',
        'Name': 'Sanym',
        'SystemAdmin': False,
       
    }

a = updateUserInfo('sanyamjain00@gmail.com',user_info)
print(a)

user_profile = {
        'notifications': True,
        'image': Binary(bytes(0)),
        'organization_name': 'Hoooot'
    }
a = updateUserProfile('sanyamjain00@gmail.com',user_profile)
print(a)

print_all_from_collection('user_info')
print_all_from_collection('user_profile')

a = deleteUser('sanyamjain00@gmail.com')