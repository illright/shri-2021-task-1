<script lang="ts">
  export let title: string;
  export let subtitle: string;
</script>

<header>
  <h1 class="headline">{title}</h1>
  <div class="subtle">{subtitle}</div>
</header>

<style lang="scss">
  @use '../styles/queries.scss';
  @use '../styles/screens.scss';

  header {
    @media (orientation: portrait) {
      padding-right: 1.75em;
    }

    @media (orientation: landscape), #{queries.portrait(screens.$ipad)} {
      text-align: center;
      padding: 0 1.25em;
    }

    .headline {
      margin-bottom: 8px;
      margin-top: 0;
    }
  }
</style>
