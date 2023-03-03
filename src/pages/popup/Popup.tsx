import React from 'react';
// import '@pages/popup/Popup.css';
import { Button, Center } from '@chakra-ui/react';

const Popup = () => {
  return (
    <Center h="150px" w="100%" bg="#282c34">
      <Button
        colorScheme="blue"
        w="80px"
        h="40px"
        onClick={async () => {
          console.log('sending');
          chrome.tabs.query(
            {
              active: true,
              currentWindow: true,
            },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'capture',
              });
            }
          );
        }}
      >
        Capture
      </Button>
    </Center>
  );
};

export default Popup;
