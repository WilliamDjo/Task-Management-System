import React from 'react';
import {
  Flex,
  Box,
  // FormControl,
  // FormLabel,
  // Input,
  // InputGroup,
  // InputRightElement,
  Stack,
  // Link,
  Button,
  Heading,
  // Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  // BrowserRouter as Router,
  // Switch,
  // Route,
  Link as RouteLink,
} from 'react-router-dom';

const CantLogin = () => {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>{"Can't Login?"}</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
              <RouteLink to="/changeemail">
                Change Email
                </RouteLink>
              </Button>
            </Stack>
            <Stack spacing={10}>

              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
              <RouteLink to="/forgotpassword">
                Change Password
                </RouteLink>
              </Button>

            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default CantLogin;
