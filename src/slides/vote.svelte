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
</script>

<Layout>
  <article class="vote">
    <Header title={data.title} subtitle={data.subtitle} />
    <div class="portrait grid">
      <div class="column">
        {#each getTeamMembers(0, 3, 6) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
      <div class="column">
        <ArrowButton up />
        {#each getTeamMembers(1, 4) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
        <ArrowButton />
      </div>
      <div class="column">
        {#each getTeamMembers(2, 5, 7) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
    </div>
    <div class="landscape grid">
      <div class="column">
        {#each getTeamMembers(0) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
      <div class="column">
        {#each getTeamMembers(1, 4) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
      <div class="column">
        <ArrowButton up />
        <ArrowButton />
      </div>
      <div class="column">
        {#each getTeamMembers(2, 5) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
      <div class="column">
        {#each getTeamMembers(3) as member}
          <div class="vote-card" class:selected={member.id === data.selectedUserId}>
            <TeamMember data={member} noValue />
          </div>
        {/each}
      </div>
    </div>
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
