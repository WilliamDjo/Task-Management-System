import React from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Center, Flex, Heading, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';

const AdminDashboard = () => {
  const [deleteUser, setDeleteUser] = React.useState();
  const [deleteUserId, setDeleteUserId] = React.useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = React.useState([
    {
      name: 'Akshay',
      email: 'akshay@taskmaster.com',
      uid: 1234,
    },
    {
      name: 'Cameron',
      email: 'cameron@taskmaster.com',
      uid: 5678,
    },
    {
      name: 'Sanyam',
      email: 'sanyam@taskmaster.com',
      uid: 9012,
    },
    {
      name: 'William',
      email: 'william@taskmaster.com',
      uid: 3456,
    },
    {
      name: 'Jonathan',
      email: 'jonathan@taskmaster.com',
      uid: 7890,
    }
  ]);

  const handleDeleteButton = (user, id) => {
    setDeleteUser(user);
    setDeleteUserId(id);
    onOpen()
  }

  const handleFinalDelete = () => {
    const newUsers = [...users];
    const newUsersFiltered = newUsers.filter((user) => user.uid !== deleteUserId);
    setUsers(newUsersFiltered);
    onClose();
  }
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Heading>Admin Dashboard</Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing='3' m='3'>
          {users.map((user, index) => {
            return (
              <Box bg='blue.50' key={index} borderRadius='xl' p='2'>
                <Text as='b'>{user.name}</Text>
                <Text>{user.email}</Text>
                <Text>ID: {user.uid}</Text>
                <Center>
                  <ButtonGroup size='sm' isAttached>
                    <Button bg={'red.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={() => handleDeleteButton(user.name, user.uid)}>Delete</Button>
                    <Button bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>Reset Password</Button>
                  </ButtonGroup>
                </Center>
              </Box>
            )
          })}
        </SimpleGrid>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete {deleteUser}
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You cannot undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleFinalDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default AdminDashboard;
