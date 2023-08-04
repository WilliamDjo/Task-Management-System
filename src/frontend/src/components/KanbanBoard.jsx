import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';

import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import TaskModal from './TaskModal';
import { fetchBackend } from '../fetch';

const KanbanBoard = () => {
  const [name, setName] = React.useState('Name');
  const [, setUsername] = React.useState('username');
  const [email, setEmail] = React.useState('email@example.com');
  const [id, setID] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTwo, setIsLoadingTwo] = useState(true);
  const [isLoadingThree, setIsLoadingThree] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [connections, setConnections] = useState([]);

  const [priority, setPriority] = useState(); // New state for priority
  const [costPerHour, setCostPerHour] = useState(''); // New state for cost per hour
  const [timeEstimate, setTimeEstimate] = useState(''); // New state for time estimate
  const [actualTimeSpent, setActualTimeSpent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch user's connections from the backend
  const fetchConnections = (email, isAdmin) => {
    const successGetConnections = data => {
      setConnections(data.Data);

      fetchTasks(email, data.Data, isAdmin);
      setIsLoading(false);
    };
    const token = localStorage.getItem('token');
    fetchBackend(
      '/user/connections',
      'POST',
      { token },
      toast,
      successGetConnections
    );
  };

  const fetchTasks = (email, connections, isAdmin) => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');
      const successGetTasks = data => {
        const connectionSet = new Set(connections.map(c => c.email));
        if (!isAdmin) {
          // Filter the tasks
          const filteredTasks = data.Data.filter(task => {
            return (
              task.assignee === email ||
              connectionSet.has(task.assignee) ||
              task.task_master === email ||
              connectionSet.has(task.task_master)
            );
          });

          // Now filteredTasks array contains only the tasks that matches your condition
          setTasks(filteredTasks);
        } else {
          setTasks(data.Data);
        }
        setIsLoadingTwo(false);
      };

      const body = {
        token,
      };
      fetchBackend('/task/getAll', 'GET', body, toast, successGetTasks);
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

      if (!token) {
        console.error('User token not found in localStorage.');
        return;
      }

      const successGetProfile = data => {
        setEmail(data.Data.email);

        setName(`${data.Data.first_name} ${data.Data.last_name}`);
        setUsername(data.Data.username);

        setIsAdmin(data.Data.SystemAdmin);

        setIsLoadingThree(false);
        fetchConnections(data.Data.email, data.Data.SystemAdmin);
      };

      fetchBackend(
        '/getuserprofile',
        'POST',
        { token },
        toast,
        successGetProfile
      );
    } catch (error) {
      // Handle error if fetching user profile fails
      console.error('Failed to fetch user profile:', error);
    }
  };

  // Fetch the user's profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleAddTask = () => {
    if (newTask && assignedTo) {
      const token = localStorage.getItem('token');
      const task = {
        // id: Date.now(),
        title: newTask,
        description,
        deadline,
        progress: 'Not Started',
        assignee: assignedTo,
        cost_per_hr: costPerHour ? parseFloat(costPerHour) : 0,
        estimation_spent_hrs: timeEstimate ? parseFloat(timeEstimate) : 0,
        actual_time_hr: actualTimeSpent ? parseFloat(actualTimeSpent) : 0,
        priority: priority ? parseInt(priority) : 1,
        // task_master: name,
        labels: tags.slice(0, 5),
        token,
      };

      // For the case when we're updating an existing task
      if (editingTask) {
        const successUpdateTask = () => {
          let updatedTask;

          const updatedTasks = tasks.map(prevTask => {
            if (prevTask.id === editingTask.id) {
              updatedTask = { ...task, progress: prevTask.progress };
              return updatedTask;
            }
            return prevTask;
          });

          setTasks(updatedTasks);

          return { updatedTask, editingTaskId: editingTask.id };
        };

        const { updatedTask, editingTaskId } = successUpdateTask();
        delete updatedTask.task_master;

        const onSuccess = () => {
          console.log('Success ' + updatedTask);
        };

        const onFailure = () => {
          console.error('Failed to update' + updatedTask);
        };

        fetchBackend(
          `/task/update/${editingTaskId}`,
          'PUT',
          updatedTask,
          toast,
          onSuccess,
          onFailure
        );

        // For the case when we're creating a new task
      } else {
        const successCreateTask = data => {
          fetchTasks(email, connections, isAdmin);
        };

        fetchBackend('/task/create', 'POST', task, toast, successCreateTask);
      }

      setNewTask('');
      setDescription('');
      setAssignedTo('');
      setDeadline('');
      setTags([]);
      setPriority(''); // Reset priority state for new task
      setCostPerHour(''); // Reset costPerHour state for new task
      setTimeEstimate(''); // Reset timeEstimate state for new task
      setActualTimeSpent(''); // Reset timeEstimate state for new task
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
    // setTasks(tasks.filter(task => task.id !== taskId));
    let id = 0;
    const updatedTasks = tasks.filter(task => {
      if (task.id === taskId) {
        id = task.id;
      }
      return task;
    });

    setTasks(updatedTasks);
    // Retrieve the token from the localStorage
    const token = localStorage.getItem('token');

    const onSuccess = data => {
      // toast({ title: data });
      fetchTasks(email, connections, isAdmin);
    };
    const onFailure = () => {
      console.error('Failed to remove task');
    };

    fetchBackend(
      `/task/delete/${id}`,
      'DELETE',
      { token },
      toast,
      onSuccess,
      onFailure
    );
  };

  const handleStatusChange = (taskId, progress) => {
    let id = 0;
    let updatedTask = {};
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        id = task.id;
        updatedTask = { ...task, progress };
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    // Retrieve the token from the localStorage
    const token = localStorage.getItem('token');
    // Remove the properties
    delete updatedTask._id;
    delete updatedTask.id;

    updatedTask = { ...updatedTask, token };

    const onSuccess = data => {
      fetchTasks(email, connections);
    };
    const onFailure = () => {
      console.error('Failed to update task');
    };

    fetchBackend(
      `/task/update/${id}`,
      'PUT',
      updatedTask,
      toast,
      onSuccess,
      onFailure
    );
  };

  const handleEditTask = taskId => {
    const taskToEdit = tasks.find(task => task.id === taskId);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTask(taskToEdit.title);
      setID(taskToEdit.id);
      setDescription(taskToEdit.description);
      setAssignedTo(taskToEdit.assignee);
      setDeadline(taskToEdit.deadline);
      setTags(taskToEdit.labels);
      setPriority(taskToEdit.priority);
      setCostPerHour(taskToEdit.cost_per_hr ? taskToEdit.cost_per_hr : 0);
      setTimeEstimate(
        taskToEdit.estimation_spent_hrs ? taskToEdit.estimation_spent_hrs : 0
      );
      setActualTimeSpent(
        taskToEdit.actual_time_hr ? taskToEdit.actual_time_hr : 0
      );

      onOpen();
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
    setActualTimeSpent('');
    onClose();
  };

  // eslint-disable-next-line multiline-ternary
  return isLoading && isLoadingTwo && isLoadingThree ? (
    <Spinner />
  ) : (
    <div style={{ overflowX: 'auto' }}>
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
          isAdmin={isAdmin}
          isOpen={isOpen}
          onClose={handleCloseModal}
          task={editingTask}
          id={id}
          onSubmit={handleAddTask}
          userFullName={name}
          userEmail={email}
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
          setActualTimeSpent={setActualTimeSpent}
        />
      </Box>
    </div>
  );
};

export default KanbanBoard;
