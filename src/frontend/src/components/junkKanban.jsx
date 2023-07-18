// import React, { useState } from 'react';
// import {
//   Box,
//   Flex,
//   Grid,
//   GridItem,
//   Heading,
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
//   Stack,
//   Tag,
//   Text,
//   Textarea,
//   useDisclosure,
//   useToast,
// } from '@chakra-ui/react';
// import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

// const KanbanBoard = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState('');
//   const [description, setDescription] = useState('');
//   const [assignedTo, setAssignedTo] = useState('');
//   const [deadline, setDeadline] = useState('');
//   const [tags, setTags] = useState([]);
//   const [editingTask, setEditingTask] = useState(null);

//   const handleAddTask = () => {
//     if (newTask && assignedTo) {
//       const task = {
//         id: Date.now(),
//         title: newTask,
//         description,
//         assignedTo,
//         deadline,
//         tags: tags.slice(0, 5), // Ensure maximum of 5 tags
//         status: 'To Do',
//       };

//       if (editingTask) {
//         setTasks(prevTasks =>
//           prevTasks.map(prevTask =>
//             prevTask.id === editingTask.id ? task : prevTask
//           )
//         );
//         setEditingTask(null);
//         toast({
//           title: 'Task Updated',
//           description: 'Task has been updated successfully.',
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       } else {
//         setTasks([...tasks, task]);
//         toast({
//           title: 'Task Added',
//           description: 'Task has been added successfully.',
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       }

//       setNewTask('');
//       setDescription('');
//       setAssignedTo('');
//       setDeadline('');
//       setTags([]);
//       onClose();
//     } else {
//       toast({
//         title: 'Error',
//         description: 'Please enter a task and assign it to someone.',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleRemoveTask = taskId => {
//     setTasks(tasks.filter(task => task.id !== taskId));
//   };

//   const handleStatusChange = (taskId, status) => {
//     setTasks(
//       tasks.map(task => {
//         if (task.id === taskId) {
//           return { ...task, status };
//         }
//         return task;
//       })
//     );
//   };

//   const handleEditTask = taskId => {
//     const taskToEdit = tasks.find(task => task.id === taskId);
//     if (taskToEdit) {
//       setEditingTask(taskToEdit);
//       setNewTask(taskToEdit.title);
//       setDescription(taskToEdit.description);
//       setAssignedTo(taskToEdit.assignedTo);
//       setDeadline(taskToEdit.deadline);
//       setTags(taskToEdit.tags);
//       onOpen();
//     }
//   };

//   const handleCloseModal = () => {
//     setEditingTask(null);
//     setNewTask('');
//     setDescription('');
//     setAssignedTo('');
//     setDeadline('');
//     setTags([]);
//     onClose();
//   };

//   return (
//     <Box p={4}>
//       <Heading as="h1" mb={4}>
//         Kanban Board
//       </Heading>
//       <Grid templateColumns="repeat(3, 1fr)" gap={4}>
//         <GridItem>
//           <Flex direction="column" align="center">
//             <Heading size="md" mb={4}>
//               To Do
//             </Heading>
//             <Stack spacing={4} w="300px">
//               {tasks
//                 .filter(task => task.status === 'To Do')
//                 .map(task => (
//                   <TaskCard
//                     key={task.id}
//                     task={task}
//                     onRemove={handleRemoveTask}
//                     onEdit={handleEditTask}
//                     onStatusChange={handleStatusChange}
//                   />
//                 ))}
//             </Stack>
//             <AddTaskButton onOpen={onOpen} />
//           </Flex>
//         </GridItem>
//         <GridItem>
//           <Flex direction="column" align="center">
//             <Heading size="md" mb={4}>
//               In Progress
//             </Heading>
//             <Stack spacing={4} w="300px">
//               {tasks
//                 .filter(task => task.status === 'In Progress')
//                 .map(task => (
//                   <TaskCard
//                     key={task.id}
//                     task={task}
//                     onRemove={handleRemoveTask}
//                     onEdit={handleEditTask}
//                     onStatusChange={handleStatusChange}
//                   />
//                 ))}
//             </Stack>
//           </Flex>
//         </GridItem>
//         <GridItem>
//           <Flex direction="column" align="center">
//             <Heading size="md" mb={4}>
//               Done
//             </Heading>
//             <Stack spacing={4} w="300px">
//               {tasks
//                 .filter(task => task.status === 'Done')
//                 .map(task => (
//                   <TaskCard
//                     key={task.id}
//                     task={task}
//                     onRemove={handleRemoveTask}
//                     onEdit={handleEditTask}
//                     onStatusChange={handleStatusChange}
//                   />
//                 ))}
//             </Stack>
//           </Flex>
//         </GridItem>
//       </Grid>
//       <TaskModal
//         isOpen={isOpen}
//         onClose={handleCloseModal}
//         task={editingTask}
//         onSubmit={handleAddTask}
//         assignedTo={assignedTo}
//         setAssignedTo={setAssignedTo}
//         newTask={newTask}
//         setNewTask={setNewTask}
//         description={description}
//         setDescription={setDescription}
//         deadline={deadline}
//         setDeadline={setDeadline}
//         tags={tags}
//         setTags={setTags}
//       />
//     </Box>
//   );
// };

// const TaskCard = ({ task, onRemove, onEdit, onStatusChange }) => {
//   const handleRemove = () => {
//     onRemove(task.id);
//   };

//   const handleEdit = () => {
//     onEdit(task.id);
//   };

//   const handleStatusChange = e => {
//     const status = e.target.value;
//     onStatusChange(task.id, status);
//   };

