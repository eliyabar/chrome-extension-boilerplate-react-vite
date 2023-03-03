import {
  IEllipseOptions,
  IGroupOptions,
  ILineOptions,
  IRectOptions,
  Textbox,
} from 'fabric/fabric-impl';
import { fabric } from 'fabric';

export type ShapesArgs =
  | {
      name: 'rectangle';
      opt?: Pick<IRectOptions, 'left' | 'top' | 'strokeWidth' | 'stroke'>;
    }
  | {
      name: 'ellipse';
      opt?: Pick<IEllipseOptions, 'left' | 'top' | 'strokeWidth' | 'stroke'>;
    }
  | {
      name: 'line';
      opt?: Pick<
        ILineOptions,
        'left' | 'top' | 'strokeWidth' | 'stroke' | 'fill'
      > & { initialPoints?: number[] };
    }
  | {
      name: 'arrow';
      opt?: Pick<
        IGroupOptions,
        'left' | 'top' | 'strokeWidth' | 'stroke' | 'fill'
      > & { initialPoints?: number[] };
    }
  | {
      name: 'measure';
      opt?: Pick<
        IGroupOptions,
        'left' | 'top' | 'strokeWidth' | 'stroke' | 'fill'
      > & { initialPoints?: number[] };
    }
  | {
      name: 'text';
      opt?: Pick<Textbox, 'left' | 'top' | 'strokeWidth' | 'stroke' | 'fill'>;
    };
export const shapeFactory = (
  ctx: fabric.Canvas,
  postCreateFn?: (obj: fabric.Object) => void
) => ({
  create: ({ name, opt }: ShapesArgs) => {
    let object: fabric.Object;
    switch (name) {
      case 'ellipse':
        object = new fabric.Ellipse({
          ...opt,
          ...{ fill: 'transparent', rx: 0, ry: 0 },
        });
        break;
      case 'rectangle':
        object = new fabric.Rect({
          ...opt,
          ...{ fill: 'transparent', width: 1, height: 1 },
        });
        break;
      case 'line': {
        const { initialPoints, ...restOptions } = opt || {};
        //points: x1,y1,x2,y2
        object = new fabric.Line(initialPoints || [0, 0, 0, 0], {
          ...restOptions,
        });
        break;
      }
      case 'text': {
        object = new fabric.Textbox('Text', {
          ...opt,
          fontFamily: "'Inter',sans-serif",
          lockUniScaling: true,
        });
        // Text does not scale as any object
        object._controlsVisibility = {
          bl: true,
          br: true,
          mb: true,
          ml: true,
          mr: true,
          mt: true,
          tl: true,
          tr: true,
          mtr: true,
        };
        break;
      }
      case 'arrow': {
        const { initialPoints, ...restOptions } = opt || {};
        object = new fabric.Arrow(initialPoints, { ...restOptions });
        break;
      }
      case 'measure': {
        const { initialPoints, ...restOptions } = opt || {};
        object = new fabric.Measure(initialPoints, {
          strokeUniform: true,
          lockScalingX: true,
          lockScalingY: true,
          lockScalingFlip: true,
          ...restOptions,
          strokeWidth: 1,
          padding: 5,
        });
        object._controlsVisibility = {
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: false,
        };
        break;
      }
    }
    if (object && postCreateFn) {
      postCreateFn?.(object);
    }
  },
});
