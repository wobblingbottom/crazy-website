const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');

function readJson(relativePath) {
  return JSON.parse(readFileSync(require.resolve(relativePath), 'utf8'));
}

test('sample comics include published series and a readable episode', () => {
  const comics = readJson('../data/comics.json');

  assert.ok(comics.length >= 2);
  assert.ok(comics.every((comic) => comic.status === 'published'));
  assert.ok(comics.some((comic) => comic.episodes.some((episode) => episode.panels.length >= 2)));
});

test('sample commission offerings are open and contain preview images', () => {
  const offerings = readJson('../data/commission-offerings.json');

  assert.ok(offerings.length >= 2);
  assert.ok(offerings.every((offering) => offering.status === 'open'));
  assert.ok(offerings.every((offering) => offering.exampleImageUrls.length >= 1));
});
