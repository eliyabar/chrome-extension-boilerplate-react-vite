/* eslint-disable react/prop-types */
import { fabric } from 'fabric';
import './fabric';
import { Center } from '@chakra-ui/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { ICanvasOptions, IEvent, IPoint } from 'fabric/fabric-impl';
import { shapeFactory, ShapesArgs } from './fabric/ShapeFactory';
import { useStateHistory } from '../useStateHistory';
import {
  COLOR_OPTIONS,
  DEFAULT_COLOR_ID,
  DrawingBoardTools,
} from './DrawingBoardTools';

interface DrawingBoardProps {
  width: number;
  height: number;
  onDrawingComplete: (blob: Blob) => void;
  onCancelDrawing: () => void;
  image: string;
}

type ObjectPlacement = {
  initialPoint?: IPoint;
  shape: ShapesArgs['name'];
} | null;

const updateSelection = (
  ctx: fabric.Canvas | null,
  setSelectedObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>
): void => {
  if (!ctx) return;
  const objects = ctx.getObjects();
  const last = objects?.[objects?.length - 1];
  if (last) {
    setSelectedObject(last);
    ctx._setActiveObject(last);
    last.drawControls(ctx.getContext());
    ctx.renderAll.bind(ctx);
  }
};

export const DrawingBoard: React.FC<DrawingBoardProps> = ({
  width,
  height,
  onDrawingComplete,
  onCancelDrawing,
  image,
}) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<fabric.Canvas | null>(null);
  const { redo, undo, canUndo, canRedo, newChange, state } =
    useStateHistory<string>({ isEqual: (a, b) => a === b });
  const strokeWidth = 3;
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [activeColor, setActiveColor] = useState<typeof COLOR_OPTIONS[number]>(
    COLOR_OPTIONS[DEFAULT_COLOR_ID]
  );
  const [isDrawing, setIsDrawing] = useState(true);
  const [activeObjectPlacement, setActiveObjectPlacement] =
    useState<ObjectPlacement>(null);
  const [textEditMode, setTextEditMode] = useState(false);
  // const playgroundScale = useRecoilValue(rc_playgroundScale);
  const objectPlacer = useCallback((shape: ShapesArgs['name']) => {
    setSelectedObject(null);
    ctx.current?.discardActiveObject();
    setActiveObjectPlacement({ shape });
    setIsDrawing(false);
    // locking controls to prevent movement/modification of several items at once
    if (ctx.current) {
      ctx.current.forEachObject((o) => {
        o.set('hasControls', false);
        o.set('lockMovementY', true);
        o.set('lockMovementX', true);
      });
      ctx.current.renderAll();
    }
  }, []);

  const shapeCreator = useCallback(
    (name: ShapesArgs['name'], initialPoint: IPoint) => {
      const { x, y } = initialPoint;
      const defaultOptions = {
        left: initialPoint.x,
        top: initialPoint.y,
        strokeWidth,
        stroke:
          activeObjectPlacement?.shape === 'text' ? 'transparent' : activeColor,
        fill:
          activeObjectPlacement?.shape === 'text' ? activeColor : 'transparent',
        initialPoints: [x, y, x, y],
      };
      if (ctx.current) {
        return shapeFactory(ctx.current, (obj) => {
          ctx.current?.add(obj);
          ctx.current?._setActiveObject(obj);
          if (obj instanceof Text) {
            obj
              .on('editing:entered', () => setTextEditMode(true))
              .on('editing:exited', () => setTextEditMode(false));
          }
          setSelectedObject(obj);

          const returnBackControlsHandler: (e: IEvent) => void = (e) => {
            ctx.current?.forEachObject((o: fabric.Object) => {
              o.set('hasControls', true);
              o.set('lockMovementY', false);
              o.set('lockMovementX', false);
            });
            obj.off('mouseup', returnBackControlsHandler);
          };

          obj
            .on('moving', (e) => {
              obj
                .set(
                  'shadow',
                  new fabric.Shadow({
                    color: 'black',
                    offsetX: 3,
                    offsetY: 3,
                    blur: 3,
                  })
                )
                .on('mouseup', (e) => {
                  obj.set('shadow', undefined);
                });
            })
            .on('mouseup', returnBackControlsHandler);
        }).create({ name, opt: defaultOptions });
      }
    },
    [activeObjectPlacement, activeColor]
  );

  useEffect(() => {
    if (!ctx.current) return;

    if (activeObjectPlacement) {
      ctx.current.defaultCursor = 'crosshair';
    } else {
      ctx.current.defaultCursor = 'default';
    }
  }, [activeObjectPlacement]);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.isDrawingMode = isDrawing;
      if (isDrawing) {
        setActiveObjectPlacement(null);
      }
    }
  }, [isDrawing]);

  useEffect(() => {
    if (selectedObject instanceof fabric.Textbox) {
      setActiveColor(selectedObject.fill as typeof COLOR_OPTIONS[number]);
    } else if (selectedObject?.stroke) {
      setActiveColor(selectedObject.stroke as typeof COLOR_OPTIONS[number]);
    }
  }, [selectedObject]);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.freeDrawingBrush.color = activeColor;
      if (selectedObject) {
        if (selectedObject instanceof fabric.Textbox) {
          selectedObject.set('fill', activeColor);
        } else {
          selectedObject.set('stroke', activeColor);
        }
        ctx.current.renderAll();
        /* Since there is no specific event for color change, and we still want to save it to history, this might get called several times
            when using undo/redo, there is an option to create custom event, but for now, it will be solved by ignoring a new event that is equal to the curren one.
           */
        newChange(JSON.stringify(ctx.current));
      }
    }
  }, [activeColor]);

  useEffect(() => {
    if (!ctx.current) return;
    ctx.current.on('selection:created', (e) => {
      if (ctx.current) setSelectedObject(ctx.current.getActiveObject());
    });
    ctx.current.on('selection:updated', (e) => {
      if (ctx.current) setSelectedObject(ctx.current.getActiveObject());
    });
    ctx.current.on('object:modified', (e) => {
      if (ctx.current && !e.target?.shadow) {
        newChange(JSON.stringify(ctx.current));
      }
    });
    ctx.current.on('path:created', (e) => {
      if (ctx.current) {
        ctx.current?.renderAll();
        newChange(JSON.stringify(ctx.current));
      }
    });
    ctx.current.on('mouse:move', (e) => {
      if (e.pointer) {
        if (activeObjectPlacement?.initialPoint && selectedObject) {
          updateCurrentShapePlacement(
            e.pointer,
            selectedObject,
            activeObjectPlacement.initialPoint
          );
          ctx.current?.renderAll();
        }
      }
    });

    ctx.current.on('mouse:down', (e) => {
      if (
        activeObjectPlacement?.shape &&
        !activeObjectPlacement.initialPoint &&
        e.pointer
      ) {
        setSelectedObject(null);
        ctx.current?.renderAll();
        setActiveObjectPlacement({
          ...activeObjectPlacement,
          initialPoint: e.pointer,
        });
        shapeCreator(activeObjectPlacement.shape, e.pointer);
      }
    });

    ctx.current.on('mouse:up', (e) => {
      if (
        ctx.current &&
        activeObjectPlacement?.shape &&
        activeObjectPlacement.initialPoint
      ) {
        setSelectedObject(ctx.current.getActiveObject());
        newChange(JSON.stringify(ctx.current));
        setActiveObjectPlacement(null);
      }
    });

    ctx.current.on('selection:cleared', (e) => {
      setSelectedObject(null);
    });

    return () => {
      ctx.current?.off();
    };
  }, [activeObjectPlacement, selectedObject, activeColor]);

  useEffect(() => {
    const handleBackSpace: (e: KeyboardEvent) => void = ({ key }) => {
      if (
        (key === 'Backspace' || key === 'Delete') &&
        selectedObject &&
        !activeObjectPlacement
      ) {
        if (!textEditMode) ctx.current?.remove(selectedObject);
      }
    };
    const handleUndoRedo: (e: KeyboardEvent) => void = ({
      key,
      ctrlKey,
      metaKey,
      shiftKey,
    }) => {
      if ((ctrlKey || metaKey) && key.toLowerCase() === 'z') {
        const state =
          shiftKey && canRedo
            ? redo()
            : !shiftKey && canUndo
            ? undo()
            : undefined;
        if (state) {
          ctx.current?.loadFromJSON(state, () => {
            updateSelection(ctx.current, setSelectedObject);
          });
        }
      }
    };
    document.addEventListener('keydown', handleBackSpace);
    document.addEventListener('keydown', handleUndoRedo);

    return () => {
      document.removeEventListener('keydown', handleBackSpace);
      document.removeEventListener('keydown', handleUndoRedo);
    };
  }, [selectedObject, textEditMode, state]);

  useEffect(() => {
    const options: ICanvasOptions = {
      width,
      height,
      enableRetinaScaling: true,
      centeredRotation: true,
      uniformScaling: false,
      selection: false,
      isDrawingMode: isDrawing,
      freeDrawingCursor: `url("data:image/svg+xml,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 20h4L18.5 9.5a2.829 2.829 0 00-4-4L4 16v4z' fill='%23fff' stroke='%2385008F' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3Cpath d='M13.5 6.5l4 4' stroke='%2385008F' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E") 0 15, auto`,
    };
    const imgEl = new Image();
    imgEl.src = image;
    imgEl.onerror = () => {
      console.error('error', {
        message: `snipping tool image, onerror, ${imgEl?.src}`,
        name: 'snipping tool',
      });
    };
    imgEl.onload = () => {
      console.log('loaded');
      if (!canvasEl.current) {
        return;
      }
      const canvas = new fabric.Canvas(canvasEl.current, options);
      canvas.setBackgroundImage(
        new fabric.Image(imgEl, {
          objectCaching: true,
        }),
        () => {
          canvas?.renderAll();
        }
      );
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = strokeWidth;

      ctx.current = canvas;
      newChange(JSON.stringify(ctx.current));
    };

    return () => {
      ctx.current?.dispose();
      ctx.current = null;
    };
  }, [image]);

  return (
    <Center
      zIndex="999"
      position={'fixed'}
      transform="translate(-50%, -50%)"
      left="50%"
      top="50%"
    >
      <canvas
        width={`${width}px`}
        height={`${height}px`}
        ref={canvasEl}
        style={{
          pointerEvents: 'all',
          outline: `2px blue solid`,
        }}
      />
      <DrawingBoardTools
        onCancelDrawing={onCancelDrawing}
        onDrawingComplete={() => {
          if (ctx.current) {
            ctx.current.getElement().toBlob((blob) => {
              onDrawingComplete(blob);
            });
          }
        }}
        chooseColorCallback={(color) => setActiveColor(color)}
        activeColor={activeColor}
        toggleDrawingMode={() => setIsDrawing((v) => !v)}
        drawingMode={isDrawing}
        onAddShape={objectPlacer}
        activeTool={activeObjectPlacement?.shape}
        onCursorIconClick={() => {
          setActiveObjectPlacement(null);
          setIsDrawing(false);
        }}
        undo={() => {
          const prevState = undo();
          ctx.current?.loadFromJSON(prevState, () => {
            updateSelection(ctx.current, setSelectedObject);
          });
        }}
        redo={() => {
          const nextState = redo();
          ctx.current?.loadFromJSON(nextState, () => {
            updateSelection(ctx.current, setSelectedObject);
          });
        }}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </Center>
  );
};

