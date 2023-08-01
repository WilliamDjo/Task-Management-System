import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Hide,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';
import ConnectionChat from './ConnectionChat';

const ConnectionProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [workload, setWorkload] = React.useState(10);
  const [loaded, setLoaded] = React.useState(false);
  const [tasks, setTasks] = React.useState([
    {
      id: 100,
      title: 'Task',
      deadline: '2023-07-15 09:00:00 AM',
    },
  ]);

  const { email } = useParams();

  const toast = useToast();

  const tabSelectedStyle = { bg: 'black', color: 'blue.50' };

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    const successGetConnectionProfile = (data) => {
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setWorkload(data.Data.workload);

      const newTasks = [...tasks];

      for (const task of newTasks) {
        const deadline = task.deadline;
        const dateDeadline = new Date(deadline)
        const monthOptions = { month: 'short' };
        const month = dateDeadline.toLocaleDateString('en-US', monthOptions);

        const dateOptions = { day: 'numeric' };
        const date = dateDeadline.toLocaleDateString('en-US', dateOptions);

        const yearOptions = { year: 'numeric' };
        const year = dateDeadline.toLocaleDateString('en-US', yearOptions);

        task.deadline = `${date} ${month} ${year}`
      }

      setTasks(newTasks);
      setLoaded(true);
    };

    fetchBackend(
      `/user/getconnection/${email}`,
      'GET',
      { token },
      toast,
      successGetConnectionProfile
    );
  }, []);

  const connectionProfileLoaded = () => {
    return (
      <ProfileCard
        name={name}
        username={username}
        email={email}
        workload={workload}
      />
    );
  };

  const connectionAssignedTaskListLoaded = () => {
    return (
      <Card mt="4">
        <CardBody>
          <Heading fontSize="lg" textTransform="uppercase">
            Assigned Task List
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Hide below="sm">
                    <Th>ID</Th>
                  </Hide>
                  <Th>Title</Th>
                  <Th isNumeric>Deadline</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task, index) => {
                  return (
                    <Tr key={index}>
                      <Hide below="sm">
                        <Td>{task.id}</Td>
                      </Hide>
                      <Td>{task.title}</Td>
                      <Td isNumeric>{task.deadline}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    );
  };

  return (
    <ConnectionsBar myConnections>
      <Box>
        <Tabs variant='unstyled' colorScheme='black'>
          <TabList bg='gray.200' p='1' rounded='full'>
            <Tab _selected={tabSelectedStyle} rounded='full' fontWeight='bold' color='gray.800' pt='1' pb='1'>Profile</Tab>
            <Tab _selected={tabSelectedStyle} rounded='full' fontWeight='bold' color='gray.800' pt='1' pb='1'>Chat</Tab>
            <Tab _selected={tabSelectedStyle} rounded='full' fontWeight='bold' color='gray.800' pt='1' pb='1'>Assigned Tasks</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {loaded ? connectionProfileLoaded() : (<Center><Spinner /></Center>)}
            </TabPanel>
            <TabPanel>
              <ConnectionChat email={email} />
            </TabPanel>
            <TabPanel>
              {loaded ? connectionAssignedTaskListLoaded() : (<Center><Spinner /></Center>)}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ConnectionsBar>
  );
};

export default ConnectionProfile;
