import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Hide,
  Link,
  Show,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import NavigationBar from './NavigationBar';

// The sidebar component, is appears on the left of the screen with links to the desired screens, and highlights the current screen.
// Additionally, for mobile sizes, it becomes a link to previous OptionsScreen of the current page and hides the sidebar.
const SideBar = (props) => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Hide below='md'>
          <Flex flex={1}>
            <Box flex={3} bg='blue.50' color='black' padding='2' fontSize='xl' fontWeight='bold'>
              {props.tabs.map((tab, index) => {
                return (
                  <Box bg={ tab.active ? 'blue.200' : '' } padding='1' paddingLeft='3' rounded='full' key={index}>
                    <Text>
                      <Link as={RouteLink} to={tab.link}>{tab.screenName}</Link>
                    </Text>
                  </Box>
                );
              })}
            </Box>
            <Box flex={9} padding='2'>
              {props.children}
            </Box>
          </Flex>
        </Hide>
        <Show below='md'>
          <Box padding='2'>
            <Link as={RouteLink} to={props.back.link}>
              <Flex align='center'>
                <ArrowBackIcon/>
                Back to {props.back.screenName}
              </Flex>
            </Link>
            {props.children}
          </Box>
        </Show>
      </Flex>
    </Box>
  );
}

SideBar.propTypes = {
  children: PropTypes.element,
  // back = {
  //   screenName: PropTypes.string,
  //   link: PropTypes.string
  // }
  back: PropTypes.object,
  // tabs = [
  //   {
  //     screenName: PropTypes.string,
  //     link: PropTypes.string,
  //     active: PropTypes.bool,
  //   },
  //   ...
  // ]
  tabs: PropTypes.array
}

export default SideBar;
