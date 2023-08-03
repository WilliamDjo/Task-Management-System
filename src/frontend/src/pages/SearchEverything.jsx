/* eslint-disable no-unused-vars */
/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  Flex,
  Stack,
  Badge,
  Grid,
  useToast,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NavigationBar from '../components/NavigationBar';
import { fetchBackend } from '../fetch';
import SearchResult from '../components/SearchResults';
import TaskModal from '../components/TaskModal';

const SearchEverything = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = React.useState('email@example.com');
  const [connections, setConnections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTwo, setIsLoadingTwo] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [organization, setOrganization] = React.useState('Example Company');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  // State to store the user's connections

  // State to store the user's full name
  const [userFullName, setUserFullName] = useState('');
  const [priority, setPriority] = useState(); // New state for priority
  const [costPerHour, setCostPerHour] = useState(''); // New state for cost per hour
  const [timeEstimate, setTimeEstimate] = useState(''); // New state for time estimate
  const [actualTimeSpent, setActualTimeSpent] = useState('');

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
        const successGetConnections = (data, email, isAdmin) => {
          setConnections(data.Data);
          fetchTasks(email, data.Data, isAdmin);
          setIsLoading(false);
        }
        setName(`${data.Data.first_name} ${data.Data.last_name}`);
        setUsername(data.Data.username);
        setEmail(data.Data.email);
        setIsAdmin(data.Data.SystemAdmin);

        fetchBackend('/user/connections', 'POST', { token }, toast, (data2) => successGetConnections(data2, data.Data.email, data.Data.SystemAdmin))
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

  const fetchTasks = (email, connections, isAdmin) => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');
      const successGetTasks = data => {
        // setTasks(data.Data);
        // const newTasks = [...data.Data];
        // Creating a Set for easier lookup
        // console.log('con ' + connections);
        if (connections) {
          const connectionSet = new Set(connections.map(c => c.email));

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
          if (isAdmin) {
            setTasks(data.Data);
          } else {
            // Filter the tasks
            const filteredTasks = data.Data.filter(task => {
              return task.assignee === email || task.task_master === email;
            });
            setTasks(filteredTasks);
          }
        }
        setIsLoadingTwo(false);
      };

      const body = {
        token,
      };
      fetchBackend('/task/getAll', 'GET', body, toast, successGetTasks);
      // console.log('email ' + email);
      // console.log('task ' + tasks);
    } catch (error) {
      // Handle error if fetching user profile fails
      console.error('Failed to fetch tasks', error);
    }
    // console.log('baba');
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.deadline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (taskId, progress) => {
    // if (progress === 'In Progress' || progress === 'Not Started') {
    //   // Reset actual time spent to null when changing the status to In Progress or To Do
    //   setActualTimeSpent(prevState => ({
    //     ...prevState,
    //     [taskId]: 0,
    //   }));
    // }
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
    // const body = { updatedTask, token }; // assuming you have the token available in the scope
    const onSuccess = data => {
      // toast({ title: data });
      fetchTasks(email, connections, isAdmin);
    };
    const onFailure = () => {
      console.log('Failed to update task');
      console.log('id: ' + id);
      console.log('task: ' + JSON.stringify(updatedTask));
    };

    fetchBackend(
      `/task/update/${id}`,
      'PUT',
      updatedTask,
      toast,
      onSuccess,
      onFailure
    );
    console.log('baba');
  };

  const handleSubmitTask = () => {
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
        task_master: name,
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
        console.log('up ' + JSON.stringify(updatedTask));
        const onSuccess = () => {
          // toast({ title: data });
          console.log('Success ' + updatedTask);
          // fetchAllTasks(email);
          fetchTasks(email, connections, isAdmin);
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

  const handleEditTask = taskId => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    // console.log('id: ' + JSON.stringify(taskToEdit));
    if (taskToEdit) {
      //   console.log('editing: ' + taskToEdit.progress);
      setEditingTask(taskToEdit);
      setNewTask(taskToEdit.title);
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
      //   onOpen();
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

    console.log('remove ' + JSON.stringify(tasks));
    const onSuccess = data => {
      // toast({ title: data });
      console.log('Delete Success => ' + JSON.stringify(updatedTasks));
      fetchTasks(email, connections, isAdmin);
    };
    const onFailure = () => {
      console.log('Failed to remove task');
      console.log('id: ' + id);
      console.log('task: ' + JSON.stringify(updatedTasks));
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

  // Fetch the user's profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      h="100vh"
      bg="gray.100"
      overflow="auto"
    >
      <NavigationBar />
      {isLoading && isLoadingTwo ? (
        <Flex justifyContent="center" alignItems="center" h="full">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <InputGroup size="lg" my={4} shadow="md">
            <InputLeftElement pointerEvents="none">
              <MdSearch size="24px" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for tasks..."
              value={searchTerm}
              onChange={handleSearch}
              borderRadius="full"
              focusBorderColor="brand.500"
              bg="white"
            />
          </InputGroup>

          {searchTerm && (
            <Tabs mt="4" variant="enclosed" isFitted colorScheme="blue">
              <TabList>
                <Tab>Tasks</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {filteredTasks.length > 0 ? (
                    <Grid
                      templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                      gap={6}
                    >
                      {filteredTasks.map(task => (
                        // eslint-disable-next-line react/jsx-key
                        <SearchResult
                          onStatusChange={handleStatusChange}
                          onRemove={handleRemoveTask}
                          onEdit={handleEditTask}
                          task={task}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Box
                      p="4"
                      color="gray.500"
                      borderRadius="md"
                      bg="white"
                      shadow="md"
                    >
                      No tasks found.
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </>
      )}
      <TaskModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={handleSubmitTask}
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
        isAdmin={isAdmin}
      />
    </Box>
  );
};

export default SearchEverything;
