import { Box, Image as ChakraImage } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DrawingBoard } from './DrawingBoard/DrawingBoard';
import { useSnip } from './hooks/useSnip';
import { SnippingOverlay } from './SnippingOverlay';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { startSnip, reset, isSnipping, imageDetails } = useSnip();
  console.log(imageDetails);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.action === 'capture') {
        startSnip();
        sendResponse({ resp: 'ok' });
      }
    });
  }, []);
  useEffect(() => {
    if (imageDetails) {
      setIsOpen(true);
    }
  }, [imageDetails]);
  return (
    <Box>
      {isOpen && imageDetails?.dimensions && (
        <SnippingOverlay
          rect={imageDetails.dimensions}
          isActive={isSnipping}
          onClose={() => {
            setIsOpen(false);
            reset();
          }}
        />
      )}
      {isOpen && (
        <DrawingBoard
          width={imageDetails.dimensions.width}
          height={imageDetails.dimensions.height}
          onDrawingComplete={(base64img?: string) => {}}
          onCancelDrawing={() => {}}
          image={imageDetails.base64}
        />
      )}
    </Box>
  );
}

// (
//   <Box
//     margin={'20px'}
//     zIndex="9999"
//     position={'fixed'}
//     width={imageDetails.dimensions.width}
//     height={imageDetails.dimensions.height}
//     left="50%"
//     top="50%"
//     transform="translate(-50%, -50%)"
//   >
//     <ChakraImage src={imageDetails.base64} />
//   </Box>
// )}
