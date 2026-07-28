/* js/scenes/stress.js — diagnostic plates. No platform chrome: these are the
   tests a mark fails. Every filter rides on a wrapper div around ctx.logo(). */
(function () {
  'use strict';

  var L = window.LogoLab;
  var SVGNS = 'http://www.w3.org/2000/svg';

  L.css(`
  /* ── plate shell ───────────────────────────────────────────────
     Every plate is 420 px wide and lands in a ~340 px column, so it is
     drawn at about 0.74. Nothing here may be smaller than 10.5 px or it
     arrives under 8 px and stops being readable — and on these plates the
     caption is half the test. */
  .st-plate {
    box-sizing: border-box; position: relative;
    background: #ffffff; color: #0b0d10;
    border: 1px solid #d7dbe0; padding: 14px 14px 13px;
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: 11.5px; line-height: 1.4;
  }
  .st-plate * { box-sizing: border-box; }

  .st-hd {
    display: flex; align-items: baseline; gap: 10px;
    padding-bottom: 7px; margin-bottom: 14px; border-bottom: 1px solid #e3e6ea;
  }
  .st-hd-l { font-size: 12px; font-weight: 600; letter-spacing: .13em; text-transform: uppercase; }
  .st-hd-c {
    margin-left: auto; font-size: 10.5px; letter-spacing: .1em;
    text-transform: uppercase; color: #98a0a8; white-space: nowrap;
  }

  .st-read {
    margin: 13px 0 0; padding-top: 9px; border-top: 1px dashed #dfe3e7;
    font-size: 11.5px; line-height: 1.45; color: #5d656e;
  }
  .st-read::before { content: "\\2192"; color: #dd3a1c; margin-right: 6px; }

  .st-cap {
    font-size: 11.5px; line-height: 1; letter-spacing: .06em;
    text-transform: uppercase; color: #697079; white-space: nowrap;
  }
  .st-sub {
    font-size: 10.5px; line-height: 1; letter-spacing: .06em;
    text-transform: uppercase; color: #a2a9b0; white-space: nowrap;
  }
  .st-col { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: none; }
  .st-col .st-sub { margin-top: -3px; }

  .st-lbl {
    display: flex; align-items: center; gap: 9px; margin-bottom: 10px;
    font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: #39404a;
  }
  .st-blk + .st-blk { margin-top: 18px; }

  .st-fx { display: block; line-height: 0; flex: none; }
  .st-sw { display: flex; align-items: center; justify-content: center; }
  .st-defs { position: absolute; width: 0; height: 0; overflow: hidden; }

  /* ── layouts ───────────────────────────────────────────────── */
  .st-lad { display: flex; align-items: flex-end; justify-content: space-between; gap: 6px; }
  .st-row { display: flex; align-items: flex-end; gap: 26px; }
  .st-mid { display: flex; justify-content: center; gap: 16px; }
  .st-sq  { display: flex; justify-content: space-between; align-items: flex-end; }
  .st-sq > .st-col { width: 94px; }
  /* padding on the wrapper, never the mark: it buys the 6 px blur room to
     spread without touching the caption below it */
  .st-sq .st-fx { padding: 11px 0; }

  .st-two { display: flex; gap: 12px; }
  .st-two > .st-col { flex: 1 1 0; align-items: stretch; text-align: center; }
  .st-two .st-sw { width: 100%; height: 158px; border: 1px solid rgba(0,0,0,.10); }

  .st-pair { display: flex; }
  .st-pair > .st-col { flex: 1 1 0; align-items: stretch; text-align: center; padding: 4px 0; }
  .st-pair > .st-col + .st-col { border-left: 1px solid #e3e6ea; }
  .st-pair .st-sw { height: 122px; }

  .st-grid4 { display: flex; justify-content: space-between; }
  .st-grid4 .st-sw { width: 88px; height: 88px; border: 1px solid rgba(0,0,0,.10); }

  .st-strip { display: flex; border: 1px solid #d7dbe0; }
  .st-strip > .st-sw { flex: 1 1 0; height: 104px; }
  .st-strip-c { display: flex; margin-top: 9px; }
  .st-strip-c > span { flex: 1 1 0; text-align: center; }

  /* ── grounds ───────────────────────────────────────────────── */
  .st-mesh {
    background-color: #1b2430;
    background-image:
      radial-gradient(circle at 14% 20%, #ff6a3d 0, rgba(255,106,61,0) 46%),
      radial-gradient(circle at 84% 14%, #24d3c4 0, rgba(36,211,196,0) 44%),
      radial-gradient(circle at 72% 84%, #7b3cff 0, rgba(123,60,255,0) 48%),
      radial-gradient(circle at 22% 86%, #ffcf3d 0, rgba(255,207,61,0) 42%),
      radial-gradient(circle at 50% 52%, #0f5ad2 0, rgba(15,90,210,0) 58%);
  }
  .st-back {
    background: #ffffff; padding: 16px; border-radius: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,.34);
  }
  .st-check {
    background: conic-gradient(from 90deg, #ffffff 25%, #cbd1d7 0 50%, #ffffff 0 75%, #cbd1d7 0)
                0 0 / 16px 16px;
  }
  .st-field {
    width: 176px; height: 176px; border: 1px solid #e0e3e6; background: #edeff1;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── clear space: technical drawing ────────────────────────── */
  /* 242 = 240 padding box + the 1 px dashed boundary, so inset:40px is a true 0.25 H */
  .st-cs {
    position: relative; width: 242px; height: 242px;
    background: #ffffff; border: 1px dashed #dd3a1c;
  }
  .st-cs-g { position: absolute; inset: 40px; box-shadow: 0 0 0 1px rgba(221,58,28,.45); }
  .st-cs-v { position: absolute; left: 50%; top: 0; height: 40px; border-left: 1px solid #dd3a1c; }
  .st-cs-v::before, .st-cs-v::after {
    content: ""; position: absolute; left: -4px; width: 9px; border-top: 1px solid #dd3a1c;
  }
  .st-cs-v::before { top: 0; }
  .st-cs-v::after { bottom: 0; }
  .st-cs-h { position: absolute; top: 50%; left: 0; width: 40px; border-top: 1px solid #dd3a1c; }
  .st-cs-h::before, .st-cs-h::after {
    content: ""; position: absolute; top: -4px; height: 9px; border-left: 1px solid #dd3a1c;
  }
  .st-cs-h::before { left: 0; }
  .st-cs-h::after { right: 0; }
  .st-cs-r {
    position: absolute; right: 19px; top: 40px; height: 160px;
    border-left: 1px solid rgba(221,58,28,.6);
  }
  .st-cs-r::before, .st-cs-r::after {
    content: ""; position: absolute; left: -4px; width: 9px; border-top: 1px solid rgba(221,58,28,.6);
  }
  .st-cs-r::before { top: 0; }
  .st-cs-r::after { bottom: 0; }
  .st-cs-t {
    position: absolute; font-size: 10.5px; letter-spacing: .06em;
    color: #dd3a1c; white-space: nowrap;
  }
  .st-legend {
    margin-top: 12px; text-align: center; font-size: 10.5px;
    letter-spacing: .08em; text-transform: uppercase; color: #8e959c;
  }

  /* ── circle crop ───────────────────────────────────────────── */
  .st-cc { position: relative; flex: none; }
  .st-cc-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px dashed #dd3a1c; }
  .st-cc-cut {
    position: absolute; inset: 0;
    background: radial-gradient(circle closest-side at 50% 50%,
                rgba(221,58,28,0) 0 100%, rgba(221,58,28,.16) 100%);
  }

  /* ── dark plates ───────────────────────────────────────────── */
  .st-dark { background: #0d0f12; color: #f2f4f6; border-color: #262b31; }
  .st-dark .st-hd { border-bottom-color: #22262c; }
  .st-dark .st-hd-c { color: #6d757d; }
  .st-dark .st-cap { color: #98a0a8; }
  .st-dark .st-sub { color: #6d757d; }
  .st-dark .st-lbl { color: #c7ced4; }
  .st-dark .st-read { border-top-color: #22262c; color: #8d959c; }
  .st-dark .st-pair > .st-col + .st-col { border-left-color: #22262c; }
  .st-dark .st-strip { border-color: #2a2f36; }
  `);

  /* ── helpers ─────────────────────────────────────────────────── */

  /* The diagnostic artboard: no mask, no padding, no backdrop — the plate's
     own ground is the ground, and alpha stays alpha so wrapper filters read true. */
  var MARK = { shape: 'sharp', pad: 0, bg: 'transparent' };

  function mark(c, size) { return c.logo(size, MARK); }

  function fx(c, size, filter) {
    var w = c.el('div', 'st-fx');
    w.style.filter = filter;
    w.appendChild(c.logo(size, MARK));
    return w;
  }

  function col(c, node, cap, sub) {
    return c.el('div', 'st-col', [
      node,
      cap ? c.el('span', 'st-cap', cap) : null,
      sub ? c.el('span', 'st-sub', sub) : null
    ]);
  }

  function sw(c, bg, inner, cls) {
    var d = c.el('div', 'st-sw' + (cls ? ' ' + cls : ''), inner);
    if (bg) d.style.background = bg;
    return d;
  }

  function rule(c, label) {
    return c.el('div', 'st-lbl', [c.el('span', null, label), c.el('span', 'kit-fill kit-hr')]);
  }

  function plate(c, o) {
    var root = c.el('div', 'st-plate' + (o.dark ? ' st-dark' : ''));
    if (o.ground) root.style.background = o.ground;
    root.appendChild(c.el('div', 'st-hd', [
      c.el('span', 'st-hd-l', o.label),
      c.el('span', 'st-hd-c', o.code)
    ]));
    var body = c.el('div', 'st-body');
    root.appendChild(body);
    if (o.read) root.appendChild(c.el('p', 'st-read', o.read));
    return { root: root, body: body };
  }

  /* ── 1 + 2 · size ladder ─────────────────────────────────────── */

  var STEPS = [128, 64, 48, 32, 24, 16];

  function ladder(c, dark) {
    var p = plate(c, {
      dark: dark,
      label: 'Size ladder',
      code: dark ? 'ground #0d0f12' : 'ground #ffffff',
      read: dark
        ? 'Light marks bloom on dark. The dark ladder should fail at the same step as the white one, not one step later.'
        : 'Read the last cell first. If counters fill in or strokes merge at 16 px, the mark needs a separate small cut.'
    });
    var row = c.el('div', 'st-lad');
    STEPS.forEach(function (s) { row.appendChild(col(c, mark(c, s), s + 'PX')); });
    p.body.appendChild(row);
    return p.root;
  }

  L.register({
    id: 'stress-ladder', group: 'stress', title: 'Size ladder',
    spec: '128 → 16 PX', note: 'the browser tab is the last cell', width: 420,
    render: function (c) { return ladder(c, false); }
  });

  L.register({
    id: 'stress-ladder-dark', group: 'stress', title: 'Size ladder — dark',
    spec: '128 → 16 PX', note: 'same steps, dark ground', width: 420,
    render: function (c) { return ladder(c, true); }
  });

  /* ── 3 + 4 · one ink ─────────────────────────────────────────── */

  var INK_SIZES = [96, 48, 24];

  function inkBlock(c, label, filter) {
    var b = c.el('div', 'st-blk', rule(c, label));
    var row = c.el('div', 'st-row');
    INK_SIZES.forEach(function (s) { row.appendChild(col(c, fx(c, s, filter), s + 'PX')); });
    b.appendChild(row);
    return b;
  }

  L.register({
    id: 'stress-one-ink', group: 'stress', title: 'One ink — black',
    spec: 'K100 · 3 SIZES', note: 'stamp, fax, engraving', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'One ink · solid black',
        code: 'wrapper filter',
        read: 'One value, no hue. Any shape that only existed as a colour change against another colour is gone here.'
      });
      /* a second "contrast(0) brightness(0)" row used to sit under this one.
         brightness(0) already crushes every channel to zero, so it drew the
         identical silhouette twice under two different labels. */
      p.body.appendChild(inkBlock(c, 'grayscale(1) brightness(0)', 'grayscale(1) brightness(0)'));
      return p.root;
    }
  });

  L.register({
    id: 'stress-knockout', group: 'stress', title: 'One ink — white knockout',
    spec: 'KNOCKOUT · 3 SIZES', note: 'white ink on black', width: 420,
    render: function (c) {
      var p = plate(c, {
        dark: true, ground: '#000000',
        label: 'One ink · white knockout',
        code: 'ground #000000',
        read: 'Knockout is not the black stamp mirrored — ink spread closes small gaps. Check the counters and the thinnest stroke.'
      });
      p.body.appendChild(inkBlock(c, 'grayscale(1) brightness(0) invert(1)', 'grayscale(1) brightness(0) invert(1)'));
      return p.root;
    }
  });

  /* ── 5 · greyscale ───────────────────────────────────────────── */

  L.register({
    id: 'stress-greyscale', group: 'stress', title: 'Greyscale vs colour',
    spec: '96 PX PAIR', note: 'value against hue', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Value check',
        code: 'grayscale(1)',
        read: 'If the grey half loses structure, the mark is carrying its contrast in hue, not in value — it will collapse in print and on dimmed screens.'
      });
      var pair = c.el('div', 'st-pair', [
        col(c, sw(c, null, mark(c, 96)), 'Colour · original'),
        col(c, sw(c, null, fx(c, 96, 'grayscale(1)')), 'Greyscale')
      ]);
      p.body.appendChild(pair);
      return p.root;
    }
  });

  /* ── 6 · squint ladder ───────────────────────────────────────── */

  L.register({
    id: 'stress-squint', group: 'stress', title: 'Squint ladder',
    spec: 'BLUR 0 – 6 PX', note: 'the distance test', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Squint ladder',
        code: '72 px · blur 0 / 1.5 / 3 / 6',
        read: 'This is the mark across a room, on a sign, or scrolled past. At 3 px of blur the silhouette alone should still name the brand.'
      });
      var row = c.el('div', 'st-sq');
      [0, 1.5, 3, 6].forEach(function (b) {
        row.appendChild(col(c, fx(c, 72, b ? 'blur(' + b + 'px)' : 'none'), 'blur ' + b + 'px'));
      });
      p.body.appendChild(row);
      return p.root;
    }
  });

  /* ── 7 · inverted ────────────────────────────────────────────── */

  L.register({
    id: 'stress-invert', group: 'stress', title: 'Inverted',
    spec: 'INVERT(1)', note: 'the negative reading', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Inversion',
        code: 'wrapper filter: invert(1)',
        read: 'Auto-inverting dark-mode extensions and negative film do exactly this. If the negative reads as a different shape, the colours need locking.'
      });
      p.body.appendChild(c.el('div', 'st-two', [
        col(c, sw(c, '#ffffff', fx(c, 96, 'invert(1)')), 'Invert on #FFFFFF'),
        col(c, sw(c, '#000000', fx(c, 96, 'invert(1)')), 'Invert on #000000')
      ]));
      return p.root;
    }
  });

  /* ── 8 · 1-bit threshold ─────────────────────────────────────── */

  L.register({
    id: 'stress-threshold', group: 'stress', title: '1-bit threshold',
    spec: 'CONTRAST(12)', note: 'thermal, fax, embroidery', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: '1-bit threshold',
        code: 'grayscale(1) contrast(12)',
        read: 'A receipt printer, a fax and an embroidery digitiser see only this. Mid-tones snap to solid or drop out — watch the gradients.'
      });
      var row = c.el('div', 'st-row');
      row.appendChild(col(c, mark(c, 96), 'Original'));
      row.appendChild(col(c, fx(c, 96, 'grayscale(1) contrast(12)'), 'Threshold 96PX'));
      row.appendChild(col(c, fx(c, 32, 'grayscale(1) contrast(12)'), 'Threshold 32PX'));
      p.body.appendChild(row);
      return p.root;
    }
  });

  /* ── 9 · busy background ─────────────────────────────────────── */

  L.register({
    id: 'stress-busy', group: 'stress', title: 'Busy background',
    spec: '96 PX ON PHOTO', note: 'bare, then on a plate', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Hostile ground',
        code: 'photo stand-in',
        read: 'Bare on a photo the edge dissolves. If the mark only survives with the plate, the plate is part of the logo, not decoration.'
      });
      var backing = c.el('div', 'st-back', mark(c, 96));
      p.body.appendChild(c.el('div', 'st-two', [
        col(c, sw(c, null, mark(c, 96), 'st-mesh'), 'Bare'),
        col(c, sw(c, null, backing, 'st-mesh'), 'On a backing plate')
      ]));
      return p.root;
    }
  });

  /* ── 10 · own-colour collision ───────────────────────────────── */

  function inks(c) {
    var fallback = ['#E5E7EB', '#9CA3AF', '#4B5563', '#111827'];
    var out = [];
    (c.palette || []).slice(0, 4).forEach(function (p) {
      if (!p || !p.hex) return;
      var pc = Math.round((p.share || 0) * 100);
      out.push({ hex: String(p.hex).toUpperCase(), sub: (pc < 1 ? '<1' : pc) + '% of plate' });
    });
    for (var i = 0; i < fallback.length && out.length < 4; i++) {
      var h = fallback[i];
      var dup = out.some(function (o) { return o.hex === h; });
      if (!dup) out.push({ hex: h, sub: 'fallback' });
    }
    return out;
  }

  L.register({
    id: 'stress-own-colour', group: 'stress', title: 'Own-colour collision',
    spec: '4 BRAND INKS', note: 'the mark on its own ink', width: 420,
    render: function (c) {
      var list = inks(c);
      var p = plate(c, {
        label: 'Own-colour collision',
        code: (c.palette && c.palette.length ? 'plate palette' : 'no palette · neutrals'),
        read: 'A mark laid on its own ink disappears. Whichever cell fails is a pairing the brand rules have to forbid.'
      });
      var g = c.el('div', 'st-grid4');
      list.forEach(function (ink) {
        g.appendChild(col(c, sw(c, ink.hex, mark(c, 60)), ink.hex, ink.sub));
      });
      p.body.appendChild(g);
      return p.root;
    }
  });

  /* ── 11 · neutral sweep ──────────────────────────────────────── */

  var SWEEP = ['#ffffff', '#f3f4f6', '#9ca3af', '#374151', '#000000'];

  L.register({
    id: 'stress-sweep', group: 'stress', title: 'Neutral sweep',
    spec: '5 GROUNDS', note: 'white to black in five steps', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Neutral background sweep',
        code: '#fff → #000',
        read: 'The mark has to hold on all five. Failing the middle grey means it has no value contrast of its own at all.'
      });
      var strip = c.el('div', 'st-strip');
      var caps = c.el('div', 'st-strip-c');
      SWEEP.forEach(function (bg) {
        strip.appendChild(sw(c, bg, mark(c, 56)));
        caps.appendChild(c.el('span', 'st-cap', bg.toUpperCase()));
      });
      p.body.appendChild(strip);
      p.body.appendChild(caps);
      return p.root;
    }
  });

  /* ── 12 · clear space ────────────────────────────────────────── */

  L.register({
    id: 'stress-clear-space', group: 'stress', title: 'Clear space',
    spec: 'CLEAR = 0.25 H', note: 'construction and exclusion zone', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Clear space',
        code: 'H = 160 px · margin 40 px',
        read: 'Nothing enters the dashed field — no type, no rule, no photo edge, no second mark.'
      });

      var box = c.el('div', 'st-cs');
      var glyph = c.el('div', 'st-cs-g', mark(c, 160));
      box.appendChild(glyph);

      box.appendChild(c.el('div', 'st-cs-v'));
      box.appendChild(c.el('div', 'st-cs-h'));
      box.appendChild(c.el('div', 'st-cs-r'));

      var t1 = c.el('span', 'st-cs-t', '0.25H');
      t1.style.left = 'calc(50% + 9px)';
      t1.style.top = '13px';
      var t2 = c.el('span', 'st-cs-t', '0.25H');
      t2.style.left = '5px';
      t2.style.top = 'calc(50% + 7px)';
      var t3 = c.el('span', 'st-cs-t', 'H');
      t3.style.right = '5px';
      t3.style.top = 'calc(50% - 5px)';
      box.appendChild(t1);
      box.appendChild(t2);
      box.appendChild(t3);

      p.body.appendChild(c.el('div', 'st-mid', box));
      p.body.appendChild(c.el('div', 'st-legend', 'H = glyph height · clear space = 0.25 H'));
      return p.root;
    }
  });

  /* ── 13 · circle crop ────────────────────────────────────────── */

  L.register({
    id: 'stress-circle-crop', group: 'stress', title: 'Circle crop',
    spec: 'CIRCLE MASK 128', note: 'what every avatar throws away', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Circle crop test',
        code: 'inscribed circle · 128 px',
        read: 'Everything tinted red is discarded by every circular avatar. A corner-anchored glyph loses its corner.'
      });

      var art = c.el('div', 'st-cc', c.logo(128, { shape: 'sharp', pad: 0, bg: '#ffffff' }));
      art.appendChild(c.el('div', 'st-cc-cut'));
      art.appendChild(c.el('div', 'st-cc-ring'));

      p.body.appendChild(c.el('div', 'st-mid', [
        col(c, c.el('div', 'st-field', art), 'Artboard + mask'),
        col(c, c.el('div', 'st-field', c.logo(128, { shape: 'circle', pad: 0, bg: '#ffffff' })), 'Circle crop · result')
      ]));
      return p.root;
    }
  });

  /* ── 14 · low contrast ───────────────────────────────────────── */

  L.register({
    id: 'stress-low-contrast', group: 'stress', title: 'Low contrast',
    spec: 'OPACITY 40%', note: 'worst realistic conditions', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Low contrast',
        code: 'wrapper filter: opacity(.4)',
        read: 'A dimmed UI, a sun-washed phone, a tired projector. If the mark is gone at 40 %, it is gone in the wild.'
      });
      p.body.appendChild(c.el('div', 'st-two', [
        col(c, sw(c, '#ffffff', fx(c, 96, 'opacity(.4)')), '40% on #FFFFFF'),
        col(c, sw(c, '#111318', fx(c, 96, 'opacity(.4)')), '40% on #111318')
      ]));
      return p.root;
    }
  });

  /* ── 15 · colour vision (added: hue-dependence has no other tile) ── */

  var CVD = [
    { id: 'st-cvd-p', name: 'Protanopia',
      v: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0' },
    { id: 'st-cvd-d', name: 'Deuteranopia',
      v: '0.625 0.375 0 0 0  0.700 0.300 0 0 0  0 0.300 0.700 0 0  0 0 0 1 0' },
    { id: 'st-cvd-t', name: 'Tritanopia',
      v: '0.950 0.050 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0' }
  ];

  function cvdDefs() {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'st-defs');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    var defs = document.createElementNS(SVGNS, 'defs');
    CVD.forEach(function (m) {
      var f = document.createElementNS(SVGNS, 'filter');
      f.setAttribute('id', m.id);
      f.setAttribute('color-interpolation-filters', 'sRGB');
      var cm = document.createElementNS(SVGNS, 'feColorMatrix');
      cm.setAttribute('type', 'matrix');
      cm.setAttribute('values', m.v);
      f.appendChild(cm);
      defs.appendChild(f);
    });
    svg.appendChild(defs);
    return svg;
  }

  L.register({
    id: 'stress-colour-vision', group: 'stress', title: 'Colour vision',
    spec: 'CVD ×3', note: 'protan, deutan, tritan', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Colour vision',
        code: 'feColorMatrix · sRGB',
        read: 'About one man in twelve has some colour-vision deficiency. If two brand colours merge into one here, the mark cannot use that pair to carry meaning.'
      });
      var row = c.el('div', 'st-lad');
      row.appendChild(col(c, mark(c, 72), 'Normal'));
      CVD.forEach(function (m) {
        row.appendChild(col(c, fx(c, 72, 'url(#' + m.id + ')'), m.name));
      });
      p.body.appendChild(row);
      p.root.appendChild(cvdDefs());
      return p.root;
    }
  });

  /* ── 16 · alpha & matte (added: nothing else exposes a baked edge) ── */

  L.register({
    id: 'stress-alpha', group: 'stress', title: 'Alpha & fringe',
    spec: 'ALPHA CHECK', note: 'transparency and matte', width: 420,
    render: function (c) {
      var p = plate(c, {
        label: 'Alpha & matte',
        code: 'checker · #FF00FF',
        read: 'A solid box on the checker means there is no alpha. A pale rim on the magenta means the edges were matted onto white.'
      });
      p.body.appendChild(c.el('div', 'st-two', [
        col(c, sw(c, null, mark(c, 96), 'st-check'), 'Transparency'),
        col(c, sw(c, '#ff00ff', mark(c, 96)), 'Matte / fringe')
      ]));
      return p.root;
    }
  });
})();
