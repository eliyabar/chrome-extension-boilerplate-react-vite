import { useEffect, useState } from 'react';
import { UseSnip, ImageDetails, BoundingRect } from '../types';

export const useSnip: UseSnip = () => {
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
            const base64Image = canvas.toDataURL();

            setImageDetails({
              base64: base64Image,
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
    reset: () => {
      setIsSnipping(false);
      setImageDetails(undefined);
    },
    imageDetails,
    isSnipping,
  };
};
