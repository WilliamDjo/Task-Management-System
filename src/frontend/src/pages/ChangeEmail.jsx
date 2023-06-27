import React, { useState } from 'react';
import {
  Button,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

const ChangeEmail = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  const handleChangeEmail = () => {
    // Simulating existing username
    const existingUsername = 'existingUser';

    if (username !== existingUsername) {
      // Username does not exist
      setUsernameError(true);
      setEmailChanged(false);
      console.error('Username does not exist');
    } else {
      // Email change successful
      setUsernameError(false);
      setEmailChanged(true);
      console.log('Email changed successfully');
    }
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
          Change your email
        </Heading>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormControl>
        {usernameError && (
          <Text color="red.500" fontSize="sm">
            The provided username does not exist.
          </Text>
        )}
        {emailChanged && (
          <Text color="green.500" fontSize="sm">
            Email has been changed successfully!
          </Text>
        )}
        <FormControl id="email">
          <FormLabel>New Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
            onClick={handleChangeEmail}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ChangeEmail;
