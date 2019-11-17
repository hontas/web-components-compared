import { action } from '@storybook/addon-actions';

import Component from './button-svelte.svelte';
import notes from './button-svelte.md';

export default {
  title: 'Components|Svelte/Button',
  parameters: {
    notes
  }
};

const defaultProps = {
  text: 'Click bait'
};
const on = { click: action('clicked') };

export const primary = () => ({
  Component,
  props: { ...defaultProps },
  on
});

export const secondary = () => ({
  Component,
  props: {
    ...defaultProps,
    variation: 'secondary'
  },
  on
});

export const disabled = () => ({
  Component,
  props: {
    ...defaultProps,
    disabled: true
  },
  on
});

export const buy = () => ({
  Component,
  props: {
    ...defaultProps,
    variation: 'buy'
  },
  on
});

export const small = () => ({
  Component,
  props: {
    ...defaultProps,
    small: true
  },
  on
});
