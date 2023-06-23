import React from 'react';
import { Box, Card, CardBody, CardHeader, Checkbox, Flex, Heading, Image, Text } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';

const Profile = () => {
  return (
    <ProfileBar myProfile>
      <Heading>My Profile</Heading>
      <Card>
        <CardHeader>
          <Heading fontSize='lg'>Name</Heading>
        </CardHeader>
        <CardBody>
          <Flex>
            <Image src={logo} borderRadius='full' height='100px' width='100px'></Image>
          <Box padding='10px'>
            <Text>Email: email@example.com</Text>
            <Text>Password: **********</Text>
            <Text>Connections: ??</Text>
            <Text>Email notifications: <Checkbox isChecked></Checkbox></Text>
          </Box>
          </Flex>
        </CardBody>
      </Card>
    </ProfileBar>
  );
}

export default Profile;
