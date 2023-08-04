import React from 'react';
import {
  Box,
  Center,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';
import AssignedTaskList from '../components/AssignedTaskList';
import NavigationBar from '../components/NavigationBar';

// A profile screen for a user, that only an admin can see (even if they are not a connection), includes tabs to profile and
// assigned task list.
const AdminProfile = () => {
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [workload, setWorkload] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);

  const { email } = useParams();

  const toast = useToast();

  const tabSelectedStyle = { bg: 'black', color: 'blue.50' };

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    const successGetConnectionProfile = (data) => {
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setWorkload(data.Data.workload);
      setTasks(data.Tasks);

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
      <AssignedTaskList title={`${name} - Assigned Task List`} tasks={tasks} />
    );
  };

  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Box p={2}>
          <Tabs variant='unstyled' colorScheme='black'>
            <TabList bg='gray.200' p='1' rounded='full'>
              <Tab _selected={tabSelectedStyle} rounded='full' fontWeight='bold' color='gray.800' pt='1' pb='1'>Profile</Tab>
              <Tab _selected={tabSelectedStyle} rounded='full' fontWeight='bold' color='gray.800' pt='1' pb='1'>Assigned Tasks</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {loaded ? connectionProfileLoaded() : (<Center><Spinner /></Center>)}
              </TabPanel>
              <TabPanel>
                {loaded ? connectionAssignedTaskListLoaded() : (<Center><Spinner /></Center>)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminProfile;
