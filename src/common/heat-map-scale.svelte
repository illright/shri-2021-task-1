<script lang="ts">
  import {
    intervalToText,
  } from '../utils/activity';
  import type { Interval } from '../utils/activity';

  export let intervals: Interval[];
  export let landscape: boolean;
</script>

<div class="key scale">
  <div class="segment" />
  <span class="description subtle">
    {#if landscape}
      2 часа
    {:else}
      1 час
    {/if}
  </span>
</div>
{#each intervals as interval}
  <div class="key">
    <div class="bar" />
    <span class="description subtle">
      {intervalToText(interval)}
    </span>
  </div>
{/each}

<style lang="scss">
  @use '../styles/units.scss';

  .key {
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-right: .5em;
    }

    .description {
      margin-top: .5em;
    }

    &:nth-child(2) .bar {
      background: var(--activity-bar0-bg);
      box-shadow: var(--activity-bar0-shadow);
    }

    &:nth-child(3) .bar {
      background: var(--activity-bar1-bg);
      box-shadow: var(--activity-bar1-shadow);
    }

    &:nth-child(4) .bar {
      background: var(--activity-bar2-bg);
      box-shadow: var(--activity-bar2-shadow);
    }

    &:nth-child(5) .bar {
      background: var(--activity-bar3-bg);
      box-shadow: var(--activity-bar3-shadow);
    }
  }

  .segment {
    width: units.em(51px);
    height: units.em(4px);
    margin: units.em(4px);
    background: var(--activity-segment-bg);
    box-shadow: var(--activity-segment-shadow);

    position: relative;

    &::before, &::after {
      content: "";
      width: units.em(4px);
      height: units.em(12px);
      background: var(--activity-segment-bg);
      box-shadow: var(--activity-segment-shadow);
      position: absolute;
      top: 50%;
      border-radius: 2px;
    }

    &::before {
      left: 0;
      transform: translate(-100%, -50%);
    }

    &::after {
      right: 0;
      transform: translate(100%, -50%);
    }
  }

  .bar {
    width: units.em(59.2px);
    height: units.em(12px);
    border-radius: units.em(2px);

    @media (orientation: landscape) {
      width: units.em(60px);
    }
  }
</style>
