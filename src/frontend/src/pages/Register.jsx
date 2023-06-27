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
} from 'react-router-dom';
import PasswordBar from '../components/PasswordBar/PasswordBar';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);

  // const [showPassword, setShowPassword] = useState(false);
  // const handleRegister = async () => {
  //   try {
  //     const response = await fetch('/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         firstName,
  //         lastName,
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
    // Simulating existing email and username
    const existingEmail = 'existing@example.com';
    const existingUsername = 'existingUser';

    if (email === existingEmail) {
      // Email already exists
      setRegistrationError(true);
      setRegistrationSuccess(false);
      console.error('Email already exists');
    } else if (username === existingUsername) {
      // Username already exists
      setRegistrationError(true);
      setRegistrationSuccess(false);
      console.error('Username already exists');
    } else if (password !== confirmPassword) {
      // Password and Confirm Password mismatch
      setPasswordMismatchError(true);
      setRegistrationError(false);
      setRegistrationSuccess(false);
      console.error('Password and Confirm Password mismatch');
    } else {
      // Registration successful
      setRegistrationError(false);
      setRegistrationSuccess(true);
      setPasswordMismatchError(false);
      console.log('Registration successful');

      // Create user object
      const newUser = {
        email,
        password,
        firstName,
        lastName,
        username,
      };

      // Send the newUser object to the backend (JSON file)
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        console.log('User account saved to the JSON file');
      } catch (error) {
        console.error('Error saving user account to the JSON file', error);
      }
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
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={lastName}
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
