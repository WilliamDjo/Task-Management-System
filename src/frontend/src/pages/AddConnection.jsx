import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Show,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';

const AddConnection = () => {
  const [email, setEmail] = React.useState('');

  const toast = useToast();

  const handleRequestConnection = () => {
    const successRequestConnection = () => {
      toast({
        title: 'Request sent.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    const token = localStorage.getItem('token');
    const body = {
      token,
      email
    }
    fetchBackend('/user/addconnection', 'POST', body, toast, successRequestConnection);
  }
  return (
    <ConnectionsBar addConnections>
      <Box>
      <Show below='sm'>
        <Link as={RouteLink} to='/connections'>
          <Flex align='center'>
            <ArrowBackIcon/>
            Back to Connections
          </Flex>
        </Link>
      </Show>
        <Heading>
          Add Connection
        </Heading>
        <Stack spacing="4">
          <Box>
            <FormControl>
              <FormLabel>New Connection Email:</FormLabel>
              <Input
                placeholder="email@email.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </FormControl>
          </Box>
          <Button
            loadingText="Submitting"
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            onClick={handleRequestConnection}
          >
            Send Request
          </Button>
        </Stack>
      </Box>
    </ConnectionsBar>
  );
}

export default AddConnection;
