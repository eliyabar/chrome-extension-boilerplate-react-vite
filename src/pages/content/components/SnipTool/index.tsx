import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from '@src/pages/content/components/SnipTool/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import mainTheme from '../../theme';

refreshOnUpdate('pages/content/components/Demo');

const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';
document.body.append(root);

createRoot(root).render(
  <ChakraProvider theme={mainTheme}>
    <App />
  </ChakraProvider>
);
