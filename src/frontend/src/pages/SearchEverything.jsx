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
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import NavigationBar from '../components/NavigationBar';
import { fetchBackend } from '../fetch';
import SearchResult from '../components/SearchResults';

const SearchEverything = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minimizedTasks, setMinimizedTasks] = useState([]);
  // const [email, setEmail] = React.useState('email@example.com');
  // const [connections, setConnections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTwo, setIsLoadingTwo] = useState(true);
  const toast = useToast();

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
        // setEmail(data.Data.email);
        // setEmailNotifications(data.Data.emailNotifications);
        // setConnections(data.Data.connections);

        // setName(`${data.Data.first_name} ${data.Data.last_name}`);
        // setUsername(data.Data.username);
        // setOrganization(data.Data.organization);
        // setLoaded(true);
        // console.log(data);
        // fetchAllTasks(data.Data.email);
        // setIsLoadingThree(false);
        // fetchConnections(data.Data.email);
        fetchTasks(data.Data.email, data.Data.connections.connections);
        // console.log(JSON.stringify(data.Data));
        setIsLoading(false);
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

  const fetchTasks = (email, connections) => {
    try {
      // Retrieve the token from the localStorage
      const token = localStorage.getItem('token');
      const successGetTasks = data => {
        // setTasks(data.Data);
        // const newTasks = [...data.Data];
        // Creating a Set for easier lookup
        // console.log('con ' + connections);
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
        console.log(filteredTasks);
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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMinimizeTask = taskId => {
    setMinimizedTasks(prevMinimizedTasks =>
      prevMinimizedTasks.includes(taskId)
        ? prevMinimizedTasks.filter(id => id !== taskId)
        : [...prevMinimizedTasks, taskId]
    );
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
      {isLoading ? (
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
                        <SearchResult task={task} />
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
    </Box>
  );
};

export default SearchEverything;
