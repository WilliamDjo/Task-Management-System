import React from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import { fetchBackend } from '../fetch';

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = React.useState();
  const [selectedUserEmail, setSelectedUserEmail] = React.useState();

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const [users, setUsers] = React.useState([
    {
      username: 'Akshay',
      email: 'akshay@taskmaster.com',
    },
    {
      username: 'Cameron',
      email: 'cameron@taskmaster.com',
    },
    {
      username: 'Sanyam',
      email: 'sanyam@taskmaster.com',
    },
    {
      username: 'William',
      email: 'william@taskmaster.com',
    },
    {
      username: 'Jonathan',
      email: 'jonathan@taskmaster.com',
    }
  ]);
  // const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetchBackend('/getallusers', 'POST', { token: localStorage.getItem('token') })
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setUsers(data.Data)
        }
      })
  }, [])

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const toast = useToast();

  const handleDeleteButton = (user, email) => {
    setSelectedUser(user);
    setSelectedUserEmail(email);
    onAlertOpen();
  }

  const handleFinalDelete = () => {
    fetchBackend('/admin/delete', 'DELETE', { token: localStorage.getItem('token'), email: selectedUserEmail })
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          const newUsers = [...users];
          const newUsersFiltered = newUsers.filter((user) => user.email !== selectedUserEmail);
          setUsers(newUsersFiltered);
          onAlertClose();
          toast({
            title: `${selectedUser}'s account successfully deleted.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      })
  }

  const handleResetButton = (user, email) => {
    setSelectedUser(user);
    setSelectedUserEmail(email);
    setNewPassword('');
    setConfirmNewPassword('');
    onModalOpen();
  }

  const handleFinalPasswordReset = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return
    }
    fetchBackend('/admin/reset', 'PUT', { token: localStorage.getItem('token'), email: selectedUserEmail, password: newPassword })
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: `${selectedUser}'s password successfully reset.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          onModalClose();
        }
      })
  }

  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Heading>Admin Dashboard</Heading>
        <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing='3' m='3'>
          {users.map((user, index) => {
            return (
              <Box bg='blue.50' key={index} borderRadius='xl' p='2'>
                <Text as='b'>{user.email}</Text>
                  <ButtonGroup size='sm' isAttached>
                    <Button bg={'red.400'} color={'white'} _hover={{ bg: 'red.500' }} onClick={() => handleDeleteButton(user.username, user.email)}>Delete</Button>
                    <Button bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={() => handleResetButton(user.username, user.email)}>Reset Password</Button>
                  </ButtonGroup>
              </Box>
            )
          })}
        </SimpleGrid>
      </Flex>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete {selectedUser}&rsquo;s Account
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You cannot undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleFinalDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset {selectedUser}&rsquo;s Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>New Password:</FormLabel>
                <PasswordBar value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password:</FormLabel>
                <PasswordBar value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={handleFinalPasswordReset}>
                Submit
              </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminDashboard;
