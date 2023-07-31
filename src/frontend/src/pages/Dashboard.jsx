import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import KanbanBoard from '../components/KanbanBoard';
import GenerateReportButton from '../components/GenerateReportButton';

const Dashboard = () => {
  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <NavigationBar />
        {/* <ChakraProvider> */}
        <KanbanBoard />
        {/* </ChakraProvider> */}
        <GenerateReportButton />
      </Flex>
    </Box>
  );
};

export default Dashboard;
