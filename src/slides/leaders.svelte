<script lang="ts">
  import type { LeadersData } from '../data';
  import Layout from './_layout.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Glass from '../common/glass.svelte';
  import Header from '../common/header.svelte';
  import { reversed, invertIndex } from '../utils/reversed';
  import { generateBars } from '../utils/leaders';

  export let data: LeadersData;
  const bars = generateBars(data);
  const invertBarsIndex = invertIndex.bind(bars);
</script>

<Layout>
  <article class="leaders">
    <Header title={data.title} subtitle={data.subtitle} />
    <section class="standings">
      {#each reversed(bars) as bar, index}
        <div class="position place-{invertBarsIndex(index) + 1}">
          <TeamMember data={bar.main.member} emoji={bar.main.emoji} />
          <div class="bar-wrapper" class:clipping={bar.main.place !== 1}>
            <Glass class="bar" lit={bar.main.place === 1} />
            <div class="content">
              <div class="headline">{bar.main.place}</div>
              {#if 'extra' in bar}
                <div class="portrait-voted">
                  <TeamMember data={bar.extra.member} emoji={bar.extra.emoji} />
                  <div class="extra-place">
                    <hr />
                    <div class="headline">{bar.extra.place}</div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </section>
  </article>
</Layout>

<style lang="scss">
  @use 'sass:math';
  @use 'sass:map';
  @use '../styles/queries.scss';
  @use '../styles/screens.scss';
  @use '../styles/units.scss';

  $max-places: 5;
  $max-places-portrait: 3;

  .leaders {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  .standings {
    display: flex;
    justify-content: center;
    align-items: stretch;

    @media (orientation: portrait) {
      height: (520 / 648) * 100%;
    }

    @media (orientation: landscape) {
      padding-top: 1.625em;
      flex: 1;
    }

  }

  @for $i from 1 through $max-places {
    .position.place-#{$i} {
      z-index: #{$max-places - $i};

      @if $i > $max-places-portrait {
        @media (orientation: portrait) and (max-width: map.get(screens.$ipad, "width") - units.em(1px)) {
          display: none;
        }
      }

      @if $i % 2 == 0 {
        order: #{math.ceil($max-places / 2) + $i / 2 - 1};

        :global .bar {
          right: 0;
        }
      } @else {
        order: #{math.ceil($max-places / 2) - ($i - 1) / 2 - 1};
      }

      :global .bar-wrapper {
        @media (orientation: portrait) {
          height: calc(62.5% - #{50px * ($i - 1)});
        }
        @media (orientation: landscape) and (max-width: map.get(screens.$desktop-s, "width") - units.em(1px)) {
          height: calc(40% - .8px - #{20px * math.ceil(($i - 1) / 2)});
        }
        @media (orientation: landscape) and (min-width: map.get(screens.$desktop-s, "width")) {
          height: calc(52.5% - #{30px * ($i - 1)});
        }
      }
    }
  }

  .position {
    --bar-width: 7.5em;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: min-content;

    .bar-wrapper {
      width: var(--bar-width);
      z-index: 2;
      position: relative;
      margin-top: 1em;

      &.clipping {
        width: calc(var(--bar-width) - 1em);
        z-index: 1;
      }
    }

    :global .bar {
      width: var(--bar-width);
      position: absolute;
      box-sizing: border-box;
      height: 100%;

      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .content {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 1.125em .5em 1em;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .portrait-voted {
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (orientation: landscape), #{queries.portrait(screens.$ipad)} {
        display: none;
      }

      :global .team-member .value {
        color: var(--fg);
      }
    }

    .extra-place {
      display: flex;
      flex-direction: column;
      align-items: stretch;

      .headline {
        padding: 0 1.25rem;
      }

      hr {
        margin: 0.5625em 0 0.375em;
      }
    }

    @media #{queries.portrait(screens.$ipad)} {
      --bar-width: 18vw;

      .content {
        padding: 3em 1em 3em;
      }
    }

    @media #{queries.landscape(screens.$ipad)} {
      --bar-width: 15vw;

      .content {
        padding-top: 2em;
      }
    }

    :global .team-member {
      margin: 0 4px;

      @media #{queries.landscape(screens.$desktop-s)} {
        margin: 0 1em;
      }
    }
  }
</style>
