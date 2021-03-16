<script lang="ts">
  export let up = false;
  export let disabled = false;
  export let offset: number;
</script>

<button
  class:up
  {disabled}
  data-action="update"
  data-params={
    JSON.stringify({
      alias: 'vote',
      data: { offset },
    })
  }
>
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M27 54C41.9117 54 54 41.9117 54 27C54 12.0883 41.9117 0 27 0C12.0883 0 0 12.0883 0 27C0 41.9117 12.0883 54 27 54ZM20.0607 22.9393C19.4749 22.3536 18.5251 22.3536 17.9393 22.9393C17.3536 23.5251 17.3536 24.4749 17.9393 25.0607L25.9393 33.0607C26.5251 33.6464 27.4749 33.6464 28.0607 33.0607L36.0607 25.0607C36.6464 24.4749 36.6464 23.5251 36.0607 22.9393C35.4749 22.3536 34.5251 22.3536 33.9393 22.9393L27 29.8787L20.0607 22.9393Z" />
  </svg>
</button>

<style lang="scss">
  button {
    box-sizing: border-box;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 2px solid var(--button-bg);
    padding: 3px;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &.up svg {
      transform: rotate(180deg);
    }

    svg {
      width: 100%;
      height: 100%;
      fill: var(--button-bg);
      display: block;
    }

    &:hover, &:disabled {
      border-color: var(--button-bg-hover);

      svg {
        fill: var(--button-bg-hover);
      }
    }
  }
</style>
