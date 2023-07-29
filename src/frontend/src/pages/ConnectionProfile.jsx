import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Heading,
  Hide,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';
import { EmailIcon } from '@chakra-ui/icons';

const ConnectionProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [loaded, setLoaded] = React.useState(true);
  const [tasks, setTasks] = React.useState([
    {
      id: 100,
      title: 'Task',
      deadline: '2023-07-15 09:00:00 AM',
    },
  ]);

  const [messages, setMessages] = React.useState([
    {
      message: 'Hello there',
      timestamp: '2023-07-29 12:00:00PM',
      sender: true,
      clicked: false
    },
    {
      message: 'Hi!',
      timestamp: '2023-07-29 12:01:00PM',
      sender: false,
      clicked: false
    }
  ])
  const [chatInput, setChatInput] = React.useState('');

  const { email } = useParams();

  const toast = useToast();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const successGetChat = (data) => {
      setMessages(data.Data);
      setLoaded(true);
    }

    const successGetConnectionProfile = (data) => {
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setTasks(data.Tasks);

      fetchBackend(
        `/chat/${email}`,
        'GET',
        { token },
        toast,
        successGetChat
      )
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
      <ProfileCard name={name} username={username} email={email} />
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

  const messageClick = (index) => {
    const newMessages = [...messages];
    newMessages[index].clicked = !newMessages[index].clicked;
    setMessages(newMessages);
  }

  const sendMessage = (message) => {
    const successSendMessage = () => {

    }
    const token = localStorage.getItem('token');
    fetchBackend(
      `/chat/${email}`,
      'POST',
      { token },
      toast,
      successSendMessage
    );
  }

  const chatCardLoaded = () => {
    return (
      <Card mt="4">
        <CardBody>
          <Stack spacing='4'>
            <Heading fontSize="lg" textTransform="uppercase">
              Chat
            </Heading>
            <Divider />
            <InputGroup>
              <Input value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
              <InputRightElement>
                <IconButton
                  isRound={true}
                  bg='blue.400'
                  color='white'
                  _hover={{ bg: 'blue.500' }}
                  size='sm'
                  icon={<EmailIcon />}
                />
              </InputRightElement>
            </InputGroup>
            <Stack spacing='4'>
              {messages.map((message, index) => {
                return (
                  <Flex justify={message.sender ? 'right' : 'left'} key={index}>
                    <Stack>
                      <Box bg={message.sender ? 'blue.200' : 'gray.200'} p='4' rounded='full' minW='32' onClick={() => messageClick(index)}>
                        <Text>{message.message}</Text>
                      </Box>
                      {message.clicked && <Box rounded='full' bg='white'><Text fontSize='2xs'>{message.timestamp}</Text></Box>}
                    </Stack>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    )
  }

  return (
    <ConnectionsBar myConnections>
      <Box>
        {loaded ? connectionProfileLoaded() : (<Center><Spinner /></Center>)}
        {loaded && chatCardLoaded()}
        {loaded && connectionAssignedTaskListLoaded()}
      </Box>
    </ConnectionsBar>
  );
};

export default ConnectionProfile;
