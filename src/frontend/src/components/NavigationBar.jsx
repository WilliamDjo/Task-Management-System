import {
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';

import { fetchBackend, isNone } from '../fetch';
import {
  AccountCircleIcon,
  AdminPanelSettingsIcon,
  GroupIcon,
  SearchIcon,
  TaskIcon
} from './GoogleIcons';

// The top navigation bar of every logged in screen, includes links to Profile, Connections, SearchEverything screens, logout button,
// and if the user is an admin, then AdminDashboard and Dashboard screens.
const NavigationBar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const hoverStyle = { color: 'blue.200', cursor: 'pointer' };

  const handleLogout = () => {
    const successLogout = () => {
      toast({
        title: 'Successfully logged out!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      navigate('/');
    };

    const failLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      navigate('/');
    };
    const token = localStorage.getItem('token');
    fetchBackend(
      '/logout',
      'POST',
      { token },
      toast,
      successLogout,
      failLogout
    );
  };

  const isAdmin = () => {
    if (
      !isNone(localStorage.getItem('admin')) &&
      localStorage.getItem('admin') === 'true'
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box bg="black" color="blue.50">
      <Flex alignItems="center">
        <RouteLink to={isAdmin() ? '/admin' : '/dashboard'}>
          <Heading _hover={hoverStyle} size="md">
            TaskMaster
          </Heading>
        </RouteLink>
        <Spacer />
        {isAdmin() && (
          <RouteLink to="/dashboard">
            <Tooltip label="Task Controls">
              <TaskIcon m="1" _hover={hoverStyle} />
            </Tooltip>
          </RouteLink>
        )}
        {isAdmin() && (
          <RouteLink to="/admin">
            <Tooltip label="User Controls">
              <AdminPanelSettingsIcon m="1" _hover={hoverStyle} />
            </Tooltip>
          </RouteLink>
        )}
        <RouteLink to="/connections">
          <Tooltip label="Connections">
            <GroupIcon m="1" _hover={hoverStyle} />
          </Tooltip>
        </RouteLink>
        <RouteLink to="/profile">
          <Tooltip label="Profile">
            <AccountCircleIcon m="1" _hover={hoverStyle} />
          </Tooltip>
        </RouteLink>
        <RouteLink to="/searcheverything">
          <Tooltip label="Search">
            <SearchIcon m="1" _hover={hoverStyle} />
          </Tooltip>
        </RouteLink>
        <Text m="1" _hover={hoverStyle} onClick={handleLogout}>
          Logout
        </Text>
      </Flex>
    </Box>
  );
};

export default NavigationBar;
