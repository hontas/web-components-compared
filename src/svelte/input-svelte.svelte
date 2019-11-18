<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let value = '';
  export let label = '';
  export let type = 'text';
  export let description = 'some descriptive text on how to...';
  export let id = uuid();

  let hasFocus = false;

  function uuid() {
    return (
      Date.now().toString(16) +
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  function onInput(evt) {
    value = evt.target.value;
    dispatch('input', evt);
  }

  function onFocus(evt) {
    hasFocus = true;
    dispatch('focus', evt);
  }

  function onBlur(evt) {
    hasFocus = false;
    dispatch('blur', evt);
  }
</script>

<svelte:options tag="input-svelte" />

<div class="input-svelte" class:has-focus={hasFocus}>
  <label for={id}>{label}</label>
  <input {...$$props} {id} {type} {value} on:input={onInput} on:change on:blur={onBlur} on:focus={onFocus} on:keydown on:keyup />
  <span class="description">{description}</span>
</div>

<style>
  .input-svelte {
    font-family: sans-serif;
    position: relative;
    width: 100%;
  }

  label {
    color: gray;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(1em, 1.5em);
    transition: transform 0.3s ease-out;
  }

  input {
    background: white;
    border: none;
    border-bottom: 1px solid darkred;
    font-size: inherit;
    padding: 1.5em 1em 1em;
    width: 100%;
  }

  .description {
    background: darkslategray;
    bottom: 0;
    color: white;
    font-size: x-small;
    padding: 0.2em 1.7em;
    position: absolute;
    transform-origin: bottom;
    transform: rotateX(90deg) scaleY(0);
    width: 100%;
  }

  .has-focus label {
    transform: translateY(0.25em) scale(0.5);
  }
</style>
