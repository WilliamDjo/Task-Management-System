/* eslint-disable indent */
/* eslint-disable multiline-ternary */
import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  //   Text,
  //   Menu,
  //   MenuButton,
  //   MenuList,
  //   MenuItem,
  //   MenuGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

const SearchEverything = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Replace this with your actual data for tasks and connections
  const tasks = [];
  const connections = [];

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  // Filter tasks and connections based on the search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box minH="100vh" h="100vh">
      <Flex h="100%" flexFlow="column">
        <NavigationBar />
        <Box>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon name="search" color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for tasks and connections..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

          <Tabs mt={4} isFitted variant="enclosed">
            <TabList>
              <Tab>Tasks</Tab>
              <Tab>Connections</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <Box
                      key={task.id}
                      p={2}
                      border="1px solid #ccc"
                      borderRadius="md"
                    >
                      {task.title}
                    </Box>
                  ))
                ) : (
                  <Box p={2} color="gray.500">
                    No tasks found.
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                {filteredConnections.length > 0 ? (
                  filteredConnections.map(connection => (
                    <Box
                      key={connection.id}
                      p={2}
                      border="1px solid #ccc"
                      borderRadius="md"
                    >
                      {connection.name}
                    </Box>
                  ))
                ) : (
                  <Box p={2} color="gray.500">
                    No connections found.
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default SearchEverything;
