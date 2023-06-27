import { Box, Flex, Heading, Spacer, Text, Tooltip, useToast } from '@chakra-ui/react';
import { ChatIcon, SettingsIcon } from '@chakra-ui/icons'
import React from 'react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { fetchBackend } from '../fetch';

const NavigationBar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const hoverStyle = { color: 'blue.200' };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    fetchBackend('/logout', 'POST', { token })
      .then((data) => {
        if (data.error) {
          toast({
            title: data.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/')
        } else {
          toast({
            title: 'Successfully logged out!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          navigate('/');
        }
      })
  }

  return (
    <Box bg='black' color='blue.50'>
      <Flex alignItems='center'>
        <RouteLink to="/dashboard">
          <Heading _hover={hoverStyle} size='md'>TaskMaster</Heading>
        </RouteLink>
        <Spacer />
        <RouteLink to="/connections">
          <Tooltip label='Connections'>
            <ChatIcon m='1' _hover={hoverStyle} />
          </Tooltip>
        </RouteLink>
        <RouteLink to="/profile">
          <Tooltip label='Profile'>
            <SettingsIcon m='1' _hover={hoverStyle} />
          </Tooltip>
        </RouteLink>
        <Text m='1' _hover={hoverStyle} onClick={handleLogout}>
          Logout
        </Text>
      </Flex>
    </Box>
  );
}

export default NavigationBar;
