const testUtils = require('@testing-library/svelte');
const Button = require('./button-svelte.svelte');

describe('button-svelte', () => {
  const defaultProps = { text: 'Click me' };
  const render = (props = {}) =>
    testUtils.render(Button, {
      props: {
        ...defaultProps,
        ...props
      }
    });

  test('shows proper label when rendered', () => {
    const { getByText } = render();

    expect(getByText('Click me')).toBeInTheDocument();
  });

  test('sets proper classes when rendered', () => {
    const { getByTestId } = render({
      variation: 'secondary',
      small: true,
      ariaLabel: 'aria',
      name: 'name',
      id: 'XXX'
    });

    const btn = getByTestId('button-svelte');

    expect(btn).toBeEnabled();
    expect(btn).toHaveClass('btn--secondary', 'btn--small');
    expect(btn).toHaveAttribute('aria-label', 'aria');
    expect(btn).toHaveAttribute('name', 'name');
    expect(btn).toHaveAttribute('id', 'XXX');
  });

  test('sets proper classes when disabled', () => {
    const { getByTestId } = render({
      variation: 'secondary',
      small: true,
      disabled: true
    });

    const btn = getByTestId('button-svelte');

    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('btn--small');
  });

  // Note: This is as an async test as we are using `fireEvent`
  test('sets proper classes when rendered', async () => {
    const spy = jest.fn();
    const { getByTestId } = render();

    const btn = getByTestId('button-svelte');
    btn.addEventListener('click', spy);

    // Using await when firing events is unique to the svelte testing library because
    // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
    await testUtils.fireEvent.click(btn);

    expect(spy).toHaveBeenCalled();
  });
});
