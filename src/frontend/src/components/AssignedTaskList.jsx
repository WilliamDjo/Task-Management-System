import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Center, Heading, Hide, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

import { isNone } from '../fetch';

const AssignedTaskList = (props) => {
  const [tasks, setTasks] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const newTasks = props.tasks.map((task) => {
      const deadline = task.deadline;

      const dateDeadline = new Date(deadline);

      const dateOptions = { day: 'numeric' };
      const date = dateDeadline.toLocaleDateString('en-US', dateOptions);

      const monthOptions = { month: 'short' };
      const month = dateDeadline.toLocaleDateString('en-US', monthOptions);

      const yearOptions = { year: 'numeric' };
      const year = dateDeadline.toLocaleDateString('en-US', yearOptions);

      let deadlineString = `${date} ${month} ${year}`;

      if (isNone(deadline)) {
        deadlineString = '';
      }

      return {
        title: task.title,
        id: task.id,
        deadline: deadlineString,
      };
    })

    setTasks(newTasks);
    setLoaded(true);
  }, []);

  const assignedTasksLoaded = () => {
    return (
      <Card>
        <CardBody>
          <Heading fontSize="lg" textTransform="uppercase">
            {props.title}
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Hide below="sm">
                    <Th>ID</Th>
                  </Hide>
                  <Th>Title</Th>
                  <Th isNumeric>Deadline</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task, index) => {
                  return (
                    <Tr key={index}>
                      <Hide below="sm">
                        <Td>{task.id}</Td>
                      </Hide>
                      <Td>{task.title}</Td>
                      <Td isNumeric>{task.deadline}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          {tasks.length === 0 && <Center><Text pt='4'>No Assigned Tasks</Text></Center>}
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      {loaded ? assignedTasksLoaded() : <Center><Spinner /></Center>}
    </>
  );
};

AssignedTaskList.propTypes = {
  title: PropTypes.string,
  // tasks = [
  //   {
  //     id: PropTypes.string,
  //     title: PropTypes.string,
  //     deadline: PropTypes.string
  //   }, ...
  // ]
  tasks: PropTypes.array,
}

export default AssignedTaskList;
