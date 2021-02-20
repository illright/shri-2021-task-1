<script lang="ts">
  import type { LeadersData } from '../data';
  export let data: LeadersData;
</script>

<main>
  <article class="leaders">
    <header>
      <h1 class="headline">{data.title}</h1>
      <div class="subhead subtle">{data.subtitle}</div>
    </header>
    <section class="standings">
      {#each data.users as user, index (user.name)}
        <div class="position place-{index + 1}">
          <div class="avatar">
            {#if index === 0}
              <span class="emoji">{data.emoji}</span>
            {/if}
            <img src={user.avatar} alt="Лицо: {user.name}" />
          </div>
          <div class="name">{user.name}</div>
          <div class="value caption">{user.valueText}</div>
          <div class="bar">
            <div class="headline">{index + 1}</div>
          </div>
        </div>
      {/each}
    </section>
  </article>
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
  }

  header .headline {
    margin-bottom: 19px;
  }
</style>
