<script lang="ts">
  import type { DiagramData } from '../data';
  import Header from '../common/header.svelte';
  import DonutChart from '../common/donut-chart.svelte';
  import Layout from './_layout.svelte';

  export let data: DiagramData;
</script>

<Layout>
  <article class="diagram">
    <Header title={data.title} subtitle={data.subtitle} />
    <figure>
      <DonutChart segments={[0.2, 0.3, 0.1, 0.4]} />
      <figcaption>
        <ul class="categories">
          {#each data.categories as category (category.title)}
            <li>
              <div class="indicator" />
              <span class="title">{category.title}</span>
              <span class="difference">{category.differenceText}</span>
              <span class="value">{category.valueText}</span>
            </li>
          {/each}
        </ul>
      </figcaption>
    </figure>
  </article>
</Layout>

<style lang="scss">
  .diagram {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
