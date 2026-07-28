/* Smoke test for scene modules — runs every scene against a stub DOM so a
   typo never reaches the browser. No dependencies: node tools/smoke.mjs */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scenesDir = join(root, 'js', 'scenes');

/* ── stub DOM ─────────────────────────────────────────────────── */

class Style {
  constructor() { this._p = {}; }
  setProperty(k, v) { this._p[k] = v; }
  getPropertyValue(k) { return this._p[k] ?? ''; }
  set cssText(v) { this._p.cssText = v; }
  get cssText() { return this._p.cssText ?? ''; }
}
const styleProxy = () => new Proxy(new Style(), {
  get: (t, k) => (k in t ? t[k] : t._p[k] ?? ''),
  set: (t, k, v) => { if (k in t) t[k] = v; else t._p[k] = v; return true; }
});

class Node {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.children = [];
    this.attrs = {};
    this.dataset = {};
    this.style = styleProxy();
    this._text = '';
    this._class = '';
    this.classList = {
      _n: this,
      add: (...c) => { this._n._class = (this._n._class + ' ' + c.join(' ')).trim(); },
      remove: () => {},
      toggle: () => {},
      contains: (c) => this._n._class.split(/\s+/).includes(c)
    };
  }
  get className() { return this._class; }
  set className(v) { this._class = String(v); }
  get textContent() { return this._text + this.children.map((c) => c.textContent ?? '').join(''); }
  set textContent(v) { this._text = String(v); this.children = []; }
  appendChild(c) { if (c == null) throw new Error('appendChild(null)'); this.children.push(c); return c; }
  append(...cs) { cs.forEach((c) => this.appendChild(c)); }
  insertBefore(c) { this.children.unshift(c); return c; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  removeAttribute(k) { delete this.attrs[k]; }
  addEventListener() {}
  removeEventListener() {}
  querySelector() { return null; }
  querySelectorAll() { return []; }
  remove() {}
  get offsetHeight() { return 100; }
  get clientWidth() { return 340; }
}
class TextNode {
  constructor(t) { this._t = String(t); }
  get textContent() { return this._t; }
}

const doc = {
  createElement: (t) => new Node(t),
  createElementNS: (_ns, t) => new Node(t),
  createTextNode: (t) => new TextNode(t),
  head: new Node('head'),
  body: new Node('body'),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};

/* ── LogoLab stub ─────────────────────────────────────────────── */

const registered = [];
const cssBlocks = [];

function el(tag, cls, content) {
  const n = new Node(tag);
  if (cls) n.className = cls;
  if (content == null) return n;
  if (Array.isArray(content)) content.forEach((c) => { if (c) n.appendChild(typeof c === 'string' ? new TextNode(c) : c); });
  else if (typeof content === 'string' || typeof content === 'number') n.textContent = String(content);
  else n.appendChild(content);
  return n;
}

const LogoLab = {
  register: (s) => registered.push({ ...s, _file: current }),
  css: (t) => cssBlocks.push({ text: t, file: current }),
  groups: ['social', 'messaging', 'web', 'favicon', 'link', 'app', 'print', 'stress'].map((id) => ({ id })),
  el,
  icon: () => new Node('svg')
};

const ctx = {
  el,
  icon: () => new Node('svg'),
  logo: (size, opts) => {
    if (typeof size !== 'number' || !isFinite(size) || size <= 0) throw new Error('ctx.logo() needs a positive px size, got ' + size);
    if (opts && opts.shape && !['auto', 'circle', 'squircle', 'rounded', 'sharp'].includes(opts.shape)) {
      throw new Error('unknown shape "' + opts.shape + '"');
    }
    return new Node('div');
  },
  logoWide: (w, h) => {
    if (!(w > 0 && h > 0)) throw new Error('ctx.logoWide() needs positive w/h');
    return new Node('div');
  },
  img: { src: 'data:,', w: 512, h: 512 },
  brand: 'Astra AI',
  handle: 'astra_ai',
  domain: 'astra-ai.co',
  tagline: 'Ship the boring parts faster',
  person: 'Andraž',
  role: 'Founder',
  accent: '#5b6cff',
  accentInk: '#ffffff',
  palette: [{ hex: '#5b6cff', rgb: [91, 108, 255], share: 0.4, chroma: 0.6, lum: 0.3 }],
  state: {}
};

