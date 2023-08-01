import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Progress,
  Stack,
  Text
} from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';

import { isNone } from '../fetch';

const ProfileCard = (props) => {
  const workloadColor = (number) => {
    if (number < 50) {
      return 'green';
    } else if (number < 75) {
      return 'yellow';
    } else if (number < 100) {
      return 'orange';
    } else {
      return 'red';
    }
  }
  return (
    <Card>
      <CardBody>
        <Stack spacing='4'>
          <Heading textTransform='uppercase' fontSize='lg'>{props.name}</Heading>
          <Divider />
            <Box padding="10px">
              <Text>User Name: {props.username}</Text>
              <Text>Email: {props.email}</Text>
              {!isNone(props.info) && props.info.map((element, index) => {
                return (
                  <Text key={index}>{element.title}: {element.attribute}</Text>
                );
              })}
              {
                !isNone(props.workload) &&
                (
                  <>
                    <Flex>
                      <Text>Workload:&nbsp;</Text>
                      <Text fontWeight={props.workload > 100 ? 'bold' : 'normal'} color={props.workload > 100 && 'red'}>{props.workload}%</Text>
                    </Flex>
                    <Progress value={props.workload} colorScheme={workloadColor(props.workload)}></Progress>
                  </>
                )
              }
              {props.children}
            </Box>
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
  email: PropTypes.string,
  workload: PropTypes.number,
}

export default ProfileCard;
