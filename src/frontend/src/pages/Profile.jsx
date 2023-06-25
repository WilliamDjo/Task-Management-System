import React from 'react';
import { AspectRatio, Box, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Heading, Image, Switch, Text, useToast } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';

const Profile = () => {
  const toast = useToast();

  const [emailNotifications, setEmailNotifications] = React.useState(true);

  const handleEmailNotifications = (value) => {
    setEmailNotifications(value);
    toast({
      title: value ? 'Email notifications turned on.' : 'Email notifications turned off.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <ProfileBar myProfile>
      <Box>
        <Heading>Profile</Heading>
        <Card>
          <CardHeader>
            <Heading fontSize='lg'>Name</Heading>
          </CardHeader>
          <CardBody>
            <Flex>
              <Box>
                <AspectRatio ratio={1} minW='150px'>
                  <Image src={logo} borderRadius='full'></Image>
                </AspectRatio>
              </Box>
              <Box padding='10px'>
                <Text>Email: email@example.com</Text>
                <Text>Password: **********</Text>
                <Text>Connections: ??</Text>
                <Text>Organisation: Example Company</Text>
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
