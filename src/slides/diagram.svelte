<script lang="ts">
  import type { DiagramData } from '../data';
  import Header from '../common/header.svelte';
  import DonutChart from '../common/donut-chart.svelte';
  import Layout from './_layout.svelte';
  import { extractAmount, forceSign } from '../utils/diagram';

  export let data: DiagramData;
</script>

<Layout>
  <article class="diagram">
    <Header title={data.title} subtitle={data.subtitle} />
    <figure>
      <DonutChart
        data={data.categories.map(category => extractAmount(category.valueText))}
        totalText={data.totalText}
        differenceText={data.differenceText}
      />
      <figcaption>
        <ul class="categories">
          {#each data.categories as category (category.title)}
            <li>
              <div class="indicator" />
              <span class="title">{category.title}</span>
              <span class="difference">
                {forceSign(extractAmount(category.differenceText))}
              </span>
              <span class="value">
                {extractAmount(category.valueText)}
              </span>
            </li>
          {/each}
        </ul>
      </figcaption>
    </figure>
  </article>
</Layout>

<style lang="scss">
  @use '../styles/queries.scss';
  @use '../styles/screens.scss';

  .diagram {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (orientation: landscape) {
      &::after {
        content: "";
      }
    }
  }

  figure {
    display: flex;
    flex-direction: column;

    @media (orientation: portrait) {
      margin-top: 2em;
    }

    :global .donut {
      max-width: 30em;
    }

    @media (orientation: landscape) {
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  @media #{queries.portrait(screens.$ipad)} {
    .diagram {
      align-items: center;
    }
  }

  .categories {
    min-width: 19em;
    padding: 0 0 .5em;
    margin: 0;

    li {
      display: flex;
      padding: 1em 0;

      &:not(:last-child) {
        border-bottom: 2px solid rgba(145, 143, 138, .3);
      }

      .indicator {
        width: 1em;
        height: 1em;
        border-radius: 50%;
        margin-right: 0.625em;
      }

      .title {
        flex: 1;
      }

      .difference, .value {
        color: var(--grey);
      }

      .value {
        margin-left: 1em;
      }

      @for $i from 1 through 4 {
        &:nth-child(#{$i}) .indicator {
          background: var(--diagram-indicator#{$i - 1}-bg);
          box-shadow: var(--diagram-indicator#{$i - 1}-shadow);
        }
      }
    }
  }
</style>
