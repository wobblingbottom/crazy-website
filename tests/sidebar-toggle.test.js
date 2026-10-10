const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

// Sidebar tests are replaced because the mockup uses permanently visible tabs.
test('four horizontal tabs replace the collapsible sidebar', () => {
  const html = readFileSync(require.resolve('../index.html'), 'utf8');
  assert.doesNotMatch(html, /data-sidebar-toggle|id="site-sidebar"|sidebar-collapsed/);
  const nav = html.match(/<nav class="section-navigation"[\s\S]*?<\/nav>/)[0];
  assert.equal((nav.match(/data-view-target=/g) || []).length, 4);
  assert.match(nav, /data-view-target="posts" aria-current="page">Posts/);
  assert.match(nav, /data-view-target="narrator">Projects/);
});

test('tab changes update active styling and the accessible current page', () => {
  const source = readFileSync(require.resolve('../script.js'), 'utf8');
  const buttons = ['posts', 'comics', 'commissions', 'narrator'].map(name => ({
    name, active: false, attrs: {},
    getAttribute() { return this.name; },
    classList: { toggle(_, active) { buttons.find(button => button.name === name).active = active; } },
    setAttribute(key, value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; }
  }));
  const context = { VALID_VIEWS: new Set(buttons.map(button => button.name)), navButtons: buttons,
    contentViews: [], window: { location: { hash: '#posts' } },
    updateLoginTarget() {}, setLogoutConfirmation() {} };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function setActiveView('), source.indexOf('function getInitialView(')), context);
  for (const name of ['comics', 'narrator', 'posts']) {
    context.setActiveView(name);
    assert.deepEqual(buttons.filter(button => button.active).map(button => button.name), [name]);
    assert.deepEqual(buttons.filter(button => button.attrs['aria-current']).map(button => button.name), [name]);
  }
});

test('power login icon remains intact and usernames are rendered as text', () => {
  const html = readFileSync(require.resolve('../index.html'), 'utf8');
  const source = readFileSync(require.resolve('../script.js'), 'utf8');
  assert.match(html, /class="login-button" href="\/login" aria-label="Log in with Discord"/);
  assert.match(html, /class="power-icon"/);
  const attrs = {};
  const context = { loginButton: { setAttribute(key, value) { attrs[key] = value; } },
    loginStatus: { textContent: '' }, currentUser: { username: '<test>' },
    currentUserIsAdmin: false, updateLoginTarget() {} };
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function renderLoginUserButton('), source.indexOf('function setActiveView(')), context);
  context.renderLoginUserButton();
  assert.equal(context.loginStatus.textContent, 'Logged in as: <test>');
  assert.equal(attrs['aria-label'], 'Log out');
  context.currentUserIsAdmin = true;
  context.renderLoginUserButton();
  assert.equal(attrs['aria-label'], 'Open dashboard');
});
