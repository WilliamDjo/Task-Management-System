import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react';
import React from 'react';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import { Link as RouteLink } from 'react-router-dom';

const MyConnections = () => {
  const [connections, setConnections] = React.useState([
    {
      username: 'Jonathan',
      first_name: 'Jonathan Sinani',
      last_name: 'Sinani',
      email: 'jonathan@jonathan.com'
    },
    {
      username: 'Jonathan2',
      first_name: 'Jonathan2 Sinani',
      last_name: 'Sinani',
      email: 'jonathan2@jonathan.com'
    }
  ]);
  const [loaded, setLoaded] = React.useState(false);

  const toast = useToast();

  React.useEffect(() => {
    const successGetConnections = (data) => {
      setConnections(data.Data);
      setLoaded(true);
    }
    const token = localStorage.getItem('token');
    fetchBackend('/user/connections', 'POST', { token }, toast, successGetConnections);
  }, [])

  const myConnectionsLoaded = () => {
    return (
      <SimpleGrid spacing='4' columns={[1, 2]}>
        {connections.map((connection, index) => {
          return (
            <LinkBox key={index}>
              <Card>
                <CardBody>
                  <Heading fontSize="lg">
                    <LinkOverlay as={RouteLink} to={`/connections/my/${connection.email}`}>
                    {connection.first_name} {connection.last_name}
                    </LinkOverlay>
                  </Heading>
                  <Text>{connection.username}</Text>
                  <Text>{connection.email}</Text>
                </CardBody>
              </Card>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    );
  }

  return (
    <ConnectionsBar myConnections>
      <Box>
        <Heading>
          My Connections
        </Heading>
        {loaded ? myConnectionsLoaded() : <Center><Spinner /></Center>}
      </Box>
    </ConnectionsBar>
  );
}

export default MyConnections;
