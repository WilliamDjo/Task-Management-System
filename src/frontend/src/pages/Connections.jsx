import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar';

const Connections = () => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Box padding='2'>
          <Heading>Connections</Heading>
          <Flex flex={1} bg='white' justifyContent='center'>
            <Box color='black' padding='2' fontSize='xl' fontWeight='bold' width='xl'>
              <Center bg='blue.50' padding='1' rounded='full' m='3'>
                <Link as={RouteLink} to="/connections/my">My Connections</Link>
              </Center>
              <Center bg='blue.50' padding='1' rounded='full' m='3'>
                <Link as={RouteLink} to="/connections/add">Add Connection</Link>
              </Center>
              <Center bg='blue.50' padding='1' rounded='full' m='3'>
                <Link as={RouteLink} to="/connections/pending">Pending Connections</Link>
              </Center>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default Connections;
