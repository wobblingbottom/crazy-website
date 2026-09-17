const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');

const server = readFileSync(require.resolve('../server.js'), 'utf8');
const client = readFileSync(require.resolve('../script.js'), 'utf8');
const packageJson = require('../package.json');

test('authentication uses persistent sessions and secure response headers', () => {
  assert.equal(typeof packageJson.dependencies.helmet, 'string');
  assert.match(server, /class FileSessionStore extends session\.Store/);
  assert.match(server, /store: new FileSessionStore\(sessionsDir\)/);
  assert.match(server, /helmet\(\{/);
  assert.match(server, /app\.disable\("x-powered-by"\)/);
  assert.match(server, /app\.set\("trust proxy", 1\)/);
});

test('OAuth callback rotates and saves the authenticated session', () => {
  assert.match(server, /await regenerateSession\(req\)/);
  assert.match(server, /await saveSession\(req\)/);
  assert.match(server, /state !== req\.session\.oauthState/);
});

test('return paths cannot redirect outside Crazyland', () => {
  assert.match(server, /function getSafeReturnPath/);
  assert.match(server, /value\.startsWith\("\/\/"\)/);
  assert.match(server, /getSafeReturnPath\(req\.query\.returnTo\)/);
  assert.match(server, /getSafeReturnPath\(req\.session\.returnTo\)/);
});

test('state-changing requests require the same origin', () => {
  assert.match(server, /\["GET", "HEAD", "OPTIONS"\]\.includes\(req\.method\)/);
  assert.match(server, /new URL\(source\)\.origin !== getRequestOrigin\(req\)/);
  assert.match(server, /Cross-site request blocked/);
});

test('logout is POST-only on the server and in the browser', () => {
  assert.match(server, /app\.post\("\/logout"/);
  assert.doesNotMatch(server, /app\.get\("\/logout"/);
  assert.match(client, /fetch\('\/logout', \{ method: 'POST' \}\)/);
  assert.doesNotMatch(server, /href="\/logout"/);
});
