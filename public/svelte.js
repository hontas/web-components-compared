(function(l, r) {
  if (l.getElementById('livereloadscript')) return;
  r = l.createElement('script');
  r.async = 1;
  r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1';
  r.id = 'livereloadscript';
  l.head.appendChild(r);
})(window.document);
function noop() {}
function add_location(element, file, line, column, char) {
  element.__svelte_meta = {
    loc: { file, line, column, char }
  };
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === 'function';
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(' ');
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else node.setAttribute(attribute, value);
}
function children(element) {
  return Array.from(element.childNodes);
}
function custom_event(type, detail) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, false, false, detail);
  return e;
}

let current_component;
function set_current_component(component) {
  current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function flush() {
  const seen_callbacks = new Set();
  do {
    // first, call beforeUpdate functions
    // and update components
    while (dirty_components.length) {
      const component = dirty_components.shift();
      set_current_component(component);
      update(component.$$);
    }
    while (binding_callbacks.length) binding_callbacks.pop()();
    // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        callback();
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
}
function update($$) {
  if ($$.fragment) {
    $$.update($$.dirty);
    run_all($$.before_update);
    $$.fragment.p($$.dirty, $$.ctx);
    $$.dirty = null;
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target, anchor) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment.m(target, anchor);
  // onMount happens before the initial afterUpdate
  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);
    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      // Edge case - component was destroyed immediately,
      // most likely as a result of a binding initialising
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  if (component.$$.fragment) {
    run_all(component.$$.on_destroy);
    component.$$.fragment.d(detaching);
    // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)
    component.$$.on_destroy = component.$$.fragment = null;
    component.$$.ctx = {};
  }
}
function make_dirty(component, key) {
  if (!component.$$.dirty) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty = blank_object();
  }
  component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, prop_names) {
  const parent_component = current_component;
  set_current_component(component);
  const props = options.props || {};
  const $$ = (component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props: prop_names,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty: null
  });
  let ready = false;
  $$.ctx = instance
    ? instance(component, props, (key, ret, value = ret) => {
        if ($$.ctx && not_equal($$.ctx[key], ($$.ctx[key] = value))) {
          if ($$.bound[key]) $$.bound[key](value);
          if (ready) make_dirty(component, key);
        }
        return ret;
      })
    : props;
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment($$.ctx);
  if (options.target) {
    if (options.hydrate) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment.l(children(options.target));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement !== 'undefined') {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
      // @ts-ignore todo: improve typings
      for (const key in this.$$.slotted) {
        // @ts-ignore todo: improve typings
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      // TODO should this delegate to addEventListener?
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
    $set() {
      // overridden by instance, if it has props
    }
  };
}

function dispatch_dev(type, detail) {
  document.dispatchEvent(custom_event(type, detail));
}
function append_dev(target, node) {
  dispatch_dev('SvelteDOMInsert', { target, node });
  append(target, node);
}
function insert_dev(target, node, anchor) {
  dispatch_dev('SvelteDOMInsert', { target, node, anchor });
  insert(target, node, anchor);
}
function detach_dev(node) {
  dispatch_dev('SvelteDOMRemove', { node });
  detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
  const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
  if (has_prevent_default) modifiers.push('preventDefault');
  if (has_stop_propagation) modifiers.push('stopPropagation');
  dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
  const dispose = listen(node, event, handler, options);
  return () => {
    dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
    dispose();
  };
}
function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
  else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
  node[property] = value;
  dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
  data = '' + data;
  if (text.data === data) return;
  dispatch_dev('SvelteDOMSetData', { node: text, data });
  text.data = data;
}

/* src/svelte/toggle-svelte.svelte generated by Svelte v3.12.1 */

const file = 'src/svelte/toggle-svelte.svelte';

