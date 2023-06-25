import React from 'react';
import { AspectRatio, Box, Button, Card, CardBody, Divider, FormControl, FormLabel, HStack, Heading, Image, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react';
import logo from '../logo.svg'

import ProfileBar from '../components/ProfileBar';

const EditAccount = () => {
  const [show, setShow] = React.useState(false);

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
                  <Input placeholder='Name'></Input>
                </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Email:</FormLabel>
                  <Input placeholder='email@example.com' type='email'></Input>
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Confirm Email:</FormLabel>
                  <Input type='email'></Input>
                  </FormControl>
              </Box>
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>
                Submit
              </Button>
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
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>
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
              <Button loadingText="Submitting" bg={'blue.400'} color={'white'} _hover={{ bg: 'blue.500' }}>
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
