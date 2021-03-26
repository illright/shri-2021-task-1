<script lang="ts">
  import type { TeamMember } from '../data';
  import Image from './image.svelte';

  export let data: TeamMember;
  export let emoji: string = null;

  export let horizontal = false;
  export let noValue = false;
</script>

<div class="team-member" class:horizontal>
  <div class="avatar">
    {#if emoji != null}
      <span class="emoji">{emoji}</span>
    {/if}
    <Image src={data.avatar} alt="Лицо: {data.name}" />
  </div>
  <div class="name">{data.name}</div>
  {#if !noValue}
    <div class="value caption">{data.valueText}</div>
  {/if}
</div>

<style lang="scss">
  @use '../styles/queries.scss';
  @use '../styles/screens.scss';

  .team-member {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &.horizontal {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      justify-items: start;
      column-gap: .875em;

      .avatar {
        grid-row: 1 / 3;
        width: 40px;
        height: 40px;
        margin: 0;
      }

      .name {
        align-self: end;
      }

      .value {
        align-self: start;
      }
    }
  }

  .avatar {
    position: relative;
    width: 64px;
    height: 64px;
    margin-bottom: 6px;

    .emoji {
      font-size: 32px;
      line-height: 32px;
      position: absolute;
      left: 50%;
      top: 10px;
      transform: translate(-50%, -100%);
      z-index: 2;
    }

    :global(img) {
      border-radius: 50%;
      width: 100%;
    }
  }

  .value {
    margin-top: 4px;

    @media #{queries.landscape(screens.$desktop-s)} {
      margin-top: .5em;
    }
  }
</style>
