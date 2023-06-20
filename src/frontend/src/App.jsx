import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';

import ChakraDefault from './pages/ChakraDefault';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ChakraDefault />
    </ChakraProvider>
  );
}

export default App;
