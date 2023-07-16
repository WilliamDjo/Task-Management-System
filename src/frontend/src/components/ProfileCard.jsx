import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';

import logo from '../logo.svg'
import { isNone } from '../fetch';

const ProfileCard = (props) => {
  return (
    <Card>
      <CardBody>
        <Stack spacing='4'>
          <Heading textTransform='uppercase' fontSize='lg'>{props.name}</Heading>
          <Divider />
          <Flex>
            <Box>
              <AspectRatio ratio={1} minW="150px">
                <Image src={logo} borderRadius="full"></Image>
              </AspectRatio>
            </Box>
            <Box padding="10px">
              <Text>User Name: {props.username}</Text>
              <Text>Email: {props.email}</Text>
              {!isNone(props.info) && props.info.map((element, index) => {
                return (
                  <Text key={index}>{element.title}: {element.attribute}</Text>
                );
              })}
              {props.children}
            </Box>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}

ProfileCard.propTypes = {
  children: PropTypes.element,
  // info = [
  //   {
  //     title: PropTypes.string,
  //     attribute: PropTypes.string | PropTypes.number
  //   }, ...
  // ]
  info: PropTypes.array,
  name: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string
}

export default ProfileCard;
