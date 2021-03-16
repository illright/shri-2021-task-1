<script lang="ts">
  import type { VoteData } from '../data';
  import ArrowButton from '../common/arrow-button.svelte';
  import TeamMember from '../common/team-member.svelte';
  import Header from '../common/header.svelte';
  import Layout from './_layout.svelte';

  export let data: VoteData;

  const memberAmountPortrait = 8;
  const memberAmountLandscape = 6;
  const memberSubset = data.users.slice(data.offset || 0, data.offset || 0 + memberAmountPortrait);

  function getTeamMembers(...indices: number[]) {
    return indices.map(index => memberSubset[index]);
  }

  const BUTTON_UP = -1;
  const BUTTON_DOWN = -2;
  const variants: Record<string, number[][]> = {
    portrait: [
      [0, 3, 6],
      [BUTTON_UP, 1, 4, BUTTON_DOWN],
      [2, 5, 7],
    ],
    landscape: [
      [0],
      [1, 4],
      [BUTTON_UP, BUTTON_DOWN],
      [2, 5],
      [3],
    ],
  }
</script>

<Layout>
  <article class="vote">
    <Header title={data.title} subtitle={data.subtitle} />
    {#each Object.keys(variants) as variant}
      <div class="{variant} grid">
        {#each variants[variant] as column}
          <div class="column">
            {#each column as index}
              {#if index === BUTTON_UP}
                <ArrowButton
                  up
                  offset={
                    Math.max((data.offset || 0) - (
                      variant === 'portrait' ? memberAmountPortrait : memberAmountLandscape
                    ), 0)
                  }
                  disabled={(data.offset || 0) === 0}
                />
              {:else if index === BUTTON_DOWN}
                <ArrowButton
                  offset={
                    Math.max((data.offset || 0) + (
                      variant === 'portrait' ? memberAmountPortrait : memberAmountLandscape
                    ), 0)
                  }
                  disabled={(data.offset || 0) === data.users.length - 1}
                />
              {:else}
                <div
                  class="vote-card"
                  class:selected={memberSubset[index].id === data.selectedUserId}
                  data-action="update"
                  data-params={
                    JSON.stringify({
                      alias: 'leaders',
                      data: { selectedUserId: memberSubset[index].id },
                    })
                  }
                >
                  <TeamMember
                    data={memberSubset[index]}
                    emoji={memberSubset[index].id === data.selectedUserId ? '👍' : null}
                    noValue
                  />
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    {/each}
  </article>
</Layout>

<style lang="scss">
  .vote {
    width: 100%;
  }

  @media (orientation: portrait) {
    .landscape.grid {
      display: none;
    }
  }

  @media (orientation: landscape) {
    .portrait.grid {
      display: none;
    }
  }

  .grid {
    display: flex;
    justify-content: space-between;

    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    }
  }

  .vote-card {
    cursor: pointer;
    padding: 1.25em .25em 1em;
    width: 6em;
    border-radius: .375em;
    margin: 2px 0;

    &:hover {
      background: var(--glass-bg);
      box-shadow: var(--glass-shadow);
    }

    &.selected {
      background: var(--glass-bg-lit);
      box-shadow: var(--glass-shadow-lit);
    }
  }
</style>
