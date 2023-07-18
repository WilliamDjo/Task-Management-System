/* eslint-disable multiline-ternary */
import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Hide,
  Spinner,
  Table,
  TableContainer,
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

const ConnectionProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [organization, setOrganization] = React.useState('Example Company');
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

  const info = [
    {
      title: 'Organization',
      attribute: organization,
    },
  ];

  React.useEffect(() => {
    const successGetConnectionProfile = data => {
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setOrganization(data.Data.organization);
      setTasks(data.Data.tasks);
      setLoaded(true);
    };
    const token = localStorage.getItem('token');

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
      <ProfileCard name={name} username={username} email={email} info={info} />
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
        {loaded ? (
          connectionProfileLoaded()
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
        {loaded && connectionAssignedTaskListLoaded()}
      </Box>
    </ConnectionsBar>
  );
};

export default ConnectionProfile;
