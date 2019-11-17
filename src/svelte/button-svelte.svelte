<script>
  // import { createEventDispatcher } from 'svelte';
  // const dispatch = createEventDispatcher();
  // const clickHandler = (evt) => dispatch('click', evt);
  import Loader from './loader-svelte.svelte';

  export let disabled = false;
  export let variation = 'primary';
  export let small = false;
  export let type = 'button';
  export let name = '';
  export let id = '';
  export let ariaLabel = '';
  export let hasLoader = false;
  export let loading = false;
  export let text = '';
  export let messageHasLoaded = '';
  export let messageLoading = '';

  const getClasses = (obj) =>
    Object.entries(obj)
      .filter(([, isTruthy]) => isTruthy)
      .map(([key]) => key)
      .join(' ');

  $: modifiers = getClasses({
    'btn--primary': !disabled && (!variation || variation === `primary`),
    'btn--secondary': !disabled && variation === `secondary`,
    'btn--small': small,
    'btn--buy': !disabled && variation === `buy`
  });

  $: labelModifiers = getClasses({
    'label--inactive': hasLoader && loading,
    label: true
  });
</script>

<svelte:options tag="button-svelte" />

<button class={modifiers} {disabled} {type} {name} {id} aria-label={ariaLabel} on:click data-testid="button-svelte">
  <div class="loader" hidden={!hasLoader}>
    <loader-svelte {messageHasLoaded} {messageLoading} {loading} />
  </div>
  <div class={labelModifiers}>
    <slot name="first" />
    <span class="text">{text}</span>
    <slot name="last" />
  </div>
</button>

<style>
  :host {
    --button-svelte-background-color: darkred;
  }
  button {
    border: 0;
    background: var(--button-svelte-background-color, darkred);
    color: white;
    cursor: pointer;
    padding: 1em;
  }

  .btn--primary {
    background-color: darkgreen;
  }

  .btn--secondary {
    background-color: blueviolet;
  }

  .btn--buy {
    background-color: teal;
  }

  .btn--small {
    padding: 0.5em 1em;
  }

  button[disabled] {
    background-color: darkgray;
    color: whitesmoke;
    cursor: not-allowed;
  }

  .label {
    display: grid;
    grid-auto-flow: column;
    column-gap: 0.5em;
  }
</style>
