import React from 'react';
import {
  Box,
  Center,
  Spinner,
  useToast
} from '@chakra-ui/react';

import { useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';

const ConnectionProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [organisation, setOrganisation] = React.useState('Example Company');
  const [loaded, setLoaded] = React.useState(true);

  const { email } = useParams();

  const toast = useToast();

  const info = [
    {
      title: 'Organisation',
      attribute: organisation
    }
  ]

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
      <ProfileCard
        name={name}
        username={username}
        email={email}
        info={info}
      />
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
