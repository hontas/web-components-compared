const svelteConfig = require('../svelte.config');

module.exports = ({ config }) => {
  const svelteLoader = config.module.rules.find((rule) => rule.loader && rule.loader.includes('svelte-loader'));
  svelteLoader.options = {
    ...svelteLoader.options,
    ...svelteConfig
  };

  return config;
};
