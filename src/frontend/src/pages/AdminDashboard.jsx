import React from 'react';
import { Box, Button, ButtonGroup, Center, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';

const AdminDashboard = () => {
  const users = [
    {
      name: 'Akshay',
      email: 'akshay@taskmaster.com',
      uid: 1234,
    },
    {
      name: 'Cameron',
      email: 'cameron@taskmaster.com',
      uid: 5678,
    },
    {
      name: 'Sanyam',
      email: 'sanyam@taskmaster.com',
      uid: 9012,
    },
    {
      name: 'William',
      email: 'william@taskmaster.com',
      uid: 3456,
    },
    {
      name: 'Jonathan',
      email: 'jonathan@taskmaster.com',
      uid: 7890,
    }
  ]
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Heading>Admin Dashboard</Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing='3' m='3'>
          {users.map((user, index) => {
            return (
              <Box bg='blue.50' key={index} borderRadius='xl' p='2'>
                <Text as='b'>{user.name}</Text>
                <Text>{user.email}</Text>
                <Text>ID: {user.uid}</Text>
                <Center>
                  <ButtonGroup size='sm' isAttached>
                    <Button bg={'red.400'} color={'white'} _hover={{ bg: 'blue.500' }}>Delete</Button>
                    <Button bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>Reset Password</Button>
                  </ButtonGroup>
                </Center>
              </Box>
            )
          })}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

export default AdminDashboard;
