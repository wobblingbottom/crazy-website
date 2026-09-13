const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

test('Narrator supports direct links and navigation back to the existing sections', () => {
  const source = readFileSync(require.resolve('../script.js'), 'utf8');
  const html = readFileSync(require.resolve('../index.html'), 'utf8');
  const names = [...html.matchAll(/data-view="([^"]+)"/g)].map(match => match[1]);
  const makeElements = () => names.map(name => ({
    name, active: false,
    getAttribute() { return this.name; },
    classList: { toggle: (_, active) => { elementStates.set(name, active); } }
  }));
  const elementStates = new Map();
  const context = {
    window: { location: { hash: '#narrator' } },
    navButtons: makeElements(), contentViews: makeElements(),
    updateLoginTarget() {}, setLogoutConfirmation() {}
  };
  vm.createContext(context);
  vm.runInContext(
    source.match(/const VALID_VIEWS = .*;/)[0] + '\nlet currentView = "posts";\n' +
    source.slice(source.indexOf('function setActiveView('), source.indexOf('function setCommissionMessage(')),
    context
  );
  assert.equal(vm.runInContext('getInitialView()', context), 'narrator');
  for (const name of ['narrator', 'posts', 'comics', 'commissions']) {
    vm.runInContext(`setActiveView('${name}')`, context);
    assert.equal(context.window.location.hash.replace(/^#/, ''), name);
    assert.deepEqual([...elementStates].filter(([, active]) => active).map(([key]) => key), [name]);
  }
  context.window.location.hash = '#unknown';
  assert.equal(vm.runInContext('getInitialView()', context), 'posts');
});