function create_fragment(ctx) {
  var h2, button, a, t0, t1, svg, rect0, rect1, t2, div, slot, div_hidden_value, dispose;

  const block = {
    c: function create() {
      h2 = element('h2');
      button = element('button');
      a = element('a');
      t0 = text(ctx.summary);
      t1 = space();
      svg = svg_element('svg');
      rect0 = svg_element('rect');
      rect1 = svg_element('rect');
      t2 = space();
      div = element('div');
      slot = element('slot');
      this.c = noop;
      attr_dev(a, 'name', ctx.summary);
      attr_dev(a, 'class', 'summary');
      add_location(a, file, 36, 4, 560);
      attr_dev(rect0, 'class', 'vertical');
      attr_dev(rect0, 'height', '8');
      attr_dev(rect0, 'width', '2');
      attr_dev(rect0, 'y', '1');
      attr_dev(rect0, 'x', '4');
      add_location(rect0, file, 38, 6, 701);
      attr_dev(rect1, 'height', '2');
      attr_dev(rect1, 'width', '8');
      attr_dev(rect1, 'y', '4');
      attr_dev(rect1, 'x', '1');
      add_location(rect1, file, 39, 6, 766);
      attr_dev(svg, 'aria-hidden', 'true');
      attr_dev(svg, 'focusable', 'false');
      attr_dev(svg, 'viewBox', '0 0 10 10');
      attr_dev(svg, 'fill', 'currentColor');
      add_location(svg, file, 37, 4, 612);
      attr_dev(button, 'aria-expanded', ctx.open);
      add_location(button, file, 35, 2, 508);
      add_location(h2, file, 34, 0, 501);
      add_location(slot, file, 45, 2, 877);
      attr_dev(div, 'class', 'content');
      div.hidden = div_hidden_value = !ctx.open;
      add_location(div, file, 44, 0, 838);
      dispose = listen_dev(button, 'click', ctx.toggle);
    },

    l: function claim(nodes) {
      throw new Error('options.hydrate only works if the component was compiled with the `hydratable: true` option');
    },

    m: function mount(target, anchor) {
      insert_dev(target, h2, anchor);
      append_dev(h2, button);
      append_dev(button, a);
      append_dev(a, t0);
      append_dev(button, t1);
      append_dev(button, svg);
      append_dev(svg, rect0);
      append_dev(svg, rect1);
      insert_dev(target, t2, anchor);
      insert_dev(target, div, anchor);
      append_dev(div, slot);
    },

    p: function update(changed, ctx) {
      if (changed.summary) {
        set_data_dev(t0, ctx.summary);
        attr_dev(a, 'name', ctx.summary);
      }

      if (changed.open) {
        attr_dev(button, 'aria-expanded', ctx.open);
      }

      if (changed.open && div_hidden_value !== (div_hidden_value = !ctx.open)) {
        prop_dev(div, 'hidden', div_hidden_value);
      }
    },

    i: noop,
    o: noop,

    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(h2);
        detach_dev(t2);
        detach_dev(div);
      }

      dispose();
    }
  };
  dispatch_dev('SvelteRegisterBlock', { block, id: create_fragment.name, type: 'component', source: '', ctx });
  return block;
}

function instance($$self, $$props, $$invalidate) {
  let { summary = '', open = false } = $$props;

  const toggle = () => {
    $$invalidate('open', (open = !open));
  };

  const writable_props = ['summary', 'open'];
  Object.keys($$props).forEach((key) => {
    if (!writable_props.includes(key) && !key.startsWith('$$'))
      console.warn(`<toggle-svelte> was created with unknown prop '${key}'`);
  });

  $$self.$set = ($$props) => {
    if ('summary' in $$props) $$invalidate('summary', (summary = $$props.summary));
    if ('open' in $$props) $$invalidate('open', (open = $$props.open));
  };

  $$self.$capture_state = () => {
    return { summary, open };
  };

  $$self.$inject_state = ($$props) => {
    if ('summary' in $$props) $$invalidate('summary', (summary = $$props.summary));
    if ('open' in $$props) $$invalidate('open', (open = $$props.open));
  };

  return { summary, open, toggle };
}

