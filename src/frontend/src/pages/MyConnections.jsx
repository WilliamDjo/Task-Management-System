import {
  Box,
  Center,
  Heading,
  Link,
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
import React from 'react';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import { Link as RouteLink } from 'react-router-dom';

const MyConnections = () => {
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
    fetchBackend('/user/connections', 'GET', { token }, toast, successGetConnections);
  }, [])

  const myConnectionsLoaded = () => {
    return (
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Full Name</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {connections.map((connection, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link as={RouteLink} to={`/connections/my/${connection.email}`}>{connection.username}</Link>
                  </Td>
                  <Td>
                    <Link as={RouteLink} to={`/connections/my/${connection.email}`}>{connection.name}</Link>
                  </Td>
                  <Td>
                    <Link as={RouteLink} to={`/connections/my/${connection.email}`}>{connection.email}</Link>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
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
