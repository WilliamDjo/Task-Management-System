import React from 'react';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileBar = (props) => {
  const navigate = useNavigate();
  return (
    <Flex height='100vh' flexFlow='column'>
      <Box bg='gold'><Heading>Navigation Bar</Heading></Box>
      <Flex height='100%'>
        <Box flex={1} bg='cornflowerblue' color='white' padding='10px' fontSize='xl' fontWeight='bold'>
          <Box bg={ props.pendingTasks ? 'black' : '' } padding='10px'><Text><Link>Pending Tasks</Link></Text></Box>
          <Box bg={ props.myProfile ? 'black' : '' } padding='10px'><Text><Link onClick={() => navigate('/profile')}>My Profile</Link></Text></Box>
          <Box bg={ props.updateProfile ? 'black' : '' } padding='10px'><Text><Link onClick={() => navigate('/profile/edit')}>Update Profile</Link></Text></Box>
          <Box bg={ props.connections ? 'black' : '' } padding='10px'><Text><Link>Connections</Link></Text></Box>
        </Box>
        <Box flex={4} padding='10px'>{props.children}</Box>
      </Flex>
    </Flex>
  )
}

ProfileBar.propTypes = {
  children: PropTypes.element,
  pendingTasks: PropTypes.bool,
  myProfile: PropTypes.bool,
  updateProfile: PropTypes.bool,
  connections: PropTypes.bool
}

export default ProfileBar;
