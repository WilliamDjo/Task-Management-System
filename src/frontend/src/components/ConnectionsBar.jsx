import {
  Box,
  Flex,
  Link,
  Show,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import NavigationBar from './NavigationBar';

const ConnectionsBar = (props) => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Show above='sm'>
          <Flex flex={1}>
            <Box flex={3} bg='blue.50' color='black' padding='2' fontSize='xl' fontWeight='bold'>
              <Box bg={ props.myConnections ? 'blue.200' : '' } padding='1' paddingLeft='3' rounded='full'>
                <Text>
                  <Link as={RouteLink} to="/connections/my">My Connections</Link>
                </Text>
              </Box>
              <Box bg={ props.addConnections ? 'blue.200' : '' } padding='1' paddingLeft='3' rounded='full'>
                <Text>
                  <Link as={RouteLink} to="/connections/add">Add Connections</Link>
                </Text>
              </Box>
              <Box bg={ props.pendingConnections ? 'blue.200' : '' } padding='1' paddingLeft='3' rounded='full'>
                <Text>
                  <Link as={RouteLink} to="/connections/pending">Pending Connections</Link>
                </Text>
              </Box>
            </Box>
            <Box flex={9} padding='2'>
              {props.children}
            </Box>
          </Flex>
        </Show>
        <Show below='sm'>
          <Box padding='2'>
            {props.children}
          </Box>
        </Show>
      </Flex>
    </Box>
  );
}

ConnectionsBar.propTypes = {
  children: PropTypes.element,
  myConnections: PropTypes.bool,
  addConnections: PropTypes.bool,
  pendingConnections: PropTypes.bool,
}

export default ConnectionsBar;
