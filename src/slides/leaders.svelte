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

  // TODO: line clipping
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

  $max-places: 5;
  $max-places-portrait: 3;

  .leaders {
    display: flex;
    flex-direction: column;
  }

  .standings {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex: 1;
  }

  @for $i from 1 through $max-places {
    .position.place-#{$i} {
      @if $i > $max-places-portrait {
        @media (orientation: portrait) {
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
        @media (orientation: landscape) {
          height: calc(40% - #{20px * math.ceil(($i - 1) / 2)});
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
      align-self: stretch;
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

      @media (orientation: landscape) {
        display: none;
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

    @media (min-width: 768px) and (orientation: portrait) {
      --bar-width: 25vw;

      .content {
        padding: 3em 1em 3em;
      }
    }

    @media (min-width: 768px) and (orientation: landscape) {
      --bar-width: 15vw;

      .content {
        padding-top: 2em;
      }
    }

    :global .team-member {
      margin: 0 2px;
    }
  }
</style>
