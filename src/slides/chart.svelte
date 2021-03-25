<script lang="ts">
  import type { ChartData } from '../data';
  import Header from '../common/header.svelte';
  import Glass from '../common/glass.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Layout from './_layout.svelte';

  const barsToRender = 9;
  const barsAfterActive = 2;

  export let data: ChartData;

  const maxHeightPercent = 70;

  const activeIndex = data.values.findIndex(period => period.active);
  const valueSubset = data.values.slice(
    Math.max(activeIndex + 1 - (barsToRender - barsAfterActive), 0),
    activeIndex + 1 + barsAfterActive,
  );
  const maxValue = Math.max(...valueSubset.map(period => period.value));
  function percentageOfMax(value: number) {
    return (value / maxValue) * maxHeightPercent;
  }

  const leadersToShow = 2;
</script>

<Layout>
  <article class="chart">
    <Header title={data.title} subtitle={data.subtitle} />
    <div class="periods">
      {#each valueSubset as period (period.title)}
        <div class="period">
          {#if period.value !== 0}
            <span class="value subhead" class:subtle={!period.active}>
              {period.value}
            </span>
          {/if}
          <Glass lit={period.active} style="height: {percentageOfMax(period.value)}%;" />
          <span class="title" class:subtle={!period.active}>{period.title}</span>
        </div>
      {/each}
    </div>
    <ul class="leaders">
      {#each data.users.slice(0, leadersToShow) as member (member.id)}
        <li>
          <TeamMember data={member} horizontal />
        </li>
      {/each}
    </ul>
  </article>
</Layout>

<style lang="scss">
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
    margin-top: .5em;
    justify-content: space-evenly;
    min-width: 100vw;
    margin-right: -1.5em;
    flex: 1;

    @media (min-width: 768px) {
      margin-right: -3em;
    }

    @media (orientation: portrait) {
      align-self: flex-end;
    }

    .period {
      --glass-bg-lit: var(--chart-glass-bg-lit);
      --glass-shadow-lit: var(--chart-glass-shadow-lit);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 1.5em;
      justify-content: flex-end;

      &:first-child {
        margin-left: 0;
      }

      :global .glass {
        width: 2.5em;
        margin: .5em 0 .75em;
        min-height: .5em;
      }
    }
  }

  .leaders {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: .5em 0 0;

    li {
      padding: 1em 0;
      list-style: none;

      &:not(:last-child) {
        border: 0 solid rgba(191, 191, 191, 0.3);
        border-bottom-width: 2px;
      }
    }

    @media (orientation: landscape) {
      flex-direction: row;

      li {
        padding: 0 1em;

        &:not(:last-child) {
          border-bottom-width: 0;
          border-right-width: 2px;
        }
      }
    }
  }
</style>
