import React from 'react';
import ConnectionsBar from '../components/ConnectionsBar';
import { Box, Button, ButtonGroup, Card, CardBody, Center, Heading, LinkBox, LinkOverlay, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react';
import { fetchBackend } from '../fetch';
import { Link as RouteLink } from 'react-router-dom';

const PendingConnections = () => {
  const [connections, setConnections] = React.useState([
    {
      username: 'Jonathan',
      name: 'Jonathan Sinani',
      email: 'jonathan@jonathan.com'
    },
    {
      username: 'Jonathan2',
      name: 'Jonathan2 Sinani',
      email: 'jonathan2@jonathan.com'
    }
  ]);
  const [loaded, setLoaded] = React.useState(true);

  const toast = useToast();

  React.useEffect(() => {
    const successGetConnections = (data) => {
      setConnections(data.Data);
      setLoaded(true);
    }
    const token = localStorage.getItem('token');
    fetchBackend('/user/pendingconnections', 'GET', { token }, toast, successGetConnections);
  }, []);

  const handleRespondConnection = (email, value) => {
    const successRespondConnection = () => {
      const newConnections = [...connections];
      const filteredConnections = newConnections.filter((connection) => connection.email !== email);
      setConnections(filteredConnections);
      toast({
        title: `Connection successfully ${value ? 'accepted' : 'declined'}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
    const token = localStorage.getItem('token');
    const body = {
      token,
      email,
      value
    }
    fetchBackend('/user/respondconnection', 'POST', body, toast, successRespondConnection, successRespondConnection);
  }

  const pendingConnectionsLoaded = () => {
    return (
      <SimpleGrid spacing='4' columns={[1, 2]}>
        {connections.map((connection, index) => {
          return (
            <LinkBox key={index}>
              <Card>
                <CardBody>
                  <Heading fontSize="lg">
                    <LinkOverlay as={RouteLink} to={`/connections/pending/${connection.email}`}>
                    {connection.name}
                    </LinkOverlay>
                  </Heading>
                  <Text>{connection.username}</Text>
                  <Text>{connection.email}</Text>
                  <ButtonGroup isAttached>
                    <Button colorScheme='green' onClick={() => handleRespondConnection(connection.email, true)}>Accept</Button>
                    <Button colorScheme='red' onClick={() => handleRespondConnection(connection.email, false)}>Decline</Button>
                  </ButtonGroup>
                </CardBody>
              </Card>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    );
  }

  return (
    <ConnectionsBar pendingConnections>
      <Box>
        <Heading>
          Pending Connections
        </Heading>
        {loaded ? pendingConnectionsLoaded() : <Center><Spinner /></Center>}
      </Box>
    </ConnectionsBar>
  );
}

export default PendingConnections;
