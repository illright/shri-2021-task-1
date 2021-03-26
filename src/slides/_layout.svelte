<main>
  <slot />
</main>

<style lang="scss">
  @use '../styles/mixins.scss';

  @include mixins.font-faces;

  :global {
    html, body {
      height: 100%;
    }

    @include mixins.normalize;

    body {
      --black: #261C00;
    	--main: #F4B000;
      --grey: #918F8A;
      --grey-light: #BFBFBF;
      --white: #FCFBF7;
      margin: 0;
      width: 100%;
    }

    body:not(.theme_light) {
      @include mixins.css-vars-dark;

    	background: radial-gradient(circle at 50% 50%, #120C01 0%, #000000 100%);
      background: radial-gradient(70.24% 70.24% at 49.87% 29.76%, rgba(18, 12, 1, 0.9) 0%, #000000 100%);
    }

    body:not(.theme_light) .team-member img {
      filter: grayscale(1);
    }

    body.theme_light {
      @include mixins.css-vars-light;

    	background: #fff;
    }

    body.theme_light .dark-only {
      display: none;
    }

    body:not(.theme_light) .light-only {
      display: none;
    }

    @include mixins.typography;
  }

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
