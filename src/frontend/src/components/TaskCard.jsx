/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Flex, Text, Tag, IconButton, Select } from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const TaskCard = props => {
  const { task, onRemove, onEdit, onStatusChange } = props;

  const handleRemove = () => {
    onRemove(task.id);
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  const handleStatusChange = e => {
    const status = e.target.value;
    onStatusChange(task.id, status);
  };

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
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {task.title}
      </Text>
      <Text fontSize="md" color="gray.500" mb={2}>
        {task.description}
      </Text>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Assigned To:
        </Text>
        <Text fontSize="sm" color="gray.500">
          {task.assignedTo}
        </Text>
      </Box>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Deadline:
        </Text>
        <Text fontSize="sm" color="gray.500">
          {task.deadline}
        </Text>
      </Box>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Tags:
        </Text>
        <Flex>
          {task.tags.map(tag => (
            <Tag key={tag} colorScheme="teal" mr={1}>
              {tag}
            </Tag>
          ))}
        </Flex>
      </Box>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Status:
        </Text>
        <Select
          value={task.status}
          onChange={handleStatusChange}
          size="sm"
          width="120px"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
          <option value="Blocked">Blocked</option>{' '}
        </Select>
      </Box>
      <Flex align="center">
        <IconButton
          icon={<EditIcon />}
          onClick={handleEdit}
          aria-label="Edit Task"
          colorScheme="teal"
          size="sm"
          mr={2}
        />
        <IconButton
          icon={<CloseIcon />}
          onClick={handleRemove}
          aria-label="Remove Task"
          colorScheme="red"
          size="sm"
        />
      </Flex>
    </Box>
  );
};

export default TaskCard;
