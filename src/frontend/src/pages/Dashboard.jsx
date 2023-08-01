/* eslint-disable no-unused-vars */
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
import GenerateReportButton from '../components/GenerateReportButton';
import { fetchBackend } from '../fetch';

const Dashboard = () => {
  const [tasks, setTasks] = React.useState([]);
  const [email, setEmail] = React.useState('');
  const toast = useToast();

  const sortTasks = (a, b) => {
    const taskA = Number(a.id.replace('TASK', ''));
    const taskB = Number(b.id.replace('TASK', ''));
    if (taskA < taskB) {
      return -1;
    } else if (taskA > taskB) {
      return 1;
    } else {
      return 0;
    }
  };

  // This runs when clicking the new task button.
  const newTask = () => {
    const success = data => {
      toast({
        title: 'New task created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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

  // This runs when clicking the show task button (replaces the current tasks on the Dashboard with an up to date version).
  const showTasks = () => {
    const success = data => {
      const newTasks = [...data.Data];
      newTasks.sort(sortTasks);
      setTasks(newTasks);
      toast({
        title: 'Showing all tasks!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    };

    const token = localStorage.getItem('token');
    fetchBackend('/task/getAll', 'GET', { token }, toast, success);
  };

  // On clicking a task, it updates it with the following content.
  const updateTask = id => {
    const success = data => {
      console.log(data);
      toast({
        title: `Task ${id} updated!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    };

    const token = localStorage.getItem('token');
    const body = {
      title: 'This is a new title',
      description: 'Description',
      deadline: '2023-09-09',
      progress: 'Not Started',
      cost_per_hr: 10,
      estimation_spent_hrs: 10,
      actual_time_hr: 10,
      priority: 1,
      labels: [],
      assignee: email,
      token,
    };
    fetchBackend(`/task/update/${id}`, 'PUT', body, toast, success);
    console.log(body);
  };

  // Console logs the tasks assigned to the inputted email.
  const tasksAssigned = () => {
    const success = data => {
      console.log(data);
      toast({
        title: 'Tasks assigned shown in console log!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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

  // Console logs the tasks given the inputted email.
  const tasksGiven = () => {
    const success = data => {
      console.log(data);
      toast({
        title: 'Tasks given shown in console log!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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

  // On loading the page, it sets the tasks to be all tasks.
  React.useEffect(() => {
    const success = data => {
      console.log(data);
      const newTasks = [...data.Data];
      newTasks.sort(sortTasks);
      setTasks(newTasks);
    };
    const token = localStorage.getItem('token');
    fetchBackend('/task/getAll', 'GET', { token }, toast, success);
  }, []);

  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        {/* <Button onClick={newTask}>Click here for new tasks</Button>
        <Button onClick={showTasks}>Click here to show all tasks</Button>
        <FormControl>
          <FormLabel>Email:</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)}></Input>
        </FormControl>
        <Button onClick={tasksAssigned}>Click here to console log all tasks assigned to email</Button>
        <Button onClick={tasksGiven}>Click here to console log all tasks given by email</Button>
        <Box>
          {tasks.map((x, index) => {
            return (
              <Box key={index} onClick={() => updateTask(x.id)}>
                {x.title} - {x.id}
              </Box>
            )
          })}
        </Box> */}
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
