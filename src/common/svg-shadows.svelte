<script lang="ts">
  import SVGDropShadow from './svg-drop-shadow.svelte';
  import SVGInnerShadow from './svg-inner-shadow.svelte';
  import type { Shadow } from './shadow';

  export let id: string;
  export let shadows: Shadow[];

  const dropShadows = shadows.filter(shadow => !shadow.inset);
  const innerShadows = shadows.filter(shadow => shadow.inset);
</script>

<filter
  {id}
  x="-10%"
  y="-10%"
  width="120%"
  height="120%"
  filterUnits="userSpaceOnUse"
  color-interpolation-filters="sRGB"
>
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  {#if dropShadows.length !== 0}
    {#each dropShadows as shadow, index}
      <SVGDropShadow
        id="{id}:drop:{index}"
        x={shadow.x}
        y={shadow.y}
        blur={shadow.blur}
        spread={shadow?.spread ?? 0}
        color={shadow.color}
        opacity={shadow.opacity}
        blendWith={index === 0 ? 'BackgroundImageFix' : `${id}:drop:${index - 1}`}
      />
    {/each}
    <feBlend mode="normal" in="SourceGraphic" in2="{id}:drop:{dropShadows.length - 1}" result="shape" />
  {:else}
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
  {/if}
  {#each innerShadows as shadow, index}
    <SVGInnerShadow
      id="{id}:inner:{index}"
      x={shadow.x}
      y={shadow.y}
      blur={shadow.blur}
      color={shadow.color}
      opacity={shadow.opacity}
      blendWith={index === 0 ? 'shape' : `${id}:inner:${index - 1}`}
    />
  {/each}
</filter>
