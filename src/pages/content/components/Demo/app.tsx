import { Box, Image as ChakraImage } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type BoundingRect = {
  top: number;
  left: number;
  height: number;
  width: number;
};
type ImageDetails = {
  base64: string;
  dimensions: BoundingRect;
};
type UseSnip = () => {
  startSnip: () => void;
  imageDetails?: ImageDetails;
  isSnipping: boolean;
};
const useSnip: UseSnip = () => {
  const [isSnipping, setIsSnipping] = useState(false);
  const [imageDetails, setImageDetails] = useState<ImageDetails>();

  let initialPoint: { x: number; y: number } | undefined = undefined;
  const rectangle: BoundingRect = {
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
              dimensions: rectangle,
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
    isSnipping,
  };
};

export default function App() {
  // const { isOpen, onOpen, onClose } = useDisclosure({
  //   isOpen: true,
  // });
  const [isOpen, setIsOpen] = useState(false);
  const { startSnip, isSnipping, imageDetails } = useSnip();
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
          onClose={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <Box
          margin={'20px'}
          zIndex="9999"
          position={'fixed'}
          width={imageDetails.dimensions.width}
          height={imageDetails.dimensions.height}
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        >
          <ChakraImage src={imageDetails.base64} />
        </Box>
      )}
    </Box>
  );
}
//TODO: fix that
function generateDataUrlBackground(props: BoundingRect) {
  //return `url( "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'%3E%3Cpath d='M10 10h123v123H10z'/%3E%3C/svg%3E" );`;
  //return `url( "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cmask id='msk'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='white' /%3E%3Crect x='${props.left}' y='${props.top}' width='${props.width}' height='${props.height}' fill='black' /%3E%3C/mask%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='blue' mask='url(%23msk)' /%3E%3C/svg%3E");`;
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100%25 100%25' height='100%25' width='100%25' preserveAspectRatio='none'%3E%3Cmask id='msk'%3E%3Crect x='0' y='0' height='100%25' width='100%25' fill='white'/%3E%3Crect x='${props.left}' y='${props.top}' height='${props.height}' width='${props.width}' fill='black'/%3E%3C/mask%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='rgba(17, 14, 30, 0.7)' mask='url(%23msk)' /%3E%3C/svg%3E");`;
}
export const SnippingOverlay = (props: {
  rect?: BoundingRect;
  isActive: boolean;
  onClose: () => void;
}) => {
  return props.isActive ? (
    <Box
      id={'xxxx'}
      position="absolute"
      width="100%"
      height="100%"
      background={'rgba(17, 14, 30, 0.7)'}
      top="0px"
      left="0px"
      onClick={props.onClose}
      zIndex="9998"
    />
  ) : null;
};
