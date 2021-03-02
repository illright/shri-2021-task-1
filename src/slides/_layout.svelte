<main>
  <slot />
</main>

<style lang="scss">
  main {
    display: flex;
    justify-content: center;
    padding: 1.25em 1.5em 0;
    box-sizing: border-box;
    height: 100vh;

    @media (min-width: 768px) {
      padding: 3em 3em 0;
    }
  }
</style>
