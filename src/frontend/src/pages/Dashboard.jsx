import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';
import KanbanBoard from '../components/KanbanBoard';
import { fetchBackend } from '../fetch';

const Dashboard = () => {
  const [tasks, setTasks] = React.useState([
    {
      title: 'Hello',
    },
  ]);
  const [email, setEmail] = React.useState('');
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

  const showTasks = () => {
    const success = data => {
      setTasks(data.Data);
    };

    const token = localStorage.getItem('token');
    fetchBackend('/task/getAll', 'GET', { token }, toast, success);
  };

  const consoleLogTask = id => {
    const success = data => {
      console.log(data);
    };

    const token = localStorage.getItem('token');
    fetchBackend(`/task/get/${id}`, 'GET', { token }, toast, success);
  };

  const tasksAssigned = () => {
    const success = data => {
      console.log(data);
    };

    const token = localStorage.getItem('token');
    fetchBackend(
      `/task/getAllAssignedTo/${email}`,
      'GET',
      { token },
      toast,
      success
    );
  };

  const tasksGiven = () => {
    const success = data => {
      console.log(data);
    };

    const token = localStorage.getItem('token');
    fetchBackend(
      `/task/getTasksGivenBy/${email}`,
      'GET',
      { token },
      toast,
      success
    );
  };

  React.useEffect(() => {
    const success = data => {
      console.log(data);
      setTasks(data.Data);
    };
    const token = localStorage.getItem('token');
    fetchBackend('/task/getAll', 'GET', { token }, toast, success);
  }, []);
  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <Button onClick={newTask}>Click here for new tasks</Button>
        <Button onClick={showTasks}>Click here to show all tasks</Button>
        <FormControl>
          <FormLabel>Email:</FormLabel>
          <Input value={email} onChange={e => setEmail(e.target.value)}></Input>
        </FormControl>
        <Button onClick={tasksAssigned}>
          Click here to console log all tasks assigned to email
        </Button>
        <Button onClick={tasksGiven}>
          Click here to console log all tasks given by email
        </Button>
        <Box>
          {tasks.map((x, index) => {
            return (
              <Box key={index} onClick={() => consoleLogTask(x.id)}>
                {x.title} - {x.id}
              </Box>
            );
          })}
        </Box>
        <NavigationBar />
        {/* <ChakraProvider> */}
        <KanbanBoard />
        {/* </ChakraProvider> */}
      </Flex>
    </Box>
  );
};

export default Dashboard;
