<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let disabled = false;
  export let variation = 'primary';
  export let small = false;
  export let type = 'type';
  export let name = 'name';
  export let componentId = '';
  export let ariaLabel = '';
  export let hasLoader = false;
  export let loading = false;
  export let text;
  export let messageHasLoaded = '';
  export let messageLoading = '';

  $: modifiers = () => ({
    'IcaButton--primary': !disabled && (!variation || variation === `primary`),
    'IcaButton--secondary': !disabled && variation === `secondary`,
    'IcaButton--buy': !disabled && variation === `buy`,
    'IcaButton--disabled': disabled,
    'IcaButton--small': small,
    IcaButton: true
  });
  $: labelModifiers = () => ({
    'IcaButton__label--inactive': hasLoader && loading,
    IcaButton__label: true,
    lIcaButton__label: true
  });

  const clickHandler = (evt) => dispatch('click', evt);
</script>

<svelte:options tag="button-svelte" />

<button
  class={modifiers()}
  disabled={this.disabled}
  type={this.type}
  name={this.name}
  id={this.componentId}
  aria-label={this.ariaLabel}
  onClick={this._clickHandler}>
  <div class="IcaButton__loader">
    <ica-loader messageHasLoaded={this.messageHasLoaded} messageLoading={this.messageLoading} loading={this.loading} />
  </div>
  <div class={this._labelModifiers()}>
    <slot name="first" />
    <span class="IcaButton__text">{this.text}</span>
    <slot name="last" />
  </div>
</button>
