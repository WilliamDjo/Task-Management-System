import React from 'react';
import ProfileBar from '../components/ProfileBar';
import {
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
  useToast
} from '@chakra-ui/react';
import { fetchBackend } from '../fetch';

const MyAssignedTasks = () => {
  const [loaded, setLoaded] = React.useState(false);
  const [tasks, setTasks] = React.useState([
    {
      id: 100,
      title: 'Hello',
      deadline: '2023-01-01'
    }
  ]);

  const toast = useToast();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const successGetTasks = (data) => {
      setTasks(data.Data);
      setLoaded(true);
    }

    const successGetProfile = (data) => {
      const email = data.Data.email;

      fetchBackend(`/task/getAllAssignedTo/${email}`, 'GET', { token }, toast, successGetTasks);
    }
    fetchBackend('/getuserprofile', 'POST', { token }, toast, successGetProfile);
  }, [])

  const myAssignedTaskListLoaded = () => {
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
    <ProfileBar pendingTasks>
      {loaded ? myAssignedTaskListLoaded() : <Center><Spinner /></Center>}
    </ProfileBar>
  );
}

export default MyAssignedTasks;
