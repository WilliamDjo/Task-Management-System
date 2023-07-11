import { Box, Center, Flex, Heading, Link, Text } from '@chakra-ui/react';
import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Link as RouterLink } from 'react-router-dom';

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
            <Center bg='blue.200' padding='1' borderRadius='full' m='3'>
              <Text>
                <Link as={RouterLink} to="/connections/my">My Connections</Link>
              </Text>
            </Center>
            <Center bg='blue.200' padding='1' borderRadius='full' m='3'>
              <Text>
                <Link as={RouterLink} to="/connections/add">Add Connection</Link>
              </Text>
            </Center>
            <Center bg='blue.200' padding='1' borderRadius='full' m='3'>
              <Text>
                <Link as={RouterLink} to="/connections/pending">Pending Connections</Link>
              </Text>
            </Center>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Connections;
