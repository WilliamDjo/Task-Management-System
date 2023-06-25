import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';

const AdminDashboard = () => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Heading>Admin Dashboard</Heading>
      </Flex>
    </Box>
  );
}

export default AdminDashboard;
