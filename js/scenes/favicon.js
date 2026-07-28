/* js/scenes/favicon.js — Favicons & tabs.
   Everything in here is 16 or 18 px. Browsers do not mask favicons, so every
   ctx.logo() call in this file is shape:'sharp' (or an explicit tiny radius)
   and asks for nearest-neighbour scaling. Prefix: .fv- */
(function () {
  'use strict';

  var L = window.LogoLab;
  var el = L.el;
  var ic = L.icon;
  var NS = 'http://www.w3.org/2000/svg';

  L.css(`
/* ── shared shell ─────────────────────────────────────────────── */
.fv-win { border-radius:10px; overflow:hidden;
  box-shadow:0 1px 2px rgba(0,0,0,.16), 0 14px 30px -16px rgba(0,0,0,.45); }
.fv-stack { display:flex; flex-direction:column; gap:14px; }

.fv-tl { display:flex; align-items:center; gap:8px; padding:0 14px 0 12px; flex:none; align-self:center; }
.fv-tl span { display:block; width:12px; height:12px; border-radius:50%; flex:none; }
.fv-tl-r { background:#ff5f57; }
.fv-tl-y { background:#febc2e; }
.fv-tl-g { background:#28c840; }

/* stand-in favicons for the other guy's tabs — flat grey, never the mark */
.fv-gf { width:16px; height:16px; flex:none; background:#a9aeb5; }
.fv-dark .fv-gf { background:#5f6368; }
.fv-gf-a { border-radius:3px; }
.fv-gf-b { border-radius:50%; }
.fv-gf-c { border-radius:5px; opacity:.82; }
.fv-gf-d { border-radius:2px; opacity:.64; }

.fv-fade { -webkit-mask-image:linear-gradient(90deg,#000 52%,transparent 100%);
           mask-image:linear-gradient(90deg,#000 52%,transparent 100%); }

/* ── Chrome ───────────────────────────────────────────────────── */
.fv-c { --fv-tab:#ffffff; background:#ffffff; }
.fv-c.fv-dark { --fv-tab:#35363a; background:#202124; }

.fv-cstrip { display:flex; align-items:flex-end; height:40px; padding-right:6px; background:#dee1e6; }
.fv-dark .fv-cstrip { background:#202124; }

.fv-ctab { position:relative; display:flex; align-items:center; gap:8px;
  height:34px; padding:0 10px; flex:none; color:#3c4043; }
.fv-dark .fv-ctab { color:#9aa0a6; }
.fv-ctab-on { background:var(--fv-tab); border-radius:10px 10px 0 0; color:#202124; z-index:2; }
.fv-dark .fv-ctab-on { color:#e8eaed; }
.fv-ctab-on::before, .fv-ctab-on::after { content:""; position:absolute; bottom:0; width:10px; height:10px; }
.fv-ctab-on::before { left:-10px;  background:radial-gradient(circle at 0 0,    transparent 10px, var(--fv-tab) 10px); }
.fv-ctab-on::after  { right:-10px; background:radial-gradient(circle at 100% 0, transparent 10px, var(--fv-tab) 10px); }
.fv-ctab-t { flex:1 1 auto; min-width:0; font-size:12px; line-height:16px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fv-ctab-x { flex:none; display:grid; place-items:center; width:16px; height:16px;
  border-radius:50%; color:#5f6368; }
.fv-dark .fv-ctab-x { color:#9aa0a6; }
.fv-ctab-sq { padding:0 8px; gap:4px; }
.fv-ctab-pin { width:34px; padding:0; gap:0; justify-content:center; }

.fv-csep { position:relative; width:1px; height:34px; flex:none; }
.fv-csep::before { content:""; position:absolute; left:0; top:9px; width:1px; height:16px; background:#bdc1c6; }
.fv-dark .fv-csep::before { background:#5f6368; }
.fv-cgap { width:9px; flex:none; }
.fv-cplus { display:grid; place-items:center; width:28px; height:28px; margin:0 0 3px 6px;
  border-radius:50%; color:#5f6368; flex:none; }
.fv-dark .fv-cplus { color:#9aa0a6; }
.fv-cts { margin-left:auto; }

.fv-ctool { display:flex; align-items:center; gap:2px; height:42px; padding:0 8px;
  background:#ffffff; border-bottom:1px solid #dadce0; color:#5f6368; }
.fv-dark .fv-ctool { background:#35363a; border-bottom-color:#2b2c2f; color:#c4c7c5; }
.fv-cbtn { display:grid; place-items:center; width:28px; height:28px; border-radius:50%; flex:none; }
.fv-comni { display:flex; align-items:center; gap:9px; flex:1 1 auto; min-width:0; height:30px;
  margin:0 8px; padding:0 12px; border-radius:999px; background:#f1f3f4; font-size:13px; color:#202124; }
.fv-dark .fv-comni { background:#202124; color:#e8eaed; }
.fv-comni-p { color:#5f6368; }
.fv-dark .fv-comni-p { color:#9aa0a6; }
.fv-comni-s { margin-left:auto; flex:none; display:grid; place-items:center;
  width:16px; height:16px; color:#5f6368; }
.fv-dark .fv-comni-s { color:#9aa0a6; }
.fv-cav { display:grid; place-items:center; width:20px; height:20px; margin:0 4px;
  border-radius:50%; background:#dadce0; color:#5f6368; flex:none; }
.fv-dark .fv-cav { background:#5f6368; color:#e8eaed; }
.fv-csliver { height:14px; background:#ffffff; }
.fv-dark .fv-csliver { background:#35363a; }

/* ── bookmarks bar ────────────────────────────────────────────── */
.fv-bb { display:flex; align-items:center; gap:2px; height:32px; padding:0 8px;
  background:#ffffff; border-bottom:1px solid #dadce0; }
.fv-bi { display:flex; align-items:center; gap:6px; height:24px; padding:0 8px;
  flex:0 1 auto; min-width:0; max-width:150px;
  border-radius:6px; font-size:12px; line-height:16px; color:#3c4043; }
.fv-bi-me { flex:none; }
.fv-bi-on { background:#f1f3f4; }
.fv-ball { display:flex; align-items:center; gap:6px; margin-left:auto; padding:0 6px;
  font-size:12px; color:#3c4043; flex:none; }
.fv-bpage { background:#ffffff; padding:20px 24px 26px; color:#202124; }
.fv-bpage-h { font-size:15px; font-weight:600; color:#202124; margin-bottom:12px; }

/* ── history ──────────────────────────────────────────────────── */
.fv-h { background:#ffffff; }
.fv-h-top { display:flex; align-items:center; gap:20px; height:54px; padding:0 20px;
  border-bottom:1px solid #e6e6e6; }
.fv-h-title { font-size:16px; font-weight:500; color:#202124; flex:none; }
.fv-h-search { display:flex; align-items:center; gap:10px; flex:1 1 auto; min-width:0;
  height:34px; max-width:320px; padding:0 14px; border-radius:999px; background:#f1f3f4;
  font-size:13px; color:#5f6368; }
.fv-h-day { font-size:14px; font-weight:500; color:#202124; padding:16px 20px 8px; }
.fv-h-row { display:flex; align-items:center; gap:16px; height:44px; padding:0 20px;
  border-top:1px solid #f1f3f4; }
.fv-h-time { width:74px; flex:none; font-size:12px; color:#5f6368; }
.fv-h-t { font-size:13px; color:#202124; max-width:280px; }
.fv-h-d { font-size:13px; color:#5f6368; }
.fv-h-dots { margin-left:auto; color:#5f6368; display:grid; place-items:center; width:20px; height:20px; }

/* ── Google result ────────────────────────────────────────────── */
.fv-g { background:#ffffff; padding:22px 24px; font-family:arial,sans-serif; }
.fv-g-h { display:flex; align-items:center; gap:12px; }
.fv-g-ico { display:grid; place-items:center; width:26px; height:26px; flex:none;
  border-radius:50%; background:#ffffff; box-shadow:0 0 0 1px #dadce0; }
.fv-g-site { font-size:14px; line-height:18px; color:#202124; }
.fv-g-url { font-size:12px; line-height:16px; color:#4d5156; }
.fv-g-dots { margin-left:auto; display:grid; place-items:center; width:24px; height:24px; color:#70757a; }
.fv-g-title { font-size:20px; line-height:26px; font-weight:400; color:#1a0dab; margin:6px 0 3px; }
.fv-g-snip { font-size:14px; line-height:22px; color:#4d5156; }
.fv-g-date { color:#70757a; }

/* ── pixel inspector ──────────────────────────────────────────── */
.fv-px { display:flex; align-items:flex-end; justify-content:center; gap:22px; padding:16px;
  background:#ffffff; border:1px solid #e3e5e8; border-radius:8px; }
.fv-px-cell { display:flex; flex-direction:column; align-items:center; gap:10px; }
.fv-px-box { position:relative; display:grid; place-items:center; background:#ffffff;
  box-shadow:0 0 0 1px #d9dcdf; }
.fv-px-sm { width:48px; height:48px; }
.fv-px-grid { position:absolute; inset:0; pointer-events:none;
  background-image:
    repeating-linear-gradient(90deg, rgba(0,0,0,.15) 0 1px, transparent 1px 8px),
    repeating-linear-gradient(180deg, rgba(0,0,0,.15) 0 1px, transparent 1px 8px); }
.fv-px-lab { font-size:10px; letter-spacing:.06em; color:#6b7280; }

/* ── size ladder ──────────────────────────────────────────────── */
.fv-ld { display:flex; flex-direction:column; gap:14px; }
.fv-ld-band { display:flex; align-items:flex-end; justify-content:space-between;
  gap:12px; padding:16px 18px 11px; border-radius:8px; }
.fv-ld-w { background:#ffffff; box-shadow:0 0 0 1px #e3e5e8; }
.fv-ld-k { background:#202124; }
.fv-ld-cell { display:flex; flex-direction:column; align-items:center; gap:9px; }
.fv-ld-n { font-size:10px; letter-spacing:.06em; color:#80868b; }
.fv-ld-cap { font-size:10px; letter-spacing:.08em; text-transform:uppercase;
  color:#9aa0a6; margin-bottom:7px; }

/* ── new tab page ─────────────────────────────────────────────── */
.fv-nt { background:#ffffff; padding:26px 20px 30px; }
.fv-nt-search { display:flex; align-items:center; gap:14px; width:340px; height:46px;
  margin:0 auto 26px; padding:0 18px; border:1px solid #dfe1e5; border-radius:24px;
  font-size:14px; color:#9aa0a6; }
.fv-nt-grid { display:flex; flex-wrap:wrap; }
.fv-nt-tile { width:112px; padding:16px 8px 14px; display:flex; flex-direction:column;
  align-items:center; gap:8px; border-radius:8px; }
.fv-nt-ico { display:grid; place-items:center; width:48px; height:48px;
  border-radius:50%; background:#f1f3f4; }
.fv-nt-add { color:#5f6368; }
.fv-nt-lab { max-width:96px; font-size:12px; line-height:16px; color:#202124;
  text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* ── tab search popup ─────────────────────────────────────────── */
.fv-ts-pop { width:320px; margin:4px 6px 12px auto; padding:8px 0 6px; background:#ffffff;
  border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,.15), 0 12px 30px -12px rgba(0,0,0,.4); }
.fv-ts-f { display:flex; align-items:center; gap:10px; height:32px; margin:0 12px 6px;
  padding:0 12px; border-radius:999px; background:#f1f3f4; font-size:13px; color:#5f6368; }
.fv-ts-h { padding:8px 16px 4px; font-size:11px; font-weight:500; letter-spacing:.04em;
  text-transform:uppercase; color:#5f6368; }
.fv-ts-row { display:flex; align-items:center; gap:12px; height:36px; margin:0 6px;
  padding:0 10px; border-radius:8px; font-size:13px; color:#202124; }
.fv-ts-on { background:#f1f3f4; }
.fv-ts-d { font-size:12px; color:#5f6368; flex:none; max-width:110px; }
.fv-ts-x { color:#5f6368; display:grid; place-items:center; width:16px; height:16px; flex:none; }

/* ── Safari ───────────────────────────────────────────────────── */
.fv-s { background:#f6f6f6; }
.fv-s-tool { position:relative; display:flex; align-items:center; height:52px;
  padding:0 12px; color:#3c3c43; }
.fv-s-grp { display:flex; align-items:center; gap:4px; flex:none; }
.fv-s-btn { display:grid; place-items:center; width:28px; height:28px; border-radius:6px;
  color:#5a5a5f; flex:none; }
.fv-s-field { position:absolute; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; justify-content:center; gap:6px;
  width:320px; height:28px; border-radius:7px; background:#e8e8e8;
  font-size:13px; color:#1d1d1f; }
.fv-s-bar { display:flex; align-items:center; height:40px; padding:0 8px 5px;
  background:#f1f1f1; border-top:1px solid rgba(0,0,0,.08); }
.fv-s-tab { position:relative; display:flex; align-items:center; height:32px; padding:0 10px;
  flex:1 1 0; min-width:0; border-radius:8px; font-size:13px; color:#5a5a5f; }
.fv-s-tab-on { background:#ffffff; color:#1d1d1f;
  box-shadow:0 1px 2px rgba(0,0,0,.18), 0 0 0 .5px rgba(0,0,0,.06); }
.fv-s-ico { position:absolute; left:9px; top:50%; margin-top:-8px; }
.fv-s-t { flex:1 1 auto; min-width:0; padding:0 20px; text-align:center;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fv-s-sep { width:1px; height:16px; flex:none; background:rgba(0,0,0,.13); }

/* ── Firefox ──────────────────────────────────────────────────── */
.fv-f { background:#f9f9fb; }
.fv-f-strip { display:flex; align-items:center; height:40px; padding:0 6px; background:#f9f9fb; }
.fv-f-tab { position:relative; display:flex; align-items:center; gap:8px; height:36px;
  padding:0 10px; flex:none; min-width:0; border-radius:4px; font-size:12px; color:#5b5b66; }
.fv-f-tab-on { background:#ffffff; color:#15141a;
  box-shadow:0 1px 4px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.05); }
.fv-f-line { position:absolute; top:0; left:0; right:0; height:2px;
  border-radius:2px 2px 0 0; background:#0060df; }
.fv-f-t { flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fv-f-x { display:grid; place-items:center; width:16px; height:16px; flex:none; color:#5b5b66; }
.fv-f-sep { width:1px; height:20px; margin:0 3px; flex:none; background:rgba(0,0,0,.12); }
.fv-f-btn { display:grid; place-items:center; width:28px; height:28px; border-radius:4px;
  color:#5b5b66; flex:none; }
.fv-f-nav { display:flex; align-items:center; gap:4px; height:44px; padding:0 8px;
  background:#f9f9fb; border-bottom:1px solid #cfcfd8; color:#5b5b66; }
.fv-f-url { display:flex; align-items:center; gap:9px; flex:1 1 auto; min-width:0; height:32px;
  margin:0 6px; padding:0 10px; border-radius:8px; background:#ffffff;
  box-shadow:0 0 0 1px #cfcfd8; font-size:13px; color:#15141a; }
.fv-f-dim { color:#5b5b66; }
`);

  /* ── little builders ──────────────────────────────────────── */

  function lights() {
    return el('div', 'fv-tl', [
      el('span', 'fv-tl-r'), el('span', 'fv-tl-y'), el('span', 'fv-tl-g')
    ]);
  }

  function ghost(i) {
    return el('div', 'fv-gf fv-gf-' + 'abcd'.charAt(i % 4));
  }

  /* 16 px favicon, the way a browser actually gets it: unmasked, crunched */
  function fav(ctx, size, radius) {
    return ctx.logo(size || 16, { shape: radius ? 'rounded' : 'sharp', radius: radius, pixel: true });
  }

  function svgPath(size, d, cls) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('class', cls || 'kit-i');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    return s;
  }

  /* Chrome and Google draw their overflow menus as a vertical ⋮ */
  function vdots(size) {
    var s = ic('dots', size);
    s.style.transform = 'rotate(90deg)';
    return s;
  }

  /* Chrome's extensions button */
  function puzzle(size) {
    return svgPath(size, 'M10 5V4a2 2 0 1 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 1 1 0 4h-1v3a1 1 0 0 1-1 1h-3v-1a2 2 0 1 0-4 0v1H7a1 1 0 0 1-1-1v-3H5a2 2 0 1 1 0-4h1V6a1 1 0 0 1 1-1z');
  }

  /* Safari's sidebar toggle */
  function sidebar(size) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('class', 'kit-i');
    [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2.5 }],
     ['path', { d: 'M9.5 5v14' }]].forEach(function (n) {
      var e = document.createElementNS(NS, n[0]);
      Object.keys(n[1]).forEach(function (k) { e.setAttribute(k, n[1][k]); });
      s.appendChild(e);
    });
    return s;
  }

  function cTab(o) {
    var t = el('div', 'fv-ctab' + (o.active ? ' fv-ctab-on' : '') + (o.cls ? ' ' + o.cls : ''));
    if (o.w) t.style.width = o.w + 'px';
    if (o.icon) t.appendChild(o.icon);
    if (o.title) t.appendChild(el('span', 'fv-ctab-t' + (o.fade ? ' fv-fade' : ''), o.title));
    if (o.close) t.appendChild(el('span', 'fv-ctab-x', ic('x', 12)));
    return t;
  }

  /* defs -> a Chrome tab strip, separators drawn only between two inactive tabs */
  function chromeStrip(defs, opts) {
    opts = opts || {};
    var strip = el('div', 'fv-cstrip');
    if (opts.lights !== false) strip.appendChild(lights());
    defs.forEach(function (d, i) {
      if (d.gapBefore) strip.appendChild(el('div', 'fv-cgap'));
      else if (i && !defs[i - 1].active && !d.active) strip.appendChild(el('div', 'fv-csep'));
      strip.appendChild(cTab(d));
    });
    strip.appendChild(el('div', 'fv-cplus', ic('plus', 14)));
    if (opts.tabSearch) strip.appendChild(el('div', 'fv-cplus fv-cts', ic('chevron-down', 14)));
    return strip;
  }

  function chromeToolbar(ctx, path) {
    return el('div', 'fv-ctool', [
      el('div', 'fv-cbtn', ic('arrow-left', 16)),
      el('div', 'fv-cbtn', ic('arrow-right', 16)),
      el('div', 'fv-cbtn', ic('reload', 15)),
      el('div', 'fv-comni', [
        ic('lock', 13),
        el('span', 'kit-ell', [ctx.domain, path ? el('span', 'fv-comni-p', path) : null]),
        el('span', 'fv-comni-s', ic('star', 14))
      ]),
      el('div', 'fv-cbtn', puzzle(15)),
      el('div', 'fv-cav', ic('user', 12)),
      el('div', 'fv-cbtn', vdots(15))
    ]);
  }

  /* the four tabs that sit next to yours in every Chrome mock */
  function neighbours() {
    return [
      { title: 'Inbox (12)', k: 0 },
      { title: 'Pull requests', k: 1 },
      { title: 'Weekly metrics', k: 2 },
      { title: 'Deploy runbook', k: 3 }
    ];
  }

  /* ═══ 1 + 2. Chrome tab strip, light and dark ═══════════════ */

  function chromeWindow(ctx, dark) {
    var n = neighbours();
    var defs = [{ active: true, w: 148, close: true, title: ctx.brand, icon: fav(ctx, 16) }];
    for (var i = 0; i < 3; i++) defs.push({ w: 148, close: true, title: n[i].title, icon: ghost(n[i].k) });

    var win = el('div', 'fv-c fv-win' + (dark ? ' fv-dark' : ''));
    win.appendChild(chromeStrip(defs));
    win.appendChild(chromeToolbar(ctx, '/pricing'));
    return win;
  }

  L.register({
    id: 'fav-chrome-light',
    group: 'favicon',
    title: 'Chrome — tab strip, light',
    spec: 'FAVICON 16 PX / TAB 34 PX',
    note: '#dee1e6 strip, white active tab',
    width: 720,
    wide: true,
    render: function (ctx) { return chromeWindow(ctx, false); }
  });

  L.register({
    id: 'fav-chrome-dark',
    group: 'favicon',
    title: 'Chrome — tab strip, dark',
    spec: 'FAVICON 16 PX / TAB 34 PX',
    note: '#202124 strip, #35363a active tab',
    width: 720,
    wide: true,
    render: function (ctx) { return chromeWindow(ctx, true); }
  });

  /* ═══ 3. Pinned tab — the harshest 16 px there is ═══════════ */

  L.register({
    id: 'fav-chrome-pinned',
    group: 'favicon',
    title: 'Chrome — pinned tab',
    spec: 'PINNED 34 PX / MARK 16 PX',
    note: 'no title, no fallback letter — the mark alone on chrome grey',
    width: 420,
    wide: false,
    render: function (ctx) {
      function strip(dark) {
        var defs = [
          { cls: 'fv-ctab-pin', icon: fav(ctx, 16) },
          { w: 126, close: true, title: 'Inbox (12)', icon: ghost(0), gapBefore: true },
          { w: 126, close: true, active: true, title: 'Weekly metrics', icon: ghost(2) }
        ];
        var win = el('div', 'fv-c fv-win' + (dark ? ' fv-dark' : ''));
        win.appendChild(chromeStrip(defs));
        win.appendChild(el('div', 'fv-csliver'));
        return win;
      }
      return el('div', 'fv-stack', [strip(false), strip(true)]);
    }
  });

  /* ═══ 4. Squeezed strip — 12 tabs, ~48 px each ══════════════ */

  L.register({
    id: 'fav-chrome-squeeze',
    group: 'favicon',
    title: 'Chrome — 12 tabs open',
    spec: 'TAB 48 PX / MARK 16 PX',
    note: 'title fades out after two characters; only the mark identifies the tab',
    width: 720,
    wide: true,
    render: function (ctx) {
      var titles = [
        'Inbox (12)', 'Calendar', ctx.brand, 'Pull requests', 'Design specs', 'Analytics',
        'Staging', 'Deploy runbook', 'Team chat', 'Drive', 'Meeting notes', 'Status'
      ];
      var defs = titles.map(function (t, i) {
        return {
          w: 48, cls: 'fv-ctab-sq', fade: true, title: t,
          active: i === 2,
          icon: i === 2 ? fav(ctx, 16) : ghost(i)
        };
      });
      var win = el('div', 'fv-c fv-win');
      win.appendChild(chromeStrip(defs));
      win.appendChild(el('div', 'fv-csliver'));
      return win;
    }
  });

  /* ═══ 5. Safari, macOS light ════════════════════════════════ */

  L.register({
    id: 'fav-safari',
    group: 'favicon',
    title: 'Safari — tab bar, macOS',
    spec: 'FAVICON 16 PX / TAB 32 PX',
    note: 'title centred, favicon pinned left at 9 px',
    width: 720,
    wide: true,
    render: function (ctx) {
      var win = el('div', 'fv-s fv-win');

      var tool = el('div', 'fv-s-tool');
      tool.appendChild(lights());
      tool.appendChild(el('div', 'fv-s-grp', [
        el('div', 'fv-s-btn', sidebar(17)),
        el('div', 'fv-s-btn', ic('chevron-left', 17)),
        el('div', 'fv-s-btn', ic('chevron-right', 17))
      ]));
      tool.appendChild(el('div', 'fv-s-field', [
        ic('lock', 11),
        el('span', null, ctx.domain)
      ]));
      var right = el('div', 'fv-s-grp');
      right.style.marginLeft = 'auto';
      [['share', 16], ['plus', 16], ['grid', 16]].forEach(function (b) {
        right.appendChild(el('div', 'fv-s-btn', ic(b[0], b[1])));
      });
      tool.appendChild(right);
      win.appendChild(tool);

      var bar = el('div', 'fv-s-bar');
      var tabs = [
        { t: 'Inbox — Mail', k: 0 },
        { t: ctx.brand, on: true },
        { t: 'Weekly metrics', k: 2 },
        { t: 'Pull requests', k: 1 },
        { t: 'Deploy runbook', k: 3 }
      ];
      tabs.forEach(function (d, i) {
        if (i && !d.on && !tabs[i - 1].on) bar.appendChild(el('div', 'fv-s-sep'));
        var tab = el('div', 'fv-s-tab' + (d.on ? ' fv-s-tab-on' : ''));
        var icoWrap = el('div', 'fv-s-ico', d.on ? fav(ctx, 16) : ghost(d.k));
        tab.appendChild(icoWrap);
        tab.appendChild(el('div', 'fv-s-t', d.t));
        bar.appendChild(tab);
      });
      var plus = el('div', 'fv-s-btn', ic('plus', 15));
      plus.style.marginLeft = '4px';
      bar.appendChild(plus);
      win.appendChild(bar);
      return win;
    }
  });

  /* ═══ 6. Firefox ════════════════════════════════════════════ */

  L.register({
    id: 'fav-firefox',
    group: 'favicon',
    title: 'Firefox — tab strip',
    spec: 'FAVICON 16 PX / TAB 36 PX',
    note: '#f9f9fb strip, 4 px radius, 2 px selected line',
    width: 720,
    wide: true,
    render: function (ctx) {
      var win = el('div', 'fv-f fv-win');

      var strip = el('div', 'fv-f-strip');
      strip.appendChild(lights());
      var defs = [
        { t: 'Inbox (12)', k: 0 },
        { t: ctx.brand, on: true },
        { t: 'Weekly metrics', k: 2 },
        { t: 'Deploy runbook', k: 3 }
      ];
      defs.forEach(function (d, i) {
        if (i && !d.on && !defs[i - 1].on) strip.appendChild(el('div', 'fv-f-sep'));
        var tab = el('div', 'fv-f-tab' + (d.on ? ' fv-f-tab-on' : ''));
        tab.style.width = '140px';
        if (d.on) tab.appendChild(el('div', 'fv-f-line'));
        tab.appendChild(d.on ? fav(ctx, 16) : ghost(d.k));
        tab.appendChild(el('div', 'fv-f-t', d.t));
        tab.appendChild(el('div', 'fv-f-x', ic('x', 12)));
        strip.appendChild(tab);
      });
      strip.appendChild(el('div', 'fv-f-btn', ic('plus', 15)));
      var listAll = el('div', 'fv-f-btn', ic('chevron-down', 15));
      listAll.style.marginLeft = 'auto';
      strip.appendChild(listAll);
      win.appendChild(strip);

      win.appendChild(el('div', 'fv-f-nav', [
        el('div', 'fv-f-btn', ic('arrow-left', 16)),
        el('div', 'fv-f-btn', ic('arrow-right', 16)),
        el('div', 'fv-f-btn', ic('reload', 15)),
        el('div', 'fv-f-url', [
          ic('shield', 13),
          ic('lock', 13),
          el('span', 'kit-ell', [ctx.domain, el('span', 'fv-f-dim', '/pricing')]),
          el('div', 'fv-f-x', ic('star', 13))
        ]),
        el('div', 'fv-f-btn', puzzle(15)),
        el('div', 'fv-f-btn', ic('user', 15)),
        el('div', 'fv-f-btn', ic('menu', 15))
      ]));
      return win;
    }
  });

  /* ═══ 7. Bookmarks bar ══════════════════════════════════════ */

  L.register({
    id: 'fav-bookmarks',
    group: 'favicon',
    title: 'Chrome — bookmarks bar',
    spec: 'FAVICON 16 PX / ROW 32 PX',
    note: 'yours in slot 3, labels truncate at 150 px',
    width: 720,
    wide: true,
    render: function (ctx) {
      var win = el('div', 'fv-c fv-win');
      var bar = el('div', 'fv-bb');
      var marks = ['Mail', 'Calendar', null, 'Dashboard', 'Docs', 'Analytics', 'Status', 'Design'];
      marks.forEach(function (label, i) {
        var mine = label === null;
        var item = el('div', 'fv-bi' + (mine ? ' fv-bi-me' : '') + (i === 4 ? ' fv-bi-on' : ''));
        item.appendChild(mine ? fav(ctx, 16) : ghost(i));
        item.appendChild(el('span', 'kit-ell', mine ? ctx.brand : label));
        bar.appendChild(item);
      });
      bar.appendChild(el('div', 'fv-ball', [ic('folder', 14), 'All Bookmarks']));
      win.appendChild(bar);

      var page = el('div', 'fv-bpage');
      page.appendChild(el('div', 'fv-bpage-h', ctx.brand));
      [74, 88, 52].forEach(function (w) {
        var bar2 = el('span', 'kit-ph');
        bar2.style.display = 'block';
        bar2.style.setProperty('--w', w + '%');
        bar2.style.setProperty('--h', '9px');
        page.appendChild(bar2);
      });
      win.appendChild(page);
      return win;
    }
  });

  /* ═══ 8. History list ═══════════════════════════════════════ */

  L.register({
    id: 'fav-history',
    group: 'favicon',
    title: 'Chrome — history',
    spec: 'FAVICON 16 PX / ROW 44 PX',
    note: 'the mark repeated down a list of other people’s marks',
    width: 620,
    wide: true,
    render: function (ctx) {
      var page = el('div', 'fv-h');
      page.appendChild(el('div', 'fv-h-top', [
        el('div', 'fv-h-title', 'History'),
        el('div', 'fv-h-search', [ic('search', 14), 'Search history'])
      ]));
      page.appendChild(el('div', 'fv-h-day', 'Today — Monday, 27 July'));

      var rows = [
        { t: '10:42 AM', mine: true, title: ctx.brand, dom: ctx.domain },
        { t: '10:31 AM', k: 0, title: 'Inbox (12) — Mail', dom: 'mail.google.com' },
        { t: '10:04 AM', k: 2, title: 'Weekly metrics — Dashboard', dom: 'analytics.internal' },
        { t: '9:58 AM', mine: true, title: 'Pricing — ' + ctx.brand, dom: ctx.domain },
        { t: '9:41 AM', k: 1, title: 'Pull requests', dom: 'github.com' },
        { t: '9:12 AM', k: 3, title: 'Deploy runbook', dom: 'docs.internal' },
        { t: '8:47 AM', k: 2, title: 'Status', dom: 'status.internal' }
      ];
      rows.forEach(function (r) {
        page.appendChild(el('div', 'fv-h-row', [
          el('div', 'fv-h-time', r.t),
          r.mine ? fav(ctx, 16) : ghost(r.k),
          el('div', 'fv-h-t kit-ell', r.title),
          el('div', 'fv-h-d kit-ell', r.dom),
          el('div', 'fv-h-dots', vdots(14))
        ]));
      });
      return page;
    }
  });

  /* ═══ 9. Google search result ═══════════════════════════════ */

  L.register({
    id: 'fav-serp',
    group: 'favicon',
    title: 'Google — search result',
    spec: 'MARK 16 PX IN 26 PX DISC',
    note: 'arial, #1a0dab title, favicon on white inside a hairline circle',
    width: 620,
    wide: true,
    render: function (ctx) {
      var res = el('div', 'fv-g');
      res.appendChild(el('div', 'fv-g-h', [
        el('div', 'fv-g-ico', fav(ctx, 16)),
        el('div', 'kit-col', [
          el('div', 'fv-g-site', ctx.brand),
          el('div', 'fv-g-url', ctx.domain + ' › pricing')
        ]),
        el('div', 'fv-g-dots', vdots(16))
      ]));
      res.appendChild(el('div', 'fv-g-title', ctx.brand + ' — ' + ctx.tagline));
      res.appendChild(el('div', 'fv-g-snip kit-clamp2', [
        el('span', 'fv-g-date', '12 Jul 2026 — '),
        'Plans start on the free tier and scale per seat. Set up takes a few minutes, ' +
        'nothing to install, and you can move your data out again at any point.'
      ]));
      return res;
    }
  });

  /* ═══ 10. Pixel inspector ═══════════════════════════════════ */

  L.register({
    id: 'fav-pixel',
    group: 'favicon',
    title: 'Pixel inspector — 16 px',
    spec: '16 PX / 16 PX AT 800%',
    note: 'nearest-neighbour, 1 px grid — every pixel you actually ship',
    width: 320,
    wide: false,
    render: function (ctx) {
      function cell(box, label) {
        return el('div', 'fv-px-cell', [box, el('div', 'fv-px-lab kit-mono', label)]);
      }
      var small = el('div', 'fv-px-box fv-px-sm', ctx.logo(16, { shape: 'sharp', pixel: true }));

      var big = el('div', 'fv-px-box');
      big.style.width = '128px';
      big.style.height = '128px';
      big.appendChild(ctx.logo(128, { shape: 'sharp', pixel: true }));
      big.appendChild(el('div', 'fv-px-grid'));

      return el('div', 'fv-px', [
        cell(small, '16 px actual'),
        cell(big, '16 px at 800%')
      ]);
    }
  });

  /* ═══ 11. Size ladder on both chromes ═══════════════════════ */

  L.register({
    id: 'fav-ladder',
    group: 'favicon',
    title: 'Favicon ladder — light vs dark chrome',
    spec: '16 / 24 / 32 / 48 PX',
    note: '#ffffff over #202124, the four sizes a browser asks for',
    width: 320,
    wide: false,
    render: function (ctx) {
      function band(dark) {
        var b = el('div', 'fv-ld-band ' + (dark ? 'fv-ld-k fv-dark' : 'fv-ld-w'));
        [16, 24, 32, 48].forEach(function (s) {
          b.appendChild(el('div', 'fv-ld-cell', [
            ctx.logo(s, { shape: 'sharp', pixel: s <= 32 }),
            el('div', 'fv-ld-n kit-mono', String(s))
          ]));
        });
        return el('div', null, [
          el('div', 'fv-ld-cap kit-mono', dark ? '#202124' : '#ffffff'),
          b
        ]);
      }
      return el('div', 'fv-ld', [band(false), band(true)]);
    }
  });

  /* ═══ 12. New tab page shortcuts ════════════════════════════ */

  L.register({
    id: 'fav-ntp',
    group: 'favicon',
    title: 'Chrome — new tab shortcuts',
    spec: 'MARK 24 PX IN 48 PX DISC',
    note: 'the favicon scaled up, not the app icon — most marks go soft here',
    width: 600,
    wide: true,
    render: function (ctx) {
      var page = el('div', 'fv-nt');
      page.appendChild(el('div', 'fv-nt-search', [
        ic('search', 16), 'Search Google or type a URL'
      ]));

      var grid = el('div', 'fv-nt-grid');
      var tiles = ['Mail', 'Calendar', null, 'Dashboard', 'Docs',
                   'Analytics', 'Status', 'Design', 'Drive'];
      tiles.forEach(function (label, i) {
        var mine = label === null;
        var art = mine
          ? ctx.logo(24, { shape: 'sharp', pixel: true })
          : el('div', 'fv-gf fv-gf-' + 'abcd'.charAt(i % 4));
        if (!mine) { art.style.width = '24px'; art.style.height = '24px'; }
        grid.appendChild(el('div', 'fv-nt-tile', [
          el('div', 'fv-nt-ico', art),
          el('div', 'fv-nt-lab', mine ? ctx.brand : label)
        ]));
      });
      grid.appendChild(el('div', 'fv-nt-tile', [
        el('div', 'fv-nt-ico fv-nt-add', ic('plus', 20)),
        el('div', 'fv-nt-lab', 'Add shortcut')
      ]));
      page.appendChild(grid);
      return page;
    }
  });

  /* ═══ 13. Tab search popup ══════════════════════════════════ */

  L.register({
    id: 'fav-tabsearch',
    group: 'favicon',
    title: 'Chrome — tab search',
    spec: 'FAVICON 16 PX / ROW 36 PX',
    note: 'the list you scan when 30 tabs are open',
    width: 340,
    wide: false,
    render: function (ctx) {
      var win = el('div', 'fv-c fv-win');
      win.appendChild(chromeStrip([
        { w: 92, close: true, active: true, title: ctx.brand, icon: fav(ctx, 16) },
        { w: 92, close: true, title: 'Inbox (12)', icon: ghost(0) }
      ], { tabSearch: true }));

      var pop = el('div', 'fv-ts-pop');
      pop.appendChild(el('div', 'fv-ts-f', [ic('search', 14), 'Search tabs']));
      pop.appendChild(el('div', 'fv-ts-h', 'Open tabs'));
      var rows = [
        { title: 'Inbox (12) — Mail', dom: 'mail.google.com', k: 0 },
        { title: ctx.brand, dom: ctx.domain, mine: true, on: true },
        { title: 'Weekly metrics', dom: 'analytics.internal', k: 2 },
        { title: 'Pull requests', dom: 'github.com', k: 1 }
      ];
      rows.forEach(function (r) {
        pop.appendChild(el('div', 'fv-ts-row' + (r.on ? ' fv-ts-on' : ''), [
          r.mine ? fav(ctx, 16) : ghost(r.k),
          el('span', 'kit-ell kit-fill', r.title),
          el('span', 'fv-ts-d kit-ell', r.dom),
          el('span', 'fv-ts-x', ic('x', 12))
        ]));
      });
      pop.appendChild(el('div', 'fv-ts-h', 'Recently closed'));
      pop.appendChild(el('div', 'fv-ts-row', [
        fav(ctx, 16),
        el('span', 'kit-ell kit-fill', 'Pricing — ' + ctx.brand),
        el('span', 'fv-ts-d kit-ell', ctx.domain)
      ]));
      win.appendChild(pop);
      return win;
    }
  });
})();
