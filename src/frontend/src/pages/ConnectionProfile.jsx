import React from 'react';
import { AspectRatio, Box, Card, CardBody, CardHeader, Center, Flex, Heading, Image, Spinner, Text, useToast } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import logo from '../logo.svg';

const ConnectionProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [organisation, setOrganisation] = React.useState('Example Company');
  const [loaded, setLoaded] = React.useState(true);

  const { email } = useParams();

  const toast = useToast();

  React.useEffect(() => {
    const successGetConnectionProfile = (data) => {
      setName(data.Data.name);
      setUsername(data.Data.username);
      setOrganisation(data.Data.organisation);
      setLoaded(true);
    }
    const token = localStorage.getItem('token');
    fetchBackend(`/user/getconnection/${email}/true`, 'GET', { token }, toast, successGetConnectionProfile);
  }, [])

  const connectionProfileLoaded = () => {
    return (
      <Card>
        <CardHeader>
          <Heading fontSize="lg">{name}</Heading>
        </CardHeader>
        <CardBody>
          <Flex>
            <Box>
              <AspectRatio ratio={1} minW="150px">
                <Image src={logo} borderRadius="full"></Image>
              </AspectRatio>
            </Box>
            <Box padding="10px">
              <Text>User Name: {username}</Text>
              <Text>Email: {email}</Text>
              <Text>Organisation: {organisation}</Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <ConnectionsBar myConnections>
      <Box>
        {loaded ? connectionProfileLoaded() : <Center><Spinner /></Center>}
      </Box>
    </ConnectionsBar>
  );
}

export default ConnectionProfile;
