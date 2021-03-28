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
 * Return the coordinates of a point when placed on a circle of a given `center` and `radius`
 * at `angle` degrees from the top, clockwise.
 *
 * @param angle The angle offset of the point from the top of the circle, going clockwise, in degrees.
 * @param radius The radius of the circle.
 * @param center The center point of the circle.
 * @return A `Point` object placed on the circle.
 */
export function pointOnCircle(angle: number, radius: number, center: Point): Point {
  return new Point(
    radius * Math.sin(toRadians(angle)) + center.x,
    radius * Math.cos(toRadians(angle)) + center.y,
  );
}

/**
 * Generate a path script to draw a donut chart segment.
 *
 * @param position The degree offset of the midpoint of that segment on the circle from the top, clockwise.
 * @param length The length of the segment in degrees.
 * @param outerRadius The radius of the outer circle.
 * @param outerRadius The radius of the inner circle.
 * @param outerRadius The canvas size (needed for centering the chart).
 * @return A path script (for <path d="...">) as a string.
 */
export function buildDonutSegment(
  position: number,
  length: number,
  outerRadius: number,
  innerRadius: number,
  canvasSize: number,
) {
  const canvasCenter = new Point(0, 0);
  const outerArcStart = pointOnCircle(position - length / 2, outerRadius, canvasCenter);
  // const outerArcStartCurveStart = pointOnCircle(180 - position - length / 2, cornerRadius, outerArcStart);
  // const outerArcStartCurveEnd = pointOnCircle(90 - position - length / 2, cornerRadius, outerArcStart);
  const outerArcEnd = pointOnCircle(position + length / 2, outerRadius, canvasCenter);
  // const outerArcEndCurveStart = pointOnCircle(180 + position + length / 2, cornerRadius, outerArcEnd);
  // const outerArcEndCurveEnd = pointOnCircle(position + length / 2 - 90, cornerRadius, outerArcEnd);
  const innerArcStart = pointOnCircle(position - length / 2, innerRadius, canvasCenter);
  const innerArcEnd = pointOnCircle(position + length / 2, innerRadius, canvasCenter);

  return {
    script: `
      M ${outerArcStart.toCanvas(canvasSize)}
      A ${outerRadius}, ${outerRadius} 0 ${+(length >= 180)} 1 ${outerArcEnd.toCanvas(canvasSize)}
      L ${innerArcEnd.toCanvas(canvasSize)}
      A ${innerRadius}, ${innerRadius} 0 ${+(length >= 180)} 0 ${innerArcStart.toCanvas(canvasSize)}
      Z
    `.trim().replace(/\n\s+/g, ' '),
    bounds: computeBounds(outerArcStart, outerArcEnd, innerArcStart, innerArcEnd, canvasSize),
  }
}

function computeBounds(s1: Point, f1: Point, s2: Point, f2: Point, canvasSize: number) {
  let rotation: 0 | 90 | 180 | 270;
  if (s1.x >= 0) {
    if (s1.y >= 0) {
      rotation = 0;
    } else {
      rotation = 90;
    }
  } else {
    if (s1.y <= 0) {
      rotation = 180;
    } else {
      rotation = 270;
    }
  }

  s1 = s1.rotate(rotation);
  f1 = f1.rotate(rotation);
  s2 = s2.rotate(rotation);
  f2 = f2.rotate(rotation);
  let topLeft: Point, bottomRight: Point;
  topLeft = s1;
  bottomRight = f1;
  if (f1.x >= 0) {
    if (f1.y >= 0) {
      topLeft = new Point(s2.x, s1.y);
      bottomRight = new Point(f1.x, f2.y);
    } else {
      topLeft = new Point(Math.min(s2.x, f2.x), s1.y);
      bottomRight = new Point(canvasSize / 2, f1.y);
    }
  } else {
    if (f1.y <= 0) {
      topLeft = new Point(f1.x, s1.y);
      bottomRight = new Point(canvasSize / 2, -canvasSize / 2);
    } else {
      topLeft = new Point(-canvasSize / 2, Math.max(s1.y, f1.y));
      bottomRight = new Point(canvasSize / 2, -canvasSize / 2);
    }
  }

  [topLeft, bottomRight] = rotateRect([topLeft, bottomRight], rotation);
  const bottomLeft = topLeft.toCanvas(canvasSize);
  const topRight = bottomRight.toCanvas(canvasSize);
  return {
    x: bottomLeft.x,
    y: bottomLeft.y,
    width: topRight.x - bottomLeft.x,
    height: topRight.y - bottomLeft.y,
  };
}

type Rectangle = [Point, Point];

function rotateRect([topLeft, bottomRight]: Rectangle, rotation: 0 | 90 | 180 | 270): Rectangle {
  topLeft = topLeft.rotate(-rotation);
  bottomRight = bottomRight.rotate(-rotation);
  if (rotation === 0) {
    return [topLeft, bottomRight];
  } else if (rotation === 90) {
    return [
      new Point(bottomRight.x, topLeft.y),
      new Point(topLeft.x, bottomRight.y),
    ]
  } else if (rotation === 180) {
    return [bottomRight, topLeft];
  } else {
    return [
      new Point(topLeft.x, bottomRight.y),
      new Point(bottomRight.x, topLeft.y),
    ];
  }
}
