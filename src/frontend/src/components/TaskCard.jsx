/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Text,
  Tag,
  IconButton,
  Select,
  Grid,
  GridItem,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const TaskCard = props => {
  const { task, onRemove, onEdit, onStatusChange } = props;
  const [actualTimeSpent, setActualTimeSpent] = useState(task.actual_time_hr);

  const handleRemove = () => {
    onRemove(task.id);
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  const handleStatusChange = e => {
    const status = e.target.value;
    // if (status === 'Done') {
    //   setActualTimeSpent(''); // Reset actualTimeSpent when status is set to 'Done'
    // }
    onStatusChange(task.id, status);
  };

  const handleActualTimeChange = e => {
    // const actualTime = e.target.value;
    // setActualTimeSpent(actualTime);
    const timeSpent = parseFloat(e.target.value);
    if (!isNaN(timeSpent) && task.progress === 'Done') {
      setActualTimeSpent(prevState => ({
        ...prevState,
        [task.id]: timeSpent,
      }));
    }
  };

  // Function to get the priority label and color based on the priority value
  const getPriorityLabelAndColor = priority => {
    switch (priority) {
      case 1:
        return { label: 'Low', color: 'green' };
      case 2:
        return { label: 'Moderate', color: 'orange' };
      case 3:
        return { label: 'High', color: 'red' };
      default:
        return { label: '', color: 'gray' };
    }
  };

  // Get the priority label and color based on the task's priority
  const { label: priorityLabel, color: priorityColor } =
    getPriorityLabelAndColor(task.priority);

  return (
    <Box
      key={task.id}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
      w="100%"
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {task.title}
      </Text>
      <Text fontSize="md" color="gray.500" mb={2}>
        {task.description}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={2}>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Assigned By:
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.task_master}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Assigned To:
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.assignee}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Deadline:
            {/* {console.log('deadline: ' + task.deadline)} */}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {/* {task.deadline} */}
            {new Date(task.deadline).toISOString().split('T')[0]}
          </Text>
        </GridItem>
      </Grid>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Tags:
        </Text>
        <Flex>
          {task.labels.map(tag => (
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
          value={task.progress}
          onChange={handleStatusChange}
          size="sm"
          width="120px"
        >
          <option value="Not Started">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Done</option>
          <option value="Blocked">Blocked</option>
        </Select>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Priority:
          </Text>
          {/* Display the priority label with the appropriate color */}
          <Text fontSize="sm" color={priorityColor}>
            {priorityLabel}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Estimation (hrs):
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.estimation_spent_hrs}
          </Text>
        </GridItem>
      </Grid>
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="bold">
          Cost Per Hour:
        </Text>
        <Text fontSize="sm" color="gray.500">
          {task.cost_per_hr}
        </Text>
      </Box>

      {task.progress === 'Done' && (
        <Box mb={2}>
          <Text fontSize="sm" fontWeight="bold">
            Actual Time Spent (hrs):
          </Text>
          <InputGroup>
            <Input
              type="number"
              placeholder="Actual Time Spent"
              value={actualTimeSpent[task.id] || ''}
              onChange={handleActualTimeChange}
              min={0}
            />
            <InputRightAddon children="hrs" />
          </InputGroup>
        </Box>
      )}
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
