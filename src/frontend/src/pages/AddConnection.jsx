import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import React from 'react';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';

// Allows the user to request a connection based on user input of an email address.
const AddConnection = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();

  const handleRequestConnection = () => {
    const successRequestConnection = () => {
      toast({
        title: 'Request sent.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
      setLoading(false);
    }

    const failRequestConnection = () => {
      setLoading(false);
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const body = {
      token,
    }
    fetchBackend(`/user/addconnection/${email}/`, 'POST', body, toast, successRequestConnection, failRequestConnection);
  }
  return (
    <ConnectionsBar addConnections>
      <Box>
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
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleRequestConnection();
                    event.target.blur()
                  }
                }}
              />
            </FormControl>
          </Box>
          <Button
            loadingText="Submitting"
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            onClick={handleRequestConnection}
            isLoading={loading}
          >
            Send Request
          </Button>
        </Stack>
      </Box>
    </ConnectionsBar>
  );
}

export default AddConnection;
