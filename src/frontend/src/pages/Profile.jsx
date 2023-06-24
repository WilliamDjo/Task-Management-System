import React from 'react';
import { AspectRatio, Box, Card, CardBody, CardHeader, Checkbox, Flex, Heading, Image, Text } from '@chakra-ui/react';
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
              <Text>Email notifications: <Checkbox isChecked></Checkbox></Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </ProfileBar>
  );
}

export default Profile;
