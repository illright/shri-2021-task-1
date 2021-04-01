/** A point in a Cartesian plane. */
class Point {
  /** The point's X-coordinate. */
  x: number;
  /** The point's Y-coordinate. */
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  };

  /** Return a string representation suitable for embedding into a SVG path script. */
  toString() {
    return `${this.x}, ${this.y}`;
  }

  /**
   * Convert a point from a regular coordinate system
   * (Ox left-to-right, Oy bottom-to-top, origin in the middle)
   * to the one used by the SVG (Ox left-to-right, Oy top-to-bottom, origin in the top left).
   *
   * @param canvasSize The size of the SVG viewBox (assumed that it is square).
   * @return A new point in the converted coordinate system.
   */
  toCanvas(canvasSize: number) {
    return new Point(this.x + canvasSize / 2, -this.y + canvasSize / 2);
  }

  /**
   * Convert a point from a Cartesian coordinate system
   * to a polar coordinate system (angles counterclockwise from Ox).
   */
  toPolar() {
    return new PolarPoint(
      Math.atan2(this.y, this.x),
      Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)),
    );
  }

  /**
   * Rotate a point about the origin counter-clockwise.
   *
   * @param angleDeg The angle of rotation in degrees.
   * @return A new rotated point.
   */
  rotate(angleDeg: number) {
    const sine = Math.sin(toRadians(angleDeg));
    const cosine = Math.cos(toRadians(angleDeg));

    return new Point(
      this.x * cosine - this.y * sine,
      this.x * sine + this.y * cosine,
    );
  }
}

/** A point in a polar plane. */
class PolarPoint {
  /** The point's angle in radians counterclockwise from Ox. */
  phi: number;
  /** The point's distance from the origin. */
  r: number;

  constructor(phi: number, r: number) {
    this.phi = phi;
    this.r = r;
  }

  /** Convert a point from a polar plane to a Cartesian one. */
  toCartesian() {
    return new Point(this.r * Math.cos(this.phi), this.r * Math.sin(this.phi));
  }
}

/**
 * Rescale an array so that every element is from 0 to 1.
 *
 * @param array An array of numbers to rescale.
 * @return A new array with each element rescaled from 0 to 1.
 */
export function rescale(array: number[]) {
  const sum = array.reduce((a, b) => a + b, 0);
  return array.map(element => element / sum);
}

/**
 * Compute the length of each segment in degrees, leaving a 1deg gap between.
 *
 * @param segments An array of segments, represented as fractions between 0 and 1.
 * @return An array of lengths of those segments in degrees.
 */
export function segmentsToDegrees(segments: number[]) {
  return segments.map(segment => segment * (360 - segments.length));
}

/**
 * Compute the degree offsets midpoints of segments given as lengths in degrees
 * when laying them out in order, clockwise, placing the midpoint of the first segment at the
 * top of the circle.
 *
 * @param segmentDegrees The lengths of segments to lay out on the circle.
 * @return An array of degree offsets from the top of the circle for each segment.
 */
export function calculateMidpoints(segmentDegrees: number[]) {
  const midpoints = [0];
  for (let i = 1; i < segmentDegrees.length; ++i) {
    midpoints.push(midpoints[i - 1] + (segmentDegrees[i] + segmentDegrees[i - 1]) / 2 + 1);
  }
  return midpoints;
}

/** Convert an angle from degrees to radians. */
export function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

/**
 * Generate a path script to draw a donut chart segment.
 *
 * @param position The degree offset of the midpoint of that segment on the circle from the top, clockwise.
 * @param length The length of the segment in degrees.
 * @param outerRadius The radius of the outer circle.
 * @param innerRadius The radius of the inner circle.
 * @param cornerRadius The radius of the the rounded corners.
 * @param canvasSize The canvas size (needed for centering the chart).
 * @return A path script (for <path d="...">) as a string.
 */
