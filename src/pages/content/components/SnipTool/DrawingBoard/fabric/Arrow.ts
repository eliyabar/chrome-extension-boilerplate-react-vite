import { fabric } from 'fabric';
import { ILineOptions } from 'fabric/fabric-impl';

const ArrowClass = fabric.util.createClass(fabric.Line, {
  type: 'arrow',

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
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate(xDiff / 2, yDiff / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-20, -15);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();
    ctx.restore();
  },
});
ArrowClass.fromObject = function (
  object: fabric.Arrow,
  callback: (object: fabric.Arrow) => void
) {
  callback &&
    callback(
      new fabric.Arrow(
        [object?.x1 || 0, object?.y1 || 0, object?.x2 || 0, object?.y2 || 0],
        object
      )
    );
};
export default ArrowClass;
