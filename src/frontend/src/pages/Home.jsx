import React from 'react';
import { Box, Button, Center, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box minH='100vh' h='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
      <Center h="full" w="full" >
        <Center p='8' bg={useColorModeValue('white', 'gray.700')} boxShadow='lg' rounded='lg'>
        <Stack align='center'>
          <Heading>TaskMaster</Heading>
          <Text>the best task manager ever ✌️</Text>
          <Center>
            <Link to="/login"><Button m='1'>Login</Button></Link>
            <Link to="/register"><Button m='1'>Register</Button></Link>
          </Center>
        </Stack>
        </Center>
      </Center>
    </Box>
  );
}

export default Home;
