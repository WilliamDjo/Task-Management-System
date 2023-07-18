import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavigationBar from '../components/NavigationBar';

const OptionsScreen = (props) => {
  return (
    <Box minH='100vh' h='100vh'>
      <Flex h='100%' flexFlow='column'>
        <NavigationBar />
        <Box padding='2'>
          <Heading>{props.heading}</Heading>
          <Flex flex={1} bg='white' justifyContent='center'>
            <Box color='black' padding='2' fontSize='xl' fontWeight='bold' width='xl'>
              {props.tabs.map((tab, index) => {
                return (
                  <Center bg='blue.50' padding='1' rounded='full' m='3' key={index}>
                    <Link as={RouteLink} to={tab.link}>{tab.screenName}</Link>
                  </Center>
                );
              })}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

OptionsScreen.propTypes = {
  heading: PropTypes.string,
  // tabs = [
  //   {
  //     screenName: PropTypes.string,
  //     link: PropTypes.string,
  //   },
  //   ...
  // ]
  tabs: PropTypes.array
}

export default OptionsScreen;
