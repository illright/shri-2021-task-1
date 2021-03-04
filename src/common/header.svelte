<script lang="ts">
  export let title: string;
  export let subtitle: string;
</script>

<header>
  <h1 class="headline">{title}</h1>
  <div class="subtle">{subtitle}</div>
</header>

<style lang="scss">
  header {
    @media (orientation: portrait) {
      padding-right: 2em;
    }

    @media (orientation: landscape) {
      text-align: center;
    }

    .headline {
      margin-bottom: 8px;
      margin-top: 0;
    }
  }
</style>
