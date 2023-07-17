import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import { fetchBackend, isNone } from '../fetch';
import { Link as RouteLink, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = React.useState('n/a');
  const [selectedUserEmail, setSelectedUserEmail] = React.useState('n/a');

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const [loaded, setLoaded] = React.useState(false);

  const [users, setUsers] = React.useState([
    {
      first_name: 'Akshay',
      last_name: 'Akshay',
      user: 'Akshay',
      email: 'akshay@taskmaster.com',
    },
    {
      first_name: 'Cameron',
      last_name: 'Cameron',
      user: 'Cameron',
      email: 'cameron@taskmaster.com',
    },
    {
      first_name: 'Sanyam',
      last_name: 'Sanyam',
      user: 'Sanyam',
      email: 'sanyam@taskmaster.com',
    },
    {
      first_name: 'William',
      last_name: 'William',
      user: 'William',
      email: 'william@taskmaster.com',
    },
    {
      first_name: 'Jonathan',
      last_name: 'Jonathan',
      user: 'Jonathan',
      email: 'jonathan@taskmaster.com',
    },
  ]);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const toast = useToast();

  const navigate = useNavigate();

  React.useEffect(() => {
    const successGetAllUsers = (data) => {
      // Ensuring that the admin cannot delete their own account.
      const successGetMyUser = (myData) => {
        const myEmail = myData.Data.email;
        const users = data.Data.filter((user) => user.email !== myEmail);
        setUsers(users);
        setLoaded(true);
        localStorage.setItem('admin', true);
      }
      fetchBackend('/getuserprofile', 'POST', { token }, null, successGetMyUser);
    }

    const failGetAllUsers = () => {
      // If it fails, then redirects if there is a token, redirects to dashboard, otherwise redirects to home screen.
      if (isNone(localStorage.getItem('token'))) {
        navigate('/');
        localStorage.removeItem('admin')
      } else {
        navigate('/dashboard');
      }
    }
    const token = localStorage.getItem('token');
    fetchBackend('/getallusers', 'POST', { token }, toast, successGetAllUsers, failGetAllUsers);
  }, []);

  const handleDeleteButton = (user, email) => {
    setSelectedUser(user);
    setSelectedUserEmail(email);
    onAlertOpen();
  };

  const handleFinalDelete = () => {
    const successAdminDelete = () => {
      const newUsers = [...users];
      const newUsersFiltered = newUsers.filter(
        user => user.email !== selectedUserEmail
      );
      setUsers(newUsersFiltered);
      onAlertClose();
      toast({
        title: `${selectedUser}'s account successfully deleted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }

    const token = localStorage.getItem('token');
    const body = {
      token,
      email: selectedUserEmail
    }
    fetchBackend('/admin/delete', 'DELETE', body, toast, successAdminDelete);
  };

  const handleResetButton = (user, email) => {
    setSelectedUser(user);
    setSelectedUserEmail(email);
    setNewPassword('');
    setConfirmNewPassword('');
    onModalOpen();
  };

  const handleFinalPasswordReset = () => {
    const successAdminPasswordReset = () => {
      toast({
        title: `${selectedUser}'s password successfully reset.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onModalClose();
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const token = localStorage.getItem('token');
    const body = {
      token,
      email: selectedUserEmail,
      password: newPassword
    }
    fetchBackend('/admin/reset', 'PUT', body, toast, successAdminPasswordReset);
  };


  const adminCards = () => {
    return (
      <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing="3" m="3">
        {users.map((user, index) => {
          return (
            <LinkBox as={Card} key={index}>
              <CardBody>
                <Heading fontSize="lg">
                  <LinkOverlay as={RouteLink} to={`/connections/my/${user.email}`}>
                    {user.first_name} {user.last_name}
                  </LinkOverlay>
                </Heading>
                <Text>{user.user}</Text>
                <Text>{user.email}</Text>
                <ButtonGroup size="sm" isAttached>
                <Button
                  bg={'red.400'}
                  color={'white'}
                  _hover={{ bg: 'red.500' }}
                  onClick={() =>
                    handleDeleteButton(user.user, user.email)
                  }
                >
                  Delete
                </Button>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  onClick={() => handleResetButton(user.user, user.email)}
                >
                  Reset Password
                </Button>
              </ButtonGroup>
              </CardBody>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    );
  }

  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <NavigationBar />
        <Heading>User Controls</Heading>
        {loaded ? adminCards() : <Center><Spinner /></Center>}
      </Flex>
      <AlertDialog isOpen={isAlertOpen} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {selectedUser}&rsquo;s Account
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You cannot undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onAlertClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleFinalDelete} ml={3}>
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
                <PasswordBar
                  value={newPassword}
                  onChange={event => setNewPassword(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password:</FormLabel>
                <PasswordBar
                  value={confirmNewPassword}
                  onChange={event => setConfirmNewPassword(event.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              loadingText="Submitting"
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              onClick={handleFinalPasswordReset}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
