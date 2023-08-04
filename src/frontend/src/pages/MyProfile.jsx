import React from 'react';
import {
  Box,
  Center,
  Heading,
  Spinner,
  useToast,
} from '@chakra-ui/react';

import ProfileBar from '../components/ProfileBar';
import { fetchBackend } from '../fetch';
import ProfileCard from '../components/ProfileCard';

// The user's profile, uses the ProfileCard component and shows the user's name, username, email, connections count, organization,
// whether email notifications are on/off, workload.
const MyProfile = () => {
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [connections, setConnections] = React.useState(0);
  const [organization, setOrganization] = React.useState('');
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [workload, setWorkload] = React.useState(0);

  const [loaded, setLoaded] = React.useState(false);

  const toast = useToast();

  const info = [
    {
      title: 'Password',
      attribute: '**********'
    }, {
      title: 'Connections',
      attribute: connections
    }, {
      title: 'Organization',
      attribute: organization
    }, {
      title: 'Email Notifications',
      attribute: emailNotifications ? 'On' : 'Off'
    }
  ]

  React.useEffect(() => {
    const successGetProfile = (data) => {
      setEmail(data.Data.email);
      setEmailNotifications(data.Data.emailNotifications);
      setConnections(data.Data.connections);
      setName(`${data.Data.first_name} ${data.Data.last_name}`);
      setUsername(data.Data.username);
      setOrganization(data.Data.organization);
      setWorkload(data.Data.workload);
      setLoaded(true);
    }
    const token = localStorage.getItem('token');
    fetchBackend('/getuserprofile', 'POST', { token }, toast, successGetProfile);
  }, []);

  const profileBarLoaded = () => {
    return (
      <ProfileCard
        name={name}
        username={username}
        email={email}
        info={info}
        workload={workload}
      />
    );
  }

  return (
    <ProfileBar myProfile>
      <Box>
        <Heading>My Profile</Heading>
        {loaded ? profileBarLoaded() : <Center><Spinner /></Center>}
      </Box>
    </ProfileBar>
  );
};

export default MyProfile;
