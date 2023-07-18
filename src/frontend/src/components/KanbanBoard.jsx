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
  const [priority, setPriority] = useState(''); // New state for priority
  const [costPerHour, setCostPerHour] = useState(''); // New state for cost per hour
  const [timeEstimate, setTimeEstimate] = useState(''); // New state for time estimate

  // Function to fetch user's connections from the backend
  const fetchConnections = async () => {
    try {
      const response = await fetchBackend(
        '/user/connections/',
        'GET',
        null,
        toast
      );
      setConnections(response.data);
    } catch (error) {
      // Handle error if fetching connections fails
      console.error('Failed to fetch connections:', error);
    }
  };

  // Function to fetch user's profile from the backend
  const fetchUserProfile = async () => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User token not found in localStorage.');
        return;
      }

      const response = await fetchBackend(
        '/getuserprofile',
        'POST',
        { token },
        toast
      );

      if (response.Success) {
        const { first_name, last_name } = response.Data;
        setUserFullName(`${first_name} ${last_name}`);
      }
    } catch (error) {
      // Handle error if fetching user profile fails
      console.error('Failed to fetch user profile:', error);
    }
  };
  // Fetch the user's connections on component mount
  useEffect(() => {
    fetchConnections();
  }, []);

  // Fetch the user's profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleAddTask = () => {
    // if (newTask && assignedTo) {
    //   const task = {
    //     id: Date.now(),
    //     title: newTask,
    //     description,
    //     assignedTo,
    //     deadline,
    //     tags: tags.slice(0, 5), // Ensure maximum of 5 tags
    //     status: 'To Do',
    //   };

    //   if (editingTask) {
    //     setTasks(prevTasks =>
    //       prevTasks.map(prevTask =>
    //         prevTask.id === editingTask.id ? task : prevTask
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
      const task = {
        title: newTask,
        description,
        deadline,
        progress: 'To Do',
        assignee: assignedTo,
        cost_per_hr: costPerHour ? parseFloat(costPerHour) : null,
        estimation_spent_hrs: timeEstimate ? parseFloat(timeEstimate) : null,
        actual_time_hr: null,
        priority: priority ? parseInt(priority) : 1,
        task_master: 'User123',
        labels: tags.slice(0, 5),
      };

      if (editingTask) {
        // Call the backend function to update the task
        fetchBackend(
          `/task/update/${editingTask.id}`, // Use the appropriate route to update the task based on the ID
          'PUT',
          task,
          toast,
          data => {
            // onSuccess: Task updated successfully
            // Update the state with the updated task
            setTasks(prevTasks =>
              prevTasks.map(prevTask =>
                prevTask.id === editingTask.id ? data : prevTask
              )
            );
            // Show success message
            toast({
              title: 'Task Updated',
              description: 'Task has been updated successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            // Clear the input fields and close the modal
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
          },
          () => {
            // onFailure: Task update failed
            // Show error message
            toast({
              title: 'Error',
              description: 'Task update failed. Please try again later.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        );
      } else {
        // Call the backend function to create the task
        fetchBackend(
          '/task/create',
          'POST',
          task,
          toast,
          data => {
            // onSuccess: Task created successfully
            // Update the state with the newly created task
            setTasks(prevTasks => [...prevTasks, data.task]);
            // Show success message
            toast({
              title: 'Task Added',
              description: 'Task has been added successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            // Clear the input fields and close the modal
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
          },
          () => {
            // onFailure: Task creation failed
            // Show error message
            toast({
              title: 'Error',
              description: 'Task creation failed. Please try again later.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        );
      }
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
    // setTasks(tasks.filter(task => task.id !== taskId));
    // Call the backend function to delete the task
    fetchBackend(
      `/task/delete/${taskId}`, // Use the appropriate route to delete the task based on the ID
      'DELETE',
      null,
      toast,
      () => {
        // onSuccess: Task deleted successfully
        // Update the state by removing the deleted task from the tasks list
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        // Show success message
        toast({
          title: 'Task Deleted',
          description: 'Task has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      () => {
        // onFailure: Task deletion failed
        // Show error message
        toast({
          title: 'Error',
          description: 'Task deletion failed. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  const handleStatusChange = (taskId, status) => {
    setTasks(
      tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status };
        }
        return task;
      })
    );
  };

  const handleEditTask = taskId => {
    // const taskToEdit = tasks.find(task => task.id === taskId);
    // if (taskToEdit) {
    //   setEditingTask(taskToEdit);
    //   setNewTask(taskToEdit.title);
    //   setDescription(taskToEdit.description);
    //   setAssignedTo(taskToEdit.assignedTo);
    //   setDeadline(taskToEdit.deadline);
    //   setTags(taskToEdit.tags);
    //   onOpen();
    // }
    // Call the backend function to get the task details
    fetchBackend(
      '/task/get',
      'GET',
      null,
      toast,
      data => {
        // onSuccess: Task details fetched successfully
        // Set the state with the fetched task details
        const taskToEdit = data.Data;
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
      },
      () => {
        // onFailure: Failed to fetch task details
        // Show error message
        toast({
          title: 'Error',
          description: 'Failed to fetch task details. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    );
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
                .filter(task => task.status === 'To Do')
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
                .filter(task => task.status === 'In Progress')
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
                .filter(task => task.status === 'Done')
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
                .filter(task => task.status === 'Blocked')
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
        userFullName={userFullName}
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
      />
    </Box>
  );
};

export default KanbanBoard;
