import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

import { fetchBackend, isNone } from '../fetch';

const ConnectionChat = (props) => {
  const email = props.email;
  const toast = useToast();

  const [loaded, setLoaded] = React.useState(false);
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

  React.useEffect(() => {
    const successGetChat = (data) => {
      const chats = data.Data.map((chat) => {
        chat.clicked = false;
        return chat;
      })
      setMessages(chats);
      setLoaded(true);
    }

    const failGetChat = (data) => {
      if (!isNone(data)) {
        if (data.Message === 'No chat exists between these users') {
          setMessages([]);
          setLoaded(true);
        }
      }
    }

    const token = localStorage.getItem('token');

    fetchBackend(`/chat/${email}`, 'GET', { token }, toast, successGetChat, failGetChat);

    const id = setInterval(() => {
      fetchBackend(
        `/chat/${email}`,
        'GET',
        { token },
        toast,
        successGetChat,
        failGetChat
      )
    }, 30000);

    return () => clearInterval(id);
  }, []);

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
    <>
      {loaded ? chatCardLoaded() : (<Center><Spinner /></Center>)}
    </>
  );
};

ConnectionChat.propTypes = {
  email: PropTypes.bool
}

export default ConnectionChat;
