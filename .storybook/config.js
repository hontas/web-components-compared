import { configure, addDecorator, addParameters } from '@storybook/svelte';
import { withTests } from '@storybook/addon-jest';
import { themes } from '@storybook/theming';

import results from '../.jest-test-results.json';

addParameters({
  options: {
    theme: themes.dark
  }
});

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);

// display test results in storybook
if (process.env.NODE_ENV !== 'production') {
  addDecorator(withTests({ results }));
}
