import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';

// When the user provides a url that does not correspond to any pages, this screen provides a link back to the Home screen.
const PageNotFound = () => {
  return (
    <Box minH='100vh' h='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
      <Center h='full' w='full'>
        <LinkBox as={Card}>
          <CardBody>
            <Stack align='center'>
              <Heading>
                <LinkOverlay as={RouteLink} to="/">Page Not Found</LinkOverlay>
              </Heading>
              <Heading fontSize="lg">
                <Link as={RouteLink} to="/">Return Home</Link>
              </Heading>
            </Stack>
          </CardBody>
        </LinkBox>
      </Center>
    </Box>
  );
}

export default PageNotFound;
