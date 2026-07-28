/* Proof — core. Owns the plates, the registration state, the scene registry,
   the sheet and the audit. Scene modules only ever talk to LogoLab.register,
   LogoLab.css and the ctx handed to render(). */
(function () {
  'use strict';

  var GROUPS = [
    { id: 'social',    title: 'Social avatars',   desc: 'profiles, feeds, comment rows' },
    { id: 'messaging', title: 'Chat & messaging', desc: 'the 32 px world' },
    { id: 'web',       title: 'Website & product', desc: 'headers, footers, empty states' },
    { id: 'favicon',   title: 'Favicons & tabs',  desc: 'where marks go to die' },
    { id: 'link',      title: 'Link previews',    desc: 'unfurls and share cards' },
    { id: 'app',       title: 'App & device icons', desc: 'home screens, docks, stores' },
    { id: 'print',     title: 'Print & physical', desc: 'card, shirt, sign, sticker' },
    { id: 'stress',    title: 'Stress tests',     desc: 'the ones that fail it' }
  ];

  var LABELS = ['A', 'B', 'C', 'D'];
  var MAX_PLATES = 4;
  var TRUE_PX_MAX = 34;      // at or under this, show honest 1× pixels
  var FAIL = 1.6, WEAK = 2.6; // contrast ratios

  var scenes = [];
  var cssSeen = Object.create(null);
  var styleEl = null;
  var plateCss = null;
  var uid = 0;

  var state = {
    plates: [],
    active: 0,
    compare: 'single',   // single | split | blink
    blinkMs: 1000,
    truePx: true,
    /* box-level registration, shared by every plate */
    shape: 'circle',
    pad: 0,
    round: 0.22,
    bg: 'transparent',
    bgCustom: '#4f46e5',
    safe: false,
    /* sheet */
    gray: false,
    squint: 0,
    tile: 340,
    hidden: {},
    q: '',
    onlyBad: false,
    text: {
      brand: 'Astra AI', handle: 'astra_ai', domain: 'astra-ai.co',
      tagline: 'Ship the boring parts faster', person: 'Andraž', role: 'Founder'
    }
  };

  var BACKDROPS = [
    { id: 'transparent', label: 'None',   css: 'transparent' },
    { id: 'white',       label: 'White',  css: '#ffffff' },
    { id: 'black',       label: 'Black',  css: '#0d0f12' },
    { id: 'ink',         label: 'Ink',    css: '#1f2937' },
    { id: 'accent',      label: 'Accent', css: 'accent' }
  ];

  /* ── tiny DOM helpers ──────────────────────────────────────── */

  function el(tag, cls, content) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (content == null) return n;
    if (Array.isArray(content)) content.forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    else if (typeof content === 'string' || typeof content === 'number') n.textContent = String(content);
    else n.appendChild(content);
    return n;
  }
  function $(sel) { return document.querySelector(sel); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ── icon set (24×24, currentColor) ────────────────────────── */

  var ICONS = {
    heart: 'M20.4 8.6c0 5-8.4 10.2-8.4 10.2S3.6 13.6 3.6 8.6a4.4 4.4 0 0 1 8.4-1.8 4.4 4.4 0 0 1 8.4 1.8z',
    star: 'M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z',
    comment: 'M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-4.6A7.5 7.5 0 0 1 4 11.5 7.5 7.5 0 0 1 11.5 4h2A7.5 7.5 0 0 1 21 11.5z',
    share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3M8 7l4-4 4 4',
    retweet: 'M17 2l4 4-4 4M21 6H7a4 4 0 0 0-4 4v2M7 22l-4-4 4-4M3 18h14a4 4 0 0 0 4-4v-2',
    fork: 'M6 4v6a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v2M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    verified: 'M12 2.5l2.2 1.7 2.8-.2.9 2.6 2.4 1.4-1 2.6 1 2.6-2.4 1.4-.9 2.6-2.8-.2L12 21.5l-2.2-1.7-2.8.2-.9-2.6L3.7 16l1-2.6-1-2.6 2.4-1.4.9-2.6 2.8.2z',
    dots: 'M6 12h.01M12 12h.01M18 12h.01',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
    plus: 'M12 5v14M5 12h14',
    check: 'M4 12.5l5 5L20 6.5',
    lock: 'M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z',
    home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z',
    user: 'M20 21v-2a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
    mic: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zM19 11a7 7 0 0 1-14 0M12 18v4',
    camera: 'M23 18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-right': 'M9 6l6 6-6 6',
    'chevron-left': 'M15 6l-6 6 6 6',
    x: 'M18 6L6 18M6 6l12 12',
    menu: 'M3 6h18M3 12h18M3 18h18',
    reload: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
    'arrow-left': 'M19 12H5M11 18l-6-6 6-6',
    'arrow-right': 'M5 12h14M13 6l6 6-6 6',
    external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',
    play: 'M6 4l14 8-14 8z',
    folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    image: 'M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
    eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    shield: 'M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3A5 5 0 0 0 13.5 3.5l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3A5 5 0 0 0 10.5 20.5l1.7-1.7',
    bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.5 14H3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.3 7.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.4a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z',
    at: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2',
    hash: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
    smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
    paperclip: 'M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 6.5'
  };

  function icon(name, size, solid) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size || 20);
    svg.setAttribute('height', size || 20);
    svg.setAttribute('class', 'kit-i' + (solid ? ' solid' : ''));
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', ICONS[name] || ICONS.image);
    svg.appendChild(p);
    return svg;
  }

  /* ── plates ────────────────────────────────────────────────── */

  function activePlate() { return state.plates[state.active] || null; }
  function shownPlates() {
    if (state.compare === 'single') {
      var p = activePlate();
      return p ? [p] : [];
    }
    return state.plates;
  }

  function resolveBg(v) {
    var p = activePlate();
    if (v === 'accent') return (p && p.info && p.info.accent) || '#2b2f36';
    return v;
  }

  /* Honest small sizes: rasterise at the real CSS pixel count, then let the
     browser blow it up with nearest-neighbour. A retina screen otherwise
     renders a 16 px favicon with 32 real pixels and flatters the mark. */
  function truePixelSrc(plate, px) {
    var key = px + '|' + plate.zoom + '|' + plate.ox + '|' + plate.oy + '|' + plate.src.length;
    if (plate.tp && plate.tp[key]) return plate.tp[key];
    if (!plate.plateEl) return plate.src;
    var c = document.createElement('canvas');
    c.width = px; c.height = px;
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    var iw = plate.plateEl.naturalWidth || plate.w;
    var ih = plate.plateEl.naturalHeight || plate.h;
    var fit = Math.min(px / iw, px / ih);
    var fw = iw * fit, fh = ih * fit;
    var dw = fw * plate.zoom, dh = fh * plate.zoom;
    var dx = (px - dw) / 2 + (plate.ox / 100) * fw * plate.zoom;
    var dy = (px - dh) / 2 + (plate.oy / 100) * fh * plate.zoom;
    var url;
    try {
      x.drawImage(plate.plateEl, dx, dy, dw, dh);
      url = c.toDataURL('image/png');
    } catch (e) { url = plate.src; }
    plate.tp = plate.tp || {};
    plate.tp[key] = url;
    return url;
  }

  function refreshTruePixels() {
    if (!state.truePx) return;
    all('.lg-tp').forEach(function (box) {
      var s = parseFloat(box.dataset.s || '0');
      if (!s) return;
      var px = Math.max(2, Math.round(s * (1 - 2 * state.pad)));
      Array.prototype.forEach.call(box.querySelectorAll('.lg-l'), function (layer) {
        var plate = state.plates[parseInt(layer.dataset.p, 10)];
        var img = layer.firstChild;
        if (!plate || !img) return;
        var src = truePixelSrc(plate, px);
        if (img.getAttribute('src') !== src) img.setAttribute('src', src);
        img.style.width = px + 'px';
        img.style.height = px + 'px';
      });
    });
  }

  /* ── the mark ──────────────────────────────────────────────── */

  function logo(size, opts) {
    opts = opts || {};
    var s = Math.max(2, size || 40);
    var shape = opts.shape || 'auto';
    var list = shownPlates();
    var n = list.length;

    var box = el('div', 'lg lg-' + shape);
    box.style.width = s + 'px';
    box.style.height = s + 'px';
    box.style.setProperty('--lg-s', s + 'px');
    box.dataset.s = s;
    if (opts.pad != null) box.style.setProperty('--lg-pad', opts.pad);
    if (opts.radius != null) box.style.borderRadius = typeof opts.radius === 'number' ? opts.radius + 'px' : opts.radius;
    if (opts.bg) box.style.setProperty('--lg-bg', resolveBg(opts.bg));
    if (opts.ring) box.style.boxShadow = opts.ring;

    var tp = state.truePx && s <= TRUE_PX_MAX && !opts.pixel;
    if (tp) box.classList.add('lg-tp');
    if (opts.pixel || s <= 20) box.classList.add('px');

    list.forEach(function (plate, i) {
      var layer = el('span', 'lg-l');
      layer.dataset.p = state.plates.indexOf(plate);
      layer.classList.add('p' + state.plates.indexOf(plate));
      if (state.compare === 'split' && n > 1) {
        var a = (i / n) * 100, b = ((n - 1 - i) / n) * 100;
        layer.style.clipPath = 'inset(0 ' + b.toFixed(3) + '% 0 ' + a.toFixed(3) + '%)';
      }
      var img = new Image();
      img.src = plate.src;
      img.alt = '';
      img.decoding = 'async';
      layer.appendChild(img);
      box.appendChild(layer);
    });

    if (state.compare === 'split' && n > 1 && s >= 30) {
      for (var i = 1; i < n; i++) {
        var d = el('span', 'lg-div');
        d.style.left = ((i / n) * 100).toFixed(3) + '%';
        box.appendChild(d);
      }
    }
    return box;
  }

  function logoWide(w, h, opts) {
    opts = opts || {};
    var n = logo(Math.min(w, h), Object.assign({ shape: 'sharp' }, opts));
    n.style.width = w + 'px';
    n.style.height = h + 'px';
    n.style.setProperty('--lg-s', Math.min(w, h) + 'px');
    n.dataset.s = Math.min(w, h);
    return n;
  }

  /* ── registry ──────────────────────────────────────────────── */

  function register(scene) {
    if (!scene || !scene.id || typeof scene.render !== 'function') return;
    scenes.push(scene);
  }

  function css(text) {
    if (cssSeen[text]) return;
    cssSeen[text] = 1;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'scene-css';
      document.head.appendChild(styleEl);
    }
    styleEl.appendChild(document.createTextNode(text));
  }

  function ctx() {
    var t = state.text;
    var p = activePlate();
    var info = (p && p.info) || {};
    return {
      logo: logo,
      logoWide: logoWide,
      el: el,
      icon: icon,
      img: p ? { src: p.src, w: p.w, h: p.h } : { src: '', w: 1, h: 1 },
      brand: t.brand || 'Brand',
      handle: (t.handle || 'brand').replace(/^@/, ''),
      domain: (t.domain || 'brand.com').replace(/^https?:\/\//, '').replace(/\/$/, ''),
      tagline: t.tagline || '',
      person: t.person || 'Alex Chen',
      role: t.role || 'Founder',
      accent: info.accent || '#2b2f36',
      accentInk: info.accentInk || '#ffffff',
      palette: info.colors || [],
      state: state
    };
  }

  /* ── sheet ─────────────────────────────────────────────────── */

  var fitQueue = [];
  function fitAll() { fitQueue.forEach(function (f) { f(); }); }

  function mountScene(scene, c) {
    var tile = el('div', 'tile' + (scene.wide ? ' span2' : ''));
    tile.id = 'tile-' + scene.id;
    tile.dataset.scene = scene.id;
    ['a', 'b', 'c', 'd'].forEach(function (k) { tile.appendChild(el('span', 'tile-cm ' + k)); });

    var stage = el('div', 'tile-stage');
    var node;
    try {
      node = scene.render(c);
    } catch (e) {
      node = el('div', null, 'This scene failed to render: ' + e.message);
      node.style.cssText = 'padding:16px;font:12px/1.4 monospace;color:#b00';
      if (window.console) console.error('[scene ' + scene.id + ']', e);
    }
    node.classList.add('kit');
    node.style.width = (scene.width || 360) + 'px';
    stage.appendChild(node);

    var cap = el('div', 'tile-cap', [
      el('span', 'tile-flag'),
      el('span', 'tile-t', scene.title),
      scene.note ? el('span', 'tile-note', scene.note) : null,
      el('span', 'tile-s', scene.spec || '')
    ]);

    tile.appendChild(stage);
    tile.appendChild(cap);

    function fit() {
      var avail = stage.clientWidth;
      if (!avail) return;
      var k = clamp(avail / (scene.width || 360), 0.12, 1.3);
      var used = (scene.width || 360) * k;
      var dx = Math.max(0, (avail - used) / 2);
      node.style.transform = 'translate(' + dx.toFixed(2) + 'px,0) scale(' + k.toFixed(4) + ')';
      stage.style.height = Math.round(node.offsetHeight * k) + 'px';
    }
    fitQueue.push(fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
    requestAnimationFrame(fit);
    setTimeout(fit, 60);
    setTimeout(fit, 400);

    return tile;
  }

  function renderSheet() {
    var wrap = $('#groups');
    var empty = $('#empty');
    fitQueue = [];
    wrap.textContent = '';
    if (!state.plates.length) {
      empty.hidden = false;
      $('#report').hidden = true;
      return;
    }
    empty.hidden = true;

    var c = ctx();
    var q = state.q.trim().toLowerCase();
    var shown = 0;

    GROUPS.forEach(function (g, gi) {
      if (state.hidden[g.id]) return;
      var list = scenes.filter(function (s) { return s.group === g.id; });
      if (q) {
        list = list.filter(function (s) {
          return (s.title + ' ' + (s.spec || '') + ' ' + (s.note || '') + ' ' + g.title).toLowerCase().indexOf(q) > -1;
        });
      }
      if (!list.length) return;
      shown += list.length;

      var sec = el('section', 'grp');
      sec.id = 'grp-' + g.id;
      sec.appendChild(el('div', 'grp-h', [
        el('span', 'grp-n', 'PL ' + String(gi + 1).padStart(2, '0')),
        el('h2', 'grp-t', g.title),
        el('span', 'grp-d', g.desc),
        el('span', 'grp-c', list.length + ' proofs')
      ]));
      var tiles = el('div', 'tiles');
      list.forEach(function (s) { tiles.appendChild(mountScene(s, c)); });
      sec.appendChild(tiles);
      wrap.appendChild(sec);
    });

    if (!shown) {
      var msg;
      if (!scenes.length) msg = 'No scene modules loaded. js/scenes/ is empty, or the browser blocked the scripts — check the console.';
      else if (q) msg = 'Nothing on the sheet matches “' + state.q + '”.';
      else msg = 'Every section is switched off. Turn one back on under Sheet.';
      wrap.appendChild(el('p', 'sheet-none', msg));
    }

    refreshTruePixels();
    requestAnimationFrame(audit);
  }

  var rerenderT = null;
  function rerender() {
    clearTimeout(rerenderT);
    rerenderT = setTimeout(renderSheet, 90);
  }

  /* ── audit: where does this mark actually break ────────────── */

  function parseRgb(str) {
    var m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    if (p.length < 3) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  /* first opaque background colour behind this node, or null if the answer
     is a gradient or an image we cannot sample */
  function surfaceOf(node) {
    var n = node, guard = 0;
    while (n && guard++ < 30) {
      var cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      var c = parseRgb(cs.backgroundColor);
      if (c && c.a >= 0.85) return c;
      if (n.classList && n.classList.contains('tile-stage')) return null;
      n = n.parentElement;
    }
    return null;
  }

  function lumOf(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function ratio(l1, l2) {
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  /* Best contrast any meaningful ink in the mark manages against a surface.
     "Meaningful" = at least 8% of the mark's opaque area, so a single dark
     dot in a pale logo cannot pass the whole thing. */
  function scoreAgainst(colors, surf) {
    var sl = lumOf(surf.r, surf.g, surf.b);
    var best = 0;
    colors.forEach(function (c) {
      if (c.share < 0.08) return;
      var r = ratio(c.lum, sl);
      if (r > best) best = r;
    });
    if (!best && colors.length) best = ratio(colors[0].lum, sl);
    return best;
  }

  function hexOf(c) {
    return '#' + [c.r, c.g, c.b].map(function (v) {
      return ('0' + Math.round(v).toString(16)).slice(-2);
    }).join('');
  }

  var lastAudit = { rows: [], checked: 0, total: 0 };

  function audit() {
    var box = $('#report');
    var p = activePlate();
    if (!p || !p.info || !p.info.colors.length) { box.hidden = true; return; }

    var rows = [], checked = 0, total = 0;

    all('#groups .tile').forEach(function (tile) {
      /* stress tiles put the mark on hostile surfaces on purpose — auditing
         them would bury the findings that are actually news */
      var grp = tile.closest('.grp');
      if (grp && grp.id === 'grp-stress') return;

      total++;
      var marks = Array.prototype.slice.call(tile.querySelectorAll('.lg')).slice(0, 8);
      if (!marks.length) return;
      var worst = null;
      marks.forEach(function (m) {
        var surf = surfaceOf(m);
        if (!surf) return;
        var r = scoreAgainst(p.info.colors, surf);
        if (!worst || r < worst.r) worst = { r: r, surf: surf };
      });
      if (!worst) return;
      checked++;
      var bad = worst.r < FAIL, soft = !bad && worst.r < WEAK;
      tile.classList.toggle('bad', bad);
      tile.classList.toggle('soft', soft);
      if (bad || soft) {
        rows.push({
          id: tile.dataset.scene,
          title: (tile.querySelector('.tile-t') || {}).textContent || tile.dataset.scene,
          group: (tile.closest('.grp') || {}).id || '',
          r: worst.r,
          surf: hexOf(worst.surf),
          bad: bad
        });
      }
    });

    rows.sort(function (a, b) { return a.r - b.r; });
    lastAudit = { rows: rows, checked: checked, total: total };
    paintReport();
  }

  function paintReport() {
    var box = $('#report');
    var rows = lastAudit.rows;
    box.textContent = '';
    if (!state.plates.length) { box.hidden = true; return; }
    box.hidden = false;

    var fails = rows.filter(function (r) { return r.bad; }).length;
    var who = state.plates.length > 1 ? 'Plate ' + (activePlate() || {}).label + ' ' : '';

    var head = el('div', 'rep-h', [
      el('span', 'rep-n mono', 'READ'),
      el('h2', 'rep-t', fails
        ? who + (who ? 'disappears' : 'Disappears') + ' in ' + fails + ' place' + (fails === 1 ? '' : 's')
        : (rows.length
            ? who + (who ? 'holds' : 'Holds') + ' everywhere, thin in ' + rows.length
            : who + (who ? 'holds' : 'Holds') + ' on every surface')),
      el('span', 'rep-d', lastAudit.checked + ' of ' + lastAudit.total + ' proofs had a readable backdrop to measure against')
    ]);
    box.appendChild(head);

    if (!rows.length) {
      box.appendChild(el('p', 'rep-none', 'No ink in this mark drops below ' + WEAK + ':1 against any surface on the sheet.'));
      return;
    }

    var list = el('div', 'rep-list');
    rows.slice(0, 18).forEach(function (r) {
      var btn = el('button', 'rep-row' + (r.bad ? ' is-bad' : ''));
      btn.type = 'button';
      var sw = el('span', 'rep-sw');
      sw.style.background = r.surf;
      btn.appendChild(sw);
      btn.appendChild(el('span', 'rep-title', r.title));
      btn.appendChild(el('span', 'rep-ratio mono', r.r.toFixed(2) + ':1'));
      btn.appendChild(el('span', 'rep-verdict', r.bad ? 'vanishes' : 'thin'));
      btn.addEventListener('click', function () {
        var t = document.getElementById('tile-' + r.id);
        if (!t) return;
        t.scrollIntoView({ block: 'center', behavior: 'smooth' });
        t.classList.add('ping');
        setTimeout(function () { t.classList.remove('ping'); }, 1400);
      });
      list.appendChild(btn);
    });
    box.appendChild(list);

    if (rows.length > 18) box.appendChild(el('p', 'rep-more', (rows.length - 18) + ' more below threshold.'));

    var acts = el('div', 'rep-acts');
    var only = el('button', 'chip', 'Show only these');
    only.type = 'button';
    only.setAttribute('aria-pressed', String(state.onlyBad));
    only.addEventListener('click', function () {
      state.onlyBad = !state.onlyBad;
      only.setAttribute('aria-pressed', String(state.onlyBad));
      document.documentElement.classList.toggle('only-bad', state.onlyBad);
    });
    acts.appendChild(only);
    acts.appendChild(el('span', 'rep-legend', 'vanishes under ' + FAIL + ':1 · thin under ' + WEAK + ':1 · measured on the flat backdrop directly behind the mark'));
    box.appendChild(acts);
  }

  /* ── live registration ─────────────────────────────────────── */

  function pushVars() {
    var r = document.documentElement;
    r.style.setProperty('--lg-pad', state.pad);
    r.style.setProperty('--lg-round', state.round);
    r.style.setProperty('--lg-bg', resolveBg(state.bg));
    r.className = r.className.replace(/shape-\w+/, 'shape-' + state.shape);
    r.classList.toggle('safe', state.safe);
    r.classList.toggle('cmp-split', state.compare === 'split');
    r.classList.toggle('cmp-blink', state.compare === 'blink');

    var f = [];
    if (state.squint > 0) f.push('blur(' + state.squint + 'px)');
    if (state.gray) f.push('grayscale(1)');
    r.style.setProperty('--sheet-filter', f.length ? f.join(' ') : 'none');

    if (!plateCss) {
      plateCss = document.createElement('style');
      plateCss.id = 'plate-css';
      document.head.appendChild(plateCss);
    }
    plateCss.textContent = state.plates.map(function (p, i) {
      return '.lg-l.p' + i + ' img{transform:scale(' + p.zoom + ') translate(' + p.ox + '%,' + p.oy + '%)}';
    }).join('\n');

    clearTimeout(pushVars._t);
    pushVars._t = setTimeout(function () { refreshTruePixels(); audit(); }, 140);
    save();
  }

  /* ── plate intake ──────────────────────────────────────────── */

  function fmtBytes(b) {
    if (!b && b !== 0) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(b < 10240 ? 1 : 0) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function normalizeSvg(text) {
    try {
      var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      var svg = doc.documentElement;
      if (svg.nodeName.toLowerCase() !== 'svg') return null;
      var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
      if (!svg.getAttribute('width') && vb.length === 4) svg.setAttribute('width', vb[2]);
      if (!svg.getAttribute('height') && vb.length === 4) svg.setAttribute('height', vb[3]);
      if (!svg.getAttribute('width')) svg.setAttribute('width', 512);
      if (!svg.getAttribute('height')) svg.setAttribute('height', 512);
      return new XMLSerializer().serializeToString(svg);
    } catch (e) { return null; }
  }

  function acceptFile(file, targetIndex) {
    if (!file) return;
    var isSvg = /svg/i.test(file.type) || /\.svg$/i.test(file.name || '');
    var reader = new FileReader();
    reader.onload = function () {
      var src = reader.result;
      if (isSvg) {
        var fixed = normalizeSvg(String(src));
        if (fixed) src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fixed);
      }
      var type = isSvg ? 'SVG' : ((file.type || '').split('/')[1] || 'IMG').toUpperCase();
      loadPlate(src, { name: file.name || 'plate', type: type, size: file.size }, targetIndex);
    };
    if (isSvg) reader.readAsText(file); else reader.readAsDataURL(file);
  }

  /* index: undefined adds a plate, a number replaces that one */
  function loadPlate(src, meta, index, opts) {
    opts = opts || {};
    var im = new Image();
    im.onload = function () {
      var existing = typeof index === 'number' ? state.plates[index] : null;
      var plate = existing || {
        id: 'p' + (uid++),
        zoom: 1, ox: 0, oy: 0, trim: false,
        inkMap: {}, inkBase: null
      };

      plate.raw = src;
      plate.src = src;
      plate.el = im;
      plate.plateEl = im;
      plate.w = im.naturalWidth || 512;
      plate.h = im.naturalHeight || 512;
      plate.name = meta.name || plate.name || 'plate';
      plate.type = meta.type || 'PNG';
      plate.size = meta.size;
      plate.vector = /svg/i.test(plate.type);
      plate.info = window.Palette ? Palette.analyze(im) : null;
      plate.tp = {};

      if (!opts.keepSource) {
        plate.svgSource = window.Recolor ? Recolor.decode(src) : null;
        plate.inks = plate.svgSource ? Recolor.scan(plate.svgSource) : [];
        plate.inkMap = {};
        plate.inkBase = null;
      }

      if (!existing) {
        if (state.plates.length >= MAX_PLATES) state.plates.pop();
        state.plates.push(plate);
        state.active = state.plates.length - 1;
      }
      relabel();

      applyTrim(plate, function () {
        paintAll();
        if (opts.quiet) { swapSrc(); refreshTruePixels(); pushVars(); }
        else { paintInkCtrl(); pushVars(); renderSheet(); }
      });
    };
    im.onerror = function () { flash('That file would not decode. Try a PNG, SVG, JPG or WebP.'); };
    im.src = src;
  }

  function relabel() {
    state.plates.forEach(function (p, i) { p.label = LABELS[i]; });
    if (state.active >= state.plates.length) state.active = Math.max(0, state.plates.length - 1);
  }

  function applyTrim(plate, done) {
    if (!plate.trim || !plate.info || !plate.el) {
      plate.src = plate.raw;
      plate.plateEl = plate.el;
      plate.w = (plate.el && plate.el.naturalWidth) || plate.w;
      plate.h = (plate.el && plate.el.naturalHeight) || plate.h;
      plate.tp = {};
      return done && done();
    }
    try {
      var cut = Palette.trim(plate.el, plate.info.bbox);
      var im2 = new Image();
      im2.onload = function () {
        plate.src = cut;
        plate.w = im2.naturalWidth;
        plate.h = im2.naturalHeight;
        plate.plateEl = im2;
        plate.tp = {};
        done && done();
      };
      im2.onerror = function () { done && done(); };
      im2.src = cut;
    } catch (e) { done && done(); }
  }

  function swapSrc() {
    all('.lg-l').forEach(function (layer) {
      var plate = state.plates[parseInt(layer.dataset.p, 10)];
      var img = layer.firstChild;
      if (plate && img) img.setAttribute('src', plate.src);
    });
  }

  function removePlate(i) {
    state.plates.splice(i, 1);
    relabel();
    if (!state.plates.length) {
      state.compare = 'single';
      $('#btn-export').disabled = true;
      document.documentElement.classList.remove('only-bad');
      state.onlyBad = false;
    }
    paintAll();
    paintInkCtrl();
    pushVars();
    renderSheet();
  }

  function setActive(i) {
    state.active = clamp(i, 0, state.plates.length - 1);
    paintAll();
    paintInkCtrl();
    pushVars();
    syncRegistrationInputs();
    audit();
  }

  /* ── rail painting ─────────────────────────────────────────── */

  function paintAll() {
    paintPlates();
    paintThumbHint();
    paintSpec();
    paintInk();
    paintWarnings();
    var has = state.plates.length > 0;
    $('#btn-export').disabled = !has;
    $('#drop').classList.toggle('has', has);
    $('#cmpfield').hidden = state.plates.length < 2;
  }

  function paintPlates() {
    var list = $('#platelist');
    list.textContent = '';
    list.hidden = !state.plates.length;

    state.plates.forEach(function (p, i) {
      var row = el('div', 'plate' + (i === state.active ? ' is-on' : ''));

      var pick = el('button', 'plate-pick');
      pick.type = 'button';
      pick.title = 'Register plate ' + p.label;
      pick.setAttribute('aria-pressed', String(i === state.active));

      var thumb = el('span', 'plate-thumb');
      var im = new Image();
      im.src = p.src;
      im.alt = '';
      thumb.appendChild(im);
      pick.appendChild(thumb);
      pick.appendChild(el('span', 'plate-l', p.label));
      pick.appendChild(el('span', 'plate-name kit-ell', p.name));
      pick.addEventListener('click', function () { setActive(i); });

      var kill = el('button', 'plate-x', '✕');
      kill.type = 'button';
      kill.title = 'Remove plate ' + p.label;
      kill.setAttribute('aria-label', 'Remove plate ' + p.label);
      kill.addEventListener('click', function () { removePlate(i); });

      row.appendChild(pick);
      row.appendChild(kill);
      list.appendChild(row);
    });
  }

  function paintThumbHint() {
    var art = $('#drop .drop-art');
    var old = art.querySelector('.lg');
    if (old) old.remove();
    if (!state.plates.length) return;
    var saved = state.compare;
    state.compare = 'single';
    var l = logo(72, { shape: 'auto' });
    state.compare = saved;
    l.style.margin = '0';
    art.appendChild(l);
  }

  function paintSpec() {
    var s = $('#spec');
    s.textContent = '';
    var p = activePlate();
    if (!p) { s.appendChild(el('span', 'spec-empty', 'no plate loaded')); return; }
    [
      el('span', null, [el('b', 'spec-label', p.label), document.createTextNode(' ' + p.name)]),
      el('span', null, [document.createTextNode('fmt '), el('b', null, p.type || '—')]),
      el('span', null, [document.createTextNode('size '), el('b', null, p.vector ? 'vector' : p.w + '×' + p.h)]),
      el('span', null, [document.createTextNode('weight '), el('b', null, fmtBytes(p.size))]),
      el('span', null, [document.createTextNode('alpha '), el('b', null, p.info && p.info.hasAlpha ? 'yes' : 'no')])
    ].forEach(function (b) { s.appendChild(b); });
  }

  function paintInk() {
    var bar = $('#inkbar');
    bar.textContent = '';
    var p = activePlate();
    var cols = (p && p.info && p.info.colors) || [];
    bar.hidden = !cols.length;
    cols.forEach(function (c) {
      var b = el('button', 'ink-chip');
      b.type = 'button';
      b.style.background = c.hex;
      b.dataset.hex = c.hex;
      b.title = 'Copy ' + c.hex;
      b.addEventListener('click', function () {
        if (navigator.clipboard) navigator.clipboard.writeText(c.hex);
        b.dataset.hex = 'copied';
        setTimeout(function () { b.dataset.hex = c.hex; }, 900);
      });
      bar.appendChild(b);
    });
  }

  function paintWarnings() {
    var box = $('#warn');
    box.textContent = '';
    var p = activePlate();
    if (!p) { box.hidden = true; return; }
    var out = [];
    var ar = p.w / p.h;
    var info = p.info;

    if (!p.vector && Math.max(p.w, p.h) < 512) out.push('Under 512 px. App icons and print will soften — export from vector if you can.');
    if (ar > 1.3 || ar < 0.77) out.push('Not square (' + ar.toFixed(2) + ':1). Square slots will letterbox it. A monogram cut usually rides alongside a wordmark.');
    if (ar > 2.6) out.push('Wordmark proportions. At 16 px in a browser tab this becomes a smudge — plan a separate favicon glyph.');
    if (info && !info.hasAlpha) out.push('No transparency. The file’s own background is baked in and will show as a box on coloured chrome.');
    if (info && info.avgLum > 0.86) out.push('Nearly white. It will vanish on light chrome — check the dark rows.');
    if (info && info.avgLum < 0.09) out.push('Nearly black. It will vanish on dark chrome — check the dark rows.');

    if (!out.length) { box.hidden = true; return; }
    box.hidden = false;
    out.forEach(function (t) { box.appendChild(el('p', null, t)); });
  }

  function flash(msg) {
    var box = $('#warn');
    box.hidden = false;
    box.textContent = '';
    box.appendChild(el('p', null, msg));
  }

  /* ── ink editor ────────────────────────────────────────────── */

  var inkT = null;
  function recolorNow() {
    var p = activePlate();
    if (!p || !p.svgSource) return;
    clearTimeout(inkT);
    inkT = setTimeout(function () {
      var text = p.svgSource;
      if (p.inks.length) text = Recolor.apply(text, p.inkMap);
      else if (p.inkBase) text = Recolor.applyBase(text, p.inkBase);
      loadPlate(Recolor.dataUrl(text), { name: p.name, type: 'SVG', size: text.length },
                state.plates.indexOf(p), { keepSource: true, quiet: true });
    }, 70);
  }

  function inkRow(hex, count, onPick, origin) {
    var row = el('div', 'ink-row' + (origin ? '' : ' base'));
    if (origin) {
      var was = el('span', 'ink-was');
      was.style.background = origin;
      was.title = 'was ' + origin;
      row.appendChild(was);
    }
    var sw = el('input');
    sw.type = 'color';
    sw.value = hex;
    sw.setAttribute('aria-label', 'Replace ' + (origin || hex));
    var tx = el('input', 'mono');
    tx.type = 'text';
    tx.value = hex;
    tx.spellcheck = false;
    tx.setAttribute('aria-label', 'Hex for ' + (origin || hex));

    function set(v, fromText) {
      var h = Recolor.norm(v);
      if (!h) return;
      if (!fromText) tx.value = h;
      sw.value = h;
      onPick(h);
      recolorNow();
    }
    sw.addEventListener('input', function () { set(sw.value, false); });
    tx.addEventListener('change', function () { set(tx.value, true); });

    row.appendChild(sw);
    row.appendChild(tx);
    row.appendChild(el('span', 'ink-n mono', count ? String(count) : ''));
    return row;
  }

  function paintInkCtrl() {
    var box = $('#inkctrl'), list = $('#inklist'), note = $('#inknote');
    list.textContent = '';
    var p = activePlate();

    if (!p) { box.hidden = true; return; }
    box.hidden = false;

    if (!p.svgSource) {
      note.textContent = 'Plate ' + p.label + ' is raster. A PNG or JPG has no separable inks — reload the mark as SVG to recolour it here.';
      $('#inkacts').hidden = true;
      return;
    }
    $('#inkacts').hidden = false;

    if (!p.inks.length) {
      note.textContent = 'This SVG declares no colours, so it inherits the default black fill. Setting a base colour paints every shape.';
      list.appendChild(inkRow(p.inkBase || '#000000', 0, function (h) { p.inkBase = h; }));
      return;
    }

    note.textContent = p.inks.length + ' ink' + (p.inks.length === 1 ? '' : 's') + ' in plate ' + p.label + '. Changes rewrite the SVG, so exports carry them too.';
    p.inks.forEach(function (ink) {
      list.appendChild(inkRow(p.inkMap[ink.hex] || ink.hex, ink.count, function (h) {
        p.inkMap[ink.hex] = h;
      }, ink.hex));
    });
  }

  function setAllInks(color) {
    var p = activePlate();
    if (!p || !p.svgSource) return;
    if (!p.inks.length) p.inkBase = color;
    else p.inks.forEach(function (i) { p.inkMap[i.hex] = color; });
    paintInkCtrl();
    recolorNow();
  }

  function resetInks() {
    var p = activePlate();
    if (!p) return;
    p.inkMap = {};
    p.inkBase = null;
    paintInkCtrl();
    recolorNow();
  }

  var SAMPLE = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#5b6cff"/><stop offset="1" stop-color="#00d0b0"/></linearGradient></defs>' +
    '<path fill="url(#g)" d="M256 32l52 148 148 52-148 52-52 148-52-148L56 232l148-52z"/>' +
    '<circle cx="256" cy="232" r="34" fill="#0b1020"/></svg>');

  /* ── persistence ───────────────────────────────────────────── */

  /* Namespaced by repo: GitHub Pages puts every lilbunnyrabbit tool on one
     origin, so localStorage is shared across all of them. */
  var KEY = 'logo-proof:v2';
  var LEGACY_KEY = 'proof.v2';
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        shape: state.shape, pad: state.pad, round: state.round,
        bg: state.bg, bgCustom: state.bgCustom,
        safe: state.safe, gray: state.gray, tile: state.tile, truePx: state.truePx,
        compare: state.compare, blinkMs: state.blinkMs,
        hidden: state.hidden, text: state.text,
        dark: document.documentElement.classList.contains('dark')
      }));
    } catch (e) { /* private mode, fine */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw === null) {
        raw = localStorage.getItem(LEGACY_KEY);
        if (raw !== null) { localStorage.setItem(KEY, raw); localStorage.removeItem(LEGACY_KEY); }
      }
      var s = JSON.parse(raw || 'null');
      if (!s) return;
      Object.keys(s).forEach(function (k) {
        if (k === 'dark') { document.documentElement.classList.toggle('dark', !!s.dark); return; }
        if (k in state) state[k] = s[k];
      });
    } catch (e) { /* ignore */ }
  }

  /* ── blink comparator ──────────────────────────────────────── */

  var blinkT = null, blinkI = 0;
  function runBlink() {
    clearInterval(blinkT);
    document.documentElement.className = document.documentElement.className.replace(/\sblink-\d/g, '');
    if (state.compare !== 'blink' || state.plates.length < 2) return;
    blinkI = 0;
    document.documentElement.classList.add('blink-0');
    blinkT = setInterval(function () {
      document.documentElement.classList.remove('blink-' + blinkI);
      blinkI = (blinkI + 1) % state.plates.length;
      document.documentElement.classList.add('blink-' + blinkI);
      var t = $('#blinkwho');
      if (t) t.textContent = state.plates[blinkI] ? state.plates[blinkI].label : '';
    }, state.blinkMs);
  }

  /* ── wiring ────────────────────────────────────────────────── */

  function syncRegistrationInputs() {
    var p = activePlate();
    var z = p ? p.zoom : 1, x = p ? p.ox : 0, y = p ? p.oy : 0;
    $('#zoom').value = Math.round(z * 100);
    $('#zoom-out').textContent = Math.round(z * 100) + '%';
    $('#ox').value = x; $('#ox-out').textContent = String(x);
    $('#oy').value = y; $('#oy-out').textContent = String(y);
    $('#trim').checked = !!(p && p.trim);
  }

  function bindGlobalRange(id, key, fmt, scale) {
    var input = $('#' + id), out = $('#' + id + '-out');
    if (!input) return;
    input.value = state[key] / (scale || 1);
    if (out) out.textContent = fmt(state[key]);
    input.addEventListener('input', function () {
      state[key] = parseFloat(input.value) * (scale || 1);
      if (out) out.textContent = fmt(state[key]);
      pushVars();
    });
  }

  function bindPlateRange(id, key, fmt, scale) {
    var input = $('#' + id), out = $('#' + id + '-out');
    input.addEventListener('input', function () {
      var p = activePlate();
      if (!p) return;
      p[key] = parseFloat(input.value) * (scale || 1);
      if (out) out.textContent = fmt(p[key]);
      p.tp = {};
      pushVars();
    });
  }

  function boot() {
    load();

    /* backdrops */
    var chips = $('#bgchips');
    function markBg(winner) {
      Array.prototype.forEach.call(chips.querySelectorAll('.chip'), function (c) {
        c.setAttribute('aria-checked', String(c === winner));
      });
    }
    BACKDROPS.forEach(function (b) {
      var btn = el('button', 'chip');
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(state.bg === b.css));
      var sw = el('span', 'sw');
      sw.style.background = b.css === 'transparent'
        ? 'conic-gradient(from 90deg,#fff 25%,#ccc 0 50%,#fff 0 75%,#ccc 0) 0 0/6px 6px'
        : (b.css === 'accent' ? 'linear-gradient(135deg,#5b6cff,#00d0b0)' : b.css);
      btn.appendChild(sw);
      btn.appendChild(document.createTextNode(b.label));
      btn.addEventListener('click', function () {
        state.bg = b.css;
        markBg(btn);
        pushVars();
      });
      chips.appendChild(btn);
    });

    /* any colour at all */
    var custom = el('label', 'chip chip-custom');
    custom.setAttribute('role', 'radio');
    custom.setAttribute('aria-checked', String(state.bg === state.bgCustom));
    var picker = el('input');
    picker.type = 'color';
    picker.value = state.bgCustom;
    picker.setAttribute('aria-label', 'Custom backdrop colour');
    picker.addEventListener('input', function () {
      state.bgCustom = picker.value;
      state.bg = picker.value;
      hexIn.value = picker.value;
      markBg(custom);
      pushVars();
    });
    var hexIn = el('input', 'chip-hex mono');
    hexIn.type = 'text';
    hexIn.value = state.bgCustom;
    hexIn.spellcheck = false;
    hexIn.size = 7;
    hexIn.setAttribute('aria-label', 'Custom backdrop hex');
    hexIn.addEventListener('change', function () {
      var h = window.Recolor ? Recolor.norm(hexIn.value) : null;
      if (!h) { hexIn.value = state.bgCustom; return; }
      state.bgCustom = h;
      state.bg = h;
      picker.value = h;
      hexIn.value = h;
      markBg(custom);
      pushVars();
    });
    custom.addEventListener('click', function (e) {
      if (e.target === hexIn) return;
      state.bg = state.bgCustom;
      markBg(custom);
      pushVars();
    });
    custom.appendChild(picker);
    custom.appendChild(hexIn);
    chips.appendChild(custom);

    /* group toggles */
    var gc = $('#groupchips');
    GROUPS.forEach(function (g) {
      var btn = el('button', 'chip', g.title);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(!state.hidden[g.id]));
      btn.addEventListener('click', function () {
        state.hidden[g.id] = !state.hidden[g.id];
        btn.setAttribute('aria-pressed', String(!state.hidden[g.id]));
        save();
        renderSheet();
      });
      gc.appendChild(btn);
    });

    /* mask */
    var seg = $('#maskseg');
    Array.prototype.forEach.call(seg.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-checked', String(b.dataset.shape === state.shape));
      b.addEventListener('click', function () {
        state.shape = b.dataset.shape;
        Array.prototype.forEach.call(seg.querySelectorAll('button'), function (o) {
          o.setAttribute('aria-checked', String(o === b));
        });
        $('#field-round').hidden = state.shape !== 'rounded';
        pushVars();
      });
    });
    $('#field-round').hidden = state.shape !== 'rounded';

    /* compare mode */
    var cseg = $('#cmpseg');
    Array.prototype.forEach.call(cseg.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-checked', String(b.dataset.cmp === state.compare));
      b.addEventListener('click', function () {
        state.compare = b.dataset.cmp;
        Array.prototype.forEach.call(cseg.querySelectorAll('button'), function (o) {
          o.setAttribute('aria-checked', String(o === b));
        });
        $('#blinkfield').hidden = state.compare !== 'blink';
        pushVars();
        runBlink();
        renderSheet();
      });
    });
    $('#blinkfield').hidden = state.compare !== 'blink';

    var bs = $('#blinkms');
    bs.value = state.blinkMs;
    $('#blinkms-out').textContent = (state.blinkMs / 1000).toFixed(1) + 's';
    bs.addEventListener('input', function () {
      state.blinkMs = parseInt(bs.value, 10);
      $('#blinkms-out').textContent = (state.blinkMs / 1000).toFixed(1) + 's';
      save();
      runBlink();
    });

    bindGlobalRange('pad',    'pad',    function (v) { return Math.round(v * 100) + '%'; }, 0.01);
    bindGlobalRange('round',  'round',  function (v) { return Math.round(v * 100) + '%'; }, 0.01);
    bindGlobalRange('squint', 'squint', function (v) { return v.toFixed(1); });

    bindPlateRange('zoom', 'zoom', function (v) { return Math.round(v * 100) + '%'; }, 0.01);
    bindPlateRange('ox',   'ox',   function (v) { return String(Math.round(v)); });
    bindPlateRange('oy',   'oy',   function (v) { return String(Math.round(v)); });
    syncRegistrationInputs();

    var dense = $('#dense');
    dense.value = state.tile;
    $('#dense-out').textContent = state.tile;
    dense.addEventListener('input', function () {
      state.tile = parseInt(dense.value, 10);
      $('#dense-out').textContent = state.tile;
      document.documentElement.style.setProperty('--tile', state.tile + 'px');
      save();
      requestAnimationFrame(fitAll);
    });
    document.documentElement.style.setProperty('--tile', state.tile + 'px');

    $('#trim').addEventListener('change', function () {
      var p = activePlate();
      if (!p) return;
      p.trim = $('#trim').checked;
      applyTrim(p, function () {
        paintAll(); paintThumbHint(); swapSrc(); refreshTruePixels(); audit();
      });
    });

    $('#safe').checked = state.safe;
    $('#safe').addEventListener('change', function () { state.safe = $('#safe').checked; pushVars(); });

    $('#truepx').checked = state.truePx;
    $('#truepx').addEventListener('change', function () {
      state.truePx = $('#truepx').checked;
      save();
      renderSheet();
    });

    $('#btn-gray').setAttribute('aria-pressed', String(state.gray));
    $('#btn-gray').addEventListener('click', function () {
      state.gray = !state.gray;
      $('#btn-gray').setAttribute('aria-pressed', String(state.gray));
      pushVars();
    });

    $('#btn-theme').addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      save();
      audit();
    });

    $('#btn-reset').addEventListener('click', function () {
      var p = activePlate();
      if (p) { p.zoom = 1; p.ox = 0; p.oy = 0; p.tp = {}; }
      state.pad = 0; state.round = 0.22;
      $('#pad').value = 0; $('#pad-out').textContent = '0%';
      $('#round').value = 22; $('#round-out').textContent = '22%';
      syncRegistrationInputs();
      pushVars();
    });

    /* ink actions */
    Array.prototype.forEach.call($('#inkacts').querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.ink;
        if (k === 'reset') return resetInks();
        var p = activePlate();
        if (k === 'accent') return setAllInks((p && p.info && p.info.accent) || '#2b2f36');
        setAllInks(k === 'black' ? '#000000' : '#ffffff');
      });
    });

    /* copy fields */
    Object.keys(state.text).forEach(function (k) {
      var input = $('#f-' + k);
      if (!input) return;
      input.value = state.text[k];
      input.addEventListener('input', function () {
        state.text[k] = input.value;
        save();
        rerender();
      });
    });

    var search = $('#f-search');
    search.addEventListener('input', function () { state.q = search.value; rerender(); });

    /* intake */
    var drop = $('#drop'), file = $('#file');
    drop.addEventListener('click', function () { file.click(); });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); }
    });
    file.addEventListener('change', function () {
      Array.prototype.slice.call(file.files).slice(0, MAX_PLATES).forEach(function (f) { acceptFile(f); });
      file.value = '';
    });
    $('#btn-sample').addEventListener('click', function () {
      loadPlate(SAMPLE, { name: 'sample-mark.svg', type: 'SVG', size: SAMPLE.length });
    });

    var veil = $('#veil'), depth = 0;
    window.addEventListener('dragenter', function (e) { e.preventDefault(); depth++; veil.classList.add('on'); });
    window.addEventListener('dragover', function (e) { e.preventDefault(); });
    window.addEventListener('dragleave', function () { depth--; if (depth <= 0) { depth = 0; veil.classList.remove('on'); } });
    window.addEventListener('drop', function (e) {
      e.preventDefault(); depth = 0; veil.classList.remove('on');
      var fs = e.dataTransfer && e.dataTransfer.files;
      if (fs) Array.prototype.slice.call(fs).slice(0, MAX_PLATES).forEach(function (f) { acceptFile(f); });
    });

    window.addEventListener('paste', function (e) {
      var items = e.clipboardData && e.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') === 0) {
            acceptFile(items[i].getAsFile());
            e.preventDefault();
            return;
          }
        }
      }
      var txt = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
      if (/^\s*<svg[\s>]/i.test(txt)) {
        var fixed = normalizeSvg(txt);
        if (fixed) {
          loadPlate('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fixed),
                    { name: 'pasted.svg', type: 'SVG', size: txt.length });
          e.preventDefault();
        }
      } else if (/^data:image\//i.test(txt.trim())) {
        loadPlate(txt.trim(), { name: 'pasted', type: 'PNG', size: txt.length });
        e.preventDefault();
      }
    });

    /* left/right cycle the registered plate */
    window.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (state.plates.length < 2) return;
      if (e.key === 'ArrowRight') { setActive((state.active + 1) % state.plates.length); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { setActive((state.active - 1 + state.plates.length) % state.plates.length); e.preventDefault(); }
    });

    window.addEventListener('resize', function () { requestAnimationFrame(fitAll); });

    $('#btn-export').addEventListener('click', function () {
      if (window.ProofExport) ProofExport.open();
    });

    pushVars();
    paintAll();
    renderSheet();

    if (location.hash.indexOf('sample') > -1) {
      loadPlate(SAMPLE, { name: 'sample-mark.svg', type: 'SVG', size: SAMPLE.length });
    }
  }

  window.LogoLab = {
    register: register,
    css: css,
    boot: boot,
    groups: GROUPS,
    state: state,
    ctx: ctx,
    icon: icon,
    el: el,
    resolveBg: resolveBg,
    refit: fitAll,
    audit: audit,
    load: loadPlate,
    plate: activePlate,
    setActive: setActive,
    setAllInks: setAllInks,
    resetInks: resetInks
  };
})();
