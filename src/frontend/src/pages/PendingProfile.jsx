/* eslint-disable multiline-ternary */
import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import ConnectionsBar from '../components/ConnectionsBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';

const PendingProfile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [loaded, setLoaded] = React.useState(false);

  const { email } = useParams();
  const navigate = useNavigate();

  const toast = useToast();

  React.useEffect(() => {
    const successGetConnectionProfile = data => {
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setLoaded(true);
    };
    const token = localStorage.getItem('token');

    fetchBackend(
      `/user/getconnection/${email}`,
      'GET',
      { token },
      toast,
      successGetConnectionProfile
    );
  }, []);

  const handleRespondConnection = (email, accepted) => {
    const successRespondConnection = () => {
      toast({
        title: `Connection successfully ${accepted ? 'accepted' : 'declined'}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      if (accepted === true) {
        navigate(`/connections/my/${email}`);
      } else {
        navigate('/connections/pending');
      }
    };
    const token = localStorage.getItem('token');
    const body = {
      token,
      accepted,
    };
    fetchBackend(
      `/user/respondconnection/${email}`,
      'POST',
      body,
      toast,
      successRespondConnection
    );
  };

  const pendingProfileLoaded = () => {
    return (
      <ProfileCard name={name} username={username} email={email}>
        <ButtonGroup isAttached>
          <Button
            colorScheme="green"
            onClick={() => handleRespondConnection(email, true)}
          >
            Accept
          </Button>
          <Button
            colorScheme="red"
            onClick={() => handleRespondConnection(email, false)}
          >
            Decline
          </Button>
        </ButtonGroup>
      </ProfileCard>
    );
  };

  return (
    <ConnectionsBar pendingConnections>
      <Box>
        {loaded ? (
          pendingProfileLoaded()
        ) : (
          <Center>
            <Spinner />
          </Center>
        )}
      </Box>
    </ConnectionsBar>
  );
};

export default PendingProfile;