/* ── run ──────────────────────────────────────────────────────── */

const sandbox = {
  window: { LogoLab },
  document: doc,
  console,
  Image: class { constructor() { this.src = ''; } },
  navigator: { clipboard: { writeText() {} } },
  setTimeout: () => 0,
  requestAnimationFrame: () => 0,
  Math,
  Date,
  JSON
};
sandbox.window.document = doc;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

let current = '';
const problems = [];
const only = process.argv.slice(2).map((a) => a.replace(/^.*\//, ''));
const files = readdirSync(scenesDir)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => !only.length || only.includes(f))
  .sort();

if (!files.length) { console.log('no scene files yet'); process.exit(0); }

for (const f of files) {
  current = f;
  const code = readFileSync(join(scenesDir, f), 'utf8');

  for (const [re, msg] of [
    [/\bfetch\s*\(/, 'uses fetch()'],
    [/https?:\/\/(?!www\.w3\.org)/, 'references a remote URL'],
    [/@import/, 'uses @import'],
    [/window\.addEventListener/, 'listens on window'],
    [/document\.(getElementById|querySelector)\b/, 'reaches outside its own tree'],
    [/setInterval\s*\(/, 'sets an interval']
  ]) if (re.test(code)) problems.push(`${f}: ${msg}`);

  try {
    vm.runInContext(code, sandbox, { filename: f });
  } catch (e) {
    problems.push(`${f}: failed to load — ${e.message}`);
  }
}

const ids = new Map();
const prefixes = new Map();

for (const b of cssBlocks) {
  for (const m of b.text.matchAll(/\.([a-z][a-z0-9]*)-[a-z0-9-]+/gi)) {
    const p = m[1];
    if (p === 'kit' || p === 'lg') continue;
    if (!prefixes.has(p)) prefixes.set(p, new Set());
    prefixes.get(p).add(b.file);
  }
}
for (const [p, fs] of prefixes) {
  if (fs.size > 1) problems.push(`class prefix ".${p}-" is used by ${[...fs].join(' and ')}`);
}

let ok = 0;
for (const s of registered) {
  const where = `${s._file}#${s.id}`;
  if (ids.has(s.id)) problems.push(`duplicate scene id "${s.id}" (${ids.get(s.id)} and ${s._file})`);
  ids.set(s.id, s._file);

  if (!LogoLab.groups.some((g) => g.id === s.group)) problems.push(`${where}: unknown group "${s.group}"`);
  if (!s.title) problems.push(`${where}: no title`);
  if (!(s.width > 40)) problems.push(`${where}: width missing or too small (${s.width})`);
  if (s.width > 2200) problems.push(`${where}: width ${s.width} is unreasonably large`);

  try {
    const node = s.render(ctx);
    if (!node || typeof node.appendChild !== 'function') throw new Error('render() did not return an element');
    if (!node.textContent && !node.children.length) throw new Error('render() returned an empty element');
    ok++;
  } catch (e) {
    problems.push(`${where}: render() threw — ${e.message}`);
  }
}

const byGroup = {};
for (const s of registered) byGroup[s.group] = (byGroup[s.group] || 0) + 1;

console.log(`scenes: ${registered.length} registered, ${ok} rendered clean`);
console.log(Object.entries(byGroup).map(([g, n]) => `  ${g.padEnd(10)} ${n}`).join('\n'));

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log('  ✗ ' + p));
  process.exit(1);
}
console.log('\nclean');
