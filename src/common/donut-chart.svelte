<script lang="ts">
  type Point = [number, number];

  const canvasSize = 328;
  const cornerRadius = canvasSize / 40;
  const innerToOuterRatio = 0.7;
  const outerRadius = canvasSize / 2;
  const innerRadius = outerRadius * innerToOuterRatio;

  export let segments: number[];
  const segmentsInDegrees = segmentsToDegrees(segments);
  const midpoints = calculateMidpoints(segmentsInDegrees);

  function segmentsToDegrees(segments: number[]) {
    return segments.map(segment => segment * (360 - segments.length));
  }

  function calculateMidpoints(segmentDegrees: number[]) {
    const midpoints = [0];
    for (let i = 1; i < segmentDegrees.length; ++i) {
      midpoints.push(midpoints[i - 1] + (segmentDegrees[i] + segmentDegrees[i - 1]) / 2 + 1);
    }
    return midpoints;
  }

  function toRadians(angle: number) {
    return angle * (Math.PI / 180);
  }

  function pointOnCircle(angle: number, radius: number, center: Point): Point {
    return [
      radius * Math.sin(toRadians(angle)) + center[0],
      radius * Math.cos(toRadians(angle)) + center[1],
    ];
  }

  function pointToSVGCanvas(point: Point, canvasSize: number): string {
    return `${point[0] + canvasSize / 2}, ${-point[1] + canvasSize / 2}`;
  }

  function buildDonutSegment(
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
    // A ${cornerRadius}, ${cornerRadius} 0 0 1 ${pointToSVGCanvas(outerArcEnd, canvasSize)}
    return `
      M ${pointToSVGCanvas(outerArcStart, canvasSize)}
      A ${outerRadius}, ${outerRadius} 0 ${+(length >= 180)} 1 ${pointToSVGCanvas(outerArcEnd, canvasSize)}
      L ${pointToSVGCanvas(innerArcEnd, canvasSize)}
      A ${innerRadius}, ${innerRadius} 0 ${+(length >= 180)} 0 ${pointToSVGCanvas(innerArcStart, canvasSize)}
      Z
    `.trim();
  }
</script>

<div class="donut">
  <svg width="100%" height="100%" viewBox="0 0 {canvasSize} {canvasSize}">
    {#each segmentsInDegrees as segment, index}
      <path
        d={buildDonutSegment(midpoints[index], segment, outerRadius, innerRadius, canvasSize)}
        stroke="#000"
        fill="transparent"
      />
    {/each}
    <!-- <circle class="donut-hole" cx="20" cy="20" r="15.91549430918954" fill="#fff"></circle>
    <circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
    <circle class="donut-segment donut-segment-2" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5" stroke-dasharray="69 31" stroke-dashoffset="25"></circle>
    <g class="donut-text donut-text-1">
      <text y="50%" transform="translate(0, 2)">
        <tspan x="50%" text-anchor="middle" class="donut-percent">69%</tspan>
      </text>
      <text y="60%" transform="translate(0, 2)">
        <tspan x="50%" text-anchor="middle" class="donut-data">3450 widgets</tspan>
      </text>
    </g> -->
  </svg>
</div>
