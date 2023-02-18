import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image as ChakraImage,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
type ImageDetails = {
  base64: string;
  dimensions: { height: number; width: number };
};
type UseSnip = () => {
  startSnip: () => void;
  imageDetails: ImageDetails;
};
const useSnip: UseSnip = () => {
  const [isSnipping, setIsSnipping] = useState(true);
  const [imageDetails, setImageDetails] = useState<ImageDetails>();

  let initialPoint: { x: number; y: number } | undefined = undefined;
  const rectangle: {
    top: number;
    left: number;
    height: number;
    width: number;
  } = {
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  };

  useEffect(() => {
    if (!isSnipping) return;

    const rectEl = document.createElement('div');

    rectEl.style.border = '1px solid black';
    rectEl.style.position = 'fixed';
    rectEl.style.zIndex = '99999';
    rectEl.id = 'ext_rectangle_wrapper';
    const styleElement = document.createElement('style');
    styleElement.id = 'lc__snipping-tool-styles';

    document.head.appendChild(styleElement);

    styleElement.sheet?.insertRule(
      `
            .snipping-tool-activated {
                cursor: crosshair;
                user-select: none;
            }`,
      0
    );
    const mainEl = document.getElementsByTagName('html')[0];
    mainEl.classList.add('snipping-tool-activated');
    document.body.style.pointerEvents = 'none';
    const mdCb = (e: { clientX: number; clientY: number }) => {
      initialPoint = { x: e.clientX, y: e.clientY };
      document.body.appendChild(rectEl);
      rectEl.style.top = `${rectangle.top}`;
      rectEl.style.left = `${rectangle.left}`;
      const mmCb = (e: { clientX: number; clientY: number }) => {
        if (initialPoint) {
          const offsetX = initialPoint.x - e.clientX;
          const offsetY = initialPoint.y - e.clientY;
          rectangle.width = Math.abs(offsetX);
          rectangle.height = Math.abs(offsetY);
          rectangle.left =
            offsetX < 0 ? initialPoint.x : initialPoint.x - Math.abs(offsetX);
          rectangle.top =
            offsetY < 0 ? initialPoint.y : initialPoint.y - Math.abs(offsetY);
          rectEl.style.width = `${rectangle.width}px`;
          rectEl.style.height = `${rectangle.height}px`;
          rectEl.style.top = `${rectangle.top}px`;
          rectEl.style.left = `${rectangle.left}px`;
        }
      };
      document.addEventListener('mousemove', mmCb);

      const muCb = () => {
        (async () => {
          rectEl.remove();
          const response: { image: string } = await chrome.runtime.sendMessage({
            capture: rectangle,
          });
          // do something with response here, not outside the function
          const canvas = document.createElement('canvas');
          const image = new Image();
          image.src = response.image;
          document.body.appendChild(image);
          const dpr = window.devicePixelRatio;

          canvas.width = rectangle.width * dpr;
          canvas.height = rectangle.height * dpr;
          const context = canvas.getContext('2d');

          console.log(rectangle);
          image.onload = () => {
            context.drawImage(
              image,
              rectangle.left * dpr,
              rectangle.top * dpr,
              rectangle.width * dpr,
              rectangle.height * dpr,
              0,
              0,
              rectangle.width * dpr,
              rectangle.height * dpr
            );
            setImageDetails({
              base64: canvas.toDataURL(),
              dimensions: { height: rectangle.height, width: rectangle.width },
            });
          };
        })();
        document.removeEventListener('mousedown', mdCb);
        document.removeEventListener('mousemove', mmCb);
        document.removeEventListener('mouseup', muCb);
        mainEl.classList.remove('snipping-tool-activated');
        document.body.style.pointerEvents = '';
      };
      document.addEventListener('mouseup', muCb);
    };
    document.addEventListener('mousedown', mdCb);
    return () => {
      document.removeEventListener('mousedown', mdCb);
    };
  }, [isSnipping]);

  return {
    startSnip: () => setIsSnipping(true),
    imageDetails,
  };
};

export default function App() {
  // const { isOpen, onOpen, onClose } = useDisclosure({
  //   isOpen: true,
  // });
  const [isOpen, setIsOpen] = useState(false);
  const { startSnip, imageDetails } = useSnip();
  console.log(imageDetails);
  useEffect(() => {
    if (imageDetails) {
      setIsOpen(true);
    }
    console.log('content view loaded');
  }, [imageDetails]);
  return (
    isOpen && (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChakraImage src={imageDetails.base64} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                startSnip();
              }}
            >
              Secondary Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  );
}
