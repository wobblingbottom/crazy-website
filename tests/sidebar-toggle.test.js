const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(require.resolve('../script.js'), 'utf8').split('const navButtons =')[0];

function setup() {
  const events = {};
  const attributes = {};
  const classes = new Set();
  const sidebar = { inert: false, hidden: false, addEventListener: (name, handler) => { events[name] = handler; } };
  const button = {
    focused: false,
    setAttribute: (name, value) => { attributes[name] = value; },
    addEventListener: (name, handler) => { events[name] = handler; },
    focus() { this.focused = true; }
  };
  const elements = {
    '[data-sidebar-toggle]': button,
    '#site-sidebar': sidebar,
    '.layout': { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } }
  };
  vm.runInNewContext(source, { document: { querySelector: (selector) => elements[selector] } });
  return { events, attributes, classes, sidebar, button };
}

test('hamburger closes and reopens the entire sidebar and releases its grid column', () => {
  const state = setup();
  state.events.click();
  assert.equal(state.sidebar.inert, true);
  assert.equal(state.sidebar.hidden, false, 'sidebar stays rendered so its exit can animate');
  assert.equal(state.attributes['aria-expanded'], 'false');
  assert.equal(state.attributes['aria-label'], 'Open navigation');
  assert.ok(state.classes.has('sidebar-collapsed'));
  state.events.click();
  assert.equal(state.sidebar.inert, false);
  assert.equal(state.attributes['aria-expanded'], 'true');
  assert.equal(state.attributes['aria-label'], 'Close navigation');
  assert.equal(state.classes.has('sidebar-collapsed'), false);
});

test('rapid toggles reverse immediately without delayed state changes', () => {
  const state = setup();
  for (let click = 0; click < 5; click += 1) state.events.click();
  assert.equal(state.sidebar.inert, true);
  state.events.click();
  assert.equal(state.sidebar.inert, false);
  assert.equal(state.attributes['aria-expanded'], 'true');
});

test('Escape inside the sidebar closes it and returns keyboard focus to the toggle', () => {
  const state = setup();
  state.events.keydown({ key: 'ArrowDown' });
  assert.equal(state.sidebar.inert, false);
  state.events.keydown({ key: 'Escape' });
  assert.equal(state.sidebar.inert, true);
  assert.equal(state.button.focused, true);
});
