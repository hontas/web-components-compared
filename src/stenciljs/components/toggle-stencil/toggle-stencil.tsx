import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'toggle-stencil',
  shadow: true,
  styleUrl: 'toggle-stencil.css'
})
export class ToggleStencil {
  constructor() {
    this.toggle = this.toggle.bind(this);
  }

  @Prop() summary: string;

  @Prop() open: boolean = false;

  toggle() {
    this.open = !this.open;
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

        <div class="content" hidden={!this.open}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
