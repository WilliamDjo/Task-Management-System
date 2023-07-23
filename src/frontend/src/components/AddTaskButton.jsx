/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const AddTaskButton = props => {
  const { onOpen } = props;

  return (
    <Box
      bg="gray.100"
      p={4}
      borderRadius="md"
      boxShadow="md"
      cursor="pointer"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onOpen}
      transition="all 0.3s"
      _hover={{ transform: 'scale(1.05)', bg: 'gray.200' }}
    >
      <AddIcon />
    </Box>
  );
};

export default AddTaskButton;
