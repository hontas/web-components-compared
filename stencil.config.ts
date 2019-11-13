import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil',
  srcDir: 'src/stenciljs',
  outputTargets: [
    {
      type: 'www',
      dir: 'public/stencil'
    }
  ]
};
