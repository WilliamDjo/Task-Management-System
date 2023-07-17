/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  //   IconButton,
  //   Input,
  //   Modal,
  //   ModalBody,
  //   ModalCloseButton,
  //   ModalContent,
  //   ModalFooter,
  //   ModalHeader,
  //   ModalOverlay,
  //   Select,
  //   Spacer,
  Stack,
  //   Tag,
  //   Text,
  //   Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
// import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import TaskCard from './TaskCard';
import AddTaskButton from './AddTaskButton';
import TaskModal from './TaskModal';
import { fetchBackend } from '../fetch';

const KanbanBoard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tags, setTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = () => {
    // if (newTask && assignedTo) {
    //   const task = {
    //     id: Date.now(),
    //     title: newTask,
    //     description,
    //     assignedTo,
    //     deadline,
    //     tags: tags.slice(0, 5), // Ensure maximum of 5 tags
    //     status: 'To Do',
    //   };

    //   if (editingTask) {
    //     setTasks(prevTasks =>
    //       prevTasks.map(prevTask =>
    //         prevTask.id === editingTask.id ? task : prevTask
    //       )
    //     );
    //     setEditingTask(null);
    //     toast({
    //       title: 'Task Updated',
    //       description: 'Task has been updated successfully.',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   } else {
    //     setTasks([...tasks, task]);
    //     toast({
    //       title: 'Task Added',
    //       description: 'Task has been added successfully.',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   }

    //   setNewTask('');
    //   setDescription('');
    //   setAssignedTo('');
    //   setDeadline('');
    //   setTags([]);
    //   onClose();
    // } else {
    //   toast({
    //     title: 'Error',
    //     description: 'Please enter a task and assign it to someone.',
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    // }
    // Function to handle task creation

    if (newTask && assignedTo) {
      const task = {
        title: newTask,
        description,
        assignedTo,
        deadline,
        tags: tags.slice(0, 5), // Ensure maximum of 5 tags
        status: 'To Do',
      };

      if (editingTask) {
        // Call the backend function to update the task
        fetchBackend(
          `/task/update/${editingTask.id}`, // Use the appropriate route to update the task based on the ID
          'PUT',
          task,
          toast,
          data => {
            // onSuccess: Task updated successfully
            // Update the state with the updated task
            setTasks(prevTasks =>
              prevTasks.map(prevTask =>
                prevTask.id === editingTask.id ? data : prevTask
              )
            );
            // Show success message
            toast({
              title: 'Task Updated',
              description: 'Task has been updated successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            // Clear the input fields and close the modal
            setNewTask('');
            setDescription('');
            setAssignedTo('');
            setDeadline('');
            setTags([]);
            setEditingTask(null);
            onClose();
          },
          () => {
            // onFailure: Task update failed
            // Show error message
            toast({
              title: 'Error',
              description: 'Task update failed. Please try again later.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        );
      } else {
        // Call the backend function to create the task
        fetchBackend(
          '/task/create',
          'POST',
          task,
          toast,
          data => {
            // onSuccess: Task created successfully
            // Update the state with the newly created task
            setTasks(prevTasks => [...prevTasks, data.task]);
            // Show success message
            toast({
              title: 'Task Added',
              description: 'Task has been added successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            // Clear the input fields and close the modal
            setNewTask('');
            setDescription('');
            setAssignedTo('');
            setDeadline('');
            setTags([]);
            onClose();
          },
          () => {
            // onFailure: Task creation failed
            // Show error message
            toast({
              title: 'Error',
              description: 'Task creation failed. Please try again later.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        );
      }
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a task and assign it to someone.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveTask = taskId => {
    // setTasks(tasks.filter(task => task.id !== taskId));
    // Call the backend function to delete the task
    fetchBackend(
      `/task/delete/${taskId}`, // Use the appropriate route to delete the task based on the ID
      'DELETE',
      null,
      toast,
      () => {
        // onSuccess: Task deleted successfully
        // Update the state by removing the deleted task from the tasks list
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        // Show success message
        toast({
          title: 'Task Deleted',
          description: 'Task has been deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      () => {
        // onFailure: Task deletion failed
        // Show error message
        toast({
          title: 'Error',
          description: 'Task deletion failed. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  const handleStatusChange = (taskId, status) => {
    setTasks(
      tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status };
        }
        return task;
      })
    );
  };

  const handleEditTask = taskId => {
    // const taskToEdit = tasks.find(task => task.id === taskId);
    // if (taskToEdit) {
    //   setEditingTask(taskToEdit);
    //   setNewTask(taskToEdit.title);
    //   setDescription(taskToEdit.description);
    //   setAssignedTo(taskToEdit.assignedTo);
    //   setDeadline(taskToEdit.deadline);
    //   setTags(taskToEdit.tags);
    //   onOpen();
    // }
    // Call the backend function to get the task details
    fetchBackend(
      `/task/get/${taskId}`, // Use the appropriate route to fetch task details based on the ID
      'GET',
      null,
      toast,
      data => {
        // onSuccess: Task details fetched successfully
        // Update the state with the fetched task
        setEditingTask(data);
        setNewTask(data.title);
        setDescription(data.description);
        setAssignedTo(data.assignedTo);
        setDeadline(data.deadline);
        setTags(data.tags);
        onOpen();
      },
      () => {
        // onFailure: Failed to fetch task details
        // Show error message
        toast({
          title: 'Error',
          description: 'Failed to fetch task details. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setNewTask('');
    setDescription('');
    setAssignedTo('');
    setDeadline('');
    setTags([]);
    onClose();
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Kanban Board
      </Heading>
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              To Do
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.status === 'To Do')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
            <AddTaskButton onOpen={onOpen} />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              In Progress
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.status === 'In Progress')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column" align="center">
            <Heading size="md" mb={4}>
              Completed
            </Heading>
            <Stack spacing={4} w="300px">
              {tasks
                .filter(task => task.status === 'Done')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onRemove={handleRemoveTask}
                    onEdit={handleEditTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </Stack>
          </Flex>
        </GridItem>
      </Grid>
      <TaskModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSubmit={handleAddTask}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        newTask={newTask}
        setNewTask={setNewTask}
        description={description}
        setDescription={setDescription}
        deadline={deadline}
        setDeadline={setDeadline}
        tags={tags}
        setTags={setTags}
      />
    </Box>
  );
};

export default KanbanBoard;
