<script lang="ts">
  export let id: string;
  export let x: number = 0;
  export let y: number = 0;
  export let blur: number = 0;
  export let spread: number = 0;
  export let color: string = '#000000';
  export let opacity: number = 1;
  export let blendWith = 'shape';

  const [r, g, b] = convertColor(color);

  function convertColor(color: string) {
    if (color[0] === '#') {
      return [
        parseInt(color.substr(1, 2), 16) / 255,
        parseInt(color.substr(3, 2), 16) / 255,
        parseInt(color.substr(5, 2), 16) / 255,
      ];
    }

    return [0, 0, 0];
  }
</script>

<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
{#if spread !== 0}
  <feMorphology
    radius={Math.abs(spread)}
    operator={spread > 0 ? 'dilate' : 'erode'}
    in="SourceAlpha"
    result={id}
  />
{/if}
<feOffset dx={x} dy={y} />
<feGaussianBlur stdDeviation={blur / 2} />
<feColorMatrix type="matrix" values="0 0 0 0 {r}
                                     0 0 0 0 {g}
                                     0 0 0 0 {b}
                                     0 0 0 {opacity} 0" />
<feBlend mode="normal" in2={blendWith} result={id} />
