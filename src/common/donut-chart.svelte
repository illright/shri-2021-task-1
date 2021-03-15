<script lang="ts">
  type Point = [number, number];

  const canvasSize = 328;
  // const cornerRadius = canvasSize / 40;
  const innerToOuterRatio = 0.7;
  const outerRadius = canvasSize / 2;
  const innerRadius = outerRadius * innerToOuterRatio;

  export let totalText: string;
  export let differenceText: string;
  export let segments: number[];
  const segmentsInDegrees = segmentsToDegrees(rescale(segments));
  const midpoints = calculateMidpoints(segmentsInDegrees);

  function rescale(segments: number[]) {
    const sum = segments.reduce((a, b) => a + b, 0);
    return segments.map(segment => segment / sum);
  }

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
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 {canvasSize} {canvasSize}"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each segmentsInDegrees as segment, index}
      <g> <!-- filter="url(#filter{index}_ii)" -->
        <path
          d={buildDonutSegment(midpoints[index], segment, outerRadius, innerRadius, canvasSize)}
          fill="url(#paint0_radial)"
          fill-opacity="0.8"
        />
      </g>
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
    <defs>
      <filter id="filter0_ii" x="163.523" y="18.578" width="76.477" height="108.58" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.4 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="1"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
      </filter>
      <filter id="filter1_ii" x="-1" y="18.7155" width="78.715" height="205.518" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.5125 0 0 0 0 0.5125 0 0 0 0 0.5125 0 0 0 0.6 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="1"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
      </filter>
      <filter id="filter2_ii" x="66.2309" y="126.356" width="172.936" height="114.644" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.4125 0 0 0 0 0.4125 0 0 0 0 0.4125 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="1"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
      </filter>
      <filter id="filter3_ii" x="62.4636" y="0" width="113.799" height="45.623" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.9 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="1"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
      </filter>
      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(119.624 120.376) rotate(90) scale(119.624)">
        <stop offset="0.8125" stop-color="#FFB800" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#FFEF99" stop-opacity="0.2"/>
      </radialGradient>
      <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(119.624 120.376) rotate(90) scale(119.624)">
        <stop offset="0.828125" stop-color="#BFBFBF" stop-opacity="0.69"/>
        <stop offset="0.921875" stop-color="#E4E4E4" stop-opacity="0.2"/>
      </radialGradient>
      <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(119.624 120.376) rotate(90) scale(119.624)">
        <stop offset="0.828125" stop-color="#A6A6A6" stop-opacity="0.69"/>
        <stop offset="0.921875" stop-color="#CBCBCB" stop-opacity="0.2"/>
      </radialGradient>
      <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(119.624 120.376) rotate(90) scale(119.624)">
        <stop offset="0.8125" stop-color="#FFB800" stop-opacity="0.7"/>
        <stop offset="1" stop-color="#FFEF99" stop-opacity="0.4"/>
      </radialGradient>
    </defs>
  </svg>
  <div class="description">
    <span class="headline">{totalText}</span>
    <span class="subhead subtle">{differenceText}</span>
  </div>
</div>

<style lang="scss">
  .donut {
    position: relative;
    margin-bottom: 1em;

    @media (orientation: landscape) {
      margin-right: 2.5em;
      margin-bottom: 0;
    }
  }

  svg {
    display: block;

    @media (orientation: landscape) {
      width: 15em;
      height: 15em;
    }
  }

  .description {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    .headline, .subhead {
      width: 164px;
    }

    .subhead {
      margin-top: 8px;
    }

    @media (orientation: landscape) {
      .headline, .subhead {
        width: 120px;
      }

      .headline {
        font-size: 20px;
      	line-height: 22px;
      }

      .subhead {
        font-weight: 500;
      	font-size: 16px;
      	line-height: 18px;
        margin-top: 6px;
      }
    }
  }
</style>
