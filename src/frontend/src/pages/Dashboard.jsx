import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';

const Dashboard = () => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Heading>Dashboard</Heading>
      </Flex>
    </Box>
  );
}

export default Dashboard;
