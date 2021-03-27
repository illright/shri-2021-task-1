<script lang="ts">
  import type { ActivityData } from '../data';
  import Header from '../common/header.svelte';
  import Layout from './_layout.svelte';
  import HeatMap from '../common/heat-map.svelte';
  import HeatMapScale from '../common/heat-map-scale.svelte';
  import {
    buildIntervals,
    convertToPortraitOrder,
    convertToLandscapeOrder,
    computeMinMax,
  } from '../utils/activity';

  export let data: ActivityData;
  const portraitMapData = convertToPortraitOrder(data.data);
  const landscapeMapData = convertToLandscapeOrder(data.data);

  const variants = {
    portrait: {
      data: portraitMapData,
      intervals: buildIntervals(...computeMinMax(portraitMapData)),
    },
    landscape: {
      data: landscapeMapData,
      intervals: buildIntervals(...computeMinMax(landscapeMapData)),
    },
  };
</script>

<Layout>
  <article class="activity">
    <Header title={data.title} subtitle={data.subtitle} />
    {#each Object.keys(variants) as variant}
      <figure class={variant}>
        <HeatMap
          data={variants[variant].data}
          intervals={variants[variant].intervals}
          isPortrait={variant === 'portrait'}
        />
        <figcaption>
          <HeatMapScale
            intervals={variants[variant].intervals}
            landscape={variant === 'landscape'}
          />
        </figcaption>
      </figure>
    {/each}
  </article>
</Layout>

<style lang="scss">
  @use '../styles/screens.scss';
  @use '../styles/queries.scss';

  .activity {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  figure {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;

    &.portrait {
      justify-content: space-between;
      margin-bottom: 1.5em;

      &::before {
        content: "";
      }
    }

    &.landscape {
      justify-content: center;

      figcaption {
        margin-top: 2em;
        text-align: center;
      }
    }

    @media #{queries.landscape(screens.$iphone8plus)} {
      font-size: 18px;
    }

    @media #{queries.portrait(screens.$ipad)}, #{queries.landscape(screens.$ipad)} {
      font-size: 26px;
    }

    @media #{queries.landscape(screens.$desktop-s)} {
      font-size: 26px;
    }

    @media #{queries.landscape(screens.$desktop-l)} {
      font-size: 40px;
    }
  }

  figcaption {
    display: flex;
  }

  @media (orientation: portrait) {
    .landscape {
      display: none;
    }
  }

  @media (orientation: landscape) {
    .portrait {
      display: none;
    }
  }
</style>
