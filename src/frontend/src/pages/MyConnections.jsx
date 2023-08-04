import {
  Box,
  Card,
  CardBody,
  Center,
  Flex,
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

// The my connections screen shows each of the user's connections (with their name, email and workload) and contains links to each
// user's ConnectionProfile screen.
const MyConnections = () => {
  const [connections, setConnections] = React.useState([]);
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
                  <Flex>
                    <Text>Workload:&nbsp;</Text>
                    <Text fontWeight={connection.workload > 100 ? 'bold' : 'normal'} color={connection.workload > 100 && 'red'}>{connection.workload}%</Text>
                  </Flex>
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
