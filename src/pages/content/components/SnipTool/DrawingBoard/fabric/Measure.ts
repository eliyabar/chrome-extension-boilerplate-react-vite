import { fabric } from 'fabric';
import { ILineOptions } from 'fabric/fabric-impl';

const BRIGHT_TEXT = '#FFFFFF';
const DARK_TEXT = '#171B2C';

const textColor: Record<string, string> = {
  '#FFFFFF': DARK_TEXT,
  '#171B2C': BRIGHT_TEXT,
  '#97F899': DARK_TEXT,
  '#DE3730': BRIGHT_TEXT,
  '#FF5449': BRIGHT_TEXT,
  '#416AFA': BRIGHT_TEXT,
  '#FFDB50': DARK_TEXT,
  '#8C49FF': BRIGHT_TEXT,
  '#C8C6CA': DARK_TEXT,
};

const MeasureClass = fabric.util.createClass(fabric.Line, {
  type: 'measure',

  initialize: function (points?: number[], objObjects?: ILineOptions) {
    this.callSuper('initialize', points, objObjects);
  },

  toObject: function (propertiesToInclude?: string[]) {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.type,
    });
  },
  _render: function (ctx: CanvasRenderingContext2D) {
    this.callSuper('_render', ctx);
    // do not render if width/height are zeros or object is not visible
    if (!this.visible) return;
    ctx.save();
    const length = Math.round(Math.abs(this.x1 - this.x2 || this.y1 - this.y2));
    ctx.strokeStyle = this.stroke;
    ctx.fillStyle = this.stroke;
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate(-xDiff / 2, -yDiff / 2);
    ctx.rotate(angle);
    // draw start notch
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.stroke();
    // draw end notch
    ctx.beginPath();
    ctx.moveTo(length, -5);
    ctx.lineTo(length, 5);
    ctx.stroke();
    ctx.restore();

    const deg = Math.abs(angle * (180 / Math.PI));
    // Measure cannot be diagonal, only referring to 0/180 deg
    // Add label
    if (deg === 0 || deg === 180) {
      ctx.roundRect(
        -6 - length.toString().length * 3,
        5,
        19 + length.toString().length * 4.5,
        14,
        3
      );
    } else {
      ctx.roundRect(8, -7, 19 + length.toString().length * 4.5, 14, 3);
    }
    ctx.strokeStyle = this.stroke;
    ctx.fillStyle = this.stroke;
    ctx.fill();
    ctx.stroke();
    // Add label text
    ctx.font = '10px Inter';
    ctx.fillStyle = textColor?.[this.stroke] || '#FFFFFF';
    if (deg === 0 || deg === 180) {
      ctx.fillText(`${length}px`, -5 - length.toString().length * 3, 15);
    } else {
      ctx.fillText(`${length}px`, 9, 4);
    }
  },
});
MeasureClass.fromObject = function (
  object: fabric.Measure,
  callback: (object: fabric.Measure) => void
) {
  callback &&
    callback(
      new fabric.Measure(
        [object?.x1 || 0, object?.y1 || 0, object?.x2 || 0, object?.y2 || 0],
        object
      )
    );
};
export default MeasureClass;
