/* eslint-disable react/prop-types */

import React from 'react';
import { Box } from '@chakra-ui/react';
import TaskCard from './TaskCard';

const TaskColumn = ({ task, onRemove, onEdit, onStatusChange }) => {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
      w="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <TaskCard
        task={task}
        onRemove={onRemove}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
      />
    </Box>
  );
};

export default TaskColumn;
