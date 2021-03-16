<script lang="ts">
  import type { ChartData } from '../data';
  import Header from '../common/header.svelte';
  import Glass from '../common/glass.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Layout from './_layout.svelte';

  export let data: ChartData;

  const minHeightPercent = 2;
  const maxHeightPercent = 70;

  const maxValue = Math.max(...data.values.map(period => period.value));
  function percentageOfMax(value: number) {
    return minHeightPercent + (value / maxValue) * (maxHeightPercent - minHeightPercent);
  }

  const leadersToShow = 2;
</script>

<Layout>
  <article class="chart">
    <Header title={data.title} subtitle={data.subtitle} />
    <div class="periods">
      {#each data.values as period (period.title)}
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
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 1.5em;
      justify-content: flex-end;

      &:last-child {
        margin-right: 1.5em;
      }

      :global .glass {
        width: 2.5em;
        margin: .5em 0 .75em;
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
