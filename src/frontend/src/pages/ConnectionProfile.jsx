import React from 'react';
import {
  Box,
  Center,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';
import ConnectionChat from './ConnectionChat';
import AssignedTaskList from '../components/AssignedTaskList';

// The profile screen for a connection, has tabs to their profile, chat with them and their assigned task list.
const ConnectionProfile = () => {
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
      console.log(data.Tasks);

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
              <ConnectionChat email={email} name={name}/>
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
