import { action } from '@storybook/addon-actions';

import Component from './input-svelte.svelte';
import notes from './input-svelte.md';

export default {
  title: 'Form|Input',
  parameters: {
    notes,
    jest: ['input-svelte.test.js']
  }
};

const defaultProps = {
  label: 'Label'
};
const on = {
  change: action('changed'),
  input: action('input'),
  focus: action('focus'),
  blur: action('blur'),
  keydown: action('keydown'),
  keyup: action('keyup')
};

export const primary = () => ({
  Component,
  props: { ...defaultProps },
  on
});