class Toggle_svelte extends SvelteElement {
  constructor(options) {
    super();

    this.shadowRoot.innerHTML = `<style>h2{margin:0}button{all:inherit;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:0.5em 0;width:100%}button svg{height:1em;margin-left:0.5em}[aria-expanded='true'] .vertical{display:none}
		/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLXN2ZWx0ZS5zdmVsdGUiLCJzb3VyY2VzIjpbInRvZ2dsZS1zdmVsdGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gIGV4cG9ydCBsZXQgc3VtbWFyeSA9ICcnO1xuICBleHBvcnQgbGV0IG9wZW4gPSBmYWxzZTtcblxuICBjb25zdCB0b2dnbGUgPSAoKSA9PiB7XG4gICAgb3BlbiA9ICFvcGVuO1xuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgaDIge1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gIGJ1dHRvbiB7XG4gICAgYWxsOiBpbmhlcml0O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHBhZGRpbmc6IDAuNWVtIDA7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgYnV0dG9uIHN2ZyB7XG4gICAgaGVpZ2h0OiAxZW07XG4gICAgbWFyZ2luLWxlZnQ6IDAuNWVtO1xuICB9XG5cbiAgW2FyaWEtZXhwYW5kZWQ9J3RydWUnXSAudmVydGljYWwge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbjwvc3R5bGU+XG5cbjxzdmVsdGU6b3B0aW9ucyB0YWc9XCJ0b2dnbGUtc3ZlbHRlXCIgLz5cbjxoMj5cbiAgPGJ1dHRvbiBhcmlhLWV4cGFuZGVkPXtvcGVufSBvbjpjbGljaz17dG9nZ2xlfT5cbiAgICA8YSBuYW1lPXtzdW1tYXJ5fSBjbGFzcz1cInN1bW1hcnlcIj57c3VtbWFyeX08L2E+XG4gICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIHZpZXdCb3g9XCIwIDAgMTAgMTBcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+XG4gICAgICA8cmVjdCBjbGFzcz1cInZlcnRpY2FsXCIgaGVpZ2h0PVwiOFwiIHdpZHRoPVwiMlwiIHk9XCIxXCIgeD1cIjRcIiAvPlxuICAgICAgPHJlY3QgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiOFwiIHk9XCI0XCIgeD1cIjFcIiAvPlxuICAgIDwvc3ZnPlxuICA8L2J1dHRvbj5cbjwvaDI+XG5cbjxkaXYgY2xhc3M9XCJjb250ZW50XCIgaGlkZGVuPXshb3Blbn0+XG4gIDxzbG90IC8+XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVRSxFQUFFLEFBQUMsQ0FBQyxBQUNGLE1BQU0sQ0FBRSxDQUFDLEFBQ1gsQ0FBQyxBQUVELE1BQU0sQUFBQyxDQUFDLEFBQ04sR0FBRyxDQUFFLE9BQU8sQ0FDWixNQUFNLENBQUUsT0FBTyxDQUNmLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZUFBZSxDQUFFLGFBQWEsQ0FDOUIsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsT0FBTyxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQ2hCLEtBQUssQ0FBRSxJQUFJLEFBQ2IsQ0FBQyxBQUNELE1BQU0sQ0FBQyxHQUFHLEFBQUMsQ0FBQyxBQUNWLE1BQU0sQ0FBRSxHQUFHLENBQ1gsV0FBVyxDQUFFLEtBQUssQUFDcEIsQ0FBQyxBQUVELENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQUFBQyxDQUFDLEFBQ2hDLE9BQU8sQ0FBRSxJQUFJLEFBQ2YsQ0FBQyJ9 */</style>`;

    init(this, { target: this.shadowRoot }, instance, create_fragment, safe_not_equal, ['summary', 'open']);

    if (options) {
      if (options.target) {
        insert_dev(options.target, this, options.anchor);
      }

      if (options.props) {
        this.$set(options.props);
        flush();
      }
    }
  }

  static get observedAttributes() {
    return ['summary', 'open'];
  }

  get summary() {
    return this.$$.ctx.summary;
  }

  set summary(summary) {
    this.$set({ summary });
    flush();
  }

  get open() {
    return this.$$.ctx.open;
  }

  set open(open) {
    this.$set({ open });
    flush();
  }
}

customElements.define('toggle-svelte', Toggle_svelte);

export { Toggle_svelte as svelteComponent };
//# sourceMappingURL=svelte.js.map
