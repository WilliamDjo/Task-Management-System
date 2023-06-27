import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  useNavigate,
} from 'react-router-dom';
// import { fetchBackend } from '../fetch';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // // Get user accounts from local storage
    // const userAccounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

    // // Find the user with matching email
    // const user = userAccounts.find(user => user.email === email);
    if (password === confirmPassword) {
      try {
        const response = await fetch('http://127.0.0.1:5000/reset/password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        if (response.ok) {
          setEmailError(false);
          setPasswordError(false);
          setConfirmPasswordError(false);
          setPasswordChanged(true);
          console.log('Password changed successfully');
          navigate('/login');
        } else {
          setEmailError(true);
          setPasswordChanged(false);
          console.error('Email or Username does not exist');
        }
      } catch (error) {
        console.error('An error occurred while logging in', error);
      }
    } else {
      setPasswordError(true);
      setConfirmPasswordError(true);
      setPasswordChanged(false);
      console.error('Password and Confirm Password do not match');
    }
    // if (password === confirmPassword) {
    //     const token = localStorage.getItem('token');
    //     fetchBackend('/update/password', 'PUT', { token, password }).then(
    //       data => {
    //         if (data.error) {
    //           setPasswordError(true);
    //           setConfirmPasswordError(true);
    //           setPasswordChanged(false);
    //           console.error('Password and Confirm Password do not match');
    //         } else {
    //           // Password change successful
    //           user.password = password; // Update the password in the user object
    //           localStorage.setItem(
    //             'userAccounts',
    //             JSON.stringify(userAccounts)
    //           ); // Update the user accounts in local storage
    //           setEmailError(false);
    //           setPasswordError(false);
    //           setConfirmPasswordError(false);
    //           setPasswordChanged(true);
    //           console.log('Password changed successfully');
    //         }
    //       }
    //     );
    //   }
    // } else {

    // }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>
        {emailError && (
          <Text color="red.500" fontSize="sm">
            The provided email or username does not exist.
          </Text>
        )}
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <PasswordBar
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <PasswordBar
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        {passwordError && confirmPasswordError && (
          <Text color="red.500" fontSize="sm">
            Password and Confirm Password do not match.
          </Text>
        )}
        {passwordChanged && (
          <Text color="green.500" fontSize="sm">
            Password has been changed successfully!
          </Text>
        )}
        <Stack spacing={6}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;
