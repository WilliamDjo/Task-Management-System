import React, { useState } from 'react';
import {
  Center,
  Heading,
  PinInput,
  PinInputField,
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchBackend } from '../fetch';

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const enteredOtp = parseInt(otp.join(''), 10); // Convert the joined OTP string to an integer
      console.log(enteredOtp);
      await fetchBackend(
        '/reset/otp',
        'POST',
        { email, otp: enteredOtp },
        null,
        async data => {
          const { Success } = data;
          if (Success) {
            console.log(email);
            navigate('/resetpassword', { state: { email } });
          } else {
            console.error('OTP verification failed');
          }
        },
        () => {
          console.error('An error occurred while verifying the OTP');
        }
      );
    } catch (error) {
      console.error('An error occurred while verifying the OTP', error);
    }
  };

  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
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
        maxW={'sm'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          fontWeight="bold"
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          {email}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput>
                <PinInputField
                  value={otp[0]}
                  onChange={e => handleOtpChange(0, e.target.value)}
                />
                <PinInputField
                  value={otp[1]}
                  onChange={e => handleOtpChange(1, e.target.value)}
                />
                <PinInputField
                  value={otp[2]}
                  onChange={e => handleOtpChange(2, e.target.value)}
                />
                <PinInputField
                  value={otp[3]}
                  onChange={e => handleOtpChange(3, e.target.value)}
                />
                <PinInputField
                  value={otp[4]}
                  onChange={e => handleOtpChange(4, e.target.value)}
                />
                <PinInputField
                  value={otp[5]}
                  onChange={e => handleOtpChange(5, e.target.value)}
                />
              </PinInput>
            </HStack>
          </Center>
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
            Verify
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default VerifyEmail;
