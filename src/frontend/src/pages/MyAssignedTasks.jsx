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
import { fetchBackend, isNone } from '../fetch';

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
      const newTasks = [...data.Data];
      newTasks.sort((a, b) => {
        if ((isNone(a.deadline) || a.deadline === '') && (isNone(b.deadline) || b.deadline === '')) {
          return 0;
        } else if (isNone(a.deadline) || a.deadline === '') {
          return 1;
        } else if (isNone(b.deadline) || b.deadline === '') {
          return -1;
        }

        const aDate = new Date(a.deadline);
        const bDate = new Date(b.deadline);
        if (aDate < bDate) {
          return -1;
        } else if (aDate > bDate) {
          return 1;
        } else {
          return 0;
        }
      })

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
    }

    const failGetTasks = (data) => {
      if (!isNone(data)) {
        if (data.Message === 'No tasks given to by task assignee') {
          setTasks([]);
          setLoaded(true);
        }
      }
    }

    const successGetProfile = (data) => {
      const email = data.Data.email;

      fetchBackend(`/task/getAllAssignedTo/${email}`, 'GET', { token }, toast, successGetTasks, failGetTasks);
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
