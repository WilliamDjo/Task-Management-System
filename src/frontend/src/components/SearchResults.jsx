/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import {
  Box,
  Text,
  Grid,
  GridItem,
  Flex,
  Tag,
  Select,
  Button,
  //   Input,
  //   InputGroup,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';

const SearchResult = ({ task, onStatusChange, onEdit, onRemove }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskToDelete, setTaskToDelete] = useState(null);
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
  console.log(taskToDelete);
  // Function to handle opening the confirmation modal
  const handleDeleteConfirmation = taskId => {
    setTaskToDelete(taskId);
    onOpen();
  };

  // Function to handle task removal (with confirmation)
  const handleRemoveWithConfirmation = () => {
    // handleRemoveTask(taskToDelete);
    handleRemove();
    onClose();
  };

  const handleRemove = () => {
    onRemove(task.id);
  };

  const handleStatusChange = e => {
    const status = e.target.value;
    // if (status === 'Done') {
    //   setActualTimeSpent(''); // Reset actualTimeSpent when status is set to 'Done'
    // }
    onStatusChange(task.id, status);
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  // Get the priority label and color based on the task's priority
  const { label: priorityLabel, color: priorityColor } =
    getPriorityLabelAndColor(task.priority);
  return (
    // <Grid templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']} gap={6}>
    <GridItem
      key={task.id}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
      w="100%"
      // maxWidth="1000px"
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
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
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
      </Grid>
      <Text fontSize="sm" fontWeight="bold">
        Deadline:
        {console.log('dead ' + task.deadline)}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {new Date(task.deadline).toISOString().split('T')[0]}
      </Text>
      <Text fontSize="sm" fontWeight="bold">
        Tags:
      </Text>
      {task.labels.map(tag => (
        <Tag key={tag} colorScheme="teal" mr={1}>
          {tag}
        </Tag>
      ))}
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
      <Text fontSize="sm" fontWeight="bold">
        Priority:
      </Text>
      {/* Display the priority label with the appropriate color */}
      <Text fontSize="sm" color={priorityColor}>
        {priorityLabel}
      </Text>
      <Text fontSize="sm" fontWeight="bold">
        Cost Per Hour:
      </Text>
      <Text fontSize="sm" color="gray.500">
        {task.cost_per_hr}
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Estimation (hrs):
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.estimation_spent_hrs}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" fontWeight="bold">
            Actual Time Spent (hrs)
          </Text>
          <Text fontSize="sm" color="gray.500">
            {task.actual_time_hr}
          </Text>
        </GridItem>
      </Grid>
      <Flex align="center" justifyContent="flex-end" mt={4}>
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
    </GridItem>
  );
};

export default SearchResult;
