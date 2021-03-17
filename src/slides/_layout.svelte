<main>
  <slot />
</main>

<style lang="scss">
  main {
    --side-padding: 1.5em;
    display: flex;
    justify-content: center;
    padding: 1.25em var(--side-padding) 0;
    box-sizing: border-box;
    height: 100vh;

    @media (orientation: landscape) {
      --side-padding: 2em;
    }

    @media (min-width: 768px) {
      --side-padding: 3em;
      padding: 3em var(--side-padding) 0;
    }
  }
</style>
