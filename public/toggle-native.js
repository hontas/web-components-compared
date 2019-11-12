(function(l, r) {
  if (l.getElementById('livereloadscript')) return;
  r = l.createElement('script');
  r.async = 1;
  r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1';
  r.id = 'livereloadscript';
  l.head.appendChild(r);
})(window.document);
const template = `
  <h2>
    <button aria-expanded="false">
      <a name="" class="summary"></a>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10" fill="currentColor">
        <rect class="vertical" height="8" width="2" y="1" x="4"/>
        <rect height="2" width="8" y="4" x="1"/>
      </svg>
    </button>
  </h2>

  <div class="content" hidden>
    <slot></slot>
  </div>

  <style>
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

  [aria-expanded="true"] .vertical {
    display: none;
  }
  </style>
`;

class ToggleSection extends HTMLElement {
  static get observedAttributes() {
    return ['summary', 'open'];
  }

  constructor() {
    super();

    this.toggle = this.toggle.bind(this);

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;

    this.$button = this.shadowRoot.querySelector('button');
    this.$summary = this.shadowRoot.querySelector('.summary');
  }

  connectedCallback() {
    if (!this.hasAttribute('summary')) {
      console.warn('<toggle-section> - requires attribute "summary".');
    }

    this.$button.addEventListener('click', this.toggle);
  }

  disconnectedCallback() {
    this.$button.removeEventListener('click', this.toggle);
  }

  attributeChangedCallback(name, oldValue, value) {
    switch (name) {
      case 'summary':
        return this.onSummaryChange(value);
      case 'open': {
        return this.onOpenChange();
      }
      default:
        console.warn(`<toggle-section> - unhandles attribute "${name}"`);
    }
  }

  toggle() {
    this.toggleAttribute('open');
  }

  onSummaryChange(value) {
    this.$summary.textContent = value;
    this.$summary.setAttribute('name', value);
  }

  onOpenChange() {
    const expanded = this.hasAttribute('open');
    this.$button.setAttribute('aria-expanded', expanded);
    this.shadowRoot.querySelector('.content').hidden = !expanded;
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) {
      this.setAttribute('open', val);
    } else {
      this.removeAttribute('open');
    }
  }
}

customElements.define('toggle-section', ToggleSection);
//# sourceMappingURL=toggle-native.js.map
