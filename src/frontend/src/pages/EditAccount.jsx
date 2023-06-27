import React from 'react';
import { AspectRatio, Box, Button, Card, CardBody, Divider, FormControl, FormLabel, HStack, Heading, Image, Input, Stack, useToast } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';
import PasswordBar from '../components/PasswordBar/PasswordBar';

const EditAccount = () => {
  const [email, setEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');

  const toast = useToast();

  const handleSubmitName = () => {
    toast({
      title: 'Name successfully changed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }

  const handleSubmitEmail = () => {
    if (email === confirmEmail) {
      toast({
        title: 'Email successfully changed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Email must match confirm email to change.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleSubmitPassword = () => {
    toast({
      title: 'Password successfully changed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }

  const handleSubmitImage = () => {
    toast({
      title: 'Profile image successfully changed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <ProfileBar updateProfile>
      <Box>
        <Heading>Update Profile</Heading>
        <Card>
          <CardBody>
            <Stack spacing='4'>
              <Box>
                <FormControl>
                  <FormLabel>Name:</FormLabel>
                  <Input placeholder='Name' />
                </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={handleSubmitName}>
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Email:</FormLabel>
                  <Input placeholder='email@example.com' type='email' value={email} onChange={(event) => setEmail(event.target.value)}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Confirm Email:</FormLabel>
                  <Input type='email' value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)}/>
                  </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={handleSubmitEmail}>
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Current Password: </FormLabel>
                  <PasswordBar />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>New Password: </FormLabel>
                  <PasswordBar />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Confirm Password: </FormLabel>
                  <PasswordBar />
                </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={handleSubmitPassword}>
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Update Profile Image:</FormLabel>
                  <HStack height='100px'>
                    <FormLabel>
                    <Box>
                      <AspectRatio ratio={1} minW='100px'>
                        <Image src={logo} borderRadius='full'></Image>
                      </AspectRatio>
                    </Box>
                    </FormLabel>
                    <Divider orientation='vertical' margin='1' />
                    <Input type='file' height='100px' accept='.png,.jpeg,.jpg'/>
                  </HStack>
                </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }} onClick={handleSubmitImage}>
                Submit
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </ProfileBar>
  );
}

export default EditAccount;
