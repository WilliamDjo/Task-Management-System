import React from 'react';
import ConnectionsBar from '../components/ConnectionsBar';
import { Box, Button, Heading, Input } from '@chakra-ui/react';

const AddConnection = () => {
  const [email, setEmail] = React.useState('');
  return (
    <ConnectionsBar addConnections>
      <Box>
        <Heading>Add Connections</Heading>
        <Input value={email} onChange={(event) => setEmail(event.target.value)}></Input>
        <Button>Send</Button>
      </Box>
    </ConnectionsBar>
  );
}

export default AddConnection;
