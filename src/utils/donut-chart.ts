import { computeMinMax } from './activity';

type Point = [number, number];

export function rescale(segments: number[]) {
  const sum = segments.reduce((a, b) => a + b, 0);
  return segments.map(segment => segment / sum);
}

export function segmentsToDegrees(segments: number[]) {
  return segments.map(segment => segment * (360 - segments.length));
}

export function calculateMidpoints(segmentDegrees: number[]) {
  const midpoints = [0];
  for (let i = 1; i < segmentDegrees.length; ++i) {
    midpoints.push(midpoints[i - 1] + (segmentDegrees[i] + segmentDegrees[i - 1]) / 2 + 1);
  }
  return midpoints;
}

export function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

export function pointOnCircle(angle: number, radius: number, center: Point): Point {
  return [
    radius * Math.sin(toRadians(angle)) + center[0],
    radius * Math.cos(toRadians(angle)) + center[1],
  ];
}

export function pointToSVGCanvas(point: Point, canvasSize: number): string {
  return `${point[0] + canvasSize / 2}, ${-point[1] + canvasSize / 2}`;
}

export function buildDonutSegment(
  position: number,
  length: number,
  outerRadius: number,
  innerRadius: number,
  canvasSize: number,
) {
  const canvasCenter: Point = [0, 0];
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
      M ${pointToSVGCanvas(outerArcStart, canvasSize)}
      A ${outerRadius}, ${outerRadius} 0 ${+(length >= 180)} 1 ${pointToSVGCanvas(outerArcEnd, canvasSize)}
      L ${pointToSVGCanvas(innerArcEnd, canvasSize)}
      A ${innerRadius}, ${innerRadius} 0 ${+(length >= 180)} 0 ${pointToSVGCanvas(innerArcStart, canvasSize)}
      Z
    `.trim(),
    bounds: {
      // TODO: fill in
    }
  }
}
