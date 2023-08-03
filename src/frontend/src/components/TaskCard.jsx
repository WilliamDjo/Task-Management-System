/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import {
  Box,
  Text,
  Tag,
  IconButton,
  Select,
  Grid,
  GridItem,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const TaskCard = props => {
  const { task, onRemove, onEdit, onStatusChange } = props;

  // New state to track the task to be deleted
  const [, setTaskToDelete] = useState(null);
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to handle opening the confirmation modal
  const handleDeleteConfirmation = taskId => {
    setTaskToDelete(taskId);
    onOpen();
  };

  // Function to handle task removal (with confirmation)
  const handleRemoveWithConfirmation = () => {
    handleRemove();
    onClose();
  };

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
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          {task.title}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          ID: {task.id}
        </Text>
      </Flex>
      <Text fontSize="md" color="gray.500" mb={2}>
        {task.description}
      </Text>

      <Text fontSize="sm" fontWeight="bold">
        Assigned By:
      </Text>
      <Text fontSize="sm" color="gray.500">
        {task.task_master}
      </Text>

      <Text fontSize="sm" fontWeight="bold">
        Assigned To:
      </Text>
      <Text fontSize="sm" color="gray.500">
        {task.assignee}
      </Text>

      <Text fontSize="sm" fontWeight="bold">
        Deadline:
      </Text>
      <Text fontSize="sm" color="gray.500">
        {new Date(task.deadline).toISOString().split('T')[0]}
      </Text>

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

      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Cost Per Hour:
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.cost_per_hr}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Actual Spent (hrs)
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.actual_time_hr}
          </Text>
        </GridItem>
      </Grid>

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
          onClick={handleDeleteConfirmation}
          aria-label="Remove Task"
          colorScheme="red"
          size="sm"
        />
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this task?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleRemoveWithConfirmation}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default TaskCard;
