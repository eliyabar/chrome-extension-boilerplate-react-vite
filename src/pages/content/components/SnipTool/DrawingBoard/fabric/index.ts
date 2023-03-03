import { fabric } from 'fabric';
import Arrow from './Arrow';
import Measure from './Measure';

// Fabric module augmentation

// Add new Shapes to fabric
fabric.Arrow = Arrow;
fabric.Measure = Measure;
// end

// Set default props when object are recreated via deserialization.
fabric.Object.prototype.set({
  cornerStyle: 'circle',
  strokeUniform: true,
  _controlsVisibility: {
    bl: true,
    br: true,
    mb: false,
    ml: false,
    mr: false,
    mt: false,
    tl: true,
    tr: true,
    mtr: true,
  },
});

fabric.Measure.prototype.set({
  strokeWidth: 1,
  padding: 5,
  strokeUniform: true,
  lockScalingX: true,
  lockScalingY: true,
  lockScalingFlip: true,
  _controlsVisibility: {
    bl: false,
    br: false,
    mb: false,
    ml: false,
    mr: false,
    mt: false,
    tl: false,
    tr: false,
    mtr: false,
  },
});
// end

// Add 2d context methods
declare global {
  interface CanvasRenderingContext2D {
    roundRect(
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ): void;
  }
}
CanvasRenderingContext2D.prototype.roundRect = function (
  x,
  y,
  width,
  height,
  radius
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};
// end

declare module 'fabric' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace fabric {
    export class Arrow extends fabric.Line {}
    export class Measure extends fabric.Line {}
  }
}
//end
