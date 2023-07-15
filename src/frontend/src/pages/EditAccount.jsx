import React from 'react';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';

import logo from '../logo.svg';
import ProfileBar from '../components/ProfileBar';
import PasswordBar from '../components/PasswordBar/PasswordBar';
import { fetchBackend } from '../fetch';

const EditAccount = () => {
  const [email, setEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [emailNotifications, setEmailNotifications] = React.useState(false);

  const [emailLoading, setEmailLoading] = React.useState(false);
  const [usernameLoading, setUsernameLoading] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [emailNotificationsLoading, setEmailNotificationsLoading] = React.useState(true);

  const toast = useToast();

  React.useEffect(() => {
    const successGetEmailNotifications = (data) => {
      setEmailNotifications(data.Data.emailNotifications);
      setEmailNotificationsLoading(false);
    }
    const token = localStorage.getItem('token');
    fetchBackend('/getuserprofile', 'POST', { token }, toast, successGetEmailNotifications);
  }, []);

  const handleSubmitName = () => {
    const successUsername = () => {
      toast({
        title: 'Username successfully changed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setUsernameLoading(false);
    }

    setUsernameLoading(true);
    const token = localStorage.getItem('token');
    const body = {
      token,
      username
    }
    fetchBackend('/update/username', 'PUT', body, toast, successUsername);
  };

  const handleSubmitEmail = () => {
    const successEmail = (data) => {
      toast({
        title: 'Email successfully changed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem('token', data.Token);
      setEmailLoading(false);
    }

    if (email === confirmEmail) {
      const token = localStorage.getItem('token');
      const body = {
        token,
        email
      }
      setEmailLoading(true);
      fetchBackend('/update/email', 'PUT', body, toast, successEmail);
    } else {
      toast({
        title: 'Email must match confirm email to change.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmitPassword = () => {
    const successPassword = () => {
      toast({
        title: 'Password successfully changed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setPasswordLoading(false);
    }

    if (password === confirmPassword) {
      const token = localStorage.getItem('token');
      const body = {
        token,
        password
      }
      setPasswordLoading(true);
      fetchBackend('/update/password', 'PUT', body, toast, successPassword);
    } else {
      toast({
        title: 'Password must match confirm password to change.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEmailNotifications = (value) => {
    const successEmailNotifications = () => {
      setEmailNotifications(value);
      toast({
        title: value
          ? 'Email notifications turned on.'
          : 'Email notifications turned off.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmailNotificationsLoading(false);
    }

    setEmailNotificationsLoading(true);
    const token = localStorage.getItem('token');
    const body = {
      token,
      value
    }
    fetchBackend('/update/notifications', 'PUT', body, toast, successEmailNotifications);
  }

  const handleSubmitImage = () => {
    // Not yet fully implemented
    toast({
      title: 'Profile image successfully changed.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <ProfileBar updateProfile>
      <Box>
        <Heading>Update Profile</Heading>
        <Card>
          <CardBody>
            <Stack spacing="4">
              <Box>
                <FormControl>
                  <FormLabel>New User Name:</FormLabel>
                  <Input
                    placeholder="User Name"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSubmitName();
                        event.target.blur();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Button
                loadingText="Submitting"
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                onClick={handleSubmitName}
                isLoading={usernameLoading}
              >
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>New Email:</FormLabel>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSubmitEmail();
                        event.target.blur();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Confirm Email:</FormLabel>
                  <Input
                    type="email"
                    value={confirmEmail}
                    onChange={event => setConfirmEmail(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSubmitEmail();
                        event.target.blur();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Button
                loadingText="Submitting"
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                onClick={handleSubmitEmail}
                isLoading={emailLoading}
              >
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>New Password: </FormLabel>
                  <PasswordBar
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSubmitPassword();
                        event.target.blur();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl>
                  <FormLabel>Confirm Password: </FormLabel>
                  <PasswordBar
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleSubmitPassword();
                        event.target.blur();
                      }
                    }}
                  />
                </FormControl>
              </Box>
              <Button
                loadingText="Submitting"
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                onClick={handleSubmitPassword}
                isLoading={passwordLoading}
              >
                Submit
              </Button>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Email Notifications:</FormLabel>
                </FormControl>
                <ButtonGroup w='full' isAttached>
                  <Button
                  loadingText="Off"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  onClick={() => handleEmailNotifications(false)}
                  w='full'
                  isDisabled={!emailNotifications}
                  isLoading={emailNotificationsLoading}
                >
                  Off
                </Button>
                <Button
                  loadingText="On"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  onClick={() => handleEmailNotifications(true)}
                  w='full'
                  isDisabled={emailNotifications}
                  isLoading={emailNotificationsLoading}
                >
                  On
                </Button>
                </ButtonGroup>
              </Box>
              <Divider />
              <Box>
                <FormControl>
                  <FormLabel>Update Profile Image:</FormLabel>
                  <HStack height="100px">
                    <FormLabel>
                      <Box>
                        <AspectRatio ratio={1} minW="100px">
                          <Image src={logo} borderRadius="full"></Image>
                        </AspectRatio>
                      </Box>
                    </FormLabel>
                    <Divider orientation="vertical" margin="1" />
                    <Input
                      type="file"
                      height="100px"
                      accept=".png,.jpeg,.jpg"
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Button
                loadingText="Submitting"
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                onClick={handleSubmitImage}
              >
                Submit
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </ProfileBar>
  );
};

export default EditAccount;
