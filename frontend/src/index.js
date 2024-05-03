import React from 'react';
import { createRoot } from 'react-dom/client';
//import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import {ChatProvider} from './Context/ChatProvider';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>

    </BrowserRouter>
  </ChakraProvider>
);