export function buildDonutSegment(
  position: number,
  length: number,
  outerRadius: number,
  innerRadius: number,
  cornerRadius: number,
  canvasSize: number,
) {
  const outerArcStart = new PolarPoint(Math.PI / 2 - toRadians(position - length / 2), outerRadius);
  const [outerArcStartCurveStart, outerArcStartCurveEnd] = curveCorner(
    outerArcStart,
    cornerRadius,
    { curveOutside: false, clockwise: true },
  );
  const outerArcEnd = new PolarPoint(Math.PI / 2 - toRadians(position + length / 2), outerRadius);
  const [outerArcEndCurveStart, outerArcEndCurveEnd] = curveCorner(
    outerArcEnd,
    cornerRadius,
    { curveOutside: false, clockwise: false },
  );
  const innerArcStart = new PolarPoint(Math.PI / 2 - toRadians(position - length / 2), innerRadius);
  const [innerArcStartCurveStart, innerArcStartCurveEnd] = curveCorner(
    innerArcStart,
    cornerRadius,
    { curveOutside: true, clockwise: true },
  );
  const innerArcEnd = new PolarPoint(Math.PI / 2 - toRadians(position + length / 2), innerRadius);
  const [innerArcEndCurveStart, innerArcEndCurveEnd] = curveCorner(
    innerArcEnd,
    cornerRadius,
    { curveOutside: true, clockwise: false },
  );
  const takeLargerArc = +(outerArcStart.phi - outerArcEnd.phi >= Math.PI);

  return {
    script: `
      M ${outerArcStartCurveStart.toCartesian().toCanvas(canvasSize)}
      A ${cornerRadius} ${cornerRadius} 0 0 1 ${outerArcStartCurveEnd.toCartesian().toCanvas(canvasSize)}
      A ${outerRadius}, ${outerRadius} 0 ${takeLargerArc} 1 ${outerArcEndCurveEnd.toCartesian().toCanvas(canvasSize)}
      A ${cornerRadius} ${cornerRadius} 0 0 1 ${outerArcEndCurveStart.toCartesian().toCanvas(canvasSize)}
      L ${innerArcEndCurveStart.toCartesian().toCanvas(canvasSize)}
      A ${cornerRadius} ${cornerRadius} 0 0 1 ${innerArcEndCurveEnd.toCartesian().toCanvas(canvasSize)}
      A ${innerRadius}, ${innerRadius} 0 ${takeLargerArc} 0 ${innerArcStartCurveEnd.toCartesian().toCanvas(canvasSize)}
      A ${cornerRadius} ${cornerRadius} 0 0 1 ${innerArcStartCurveStart.toCartesian().toCanvas(canvasSize)}
      Z
    `.trim().replace(/\n\s+/g, ' '),
  }
}

/** See `curveCorner` for the description of the parameters. */
interface CurveCornerOptions {
  curveOutside: boolean;
  clockwise: boolean;
}

/**
 * Curve a corner between a straight line and an arc.
 *
 * @param cornerPoint The polar point of the sharp corner to be curved.
 * @param curvatureRadius The radius of the curved corner.
 * @param curveCornerOptions Additional parameters of curving.
 * @param curveCornerOptions.curveOutside Whether the curve should go outwards from the center.
 * @param curveCornerOptions.clockwise Whether the curve should go clockwise.
 */
function curveCorner(
  cornerPoint: PolarPoint,
  curvatureRadius: number,
  { curveOutside, clockwise }: CurveCornerOptions,
) {
  const distanceToCurveCenter = cornerPoint.r + falseToNegative(curveOutside) * curvatureRadius;
  const cornerToCurveCenterAngle = Math.atan2(curvatureRadius, distanceToCurveCenter);
  const contactWithLine = new PolarPoint(
    cornerPoint.phi,
    curvatureRadius / Math.sin(cornerToCurveCenterAngle),
  );
  const contactWithCurve = new PolarPoint(
    cornerPoint.phi - falseToNegative(clockwise) * cornerToCurveCenterAngle,
    cornerPoint.r,
  );

  return [contactWithLine, contactWithCurve];
}

/** Return -1 for false and 1 for true. */
function falseToNegative(value: boolean) {
  if (value) {
    return 1;
  }
  return -1;
}
