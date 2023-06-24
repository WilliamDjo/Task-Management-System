import React from 'react';
import { AspectRatio, Box, Button, Card, CardBody, Divider, Flex, Heading, Image, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';

const EditAccount = () => {
  const [show, setShow] = React.useState(false);

  return (
    <ProfileBar updateProfile>
      <Heading>Update Profile</Heading>
      <Card>
        <CardBody>
          <Stack spacing='4'>
            <Box>
              <Text>Name:</Text>
              <Input placeholder='Name'></Input>
            </Box>
            <Button>Submit</Button>
            <Divider />
            <Box>
              <Text>Email:</Text>
              <Input placeholder='email@example.com'></Input>
              <Text>Confirm Email:</Text>
              <Input placeholder='email@example.com'></Input>
            </Box>
            <Button>Submit</Button>
            <Divider />
            <Box>
            <Text>Current Password:</Text>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='**********'
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box>
              <Text>New Password:</Text>
              <Input type='password' placeholder='**********' />
              <Text>Confirm Password:</Text>
              <Input type='password' placeholder='**********' />
            </Box>
            <Button>Submit</Button>
            <Divider />
            <Box>
              <Text>Update Profile Image:</Text>
              <Flex height='100px'>
                <Box>
                  <AspectRatio ratio={1} minW='100px'>
                    <Image src={logo} borderRadius='full'></Image>
                  </AspectRatio>
                </Box>
                <Divider orientation='vertical' margin='10px' />
                <Input type='file' height='100px' />
              </Flex>
            </Box>
            <Button>Submit</Button>
          </Stack>
        </CardBody>
      </Card>
    </ProfileBar>
  );
}

export default EditAccount;
