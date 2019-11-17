import Component from './toggle-svelte.svelte';
import notes from './toggle-svelte.md';

export default {
  title: 'Components|Toggle',
  parameters: {
    notes,
    jest: ['toggle-svelte.test.js']
  }
};

const defaultProps = {
  summary: 'Click bait'
};

export const normal = () => ({
  Component,
  props: { ...defaultProps }
});
