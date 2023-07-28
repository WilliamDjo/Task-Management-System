import React from 'react';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import KanbanBoard from '../components/KanbanBoard';
import { fetchBackend } from '../fetch';

const Dashboard = () => {
  const toast = useToast();

  const newTask = () => {
    const success = data => {
      toast({ title: data.message });
    };
    const title = 'Title';
    const description = 'This is a description';
    const deadline = '2023-12-31';
    const progress = 'Not Started';
    const costPerHr = 10;
    const estimationSpentHrs = 20;
    const actualTimeHr = 30;
    const priority = 1;
    const labels = ['code', 'agile'];
    const assignee = '';
    const token = localStorage.getItem('token');

    const body = {
      title,
      description,
      deadline,
      progress,
      cost_per_hr: costPerHr,
      estimation_spent_hrs: estimationSpentHrs,
      actual_time_hr: actualTimeHr,
      priority,
      labels,
      assignee,
      token,
    };

    fetchBackend('/task/create', 'POST', body, toast, success);
  };

  React.useEffect(() => {
    const success = data => {
      console.log(data);
    };
    const token = localStorage.getItem('token');
    fetchBackend('/task/getAll', 'GET', { token }, toast, success);
  });
  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <Button onClick={newTask}>Click here</Button>
        <NavigationBar />
        {/* <ChakraProvider> */}
        <KanbanBoard />
        {/* </ChakraProvider> */}
      </Flex>
    </Box>
  );
};

export default Dashboard;
