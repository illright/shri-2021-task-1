<script lang="ts">
  import type { ChartData } from '../data';
  import Header from '../common/header.svelte';
  import Glass from '../common/glass.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Layout from './_layout.svelte';

  const barsToRender = 9;
  const barsAfterActive = 2;
  const barsToRenderExtended = 15;
  const barsAfterActiveExtended = 4;

  export let data: ChartData;

  const maxHeightPercent = 153 / 218 * 100;

  const activeIndex = data.values.findIndex(period => period.active);
  const valueSubset = data.values.slice(
    Math.max(activeIndex + 1 - (barsToRenderExtended - barsAfterActiveExtended), 0),
    activeIndex + 1 + barsAfterActiveExtended,
  );

  const coreStart = Math.max(activeIndex + 1 - (barsToRender - barsAfterActive), 0);
  const coreEnd = activeIndex + 1 + barsAfterActive;
  const maxValue = Math.max(...valueSubset.map(period => period.value));
  function percentageOfMax(value: number) {
    return (value / maxValue) * maxHeightPercent;
  }

  const leadersToShow = 2;
  const leadersToShowExtended = 3;
</script>

<Layout>
  <article class="chart">
    <Header title={data.title} subtitle={data.subtitle} />
    <div class="periods">
      {#each valueSubset as period, index (period.title)}
        <div class="period" class:extended={index < coreStart || index >= coreEnd}>
          {#if period.value !== 0}
            <span class="value subhead" class:subtle={!period.active}>
              {period.value}
            </span>
          {/if}
          <Glass lit={period.active} style="height: {percentageOfMax(period.value)}%;" />
          <span class="title subtle">{period.title}</span>
        </div>
      {/each}
    </div>
    <ul class="leaders">
      {#each data.users.slice(0, leadersToShowExtended) as member, index (member.id)}
        <li class:extended={index >= leadersToShow}>
          <TeamMember data={member} horizontal />
        </li>
      {/each}
    </ul>
  </article>
</Layout>

<style lang="scss">
  @use 'sass:map';
  @use '../styles/screens.scss';
  @use '../styles/units.scss';
  @use '../styles/queries.scss';

  .chart {
    width: 100%;
    display: flex;
    flex-direction: column;

    @media (orientation: landscape) {
      align-items: center;
    }
  }

  .periods {
    display: flex;
    justify-content: space-between;
    margin-top: 43.2941px;
    flex: 1;

    @media (orientation: portrait) and (max-width: map.get(screens.$ipad, "width") - units.em(1px)) {
      align-self: flex-end;
      margin-right: -0.75em;
    }

    .period {
      --glass-bg-lit: var(--chart-glass-bg-lit);
      --glass-shadow-lit: var(--chart-glass-shadow-lit);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;

      :global .glass {
        width: 2.5em;
        margin: .5em 0.75em .75em;
        min-height: .5em;
        flex-shrink: 0;
      }
    }
  }

  .leaders {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: .5em 0;

    li {
      padding: 1em 0;
      list-style: none;

      &:not(:first-child) {
        border: 0 solid rgba(191, 191, 191, 0.3);
        border-top-width: 2px;
      }
    }

    @media (orientation: landscape) {
      flex-direction: row;
      margin: 1.5em 0;

      li {
        padding: 0 1em;
        min-width: 13.75em;

        &:not(:first-child) {
          border-top-width: 0;
          border-left-width: 2px;
        }
      }
    }
  }

  .extended {
    display: none !important;
  }

  @media #{queries.landscape(screens.$desktop-s)} {
    .extended {
      display: flex !important;
    }
  }
</style>
