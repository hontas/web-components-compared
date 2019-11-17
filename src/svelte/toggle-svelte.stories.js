import Component from './toggle-svelte.svelte';
import notes from './toggle-svelte.md';

export default {
  title: 'Components|Svelte/Toggle',
  parameters: {
    notes
  }
};

const defaultProps = {
  summary: 'Click bait'
};

export const normal = () => ({
  Component,
  props: { ...defaultProps }
});
