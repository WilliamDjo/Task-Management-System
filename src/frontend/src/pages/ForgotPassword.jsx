import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { fetchBackend } from '../fetch';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await fetchBackend(
        '/reset/password',
        'POST',
        { email },
        null,
        async data => {
          const { Success } = data;
          if (Success) {
            navigate('/verifyemail', { state: { email } });
          } else {
            // Handle error if needed
            console.error('Reset password request failed');
          }
        },
        () => {
          // Handle error if needed
          console.error('An error occurred while resetting the password');
        }
      );
    } catch (error) {
      console.error('An error occurred while resetting the password', error);
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
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
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
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ForgotPassword;
