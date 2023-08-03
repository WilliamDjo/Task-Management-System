import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';

import PasswordBar from '../components/PasswordBar/PasswordBar';
import { fetchBackend } from '../fetch';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [sysAdmin, setSysAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Simulating incorrect login credentials
    // Get user accounts from local storage
    const credentials = {
      email,
      password,
      sysAdmin,
    };

    try {
      await fetchBackend(
        '/login',
        'POST',
        credentials,
        null,
        async data => {
          const { Token, Sys_admin: SysAdmin } = data;

          // Store the token and isAdmin status in localStorage
          if (!Token) {
            setLoginError(true);
            setLoginSuccess(false);
            console.error('Login failed token');
            console.log(data);
            console.log(Token);
          } else {
            setSysAdmin(SysAdmin);
            localStorage.setItem('token', Token);
            console.log('Login successful');
            console.log(Token);
            if (SysAdmin) {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }
        },
        () => {
          // Login failed, handle the error
          setLoginError(true);
          setLoginSuccess(false);
          console.error('Login failed');
        }
      );
    } catch (error) {
      console.error('An error occurred while logging in', error);
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
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to use the best task management system ever ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <PasswordBar
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox>Remember me</Checkbox>
                <Link as={RouteLink} to="/forgotpassword" color={'blue.400'}>
                  {' '}
                  Forgot Password
                </Link>
              </Stack>
              {loginError && (
                <Text color="red.500" fontSize="sm">
                  Invalid email or password. Please try again.
                </Text>
              )}
              {loginSuccess && (
                <Text color="green.500" fontSize="sm">
                  Login successful! Redirecting...
                </Text>
              )}
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don`t have an account?{' '}
                <Link as={RouteLink} to="/register" color={'blue.400'}>
                  {' '}
                  Register
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
