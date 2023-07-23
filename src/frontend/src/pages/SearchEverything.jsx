/* eslint-disable multiline-ternary */
import React, { useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import NavigationBar from '../components/NavigationBar';

const SearchEverything = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minimizedTasks, setMinimizedTasks] = useState([]);
  const [minimizedConnections, setMinimizedConnections] = useState([]);

  // Dummy data for tasks and connections
  const tasks = [
    {
      id: 1,
      title: 'Create user authentication system',
      description: 'Implement user login and registration functionality.',
      tags: ['software engineering', 'authentication', 'backend'],
      deadline: '2023-08-15',
      progress: 25,
      assignee: 'John Doe',
      cost_per_hr: 30,
      estimation_spent_hrs: 12,
      actual_time_hr: 8,
      priority: 'High',
      task_master: 'Akshay',
    },
    {
      id: 2,
      title: 'Design landing page',
      description: 'Design a visually appealing landing page for the website.',
      tags: ['software engineering', 'design', 'frontend'],
      deadline: '2023-08-10',
      progress: 75,
      assignee: 'Jane Smith',
      cost_per_hr: 25,
      estimation_spent_hrs: 20,
      actual_time_hr: 18,
      priority: 'Medium',
      task_master: 'William',
    },
    {
      id: 3,
      title: 'Implement search functionality',
      description: 'Add search feature to the application.',
      tags: ['software engineering', 'search', 'frontend', 'backend'],
      deadline: '2023-08-20',
      progress: 50,
      assignee: 'Bob Johnson',
      cost_per_hr: 28,
      estimation_spent_hrs: 15,
      actual_time_hr: 10,
      priority: 'Medium',
      task_master: 'Cameron',
    },
    {
      id: 4,
      title: 'Fix bugs in user profile page',
      description: 'Resolve issues reported in the user profile section.',
      tags: ['software engineering', 'bugfix', 'frontend'],
      deadline: '2023-08-05',
      progress: 90,
      assignee: 'Alice Williams',
      cost_per_hr: 22,
      estimation_spent_hrs: 30,
      actual_time_hr: 28,
      priority: 'High',
      task_master: 'Jonathan',
    },
    {
      id: 5,
      title: 'Optimize database queries',
      description: 'Improve performance by optimizing database queries.',
      tags: ['software engineering', 'database', 'backend'],
      deadline: '2023-08-25',
      progress: 40,
      assignee: 'John Doe',
      cost_per_hr: 35,
      estimation_spent_hrs: 10,
      actual_time_hr: 8,
      priority: 'High',
      task_master: 'Sanyam',
    },
  ];

  const connections = [
    {
      id: 1,
      name: 'William Djong',
      email: 'william.doe@yahoo.com',
      organization: 'ACME Corporation',
    },
    {
      id: 2,
      name: 'Akshay Valluri',
      email: 'akshay.smith@example.com',
      organization: 'Tech Co',
    },
    {
      id: 3,
      name: 'Sanyam Jaine',
      email: 'sanyam.johnson@example.com',
      organization: 'Software Solutions',
    },
    {
      id: 4,
      name: 'Jonathan Sinani',
      email: 'jonatha.williams@example.com',
      organization: 'Web Services',
    },
    {
      id: 5,
      name: 'Cameron Pereira',
      email: 'cameron.brown@example.com',
      organization: 'Digital Innovations',
    },
  ];

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMinimizeTask = taskId => {
    setMinimizedTasks(prevMinimizedTasks =>
      prevMinimizedTasks.includes(taskId)
        ? prevMinimizedTasks.filter(id => id !== taskId)
        : [...prevMinimizedTasks, taskId]
    );
  };

  const handleMinimizeConnection = connectionId => {
    setMinimizedConnections(prevMinimizedConnections =>
      prevMinimizedConnections.includes(connectionId)
        ? prevMinimizedConnections.filter(id => id !== connectionId)
        : [...prevMinimizedConnections, connectionId]
    );
  };

  return (
    <Box minH="100vh" h="100vh">
      <NavigationBar />
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon name="search" color="gray.400" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search for tasks and connections..."
          value={searchTerm}
          onChange={handleSearch}
          focusBorderColor="brand.500"
        />
      </InputGroup>

      {searchTerm && (
        <Flex justifyContent="center">
          {' '}
          {/* Center the tabs */}
          <Tabs mt="4" variant="enclosed">
            <TabList>
              <Tab
                _selected={{ color: 'white', bg: 'gray.600' }}
                _focus={{ boxShadow: 'none' }}
              >
                Tasks
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'gray.600' }}
                _focus={{ boxShadow: 'none' }}
              >
                Connections
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <Box
                      key={task.id}
                      p="2"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <Text fontWeight="bold">
                          {!minimizedTasks.includes(task.id)
                            ? task.title
                            : task.title}
                        </Text>
                        <Button
                          variant="link"
                          onClick={() => handleMinimizeTask(task.id)}
                        >
                          {!minimizedTasks.includes(task.id) ? '▶' : '▼'}
                        </Button>
                      </Flex>
                      {minimizedTasks.includes(task.id) && (
                        <>
                          <Text color="gray.500" fontSize="sm">
                            Description: {task.description}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Tags: {task.tags.join(', ')}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Deadline: {task.deadline}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Progress: {task.progress}%
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Assignee: {task.assignee}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Cost per hour: ${task.cost_per_hr}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Estimation spent hours: {task.estimation_spent_hrs}{' '}
                            hrs
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Actual time spent: {task.actual_time_hr} hrs
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Priority: {task.priority}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Task Master: {task.task_master}
                          </Text>
                        </>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box p="2" color="gray.500">
                    No tasks found.
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                {filteredConnections.length > 0 ? (
                  filteredConnections.map(connection => (
                    <Box
                      key={connection.id}
                      p="2"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <Text fontWeight="bold">
                          {!minimizedConnections.includes(connection.id)
                            ? connection.name
                            : connection.name}
                        </Text>
                        <Button
                          variant="link"
                          onClick={() =>
                            handleMinimizeConnection(connection.id)
                          }
                        >
                          {!minimizedConnections.includes(connection.id)
                            ? '▶'
                            : '▼'}
                        </Button>
                      </Flex>
                      {minimizedConnections.includes(connection.id) && (
                        <>
                          <Text color="gray.500" fontSize="sm">
                            Email: {connection.email}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            Organization: {connection.organization}
                          </Text>
                        </>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box p="2" color="gray.500">
                    No connections found.
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      )}
    </Box>
  );
};

export default SearchEverything;
