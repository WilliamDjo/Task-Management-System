import React from 'react';
import { AspectRatio, Box, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Heading, Image, Switch, Text, useToast } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';
import { fetchBackend } from '../fetch';

const Profile = () => {
  const [name, setName] = React.useState('Name');
  const [username, setUsername] = React.useState('username');
  const [email, setEmail] = React.useState('email@example.com');
  const [connections, setConnections] = React.useState(1);
  const [organisation, setOrganisation] = React.useState('Example Company');
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  const toast = useToast();

  const handleEmailNotifications = (value) => {
    const token = localStorage.getItem('token')
    fetchBackend('/update/notifications', 'PUT', { token, value })
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        } else {
          setEmailNotifications(value);
          toast({
            title: value ? 'Email notifications turned on.' : 'Email notifications turned off.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
        }
      })
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    fetchBackend('/getuserprofile', 'POST', { token })
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        } else {
          setEmail(data.email);
          setEmailNotifications(data.emailNotifications);
          setConnections(data.connections);
          setName(`${data.first_name} ${data.last_name}`);
          setUsername(data.username);
          setOrganisation(data.organisation);
        }
      })
  }, [])

  return (
    <ProfileBar myProfile>
      <Box>
        <Heading>Profile</Heading>
        <Card>
          <CardHeader>
            <Heading fontSize='lg'>{name}</Heading>
          </CardHeader>
          <CardBody>
            <Flex>
              <Box>
                <AspectRatio ratio={1} minW='150px'>
                  <Image src={logo} borderRadius='full'></Image>
                </AspectRatio>
              </Box>
              <Box padding='10px'>
                <Text>User Name: {username}</Text>
                <Text>Email: {email}</Text>
                <Text>Password: **********</Text>
                <Text>Connections: {connections}</Text>
                <Text>Organisation: {organisation}</Text>
                <FormControl display='flex' alignItems='center'>
                  <FormLabel htmlFor='email-alerts' mb='0' fontWeight='normal'>
                    Email Notifications:
                  </FormLabel>
                  <Switch id='email-alerts' defaultChecked={emailNotifications} value={emailNotifications} onChange={() => { handleEmailNotifications(!emailNotifications) }}/>
                </FormControl>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    </ProfileBar>
  );
}

export default Profile;
