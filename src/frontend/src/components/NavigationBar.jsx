import { Box, Flex, Heading, Spacer, Text, Tooltip } from '@chakra-ui/react';
import { ChatIcon, SettingsIcon } from '@chakra-ui/icons'
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

const NavigationBar = () => {
  const hoverStyle = { color: 'blue.200' };

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
        <Text m='1' _hover={hoverStyle}>
          <RouteLink to="/">Logout</RouteLink>
        </Text>
      </Flex>
    </Box>
  );
}

export default NavigationBar;
