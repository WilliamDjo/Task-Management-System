/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  //   Grid,
  //   GridItem,
  Heading,
  //   IconButton,
  //   Input,
  //   Modal,
  //   ModalBody,
  //   ModalCloseButton,
  //   ModalContent,
  //   ModalFooter,
  //   ModalHeader,
  //   ModalOverlay,
  //   Select,
  //   Spacer,
  Stack,
  //   Tag,
  //   Text,
  //   Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
// import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import TaskModal from './TaskModal';
import { fetchBackend } from '../fetch';

const KanbanBoard = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [email, setEmail] = React.useState('email@example.com');
  //   const [connections, setConnections] = React.useState(1);
  const [organization, setOrganization] = React.useState('Example Company');
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  // State to store the user's connections
  const [connections, setConnections] = useState([]);
  // State to store the user's full name
  const [userFullName, setUserFullName] = useState('');
  const [priority, setPriority] = useState(); // New state for priority
  const [costPerHour, setCostPerHour] = useState(); // New state for cost per hour
  const [timeEstimate, setTimeEstimate] = useState(); // New state for time estimate
  const [actualTimeSpent, setActualTimeSpent] = useState(0);

  // Function to reset the actual time spent in TaskModal
  const handleResetActualTime = () => {
    setActualTimeSpent('');
  };

  // Function to fetch user's connections from the backend
  const fetchConnections = () => {
    const successGetConnections = data => {
      setConnections(data.Data);
    };
    const token = localStorage.getItem('token');
    fetchBackend(
      '/user/connections',
      'POST',
      { token },
      toast,
      successGetConnections
    );
    // console.log('hello connections ' + connections);
    // console.log(response);
    //   setConnections(response.Data);

    // console.log('baba');
    // console.log(connections);
  };

  const fetchTasks = () => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');
      const successGetTasks = data => {
        setTasks(data.Data);
      };

      const body = {
        token: token,
        email: email,
      };
      fetchBackend(
        '/task/getTasksGivenBy',
        'GET',
        body,
        toast,
        successGetTasks
      );
      console.log('email ' + email);
      console.log('task ' + tasks);
    } catch (error) {
      // Handle error if fetching user profile fails
      console.error('Failed to fetch tasks', error);
    }
  };

  // Function to fetch user's profile from the backend
  const fetchUserProfile = () => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');
      //   console.log(token);

      if (!token) {
        console.error('User token not found in localStorage.');
        return;
      }

      const successGetProfile = data => {
        setEmail(data.Data.email);
        setEmailNotifications(data.Data.emailNotifications);
        setConnections(data.Data.connections);
        setName(`${data.Data.first_name} ${data.Data.last_name}`);
        setUsername(data.Data.username);
        setOrganization(data.Data.organization);
        // setLoaded(true);
        // console.log(data);

        fetchTasks();
      };

      fetchBackend(
        '/getuserprofile',
        'POST',
        { token },
        toast,
        successGetProfile
      );

      // console.log('response: ' + name);

      //   if (response) {
      //     // const { first_name, last_name } = response.Data;
      //     setUserFullName({ name });
      //     console.log('hello1');
      //   }
    } catch (error) {
      // Handle error if fetching user profile fails
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Fetch the user's profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch the user's connections on component mount
  useEffect(() => {
    fetchConnections();
  }, []);

  // // Fetch the user's connections on component mount
  // useEffect(() => {

  // }, []);

  const handleAddTask = () => {
    // if (newTask && assignedTo) {
    //   const task = {
    //     id: Date.now(),
    //     title: newTask,
    //     description,
    //     deadline,
    //     progress: 'To Do',
    //     assignee: assignedTo,
    //     cost_per_hr: costPerHour ? parseFloat(costPerHour) : null,
    //     estimation_spent_hrs: timeEstimate ? parseFloat(timeEstimate) : null,
    //     actual_time_hr: actualTimeSpent,
    //     priority: priority ? parseInt(priority) : 1,
    //     task_master: name,
    //     labels: tags.slice(0, 5),
    //   };
    //   if (editingTask) {
    //     setTasks(prevTasks =>
    //       prevTasks.map(prevTask =>
    //         prevTask.id === editingTask.id
    //           ? { ...task, progress: prevTask.progress }
    //           : prevTask
    //       )
    //     );
    //     setEditingTask(null);
    //     toast({
    //       title: 'Task Updated',
    //       description: 'Task has been updated successfully.',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   } else {
    //     setTasks([...tasks, task]);
    //     toast({
    //       title: 'Task Added',
    //       description: 'Task has been added successfully.',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   }
    //   setNewTask('');
    //   setDescription('');
    //   setAssignedTo('');
    //   setDeadline('');
    //   setTags([]);
    //   setPriority(''); // Reset priority state for new task
    //   setCostPerHour(''); // Reset costPerHour state for new task
    //   setTimeEstimate(''); // Reset timeEstimate state for new task
    //   setEditingTask(null);
    //   onClose();
    // } else {
    //   toast({
    //     title: 'Error',
    //     description: 'Please enter a task and assign it to someone.',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    // }
    if (newTask && assignedTo) {
      const token = localStorage.getItem('token');
      const task = {
        // id: Date.now(),
        title: newTask,
        description,
        deadline,
        progress: 'Not Started',
        assignee: assignedTo,
        cost_per_hr: costPerHour ? parseFloat(costPerHour) : null,
        estimation_spent_hrs: timeEstimate ? parseFloat(timeEstimate) : null,
        actual_time_hr: actualTimeSpent,
        priority: priority ? parseInt(priority) : 1,
        // task_master: name,
        labels: tags.slice(0, 5),
        token,
      };

      // For the case when we're updating an existing task
      if (editingTask) {
        const successUpdateTask = data => {
          if (data.Success) {
            setTasks(prevTasks =>
              prevTasks.map(prevTask =>
                prevTask.id === editingTask.id
                  ? { ...task, progress: prevTask.progress }
                  : prevTask
              )
            );
            toast({
              title: 'Task Updated',
              description: 'Task has been updated successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
          }
        };

        fetchBackend(
          `/task/update/${editingTask.id}`,
          'PUT',
          { token, ...task },
          toast,
          successUpdateTask
        );

        // For the case when we're creating a new task
      } else {
        const successCreateTask = data => {
          // setTasks([...tasks, data.Data]);
          // toast({
          //   title: 'Task Added',
          //   description: 'Task has been added successfully.',
          //   status: 'success',
          //   duration: 3000,
          //   isClosable: true,
          // });
          toast({ title: data.message });
        };

        fetchBackend('/task/create', 'POST', task, toast, successCreateTask);
        console.log('task: ' + task);
      }

      setNewTask('');
      setDescription('');
      setAssignedTo('');
      setDeadline('');
      setTags([]);
      setPriority(''); // Reset priority state for new task
      setCostPerHour(''); // Reset costPerHour state for new task
      setTimeEstimate(''); // Reset timeEstimate state for new task
      setEditingTask(null);
      onClose();
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a task and assign it to someone.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveTask = taskId => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId, progress) => {
    // setTasks(prevTasks =>
    //   prevTasks.map(task => {
    //     if (task.id === taskId) {
    //       return { ...task, progress };
    //     }
    //     return task;
    //   })
    // );
    if (progress === 'In Progress' || progress === 'Not Started') {
      // Reset actual time spent to null when changing the status to In Progress or To Do
      setActualTimeSpent(prevState => ({
        ...prevState,
        [taskId]: null,
      }));
    }

    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, progress };
        }
        return task;
      })
    );
  };

  const handleEditTask = taskId => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      //   console.log('editing: ' + taskToEdit.progress);
      setEditingTask(taskToEdit);
      setNewTask(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssignedTo(taskToEdit.assignee);
      setDeadline(taskToEdit.deadline);
      setTags(taskToEdit.labels);
      setPriority(taskToEdit.priority.toString());
      setCostPerHour(
        taskToEdit.cost_per_hr ? taskToEdit.cost_per_hr.toString() : ''
      );
      setTimeEstimate(
        taskToEdit.estimation_spent_hrs
          ? taskToEdit.estimation_spent_hrs.toString()
          : ''
      );

      onOpen();
      //   onOpen();
    }
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setNewTask('');
    setDescription('');
    setAssignedTo('');
    setDeadline('');
    setTags([]);
    setPriority('');
    setCostPerHour('');
    setTimeEstimate('');
    onClose();
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Zombies Board
      </Heading>
      <Flex justify="space-between">
        {' '}
        {/* Use Flex container with row direction */}
        <Box flex={1}>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              To Do
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.progress === 'Not Started')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                    actualTimeSpent={actualTimeSpent[task.id] || null}
                  />
                ))}
            </Stack>
            <AddTaskButton onOpen={onOpen} />
          </Flex>
        </Box>
        <Box flex={1}>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              In Progress
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.progress === 'In Progress')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
          </Flex>
        </Box>
        <Box flex={1}>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              Completed
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.progress === 'Completed')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
          </Flex>
        </Box>
        <Box flex={1}>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              Blocked
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.progress === 'Blocked')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
          </Flex>
        </Box>
      </Flex>
      <TaskModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={handleAddTask}
        userFullName={name}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        connections={connections} // Pass the user's connections to the modal
        newTask={newTask}
        setNewTask={setNewTask}
        description={description}
        setDescription={setDescription}
        deadline={deadline}
        setDeadline={setDeadline}
        tags={tags}
        setTags={setTags}
        priority={priority}
        setPriority={setPriority}
        costPerHour={costPerHour}
        setCostPerHour={setCostPerHour}
        timeEstimate={timeEstimate}
        setTimeEstimate={setTimeEstimate}
        actualTimeSpent={actualTimeSpent}
        resetActualTime={handleResetActualTime}
      />
    </Box>
  );
};

export default KanbanBoard;
