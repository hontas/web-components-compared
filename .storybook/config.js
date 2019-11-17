import { configure } from '@storybook/svelte';

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
