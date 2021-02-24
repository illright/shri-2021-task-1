<script lang="ts">
  import type { LeadersData } from '../data';
  import Layout from './_layout.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Glass from '../common/glass.svelte';
  import Header from '../common/header.svelte';
  import { reversed, invertIndex } from '../utils/reversed';

  const maxPlaces = 5;
  const maxPlacesPortrait = 3;

  export let data: LeadersData;

  const users = data.users.slice(0, maxPlaces);
  const invertUsersIndex = invertIndex.bind(users);

  function getEmojiForIndex(index: number) {
    if (index === 0) {
      return data.emoji;
    } else if (index === data.selectedUserId) {
      return '👍';
    } else {
      return null;
    }
  }
</script>

<Layout>
  <article class="leaders">
    <Header title={data.title} subtitle={data.subtitle} />
    <section class="standings">
      {#each reversed(users) as user, index (user.name)}
        <div class="position place-{invertUsersIndex(index) + 1}">
          <TeamMember data={user} emoji={getEmojiForIndex(invertUsersIndex(index))} />
          <div class="bar-wrapper" class:clipping={index !== invertUsersIndex(0)}>
            <Glass class="bar" lit={index === invertUsersIndex(0)} />
            <div class="content">
              <div class="headline">{invertUsersIndex(index) + 1}</div>
              {#if
                'selectedUserId' in data
                && index === invertUsersIndex(0)
                && data.selectedUserId > invertUsersIndex(maxPlacesPortrait)
              }
                <div class="portrait-voted">
                  <TeamMember
                    data={data.users[data.selectedUserId]}
                    emoji={getEmojiForIndex(data.selectedUserId)}
                  />
                  <hr />
                  <div class="headline">{invertUsersIndex(index) + 1}</div>
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
