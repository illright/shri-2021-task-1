<script lang="ts">
  import SVGShadows from './svg-shadows.svelte';
  import {
    buildDonutSegment,
    calculateMidpoints,
    rescale,
    segmentsToDegrees,
  } from '../utils/donut-chart';
  import type { Shadow } from './shadow';

  const canvasSize = 328;
  const cornerRadius = 6;
  const innerToOuterRatio = 0.7;
  const outerRadius = canvasSize / 2;
  const innerRadius = outerRadius * innerToOuterRatio;

  export let totalText: string;
  export let differenceText: string;
  export let data: number[];
  export let theme: 'light' | 'dark' = 'light';

  const lengths = segmentsToDegrees(rescale(data));
  const midpoints = calculateMidpoints(lengths);
  const segments = midpoints.map(
    (midpoint, index) => buildDonutSegment(
      midpoint, lengths[index], outerRadius, innerRadius, cornerRadius, canvasSize
    )
  );

  interface GradientStop {
    offset: number;
    color: string;
    opacity: number;
  }

  const gradients: Record<string, GradientStop[]> = {
    'light-0': [
      { offset: 0.8125, color: '#FFB800', opacity: 0.56 },
      { offset: 1, color: '#FFEF99', opacity: 0.32 },
    ],
    'light-1': [
      { offset: 0.8125, color: '#FFB800', opacity: 0.24 },
      { offset: 1, color: '#FFEF99', opacity: 0.12 },
    ],
    'light-2': [
      { offset: 0.8281, color: '#A6A6A6', opacity: 0.1725 },
      { offset: 0.9219, color: '#CBCBCB', opacity: 0.05 },
    ],
    'light-3': [
      { offset: 0.8281, color: '#BFBFBF', opacity: 0.345 },
      { offset: 0.9219, color: '#E4E4E4', opacity: 0.1 },
    ],
    'dark-0': [
      { offset: 0.7188, color: '#FFA300', opacity: 0.8 },
      { offset: 1, color: '#5B3A00', opacity: 0.8 },
    ],
    'dark-1': [
      { offset: 0.7292, color: '#633F00', opacity: 0.5 },
      { offset: 1, color: '#0F0900', opacity: 0.5 },
    ],
    'dark-2': [
      { offset: 0.7188, color: '#9B9B9B', opacity: 0.5 },
      { offset: 1, color: '#382900', opacity: 0.5 },
    ],
    'dark-3': [
      { offset: 0.7188, color: '#4D4D4D', opacity: 0.5 },
      { offset: 1, color: '#382900', opacity: 0.5 },
    ],
  };

  const shadowFilters: Record<string, Shadow[]> = {
    'light-0': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#FFB039', opacity: 0.9 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
    ],
    'light-1': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#FFB039', opacity: 0.4 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
    ],
    'light-2': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#696969', opacity: 0.2 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
    ],
    'light-3': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#838383', opacity: 0.6 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
    ],
    'dark-0': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#FFA200', opacity: 0.9 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
      { inset: false, x: 0, y: 0, blur: 20, spread: -8, color: '#F89E00', opacity: 0.2 },
    ],
    'dark-1': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#CA8100', opacity: 0.9 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
      { inset: false, x: 0, y: 0, blur: 20, spread: -8, color: '#935D00', opacity: 0.2 },
    ],
    'dark-2': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#8B8B8B', opacity: 0.9 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
      { inset: false, x: 0, y: 0, blur: 20, spread: -8, color: '#000000', opacity: 0.2 },
    ],
    'dark-3': [
      { inset: true, x: 0, y: 0, blur: 20, color: '#262626', opacity: 0.9 },
      { inset: true, x: -1, y: 1, blur: 1, color: '#FFFFFF', opacity: 0.5 },
      { inset: false, x: 0, y: 0, blur: 20, spread: -8, color: '#606060', opacity: 0.2 },
    ],
  };
</script>

<div class="donut {theme}-only">
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 {canvasSize} {canvasSize}"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#each segments as segment, index}
      <g filter="url(#shadow-{theme}-{index})">
        <path
          d={segment.script}
          fill="url(#fill-{theme}-{index})"
          fill-opacity="0.8"
        />
      </g>
    {/each}

    <defs>
      {#each segments as _segment, index}
        <SVGShadows id="shadow-{theme}-{index}" shadows={shadowFilters[`${theme}-${index}`]} />
      {/each}
      {#each segments as _segment, index}
        <radialGradient
          xmlns="http://www.w3.org/2000/svg"
          id="fill-{theme}-{index}"
          cx={canvasSize / 2}
          cy={canvasSize / 2}
          r={canvasSize / 2}
          gradientUnits="userSpaceOnUse"
        >
          {#each gradients[`${theme}-${index}`] as stop}
            <stop
              offset={stop.offset}
              stop-color={stop.color}
              stop-opacity={stop.opacity}
            />
          {/each}
        </radialGradient>
      {/each}
    </defs>
  </svg>
  <div class="description">
    <span class="headline">{totalText}</span>
    <span class="subhead subtle">{differenceText}</span>
  </div>
</div>

<style lang="scss">
  @use 'sass:map';
  @use '../styles/mixins.scss';
  @use '../styles/screens.scss';
  @use '../styles/queries.scss';
  @use '../styles/units.scss';

  .donut {
    position: relative;
    margin-bottom: 1em;

    @media (orientation: landscape) {
      margin-right: 2.5em;
      margin-bottom: 0;
    }

    @media #{queries.landscape(screens.$desktop-l)} {
      margin-right: 5em;
    }
  }

  svg {
    display: block;

    @media (orientation: landscape) and (max-width: map.get(screens.$ipad, "width") - units.em(1px)) {
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

      @media #{queries.portrait(screens.$ipad)}, #{queries.landscape(screens.$ipad)} {
        width: 50%;
      }
    }

    .subhead {
      margin-top: 8px;
    }

    @media (orientation: landscape) and (max-width: map.get(screens.$ipad, "width") - units.em(1px)) {
      .headline, .subhead {
        width: 120px;
      }

      .headline {
        @include mixins.font-size(20px);
      }

      .subhead {
        @include mixins.font-size(16px);

        font-weight: 500;
        margin-top: 6px;
      }
    }

    @media #{queries.landscape(screens.$ipad)} {
      .headline {
        @include mixins.font-size(26px);
      }

      .subhead {
        @include mixins.font-size(22px);
      }
    }

    @media #{queries.landscape(screens.$desktop-l)} {
      .headline {
        @include mixins.font-size(36px);
      }

      .subhead {
        @include mixins.font-size(28px);
      }
    }
  }
</style>
