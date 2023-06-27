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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSubmit = () => {
    // Simulating existing email
    const existingEmail = 'existing-email@example.com';

    if (email !== existingEmail) {
      // Email does not exist
      setEmailError(true);
      setPasswordChanged(false);
      console.error('Email does not exist');
      return;
    }

    if (password !== confirmPassword) {
      // Password and Confirm Password do not match
      setPasswordError(true);
      setConfirmPasswordError(true);
      setPasswordChanged(false);
      console.error('Password and Confirm Password do not match');
      return;
    }

    // Password change successful
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setPasswordChanged(true);
    console.log('Password changed successfully');
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
            The provided email does not exist.
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
