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

import { Link as RouteLink, useNavigate } from 'react-router-dom';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import { fetchBackend } from '../fetch';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [sysAdmin, setSysAdmin] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Password and Confirm Password mismatch
      setPasswordMismatchError(true);
      setRegistrationError(false);
      setRegistrationSuccess(false);
      console.error('Password and Confirm Password mismatch');
    } else {
      // Create user object
      const newUser = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username,
        sys_admin: sysAdmin,
      };

      try {
        await fetchBackend(
          '/signup',
          'POST',
          newUser,
          null,
          async data => {
            const { Token, Sys_admin: SysAdmin } = data;

            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', Token);
            // Store the SysAdmin value in state
            setSysAdmin(SysAdmin);

            console.log('User account created and token received');
            // Redirect the user based on the SysAdmin value
            if (SysAdmin) {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          },
          () => {
            // Registration failed
            console.error('Registration failed');
          }
        );
      } catch (error) {
        console.error('Error registering user', error);
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
                <FormControl id="lastName" isRequired>
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
                <Link as={RouteLink} to="/login" color={'blue.400'}>
                  {' '}
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
