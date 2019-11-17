<script>
  export let summary = '';
  export let open = false;

  const toggle = () => {
    open = !open;
  };
</script>

<svelte:options tag="toggle-svelte" />
<h2>
  <button aria-expanded={open} on:click={toggle}>
    <span class="summary">{summary}</span>
    <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10" fill="currentColor">
      <rect class="vertical" height="8" width="2" y="1" x="4" />
      <rect height="2" width="8" y="4" x="1" />
    </svg>
  </button>
</h2>

<div class="content" hidden={!open}>
  <slot>This will be replaced with whatever you put in</slot>
</div>

<style>
  h2 {
    margin: 0;
  }

  button {
    all: inherit;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0;
    width: 100%;
  }
  button svg {
    height: 1em;
    margin-left: 0.5em;
  }

  [aria-expanded='true'] .vertical {
    display: none;
  }
</style>
