import { LitElement, html } from 'lit-element';
import { styles } from './styles';

class ToggleLit extends LitElement {
  static get properties() {
    return { summary: String, open: Boolean };
  }

  static get styles() {
    return styles;
  }

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.open = !this.open;
  }

  render() {
    return html`
      <h2>
        <button ?aria-expanded="${this.open}" @click="${this.toggle}">
          <span class="summary">${this.summary}</span>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10" fill="currentColor">
            <rect class="vertical" height="8" width="2" y="1" x="4" />
            <rect height="2" width="8" y="4" x="1" />
          </svg>
        </button>
      </h2>

      <div class="content" ?hidden="${!this.open}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('toggle-lit', ToggleLit);
