const testUtils = require('@testing-library/svelte');
const Component = require('./toggle-svelte.svelte');

describe('toggle-svelte', () => {
  const defaultProps = { summary: 'Expand/collapse content' };
  const render = (props = {}) =>
    testUtils.render(Component, {
      props: {
        ...defaultProps,
        ...props
      }
    });

  test('shows proper label when rendered', () => {
    const { getByText } = render();

    const summary = getByText(defaultProps.summary);

    expect(summary).toBeVisible();
    expect(summary).toBeInTheDocument();
  });

  // Note: This is as an async test as we are using `fireEvent`
  test('toggles content when clicked', async () => {
    const { getByTestId } = render();

    const button = getByTestId('toggle-svelte-button');
    const getContent = () => getByTestId('toggle-svelte-content');

    expect(getContent()).toHaveAttribute('hidden');

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
    await testUtils.fireEvent.click(button);

    expect(getContent()).not.toHaveAttribute('hidden');

    await testUtils.fireEvent.click(button);

    expect(getContent()).toHaveAttribute('hidden');
  });
});