//   return (
//     <Box
//       bg="white"
//       p={4}
//       borderRadius="md"
//       boxShadow="md"
//       w="100%"
//       display="flex"
//       flexDirection="column"
//       alignItems="flex-start"
//       justifyContent="space-between"
//     >
//       <Text fontSize="lg" fontWeight="bold" mb={2}>
//         {task.title}
//       </Text>
//       <Text fontSize="md" color="gray.500" mb={2}>
//         {task.description}
//       </Text>
//       <Box mb={2}>
//         <Text fontSize="sm" fontWeight="bold">
//           Assigned To:
//         </Text>
//         <Text fontSize="sm" color="gray.500">
//           {task.assignedTo}
//         </Text>
//       </Box>
//       <Box mb={2}>
//         <Text fontSize="sm" fontWeight="bold">
//           Deadline:
//         </Text>
//         <Text fontSize="sm" color="gray.500">
//           {task.deadline}
//         </Text>
//       </Box>
//       <Box mb={2}>
//         <Text fontSize="sm" fontWeight="bold">
//           Tags:
//         </Text>
//         <Flex>
//           {task.tags.map(tag => (
//             <Tag key={tag} colorScheme="teal" mr={1}>
//               {tag}
//             </Tag>
//           ))}
//         </Flex>
//       </Box>
//       <Box mb={2}>
//         <Text fontSize="sm" fontWeight="bold">
//           Status:
//         </Text>
//         <Select
//           value={task.status}
//           onChange={handleStatusChange}
//           size="sm"
//           width="120px"
//         >
//           <option value="To Do">To Do</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Done">Done</option>
//         </Select>
//       </Box>
//       <Flex align="center">
//         <IconButton
//           icon={<EditIcon />}
//           onClick={handleEdit}
//           aria-label="Edit Task"
//           colorScheme="teal"
//           size="sm"
//           mr={2}
//         />
//         <IconButton
//           icon={<CloseIcon />}
//           onClick={handleRemove}
//           aria-label="Remove Task"
//           colorScheme="red"
//           size="sm"
//         />
//       </Flex>
//     </Box>
//   );
// };

// const AddTaskButton = ({ onOpen }) => (
//   <Box
//     bg="gray.100"
//     p={4}
//     borderRadius="md"
//     boxShadow="md"
//     cursor="pointer"
//     w="100%"
//     display="flex"
//     alignItems="center"
//     justifyContent="center"
//     onClick={onOpen}
//     transition="all 0.3s"
//     _hover={{ transform: 'scale(1.05)', bg: 'gray.200' }}
//   >
//     <AddIcon />
//   </Box>
// );

// const TaskModal = ({
//   isOpen,
//   onClose,
//   task,
//   onSubmit,
//   assignedTo,
//   setAssignedTo,
//   newTask,
//   setNewTask,
//   description,
//   setDescription,
//   deadline,
//   setDeadline,
//   tags,
//   setTags,
// }) => {
//   const handleSubmit = e => {
//     e.preventDefault();
//     onSubmit();
//   };

//   const handleTagInputChange = (e, index) => {
//     const updatedTags = [...tags];
//     updatedTags[index] = e.target.value;
//     setTags(updatedTags);
//   };

//   const handleAddTag = () => {
//     if (tags.length < 5) {
//       setTags([...tags, '']);
//     }
//   };

//   const handleRemoveTag = index => {
//     const updatedTags = [...tags];
//     updatedTags.splice(index, 1);
//     setTags(updatedTags);
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>{task ? 'Edit Task' : 'Add Task'}</ModalHeader>
//         <ModalCloseButton />
//         <form onSubmit={handleSubmit}>
//           <ModalBody>
//             <Stack spacing={4}>
//               <Input
//                 placeholder="Task Title"
//                 value={newTask}
//                 onChange={e => setNewTask(e.target.value)}
//               />
//               <Textarea
//                 placeholder="Description"
//                 value={description}
//                 onChange={e => setDescription(e.target.value)}
//                 resize="vertical"
//                 minH="100px"
//               />
//               <Input
//                 type="date"
//                 placeholder="Deadline"
//                 value={deadline}
//                 onChange={e => setDeadline(e.target.value)}
//               />
//               <Stack spacing={2}>
//                 {tags.map((tag, index) => (
//                   <Flex key={index}>
//                     <Input
//                       placeholder={`Tag ${index + 1}`}
//                       value={tag}
//                       onChange={e => handleTagInputChange(e, index)}
//                     />
//                     {index > 0 && (
//                       <IconButton
//                         icon={<CloseIcon />}
//                         onClick={() => handleRemoveTag(index)}
//                         aria-label="Remove Tag"
//                         colorScheme="red"
//                         size="sm"
//                         ml={2}
//                       />
//                     )}
//                   </Flex>
//                 ))}
//                 {tags.length < 5 && (
//                   <IconButton
//                     icon={<AddIcon />}
//                     onClick={handleAddTag}
//                     aria-label="Add Tag"
//                     colorScheme="teal"
//                     size="sm"
//                   />
//                 )}
//               </Stack>
//               <Select
//                 placeholder="Assign To"
//                 value={assignedTo}
//                 onChange={e => setAssignedTo(e.target.value)}
//               >
//                 <option value="">Select Assignee</option>
//                 <option value="You">You</option>
//                 <option value="Alice">Alice</option>
//                 <option value="Bob">Bob</option>
//                 <option value="Charlie">Charlie</option>
//               </Select>
//             </Stack>
//           </ModalBody>
//           <ModalFooter>
//             <Spacer />
//             <IconButton
//               icon={<CloseIcon />}
//               onClick={onClose}
//               aria-label="Cancel"
//               colorScheme="gray"
//               mr={2}
//             />
//             <IconButton
//               type="submit"
//               icon={<AddIcon />}
//               aria-label={task ? 'Update Task' : 'Add Task'}
//               colorScheme="teal"
//             />
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default KanbanBoard;
