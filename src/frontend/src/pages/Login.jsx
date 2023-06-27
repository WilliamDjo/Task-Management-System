import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  // InputGroup,
  // InputRightElement,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link as RouteLink,
} from 'react-router-dom';
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import PasswordBar from '../components/PasswordBar/PasswordBar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // Simulating incorrect login credentials
  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (response.ok) {
  //       // Login successful, perform necessary actions
  //       console.log('Login successful');
  //     } else {
  //       // Login failed, handle the error
  //       console.error('Login failed');
  //     }
  //   } catch (error) {
  //     console.error('An error occurred while logging in', error);
  //   }
  // };
  const handleLogin = async () => {
    // Simulating incorrect login credentials
    const dummyEmail = 'dummy@example.com';
    const dummyPassword = 'password123';

    if (email === dummyEmail && password === dummyPassword) {
      // Login successful
      setLoginError(false);
      setLoginSuccess(true);
      console.log('Login successful');
    } else {
      // Login failed, handle the error
      setLoginError(true);
      setLoginSuccess(false);
      console.error('Login failed');
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
                <RouteLink to="/cantlogin">
                  <Link color={'blue.400'}>{"Can't Login?"}</Link>
                </RouteLink>
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
                <RouteLink to="/register">
                  <Link color={'blue.400'}>Register</Link>
                </RouteLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
