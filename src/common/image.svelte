<script lang="ts">
  export let src: string;
  export let alt: string;
</script>

<img
  src="images/1x/{src}"
  srcset="images/2x/{src} 414w, images/3x/{src} 768w, images/4x/{src} 1920w"
  {alt}
/>
