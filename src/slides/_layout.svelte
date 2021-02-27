<main>
  <slot />
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
    padding: 1.25em 1.5em 0;
    box-sizing: border-box;
    min-height: 100vh;

    @media (min-width: 768px) {
      padding-top: 3em;
    }
  }
</style>
