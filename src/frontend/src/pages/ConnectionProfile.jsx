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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
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

  const tabSelectedStyle = { bg: 'black', color: 'blue.50' };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const successGetChat = (data) => {
      const chats = data.Data.map((chat) => {
        chat.clicked = false;
        return chat;
      })
      setMessages(chats);
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

    // const id = setInterval(() => {
    //   fetchBackend(
    //     `/chat/${email}`,
    //     'GET',
    //     { token },
    //     toast,
    //     successGetChat
    //   )
    // }, 30000);

    // return () => clearInterval(id);
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

  const sendMessage = () => {
    const successSendMessage = (data) => {
      const newMessages = [...messages];
      newMessages.unshift({
        message: chatInput,
        timestamp: data.Timestamp,
        sender: true,
        clicked: false
      });
      setMessages(newMessages);
      setChatInput('');
    }

    if (chatInput === '') {
      toast({
        title: 'Message must have content',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const token = localStorage.getItem('token');
    const body = {
      token,
      message: chatInput
    }
    fetchBackend(
      `/chat/${email}`,
      'POST',
      body,
      toast,
      successSendMessage,
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
              <Input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    sendMessage();
                    event.target.blur();
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  isRound={true}
                  bg='blue.400'
                  color='white'
                  _hover={{ bg: 'blue.500' }}
                  size='sm'
                  icon={<EmailIcon />}
                  onClick={sendMessage}
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
              {loaded ? chatCardLoaded() : (<Center><Spinner /></Center>)}
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
