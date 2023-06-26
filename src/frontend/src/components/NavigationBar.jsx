import { Box, Flex, Heading, Spacer, Link } from '@chakra-ui/react';
import { ChatIcon, SettingsIcon } from '@chakra-ui/icons'
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Box bg='black' color='blue.50'>
      <Flex alignItems='center'>
        <RouteLink to="/dashboard"><Heading>TaskMaster</Heading></RouteLink>
        <Spacer />
        <RouteLink to="/connections"><ChatIcon m='1' /></RouteLink>
        <RouteLink to="/profile"><SettingsIcon m='1' /></RouteLink>
        <Link m='1'><RouteLink to="/">Logout</RouteLink></Link>
      </Flex>
    </Box>
  );
}

export default NavigationBar;
