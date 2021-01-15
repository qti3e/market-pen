export type Point2D = { x: number; y: number };

export class Spline {
  private cache?: Readonly<Int16Array>;
  readonly points: ReadonlyArray<Readonly<Point2D>>;

  constructor(...points: ReadonlyArray<Readonly<Point2D>>) {
    this.points = points.slice();
  }

  getPath(): Readonly<Int16Array> {
    if (this.cache) return this.cache;

    const { points } = this;
    const tension = 0.25;
    const pLen = points.length;

    // If we only have one point, there is nothing we can do.
    if (pLen < 2) return (this.cache = new Int16Array([2]));

    // If we only have two points, we can only draw a straight line.
    if (pLen == 2) {
      return (this.cache = new Int16Array([
        4, // moveTo followed by a lineTo.
        points[0].x,
        points[0].y,
        points[1].x,
        points[1].y,
        2, // end.
      ]));
    }

    // For each interior point, we need to calculate the tangent and pick
    // two points on it that'll serve as control points for curves to and
    // from the point.
    const cpoints: {
      cp?: Point2D; // previous control point.
      cn?: Point2D; // next control point.
    }[] = new Array(pLen);

    for (let i = 1; i < pLen - 1; ++i) {
      const pi = points[i]; // current point.
      const pp = points[i - 1]; // previous point.
      const pn = points[i + 1]; // next point.

      // First, we calculate the normalized tangent slope vector (dx,dy).
      // We intentionally don't work with the derivative so we don't have
      // to handle the vertical line edge cases separately.

      const rdx = pn.x - pp.x; // actual delta-x between previous and next points.
      const rdy = pn.y - pp.y; // actual delta-y between previous and next points.
      const rd = h(rdx, rdy); // actual distance between previous and next points.
      const dx = rdx / rd; // normalized delta-x (so the total distance is 1).
      const dy = rdy / rd; // normalized delta-y (so the total distance is 1).

      // Next we calculate distances to previous and next points, so we
      // know how far out to put the control points on the tangents (tension).

      const dp = h(pi.x - pp.x, pi.y - pp.y); // distance to previous point.
      const dn = h(pi.x - pn.x, pi.y - pn.y); // distance to next point.

      // Now we can calculate control points. Previous control point is
      // located on the tangent of the curve, with the distance between it
      // and the current point being a fraction of the distance between the
      // current point and the previous point. Analogous to next point.

      const cpx = pi.x - dx * dp * tension;
      const cpy = pi.y - dy * dp * tension;
      const cnx = pi.x + dx * dn * tension;
      const cny = pi.y + dy * dn * tension;

      cpoints[i] = {
        cp: { x: cpx, y: cpy },
        cn: { x: cnx, y: cny },
      };
    }

    // For the end points, we only need to calculate one control point.
    // Picking a point in the middle between the endpoint and the other's
    // control point seems to work well.

    cpoints[0] = {
      cn: {
        x: (points[0].x + cpoints[1].cp!.x) / 2,
        y: (points[0].y + cpoints[1].cp!.y) / 2,
      },
    };

    cpoints[pLen - 1] = {
      cp: {
        x: (points[pLen - 1].x + cpoints[pLen - 2].cn!.x) / 2,
        y: (points[pLen - 1].y + cpoints[pLen - 2].cn!.y) / 2,
      },
    };

    // 10 = 9 for the first and curve and 1 for the end (`2`).
    const path = new Int16Array(10 + (pLen - 2) * 7);

    path[0] = 1; // moveTo and then bezierCurveTo.
    // line.
    path[1] = points[0].x;
    path[2] = points[0].y;
    // curve.
    path[3] = cpoints[0].cn!.x;
    path[4] = cpoints[0].cn!.y;
    path[5] = cpoints[1].cp!.x;
    path[6] = cpoints[1].cp!.y;
    path[7] = points[1].x;
    path[8] = points[1].y;

    let j = 9;
    for (let i = 2; i < pLen; ++i) {
      const p = points[i];
      const cp = cpoints[i];
      const cpp = cpoints[i - 1];

      // Each bezier curve uses the "next control point" of first point
      // point, and "previous control point" of second point.
      path[j++] = 0; // bezierCurveTo.
      path[j++] = cpp.cn!.x;
      path[j++] = cpp.cn!.y;
      path[j++] = cp.cp!.x;
      path[j++] = cp.cp!.y;
      path[j++] = p.x;
      path[j++] = p.y;
    }
    path[j] = 2; // end.

    return (this.cache = path);
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1, lineWidth = 3) {
    const path = this.getPath();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    loop: for (let i = 0; ; ) {
      console.log('xxx');
      const m = path[i++];
      switch (m) {
        // moveTo followed by a bezierCurveTo
        case 1:
          ctx.moveTo(path[i++] * scale + x, path[i++] * scale + y);
        // A single bezierCurveTo
        case 0:
          ctx.bezierCurveTo(
            path[i++] * scale + x,
            path[i++] * scale + y,
            path[i++] * scale + x,
            path[i++] * scale + y,
            path[i++] * scale + x,
            path[i++] * scale + y
          );
          break;
        // moveTo followed by a lineTo
        case 4:
          ctx.moveTo(path[i++] * scale + x, path[i++] * scale + y);
        // Just a lineTo
        case 3:
          ctx.lineTo(path[i++] * scale + x, path[i++] * scale + y);
          break;
        // End of the path.
        case 2:
          break loop;
        default:
          throw new Error('Invalid Path.');
      }
    }
    ctx.stroke();
    ctx.closePath();
  }
}

// Helper function to calculate the hypotenuse.
function h(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
