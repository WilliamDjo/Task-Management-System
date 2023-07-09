import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBackend } from '../fetch'; // Import the fetchBackend function

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false); // New state variable
  const location = useLocation();
  const email = location.state?.email || '';
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log(email);
    if (password === confirmPassword) {
      const requestBody = {
        email,
        new_password: password,
      };

      fetchBackend(
        '/reset/account',
        'POST',
        requestBody,
        null,
        onSuccess,
        onFailure
      );
    } else {
      setPasswordMatchError(true); // Set the password match error to true
    }
  };

  const onSuccess = () => {
    console.log('Password reset successful');
    // Perform any necessary actions after successful password reset
    navigate('/login'); // Redirect to the login page
  };

  const onFailure = () => {
    console.error('Password reset failed');
    // Perform any necessary actions after failed password reset
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

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <PasswordBar
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl
          id="confirm-password"
          isRequired
          isInvalid={passwordMatchError}
        >
          <FormLabel>Confirm Password</FormLabel>
          <PasswordBar
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {passwordMatchError && (
            <FormErrorMessage>
              Password and Confirm Password do not match
            </FormErrorMessage>
          )}
        </FormControl>
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

export default ResetPassword;
