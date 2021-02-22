<script lang="ts">
  import type { LeadersData } from '../data';
  import TeamMember from '../components/team-member.svelte';
  import Glass from '../components/glass.svelte';
  import reversed from '../utils/reversed';

  export let data: LeadersData;
</script>

<main>
  <article class="leaders">
    <header>
      <h1 class="headline">{data.title}</h1>
      <div class="subtle">{data.subtitle}</div>
    </header>
    <section class="standings">
      {#each reversed(data.users) as user, index (user.name)}
        <div class="position place-{data.users.length - index}">
          {#if index === data.users.length - 1}
            <TeamMember data={user} emoji={data.emoji} />
          {:else if index === data.selectedUserId}
            <TeamMember data={user} emoji="👍" />
          {:else}
            <TeamMember data={user} />
          {/if}

          <div class="bar-wrapper" class:clipping={index !== data.users.length - 1}>
            <Glass class="bar" lit={index === data.users.length - 1} />
            <div class="content">
              <div class="headline">{data.users.length - index}</div>
            </div>
          </div>
        </div>
      {/each}
    </section>
  </article>
</main>

<style lang="scss">
  @use 'sass:math';

  $max-places: 5;
  $max-places-portrait: 3;

  main {
    display: flex;
    justify-content: center;
    padding: 1.25em 1.5em 0;
    box-sizing: border-box;
    min-height: 100vh;
  }

  .leaders {
    display: flex;
    flex-direction: column;
  }

  header {
    @media (orientation: portrait) {
      padding-right: 2em;
      margin-bottom: 2.375em;
    }

    @media (orientation: landscape) {
      text-align: center;
      margin-bottom: 1.75em;
    }

    .headline {
      margin-bottom: 8px;
      margin-top: 0;
    }
  }

  .standings {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex: 1;
  }

  @for $i from 1 through $max-places {
    .position.place-#{$i} {
      @if $i <= $max-places-portrait {
        display: flex;
      }

      @if $i > $max-places-portrait and $i <= $max-places {
        @media (orientation: landscape) {
          display: flex;
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
    display: none;  // set to 'flex' for each shown position in the loop above
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: min-content;

    .bar-wrapper {
      width: 7.5em;
      z-index: 2;
      position: relative;
      margin-top: 1em;

      &.clipping {
        width: 6.5em;
        z-index: 1;
      }
    }

    :global .bar {
      width: 7.5em;
      position: absolute;
      align-self: stretch;
      height: 6em;
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
      padding: 1.125em;
      justify-content: center;
      box-sizing: border-box;
    }

    :global .team-member {
      margin: 0 2px;
    }
  }
</style>
