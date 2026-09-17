const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');

test('post cards render without decorative borders', () => {
  const script = readFileSync(require.resolve('../script.js'), 'utf8');
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.doesNotMatch(script, /post-frame/);
  assert.doesNotMatch(styles, /\.post-frame/);
  assert.match(styles, /\.post-card\s*\{[^}]*border:\s*0;/s);
});

test('rectangular controls and surfaces use minimally rounded corners', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');
  const nonCircularRadii = [...styles.matchAll(/border-radius:\s*([^;]+);/g)]
    .map(([, radius]) => radius.trim())
    .filter((radius) => radius !== '0' && radius !== '2px' && radius !== '999px' && radius !== 'inherit');

  assert.deepEqual(nonCircularRadii, []);
});

test('commission information panel displays the page background', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.match(styles, /body\s*\{[^}]*background:\s*var\(--page-background\);/s);
  assert.match(styles, /\.commission-policy\s*\{[^}]*linear-gradient\(rgba\(255, 255, 255, 0\.72\)[^}]*var\(--page-background\);[^}]*background-attachment:\s*fixed, fixed;/s);
  assert.match(styles, /\.commission-policy\s*\{[^}]*color:\s*#f45f77;/s);
  assert.match(styles, /\.commission-policy-tos\s*\{[^}]*color:\s*#f45f77;/s);
  const policyStyles = styles.match(/\.commission-policy\s*\{([^}]*)\}/s)?.[1] || '';
  assert.doesNotMatch(policyStyles, /(?:box|text)-shadow/);
});

test('commission offering cards match the information panel without a glow', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.match(styles, /\.commission-type-copy\s*\{[^}]*var\(--page-background\);[^}]*color:\s*#f45f77;/s);
  assert.match(styles, /\.commission-type-card-selected\s*\{[^}]*box-shadow:\s*none;[^}]*transform:\s*none;/s);
  const offeringStyles = styles.match(/\.commission-type-copy\s*\{([^}]*)\}/s)?.[1] || '';
  assert.doesNotMatch(offeringStyles, /(?:box|text)-shadow/);
});

test('comic information boxes use the flat page-background treatment', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');
  const comicStyles = styles.match(/\.comic-copy\s*\{([^}]*)\}/s)?.[1] || '';

  assert.match(comicStyles, /var\(--page-background\)/);
  assert.match(comicStyles, /color:\s*#f45f77/);
  assert.match(comicStyles, /box-shadow:\s*none/);
  assert.doesNotMatch(comicStyles, /text-shadow/);
  assert.match(comicStyles, /height:\s*var\(--commission-card-height\)/);
  assert.match(comicStyles, /padding:\s*8px 16px/);
  assert.match(styles, /\.comic-image\s*\{[^}]*height:\s*var\(--commission-card-height\)/s);
  assert.match(styles, /\.comic-text\s*\{[^}]*-webkit-line-clamp:\s*2;/s);
});

test('commission form fields match the flat information-box treatment', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');
  const fieldStyles = styles.match(/\.commission-form input,\s*\.commission-form textarea\s*\{([^}]*)\}/s)?.[1] || '';

  assert.match(fieldStyles, /var\(--page-background\)/);
  assert.match(fieldStyles, /color:\s*#f45f77/);
  assert.match(fieldStyles, /font-family:\s*inherit/);
  assert.match(fieldStyles, /font-synthesis:\s*none/);
  assert.match(fieldStyles, /font-weight:\s*400/);
  assert.doesNotMatch(fieldStyles, /(?:box|text)-shadow/);
  assert.match(styles, /\.commission-form input\[type="file"\]::file-selector-button\s*\{[^}]*color:\s*#f45f77/s);
  assert.match(styles, /\.commission-form input:focus,\s*\.commission-form textarea:focus\s*\{[^}]*border-color:\s*#1b1b1b;[^}]*color:\s*#1b1b1b;/s);
});

test('commission preview images remain intact on small screens', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.commission-type-card\s*\{[^}]*height:\s*auto;[^}]*min-height:\s*0;/s);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.commission-type-image\s*\{[^}]*aspect-ratio:\s*16 \/ 9;/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*?\.commission-type-image\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*1;/s);
});

test('commission content stays centered with white space on small screens', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.commission-policy\s*\{[^}]*width:\s*calc\(100% - 40px\);[^}]*margin-right:\s*auto;[^}]*margin-left:\s*auto;/s);
  assert.match(styles, /@media \(max-width: 900px\)[\s\S]*?\.commission-types\s*\{[^}]*width:\s*100%;[^}]*margin-right:\s*0;[^}]*margin-left:\s*0;[^}]*padding:\s*0 20px 70px;/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*?\.content-view\[data-view="commissions"\]\s*\{[^}]*right:\s*0;[^}]*left:\s*0;/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*?\.commission-policy\s*\{[^}]*width:\s*calc\(100% - 48px\);/s);
  assert.match(styles, /@media \(max-width: 600px\)[\s\S]*?\.commission-types\s*\{[^}]*width:\s*100%;[^}]*padding-right:\s*24px;[^}]*padding-left:\s*24px;/s);
});

test('a readable system font is used consistently across the site', () => {
  const styles = readFileSync(require.resolve('../styles.css'), 'utf8');

  assert.match(styles, /body\s*\{[^}]*font-family:\s*system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;/s);
  assert.doesNotMatch(styles, /font-family:\s*"(?:JMH Typewriter|Rayman)"/);
  assert.match(styles, /body\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.6;[^}]*letter-spacing:\s*0\.01em;/s);
  assert.match(styles, /:root\s*\{[^}]*font-size:\s*16px;/s);
  assert.match(styles, /\.modal-episode p,[\s\S]*\.commission-type-description\s*\{\s*font-size:\s*0\.875rem;\s*line-height:\s*1\.5;\s*letter-spacing:\s*0\.02em;/);
  assert.match(styles, /\.narrator-page,\s*\.narrator-page code\s*\{\s*letter-spacing:\s*0\.01em;/);
  assert.match(styles, /\.narrator-page\s*\{[^}]*line-height:\s*1\.55;/s);
});
