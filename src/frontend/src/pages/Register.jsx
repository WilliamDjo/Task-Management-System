/* eslint-disable camelcase */
import React, { useState } from 'react';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';

import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link as RouteLink,
  useNavigate,
} from 'react-router-dom';
import PasswordBar from '../components/PasswordBar/PasswordBar';
// import { fetchBackend } from '../fetch';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [sys_admin, setSysAdmin] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const navigate = useNavigate();

  // const [showPassword, setShowPassword] = useState(false);
  // const handleRegister = async () => {
  //   try {
  //     const response = await fetch('/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         first_name,
  //         last_name,
  //         username,
  //         email,
  //         password,
  //       }),
  //     });

  //     if (response.ok) {
  //       // Login successful, perform necessary actions
  //       console.log('Register successful');
  //     } else {
  //       // Login failed, handle the error
  //       console.error('Register failed');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred while logging in', error);
  //   }
  // };
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Password and Confirm Password mismatch
      setPasswordMismatchError(true);
      setRegistrationError(false);
      setRegistrationSuccess(false);
      console.error('Password and Confirm Password mismatch');
    }
    // // Get existing user accounts from local storage
    // const existingAccounts =
    //   JSON.parse(localStorage.getItem('userAccounts')) || [];

    // // Check if user already exists
    // const userExists = existingAccounts.some(
    //   user => user.email === email || user.username === username
    // );
    // Create user object
    const newUser = {
      email,
      password,
      first_name,
      last_name,
      username,
      sys_admin,
    };
    // // Add the new user to existing user accounts
    // const updatedAccounts = [...existingAccounts, newUser];

    // // Save the updated user accounts to local storage
    // localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));

    // console.log('User account saved to local storage');
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // Registration successful, receive the token from the backend
        const data = await response.json();
        const { token, sys_admin } = data;

        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', token);
        // Store the sys_admin value in state
        setSysAdmin(sys_admin);

        console.log('User account created and token received');
        // Redirect the user based on the sys_admin value
        if (sys_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }

        // Redirect the user to the login page
        // You can use a router library like react-router-dom for navigation
        // Example:
        // history.push('/login');
      } else {
        // Registration failed
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to use the best task manager ever ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={first_name}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={last_name}
                    onChange={e => setLastName(e.target.value)}
                  />
                </FormControl>
              </Box>
            </HStack>
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
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>
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
            <Stack spacing={10} pt={2}>
              {registrationError && (
                <Text color="red.500" fontSize="sm">
                  An account with the same email or username already exists.
                </Text>
              )}
              {passwordMismatchError && (
                <Text color="red.500" fontSize="sm">
                  Password and Confirm Password do not match.
                </Text>
              )}
              {registrationSuccess && (
                <Text color="green.500" fontSize="sm">
                  Account created successfully! You can now log in.
                </Text>
              )}
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <RouteLink to="/login">
                  <Link color={'blue.400'}>Login</Link>
                </RouteLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
