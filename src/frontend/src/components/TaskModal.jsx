/* eslint-disable react/prop-types */
import React from 'react';
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
  Textarea,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

const TaskModal = props => {
  const {
    isOpen,
    onClose,
    task,
    onSubmit,
    assignedTo,
    setAssignedTo,
    newTask,
    setNewTask,
    description,
    setDescription,
    deadline,
    setDeadline,
    tags,
    setTags,
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
              <Select
                placeholder="Assign To"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
              >
                <option value="">Select Assignee</option>
                <option value="You">You</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
              </Select>
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
