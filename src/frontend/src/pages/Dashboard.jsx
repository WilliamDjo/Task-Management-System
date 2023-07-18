import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import KanbanBoard from '../components/KanbanBoard';

const Dashboard = () => {
  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <NavigationBar />
        {/* <ChakraProvider> */}
        <KanbanBoard />
        {/* </ChakraProvider> */}
      </Flex>
    </Box>
  );
};

export default Dashboard;
