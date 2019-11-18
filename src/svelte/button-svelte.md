# button-svelte

A button with some default styles.

## slots

- `first` Content before text
- `last` Content after text

## props

- `variation - String | Default: primary | Allowed: [primary, secondary, buy]`
  - Set the display variation of the button.
- `disabled - Boolean`
  - Disables button

## example

```html
<button-svelte text="Klicka på mig">
  <p slot="first">pre-text-slot</p>
  <p slot="last">post-text-slot</p>
</button-svelte>
```
