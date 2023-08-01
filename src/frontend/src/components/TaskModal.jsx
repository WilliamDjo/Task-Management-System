/* eslint-disable multiline-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spacer,
  IconButton,
  Select,
  Stack,
  Input,
  InputRightAddon,
  InputGroup,
  Textarea,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

const TaskModal = props => {
  const {
    isOpen,
    onClose,
    task,
    onSubmit,
    userFullName,
    userEmail,
    assignedTo,
    setAssignedTo,
    connections,
    newTask,
    setNewTask,
    description,
    setDescription,
    deadline,
    setDeadline,
    tags,
    setTags,
    priority,
    setPriority,
    costPerHour,
    setCostPerHour,
    timeEstimate,
    setTimeEstimate,
    actualTimeSpent,
    setActualTimeSpent,
    resetActualTime,
  } = props;

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit();
  };

  const handleTagInputChange = (e, index) => {
    const updatedTags = [...tags];
    updatedTags[index] = e.target.value;
    setTags(updatedTags);
  };

  const handleAddTag = () => {
    if (tags.length < 5) {
      setTags([...tags, '']);
    }
  };

  const handleRemoveTag = index => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  // Function to reset actual time spent when progress changes to 'To Do' or 'In Progress'
  useEffect(() => {
    if (
      task &&
      (task.progress === 'To Do' || task.progress === 'In Progress')
    ) {
      resetActualTime();
    }
  }, [task, resetActualTime]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task ? 'Edit Task' : 'Add Task'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack spacing={4}>
              <Input
                placeholder="Task Title"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                resize="vertical"
                minH="100px"
              />
              <Input
                type="date"
                placeholder="Deadline"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
              <Select
                placeholder="Priority"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="1">Low</option>
                <option value="2">Moderate</option>
                <option value="3">High</option>
              </Select>
              <InputGroup>
                <Input
                  type="number"
                  placeholder="Cost per Hour (optional)"
                  value={costPerHour}
                  onChange={e => setCostPerHour(e.target.value)}
                />
                <InputRightAddon children="AUD" />
              </InputGroup>
              <Input
                type="number"
                placeholder="Time Estimate (in hours)"
                value={timeEstimate}
                onChange={e => setTimeEstimate(e.target.value)}
              />
              <Tooltip label="Recommended only to be filled once the task is complete">
                <Input
                  type="number"
                  placeholder="Actual Time (in hours)"
                  value={actualTimeSpent}
                  onChange={e => setActualTimeSpent(e.target.value)}
                />
              </Tooltip>
              <Stack spacing={2}>
                {tags.map((tag, index) => (
                  <Flex key={index}>
                    <Input
                      placeholder={`Tag ${index + 1}`}
                      value={tag}
                      onChange={e => handleTagInputChange(e, index)}
                    />
                    {index > 0 && (
                      <IconButton
                        icon={<CloseIcon />}
                        onClick={() => handleRemoveTag(index)}
                        aria-label="Remove Tag"
                        colorScheme="red"
                        size="sm"
                        ml={2}
                      />
                    )}
                  </Flex>
                ))}
                {tags.length < 5 && (
                  <IconButton
                    icon={<AddIcon />}
                    onClick={handleAddTag}
                    aria-label="Add Tag"
                    colorScheme="teal"
                    size="sm"
                  />
                )}
              </Stack>

              {/* {console.log('task modal: ' + connections)} */}
              {connections && connections.size > 0 && (
                <Select
                  placeholder="Assign To"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  size="sm"
                >
                  <option value={userEmail}>
                    {userFullName} {'(Yourself)'}
                  </option>
                  {connections.connections.map(connection => (
                    <option key={connection.id} value={connection.email}>
                      {connection.first_name} {connection.last_name}
                    </option>
                  ))}
                </Select>
              )}
              {connections && (
                <Select
                  placeholder="Assign To"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  size="sm"
                >
                  <option value={userEmail}>
                    {userFullName} {'(Yourself)'}
                  </option>
                  {connections.map(connection => (
                    <option key={connection.id} value={connection.email}>
                      {connection.first_name} {connection.last_name}
                    </option>
                  ))}
                </Select>
              )}
              {!connections && (
                <Select
                  placeholder="Assign To"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  size="sm"
                >
                  <option value={userEmail}>
                    {userFullName} {'(Yourself)'}
                  </option>
                </Select>
              )}
              {/* {console.log('A: ' + assignedTo)} */}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Spacer />
            <IconButton
              icon={<CloseIcon />}
              onClick={onClose}
              aria-label="Cancel"
              colorScheme="gray"
              mr={2}
            />
            <IconButton
              type="submit"
              icon={<AddIcon />}
              aria-label={task ? 'Update Task' : 'Add Task'}
              colorScheme="teal"
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
