/* eslint-disable no-unused-vars */
// TaskList.js
import React from 'react';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import TaskColumn from './TaskColumn';
import AddTaskButton from './AddTaskButton';

const TaskList = props => {
  const {
    status,
    tasks,
    onAddTask,
    onEditTask,
    onRemoveTask,
    onUpdateTask,
    onStatusChange,
  } = props;
  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <Flex direction="column" align="center">
      <Heading size="md" mb={4}>
        {status}
      </Heading>
      <Stack spacing={4} w="300px">
        {filteredTasks.map(task => (
          <TaskColumn
            key={task.id}
            task={task}
            onRemove={onRemoveTask}
            onEdit={onEditTask}
            onStatusChange={onStatusChange}
          />
        ))}
      </Stack>
      <AddTaskButton onOpen={() => onEditTask(null)} />
    </Flex>
  );
};

TaskList.propTypes = {
  status: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onRemoveTask: PropTypes.func.isRequired,
  onUpdateTask: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default TaskList;
