<script lang="ts">
  import {
    intervalToText,
  } from '../../utils/activity';
  import type { Interval } from '../../utils/activity';

  export let intervals: Interval[];
</script>

<div class="key scale">
  <div class="segment" />
  <span class="description subtle">
    1 час
  </span>
</div>
{#each intervals as interval, index}
  <div class="key">
    <div class="color-sample sample-{index}" />
    <span class="description subtle">
      {intervalToText(interval)}
    </span>
  </div>
{/each}

<style lang="scss">
  .key {
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-right: .5em;
    }

    .description {
      margin-top: .5em;
    }
  }

  .segment {
    width: 51px;
    height: 4px;
    margin: 4px;
    background: var(--activity-segment-bg);
    box-shadow: var(--activity-segment-shadow);

    position: relative;

    &::before, &::after {
      content: "";
      width: 4px;
      height: 12px;
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

  .color-sample {
    width: 59.2px;
    height: 12px;
    border-radius: 2px;

    &.sample-0 {
      background: var(--activity-bar0-bg);
      box-shadow: var(--activity-bar0-shadow);
    }

    &.sample-1 {
      background: var(--activity-bar1-bg);
      box-shadow: var(--activity-bar1-shadow);
    }

    &.sample-2 {
      background: var(--activity-bar2-bg);
      box-shadow: var(--activity-bar2-shadow);
    }

    &.sample-3 {
      background: var(--activity-bar3-bg);
      box-shadow: var(--activity-bar3-shadow);
    }
  }
</style>
