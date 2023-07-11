import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar';

const Connections = () => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Box bg='blue.50' w='full'>
          <Heading>Connections</Heading>
        </Box>
        <Flex flex={1} bg='blue.50' justifyContent='center'>
          <Box color='black' padding='2' fontSize='xl' fontWeight='bold' width='xl'>
            <Center boxShadow='lg' padding='1' rounded='full' m='3'>
              <Text>
                <Link as={RouteLink} to="/connections/my">My Connections</Link>
              </Text>
            </Center>
            <Center boxShadow='lg' padding='1' rounded='full' m='3'>
              <Text>
                <Link as={RouteLink} to="/connections/add">Add Connection</Link>
              </Text>
            </Center>
            <Center boxShadow='lg' padding='1' rounded='full' m='3'>
              <Text>
                <Link as={RouteLink} to="/connections/pending">Pending Connections</Link>
              </Text>
            </Center>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Connections;
