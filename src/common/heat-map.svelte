<script lang="ts">
  import type { Interval } from '../utils/activity';

  export let data: number[];
  export let intervals: Interval[];
  export let isPortrait: boolean;

  const barHeights = ['min', 'mid', 'max', 'extra'];
  function determineInterval(value: number, intervals: Interval[]) {
    for (let intervalIdx = 0; intervalIdx < intervals.length; ++intervalIdx) {
      if (value < intervals[intervalIdx][1]) {
        return intervalIdx;
      }
    }
  }
</script>

<div class="heat-map" class:portrait={isPortrait}>
  {#each data as hour}
    <div class="image-wrapper">
      <img
        src="images/{barHeights[determineInterval(hour, intervals)]}-light.svg"
        alt="{hour} коммитов"
        class="light-only"
      />
      <img
        src="images/{barHeights[determineInterval(hour, intervals)]}-dark.svg"
        alt="{hour} коммитов"
        class="dark-only"
      />
    </div>
  {/each}
</div>

<style lang="scss">
  $portrait-bar-size: 43.73px;
  $landscape-bar-size: 34px;
  $portrait-bar-height: $portrait-bar-size - 33.44px;
  $landscape-bar-height: $landscape-bar-size - 26px;
  $portrait-columns: 7;
  $landscape-columns: 12;

  .heat-map {
    display: grid;

    &.portrait {
      padding: ($portrait-bar-size - $portrait-bar-height) / 2
               $portrait-bar-size / 2
               $portrait-bar-height;
      column-gap: $portrait-bar-size / 2;
      grid-template-columns: repeat($portrait-columns, $portrait-bar-size / 2);
    }

    &:not(.portrait) {
      padding: ($landscape-bar-size - $landscape-bar-height) / 2
               $landscape-bar-size / 2
               $landscape-bar-height;
      column-gap: $landscape-bar-size / 2;
      grid-template-columns: repeat($landscape-columns, $landscape-bar-size / 2);
    }
  }

  .image-wrapper {
    position: relative;

    img {
      position: absolute;
      right: 0;
      width: 200%;
    }
  }

  %img-right-align {
    img {
      right: unset;
      left: 0;
    }
  }

  .heat-map.portrait .image-wrapper {
    width: $portrait-bar-size / 2;
    height: ($portrait-bar-size - $portrait-bar-height) / 2;

    @for $i from $portrait-columns + 1 through 2 * $portrait-columns {
      &:nth-child(#{2 * $portrait-columns}n + #{$i}) {
        @extend %img-right-align;
      }
    }

    img {
      bottom: -$portrait-bar-height;
    }
  }

  .heat-map:not(.portrait) .image-wrapper {
    width: $landscape-bar-size / 2;
    height: ($landscape-bar-size - $landscape-bar-height) / 2;

    @for $i from $landscape-columns + 1 through 2 * $landscape-columns {
      &:nth-child(#{2 * $landscape-columns}n + #{$i}) {
        @extend %img-right-align;
      }
    }

    img {
      bottom: -$landscape-bar-height;
    }
  }
</style>