function updateCurrentShapePlacement(
  p: IPoint,
  selectedObject: fabric.Object,
  initialPoint: IPoint
) {
  if (selectedObject instanceof fabric.IText) return;

  if (selectedObject instanceof fabric.Ellipse) {
    selectedObject.set('rx', Math.abs(p.x - initialPoint.x) / 2);
    selectedObject.set('ry', Math.abs(p.y - initialPoint.y) / 2);
  } else if (selectedObject instanceof fabric.Arrow) {
    selectedObject.set('x2', p.x);
    selectedObject.set('y2', p.y);
  } else if (selectedObject instanceof fabric.Measure) {
    const angle = Math.abs(
      Math.atan2(p.y - initialPoint.y, p.x - initialPoint.x) * (180 / Math.PI)
    );
    const snapX = angle < 45 || angle > 135;
    if (snapX) {
      selectedObject.set('x2', p.x);
      selectedObject.set('y2', initialPoint.y);
    } else {
      //snapY
      selectedObject.set('x2', initialPoint.x);
      selectedObject.set('y2', p.y);
    }
  } else {
    selectedObject.set('width', Math.abs(p.x - initialPoint.x));
    selectedObject.set('height', Math.abs(p.y - initialPoint.y));
  }
  // flipping the direction in case of the negative direction
  const xFlipped = p.x - initialPoint.x < 0;
  const yFlipped = p.y - initialPoint.y < 0;
  selectedObject.set('originX', xFlipped ? 'right' : 'left');
  selectedObject.set('originY', yFlipped ? 'bottom' : 'top');

  if (
    selectedObject instanceof fabric.Line &&
    !(selectedObject instanceof fabric.Arrow) &&
    !(selectedObject instanceof fabric.Measure)
  ) {
    selectedObject.set('flipX', xFlipped);
    selectedObject.set('flipY', yFlipped);
  }
}
