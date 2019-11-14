<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

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
    btn: true,
    'btn--primary': !disabled && (!variation || variation === `primary`),
    'btn--secondary': !disabled && variation === `secondary`,
    'btn--disabled': disabled,
    'btn--small': small,
    'btn--buy': !disabled && variation === `buy`
  });

  $: labelModifiers = getClasses({
    'label--inactive': hasLoader && loading,
    label: true
  });

  const clickHandler = (evt) => dispatch('click', evt);
</script>

<style>
  :host {
    --button-svelte-background-color: darkred;
  }
  button {
    border: 0;
    background: var(--button-svelte-background-color);
    color: white;
    padding: 1em;
  }
  .label {
    display: grid;
    grid-auto-flow: column;
    column-gap: 0.5em;
  }
</style>

<svelte:options tag="button-svelte" />

<button class={modifiers} {disabled} {type} {name} {id} aria-label={ariaLabel} on:click={clickHandler}>
  <div class="loader">
    <ica-loader {messageHasLoaded} {messageLoading} {loading} />
  </div>
  <div class={labelModifiers}>
    <slot name="first" />
    <span class="text">{text}</span>
    <slot name="last" />
  </div>
</button>
