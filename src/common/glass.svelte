<script lang="ts">
  let _class = null;
  export { _class as class };
  export let lit = false;
  export let style: string | null = null;
</script>

<div class="glass{_class ? ` ${_class}` : ''}" class:lit {style}>
  <slot />
</div>

<style lang="scss">
  .glass {
    border-radius: 6px;
    display: flex;
    background: var(--glass-bg);
    box-shadow: var(--glass-shadow);

    &.lit {
      background: var(--glass-bg-lit);
      box-shadow: var(--glass-shadow-lit);
    }
  }
</style>
