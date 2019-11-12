import { Component, Host, Prop, h } from '@stencil/core';

const styles = `
h2 {
  margin: 0;
}

button {
  all: inherit;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0;
  width: 100%;
}
button svg {
  height: 1em;
  margin-left: 0.5em;
}

[aria-expanded='true'] .vertical {
  display: none;
}
`;

@Component({
  tag: 'toggle-stencil',
  scoped: true,
  shadow: true,
  styles
})
export class ToggleStencil {
  @Prop() summary: string;

  @Prop({ mutable: true }) open: boolean;

  @Listen('click', { capture: true })
  handleClick(ev) {
    console.log('click', ev);
  }

  render() {
    return (
      <Host>
        <h2>
          <button aria-expanded={this.open} onClick={this.toggle}>
            <span class="summary">{this.summary}</span>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10" fill="currentColor">
              <rect class="vertical" height="8" width="2" y="1" x="4" />
              <rect height="2" width="8" y="4" x="1" />
            </svg>
          </button>
        </h2>

        <div class="content" hidden>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
