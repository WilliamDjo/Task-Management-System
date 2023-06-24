import React from 'react';
import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileBar = (props) => {
  const navigate = useNavigate();
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <Box bg='black' color='blue.50'>
          <Heading>Navigation Bar</Heading>
          </Box>
        <Flex flex={1}>
          <Box flex={1} bg='blue.50' color='black' padding='2' fontSize='xl' fontWeight='bold'>
            <Box bg={ props.pendingTasks ? 'blue.200' : '' } padding='1' paddingLeft='3' borderRadius='full'><Text><Link>Pending Tasks</Link></Text></Box>
            <Box bg={ props.myProfile ? 'blue.200' : '' } padding='1' paddingLeft='3' borderRadius='full'><Text><Link onClick={() => navigate('/profile')}>My Profile</Link></Text></Box>
            <Box bg={ props.updateProfile ? 'blue.200' : '' } padding='1' paddingLeft='3' borderRadius='full'><Text><Link onClick={() => navigate('/profile/edit')}>Update Profile</Link></Text></Box>
            <Box bg={ props.connections ? 'blue.200' : '' } padding='1' paddingLeft='3' borderRadius='full'><Text><Link>Connections</Link></Text></Box>
          </Box>
          <Box flex={4} padding='2'>
            {props.children}
          </Box>
        </Flex>
      </Flex>
    </Box>
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
