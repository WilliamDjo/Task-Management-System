import React from 'react';
import ProfileBar from '../components/ProfileBar';
import {
  Center,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { fetchBackend, isNone } from '../fetch';
import AssignedTaskList from '../components/AssignedTaskList';

// Displays the user's own assigned tasks with the AssignedTaskList component.
const MyAssignedTasks = () => {
  const [loaded, setLoaded] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);

  const toast = useToast();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const successGetTasks = (data) => {
      const newTasks = [...data.Data];

      // Sorts the tasks by deadline, if one exists
      newTasks.sort((a, b) => {
        if ((isNone(a.deadline) || a.deadline === '') && (isNone(b.deadline) || b.deadline === '')) {
          return 0;
        } else if (isNone(a.deadline) || a.deadline === '') {
          return 1;
        } else if (isNone(b.deadline) || b.deadline === '') {
          return -1;
        }

        const aDate = new Date(a.deadline);
        const bDate = new Date(b.deadline);
        if (aDate < bDate) {
          return -1;
        } else if (aDate > bDate) {
          return 1;
        } else {
          return 0;
        }
      })

      setTasks(newTasks);
      setLoaded(true);
    }

    const failGetTasks = (data) => {
      if (!isNone(data)) {
        if (data.Message === 'No tasks given to by task assignee') {
          setTasks([]);
          setLoaded(true);
        } else {
          toast({
            title: data.Message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }

    const successGetProfile = (data) => {
      const email = data.Data.email;

      fetchBackend(`/task/getAllAssignedTo/${email}`, 'GET', { token }, null, successGetTasks, failGetTasks);
    }
    fetchBackend('/getuserprofile', 'POST', { token }, toast, successGetProfile);
  }, [])

  const myAssignedTaskListLoaded = () => {
    return (
      <AssignedTaskList title={'My Assigned Task List'} tasks={tasks} />
    );
  };

  return (
    <ProfileBar pendingTasks>
      {loaded ? myAssignedTaskListLoaded() : <Center><Spinner /></Center>}
    </ProfileBar>
  );
}

export default MyAssignedTasks;
