/* js/scenes/app.js — App & device icons: home screens, docks, menu bars, stores.
   Every platform here forces its own mask, so every mark is rendered with the
   shape that platform would actually apply, and with the background that
   platform bakes behind it. */
(function () {
  'use strict';

  var L = window.LogoLab;
  var NS = 'http://www.w3.org/2000/svg';

  /* ── svg helpers ──────────────────────────────────────────── */

  function sv(w, h, vb) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', String(w));
    s.setAttribute('height', String(h));
    s.setAttribute('viewBox', vb);
    s.setAttribute('fill', 'none');
    return s;
  }
  function pth(d, fill, stroke, sw, op) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', fill || 'none');
    if (stroke) {
      p.setAttribute('stroke', stroke);
      p.setAttribute('stroke-width', String(sw || 1.5));
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
    }
    if (op != null) p.setAttribute('opacity', String(op));
    return p;
  }
  function rct(x, y, w, h, r, fill, op) {
    var n = document.createElementNS(NS, 'rect');
    n.setAttribute('x', String(x)); n.setAttribute('y', String(y));
    n.setAttribute('width', String(w)); n.setAttribute('height', String(h));
    if (r != null) n.setAttribute('rx', String(r));
    n.setAttribute('fill', fill || 'currentColor');
    if (op != null) n.setAttribute('opacity', String(op));
    return n;
  }
  function cir(cx, cy, r, fill, op) {
    var n = document.createElementNS(NS, 'circle');
    n.setAttribute('cx', String(cx)); n.setAttribute('cy', String(cy));
    n.setAttribute('r', String(r));
    n.setAttribute('fill', fill || 'currentColor');
    if (op != null) n.setAttribute('opacity', String(op));
    return n;
  }
  function kids(parent, list) {
    list.forEach(function (k) { if (k) parent.appendChild(k); });
    return parent;
  }

  /* ── generic bits ─────────────────────────────────────────── */

  function ph(w, h) {
    var s = L.el('span', 'kit-ph');
    s.style.setProperty('--w', w);
    s.style.setProperty('--h', h + 'px');
    return s;
  }

  /* a flat neutral sibling app icon so the real mark has company */
  function tile(size, cls, bg, glyph, gsize, color) {
    var d = L.el('div', 'ap-ico' + (cls ? ' ' + cls : ''));
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.background = bg;
    d.style.color = color || '#8b9099';
    if (glyph) d.appendChild(L.icon(glyph, gsize || Math.round(size * 0.46)));
    return d;
  }

  var GREY = [
    'linear-gradient(180deg,#ffffff,#eef0f4)',
    'linear-gradient(180deg,#f4f5f8,#e0e3ea)',
    'linear-gradient(180deg,#e9ebf0,#d3d7e0)',
    'linear-gradient(180deg,#dfe2e9,#c6cbd6)'
  ];

  /* ── platform glyphs (drawn here, never emoji) ────────────── */

  function appleMark(size, color) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [pth('M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.18-1.73-1.35-.14-2.64.79-3.33.79-.69 0-1.75-.77-2.87-.75-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.21 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.5zM14.9 6.2c.61-.74 1.02-1.77.91-2.8-.88.04-1.94.59-2.57 1.32-.56.65-1.05 1.7-.92 2.7.98.08 1.98-.5 2.58-1.22z', color || 'currentColor')]);
  }

  function winMark(size) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [
      rct(0.5, 0.5, 10.4, 10.4, 0, '#0f8fe0'),
      rct(13.1, 0.5, 10.4, 10.4, 0, '#0f8fe0'),
      rct(0.5, 13.1, 10.4, 10.4, 0, '#0f8fe0'),
      rct(13.1, 13.1, 10.4, 10.4, 0, '#0f8fe0')
    ]);
  }

  function googleG(size) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [
      pth('M4.48 9.26A8 8 0 0 1 16 5.07', null, '#EA4335', 3.6),
      pth('M16 5.07A8 8 0 0 1 19.52 14.74', null, '#4285F4', 3.6),
      pth('M19.52 14.74A8 8 0 0 1 9.26 19.52', null, '#34A853', 3.6),
      pth('M9.26 19.52A8 8 0 0 1 4.48 9.26', null, '#FBBC05', 3.6),
      pth('M12.6 12h7.4', null, '#4285F4', 3.6)
    ]);
  }

  function puzzle(size, color) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [pth('M12.4 3.2a2.1 2.1 0 0 1 2.1 2.1v1.1h2.9c.8 0 1.4.6 1.4 1.4v2.9h-1.1a2.1 2.1 0 1 0 0 4.2h1.1v2.9c0 .8-.6 1.4-1.4 1.4h-2.9v-1.1a2.1 2.1 0 1 0-4.2 0v1.1H7.4c-.8 0-1.4-.6-1.4-1.4v-2.9H4.9a2.1 2.1 0 1 1 0-4.2H6V7.8c0-.8.6-1.4 1.4-1.4h2.9V5.3a2.1 2.1 0 0 1 2.1-2.1z', null, color || 'currentColor', 1.6)]);
  }

  /* ── iOS chrome ───────────────────────────────────────────── */

  function iosStatus() {
    var r = L.el('div', 'ap-ios-sb');
    r.appendChild(L.el('div', 'ap-ios-time', '9:41'));
    var right = L.el('div', 'ap-ios-sys');

    var sig = sv(17, 12, '0 0 17 12');
    kids(sig, [rct(0, 8, 3, 4, 1), rct(4.6, 5.8, 3, 6.2, 1),
               rct(9.2, 3.2, 3, 8.8, 1), rct(13.8, 0.6, 3, 11.4, 1)]);

    var wifi = sv(16, 12, '0 0 16 12');
    kids(wifi, [
      pth('M1.1 4.4A10.3 10.3 0 0 1 14.9 4.4', null, 'currentColor', 1.9),
      pth('M3.8 7.2a6.4 6.4 0 0 1 8.4 0', null, 'currentColor', 1.9),
      cir(8, 10.4, 1.35)
    ]);

    var batt = sv(27, 13, '0 0 27 13');
    kids(batt, [
      rct(0.6, 0.7, 22.6, 11.6, 3.6, 'none'),
      rct(2.2, 2.3, 16, 8.4, 2.2),
      pth('M25.2 4.6c1 .4 1.6 1.1 1.6 1.8s-.6 1.4-1.6 1.8z', 'currentColor', null, 0, 0.45)
    ]);
    batt.children[0].setAttribute('stroke', 'currentColor');
    batt.children[0].setAttribute('stroke-width', '1.1');
    batt.children[0].setAttribute('opacity', '0.38');

    kids(right, [sig, wifi, batt]);
    r.appendChild(right);
    return r;
  }

  var IOS_ROW1 = [
    { n: 'Files', g: 'folder' },
    { mine: true },
    { n: 'Photos', g: 'image' },
    { n: 'Notes', g: 'paperclip' }
  ];
  var IOS_ROW2 = [
    { n: 'Maps', g: 'pin' },
    { n: 'Podcasts', g: 'mic' },
    { n: 'Camera', g: 'camera' },
    { n: 'Settings', g: 'settings' }
  ];
  var IOS_ROW3 = [
    { n: 'Calendar', g: 'grid' },
    { n: 'Clock', g: 'reload' },
    { n: 'Health', g: 'heart' },
    { n: 'Wallet', g: 'bookmark' }
  ];

  function iosScreen(ctx, dark) {
    var E = ctx.el;
    var root = E('div', 'ap-ios ' + (dark ? 'ap-ios-d' : 'ap-ios-l'));
    root.appendChild(iosStatus());

    var grid = E('div', 'ap-ios-grid');
    IOS_ROW1.concat(IOS_ROW2, IOS_ROW3).forEach(function (a, i) {
      var cell = E('div', 'ap-ios-cell');
      if (a.mine) {
        cell.appendChild(ctx.logo(60, { shape: 'squircle', bg: dark ? '#0d0f12' : '#ffffff' }));
        cell.appendChild(E('div', 'ap-ios-lab', ctx.brand));
      } else {
        cell.appendChild(tile(60, 'ap-sqm', GREY[i % 4], a.g, 27));
        cell.appendChild(E('div', 'ap-ios-lab', a.n));
      }
      grid.appendChild(cell);
    });
    root.appendChild(grid);

    var search = E('div', 'ap-ios-search');
    search.appendChild(L.icon('search', 13));
    search.appendChild(E('span', null, 'Search'));
    root.appendChild(search);

    var dock = E('div', 'ap-ios-dock');
    [['comment', 0], ['globe', 1], ['send', 2], ['play', 3]].forEach(function (d) {
      dock.appendChild(tile(60, 'ap-sqm', GREY[d[1]], d[0], 27));
    });
    root.appendChild(dock);
    root.appendChild(E('div', 'ap-ios-hi'));
    return root;
  }

  /* ── Android chrome ───────────────────────────────────────── */

  function andStatus(cls) {
    var r = L.el('div', 'ap-an-sb' + (cls ? ' ' + cls : ''));
    r.appendChild(L.el('div', 'ap-an-time', '9:41'));
    var right = L.el('div', 'ap-an-sys');

    var wifi = sv(15, 12, '0 0 16 13');
    kids(wifi, [pth('M8 12.2.9 4.7A10.2 10.2 0 0 1 15.1 4.7z', 'currentColor')]);

    var sig = sv(13, 12, '0 0 14 13');
    kids(sig, [pth('M1 12.4h12V.6z', 'currentColor')]);

    var batt = sv(10, 13, '0 0 10 14');
    kids(batt, [rct(3.4, 0.4, 3.2, 2.2, 0.9), rct(1.2, 1.8, 7.6, 11.6, 1.8)]);

    kids(right, [wifi, sig, batt]);
    r.appendChild(right);
    return r;
  }

  function andCell(node, label) {
    var c = L.el('div', 'ap-an-cell');
    c.appendChild(node);
    c.appendChild(L.el('div', 'ap-an-lab', label));
    return c;
  }

  /* ── macOS chrome ─────────────────────────────────────────── */

  function macWifi(size, color) {
    var s = sv(size, size * 0.72, '0 0 18 13');
    return kids(s, [
      pth('M1.2 4.6A11.4 11.4 0 0 1 16.8 4.6', null, color, 1.7),
      pth('M4.2 7.6a7.1 7.1 0 0 1 9.6 0', null, color, 1.7),
      cir(9, 11, 1.5, color)
    ]);
  }
  function macBatt(color) {
    var s = sv(26, 12, '0 0 26 12');
    var out = rct(0.6, 0.7, 21.4, 10.6, 3.2, 'none');
    out.setAttribute('stroke', color);
    out.setAttribute('stroke-width', '1');
    out.setAttribute('opacity', '0.4');
    return kids(s, [
      out,
      rct(2, 2.1, 14, 7.8, 2, color),
      pth('M23.6 4.2c.9.4 1.4 1 1.4 1.8s-.5 1.4-1.4 1.8z', color, null, 0, 0.4)
    ]);
  }
  function chevUp(size, color) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [pth('M4.5 15.5 12 8l7.5 7.5', null, color, 2)]);
  }
  function speaker(size, color) {
    var s = sv(size, size, '0 0 24 24');
    return kids(s, [
      pth('M4 9.2h3.4L12 5.4v13.2L7.4 14.8H4z', color),
      pth('M15.6 9.4a3.7 3.7 0 0 1 0 5.2M18.3 6.8a7.4 7.4 0 0 1 0 10.4', null, color, 1.6)
    ]);
  }
  function macCC(color) {
    var s = sv(15, 15, '0 0 16 16');
    return kids(s, [
      pth('M2.6 5.2h10.8M2.6 10.8h10.8', null, color, 1.4),
      cir(6, 5.2, 2, color), cir(10, 10.8, 2, color)
    ]);
  }

  /* ── styles ───────────────────────────────────────────────── */

  L.css(`
  .ap-sqm {
    --ap-sq: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0c33.6 0 43.4 3.1 46.9 6.6C100.4 10.1 100 16.4 100 50s.4 39.9-3.1 43.4C93.4 96.9 83.6 100 50 100s-43.4-3.1-46.9-6.6C-.4 89.9 0 83.6 0 50S-.4 10.1 3.1 6.6 16.4 0 50 0z'/%3E%3C/svg%3E");
    -webkit-mask-image: var(--ap-sq); mask-image: var(--ap-sq);
    -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
  }
  .ap-ico { display: grid; place-items: center; flex: none; overflow: hidden; }
  .ap-hair { display: inline-block; padding: .5px; background: rgba(0,0,0,.13); flex: none; }
  .ap-mono { filter: grayscale(1) brightness(0); }
  .ap-monoi { filter: grayscale(1) brightness(0) invert(1); }

  /* ═ iOS home screen ═ */
  .ap-ios {
    position: relative; height: 844px; overflow: hidden;
    display: flex; flex-direction: column;
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  }
  .ap-ios-l {
    color: #0b0d12;
    background:
      radial-gradient(120% 70% at 15% 0%, #f6dfc7 0%, rgba(246,223,199,0) 58%),
      radial-gradient(90% 60% at 100% 18%, #a9c6ef 0%, rgba(169,198,239,0) 55%),
      linear-gradient(165deg, #d7e0f4 0%, #a8bbdf 46%, #7189b4 100%);
  }
  .ap-ios-d {
    color: #fff;
    background:
      radial-gradient(120% 70% at 22% 2%, #23324f 0%, rgba(35,50,79,0) 58%),
      radial-gradient(90% 55% at 98% 22%, #2c1f40 0%, rgba(44,31,64,0) 55%),
      linear-gradient(165deg, #121724 0%, #0a0d15 55%, #04060a 100%);
  }
  .ap-ios-sb {
    height: 54px; padding: 0 28px 7px 34px; flex: none;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .ap-ios-time { font-size: 16px; font-weight: 600; letter-spacing: -.2px; }
  .ap-ios-sys { display: flex; align-items: center; gap: 6px; }
  .ap-ios-grid {
    display: grid; grid-template-columns: repeat(4, 60px);
    justify-content: space-between; padding: 12px 27px 0; row-gap: 28px;
  }
  .ap-ios-cell { width: 60px; display: flex; flex-direction: column; align-items: center; }
  .ap-ios-lab {
    margin-top: 5px; max-width: 76px; flex: none; font-size: 11px; line-height: 13px;
    letter-spacing: -.05px; color: #fff;
    text-shadow: 0 0 2px rgba(0,0,0,.92), 0 1px 3px rgba(0,0,0,.7);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ap-ios-search {
    margin: auto auto 16px; display: flex; align-items: center; gap: 4px;
    height: 30px; padding: 0 13px 0 10px; border-radius: 15px;
    background: rgba(255,255,255,.26); color: #fff; font-size: 13px; font-weight: 500;
    -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  }
  .ap-ios-d .ap-ios-search { background: rgba(255,255,255,.14); }
  .ap-ios-dock {
    margin: 0 10px 24px; height: 92px; border-radius: 34px; flex: none;
    display: flex; align-items: center; justify-content: space-between; padding: 0 17px;
    background: rgba(255,255,255,.26);
    box-shadow: inset 0 0 0 .5px rgba(255,255,255,.3);
    -webkit-backdrop-filter: blur(26px) saturate(180%);
    backdrop-filter: blur(26px) saturate(180%);
  }
  .ap-ios-d .ap-ios-dock {
    background: rgba(255,255,255,.1); box-shadow: inset 0 0 0 .5px rgba(255,255,255,.13);
  }
  .ap-ios-hi {
    position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%);
    width: 140px; height: 5px; border-radius: 3px; background: rgba(0,0,0,.4);
  }
  .ap-ios-d .ap-ios-hi { background: rgba(255,255,255,.5); }

  /* ═ Android home screen ═ */
  .ap-an {
    position: relative; height: 915px; overflow: hidden;
    display: flex; flex-direction: column; color: #fff;
    font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
    background:
      radial-gradient(90% 55% at 12% 4%, #f3edf9 0%, rgba(243,237,249,0) 60%),
      linear-gradient(168deg, #ded6e9 0%, #b0a6c2 46%, #6f6683 100%);
  }
  .ap-an-sb, .ap-an-glance { color: #1c1b1f; }
  .ap-an-sb {
    height: 26px; flex: none; width: 100%; padding: 0 14px 0 18px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; font-weight: 500;
  }
  .ap-an-sys { display: flex; align-items: center; gap: 5px; }
  .ap-an-glance { padding: 14px 20px 0; }
  .ap-an-day { font-size: 15px; font-weight: 500; }
  .ap-an-wx { font-size: 13px; margin-top: 1px; opacity: .8; }
  .ap-an-pair { display: flex; justify-content: center; gap: 74px; margin-top: 34px; }
  .ap-an-row {
    display: grid; grid-template-columns: repeat(4, 56px);
    justify-content: space-between; padding: 34px 28px 0;
  }
  .ap-an-cell { display: flex; flex-direction: column; align-items: center; width: 56px; }
  .ap-an-lab {
    margin-top: 7px; max-width: 78px; flex: none; font-size: 12px; line-height: 14px; color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,.6), 0 0 10px rgba(0,0,0,.35);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ap-an-qsb {
    margin: auto 24px 18px; height: 48px; border-radius: 24px; flex: none;
    display: flex; align-items: center; gap: 12px; padding: 0 16px;
    background: rgba(255,255,255,.62); color: #49454f;
    -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
  }
  .ap-an-nav {
    height: 24px; flex: none; display: grid; place-items: center;
  }
  .ap-an-nav i { display: block; width: 108px; height: 4px; border-radius: 2px; background: rgba(255,255,255,.8); }

  /* ═ Android settings / app list ═ */
  .ap-al { background: #fff; font-family: Roboto, "Helvetica Neue", Arial, sans-serif; color: #1f1f1f; padding-bottom: 10px; }
  .ap-al-bar { height: 64px; display: flex; align-items: center; gap: 24px; padding: 0 16px; color: #1f1f1f; }
  .ap-al-t { font-size: 22px; font-weight: 400; flex: 1 1 auto; }
  .ap-al-row { height: 64px; display: flex; align-items: center; gap: 20px; padding: 0 20px; }
  .ap-al-n { font-size: 16px; line-height: 20px; }
  .ap-al-s { font-size: 14px; line-height: 18px; color: #444746; margin-top: 1px; }
  .ap-al-h { font-size: 12px; font-weight: 500; color: #444746; padding: 12px 20px 6px; letter-spacing: .3px; }

  /* ═ macOS dock ═ */
  .ap-mdk {
    height: 210px; position: relative; display: flex; align-items: flex-end;
    justify-content: center; padding-bottom: 12px;
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(175deg, #2a3550 0%, #4c608a 45%, #93a8c4 100%);
  }
  .ap-mdk-bar {
    display: flex; align-items: flex-end; gap: 9px; padding: 5px 8px 8px;
    border-radius: 20px; position: relative;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.5);
    box-shadow: 0 8px 26px rgba(0,0,0,.34), inset 0 -14px 22px -18px rgba(255,255,255,.9);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
    backdrop-filter: blur(22px) saturate(180%);
  }
  .ap-mdk-slot { position: relative; display: flex; flex-direction: column; align-items: center; }
  .ap-mdk-ico { filter: drop-shadow(0 2px 3px rgba(0,0,0,.3)) drop-shadow(0 7px 11px rgba(0,0,0,.18)); }
  .ap-mdk-refl {
    position: absolute; top: 54px; left: 0; width: 54px;
    height: 11px; overflow: hidden; opacity: .14;
    transform: scaleY(-1);
    -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent);
    mask-image: linear-gradient(180deg, rgba(0,0,0,.9), transparent);
  }
  .ap-mdk-dot {
    position: relative; z-index: 1; width: 4px; height: 4px; border-radius: 50%;
    background: rgba(0,0,0,.62); margin-top: 3px;
  }
  .ap-mdk-sep { width: 1px; align-self: stretch; margin: 4px 3px; background: rgba(0,0,0,.18); }
  .ap-mdk-tip {
    position: absolute; bottom: 100%; left: 50%; transform: translate(-50%, -12px);
    padding: 3px 10px 4px; border-radius: 6px; white-space: nowrap;
    font-size: 13px; letter-spacing: -.1px; color: #1d1d1f;
    background: #f4f4f5cc; border: 1px solid rgba(0,0,0,.1);
    box-shadow: 0 4px 14px rgba(0,0,0,.22);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .ap-mdk-tip i {
    position: absolute; left: 50%; bottom: -4px; width: 8px; height: 8px;
    transform: translateX(-50%) rotate(45deg); background: #f4f4f5;
    border-right: 1px solid rgba(0,0,0,.1); border-bottom: 1px solid rgba(0,0,0,.1);
  }

  /* ═ macOS menu bar ═ */
  .ap-mb {
    padding: 0; font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(160deg, #33405f, #6a7f9f 60%, #a9bacd);
  }
  .ap-mb-pad { padding: 22px 0; }
  .ap-mb-bar {
    height: 24px; display: flex; align-items: center; gap: 16px; padding: 0 12px 0 14px;
    font-size: 13px; letter-spacing: -.08px;
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%);
  }
  .ap-mb-l { background: rgba(247,247,248,.92); color: #1d1d1f; box-shadow: inset 0 -1px 0 rgba(0,0,0,.1); }
  .ap-mb-d { background: rgba(28,28,30,.72); color: #f5f5f7; box-shadow: inset 0 -1px 0 rgba(255,255,255,.08); }
  .ap-mb-app { font-weight: 600; }
  .ap-mb-menus { display: flex; align-items: center; gap: 15px; }
  .ap-mb-r { margin-left: auto; display: flex; align-items: center; gap: 13px; }
  .ap-mb-clock { font-size: 13px; letter-spacing: -.1px; }

  /* ═ Windows 11 ═ */
  .ap-w {
    font-family: "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif;
    background: linear-gradient(150deg, #1b2b3a, #2f4a63 55%, #46687f);
    padding-top: 26px; color: #fff;
  }
  .ap-w-start {
    width: 600px; margin: 0 auto 10px; border-radius: 8px; padding: 22px 24px 12px;
    background: rgba(43,43,43,.94); border: 1px solid rgba(255,255,255,.08);
    box-shadow: 0 16px 44px rgba(0,0,0,.5);
    -webkit-backdrop-filter: blur(30px); backdrop-filter: blur(30px);
  }
  .ap-w-srch {
    height: 32px; border-radius: 16px; display: flex; align-items: center; gap: 8px;
    padding: 0 12px; background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1); color: #c9c9c9; font-size: 12px;
  }
  .ap-w-h { display: flex; align-items: center; margin: 18px 0 12px; font-size: 14px; font-weight: 600; }
  .ap-w-chip {
    margin-left: auto; font-size: 12px; font-weight: 400; padding: 4px 10px; border-radius: 4px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.09); color: #e8e8e8;
  }
  .ap-w-grid { display: grid; grid-template-columns: repeat(6, 1fr); row-gap: 4px; }
  .ap-w-cell { padding: 12px 4px 10px; border-radius: 4px; display: flex; flex-direction: column; align-items: center; }
  .ap-w-on { background: rgba(255,255,255,.06); }
  .ap-w-lab {
    margin-top: 8px; max-width: 88px; font-size: 12px; line-height: 16px; color: #f2f2f2;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;
  }
  .ap-w-rec { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .ap-w-recit { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 4px; }
  .ap-w-acct {
    display: flex; align-items: center; gap: 10px; margin: 12px -24px -12px; padding: 12px 24px;
    border-top: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.03);
    border-radius: 0 0 8px 8px; font-size: 13px;
  }
  .ap-w-tb {
    height: 48px; background: #202020; border-top: 1px solid rgba(255,255,255,.06);
    display: flex; align-items: center; padding: 0 12px; position: relative;
  }
  .ap-w-tbc { margin: 0 auto; display: flex; align-items: center; gap: 4px; }
  .ap-w-btn {
    width: 44px; height: 40px; border-radius: 5px; display: grid; place-items: center;
    position: relative; color: #e9e9e9;
  }
  .ap-w-btn.ap-w-on { background: rgba(255,255,255,.07); }
  .ap-w-ind {
    position: absolute; left: 50%; bottom: 1px; transform: translateX(-50%);
    width: 16px; height: 3px; border-radius: 2px; background: #60cdff;
  }
  .ap-w-tray { position: absolute; right: 12px; display: flex; align-items: center; gap: 12px; color: #e9e9e9; }
  .ap-w-clk { font-size: 12px; line-height: 15px; text-align: right; }

  /* ═ PWA splash ═ */
  .ap-sp {
    height: 915px; display: flex; flex-direction: column; align-items: center;
    font-family: Roboto, -apple-system, "Helvetica Neue", Arial, sans-serif;
  }
  .ap-sp-mid { margin: auto; display: flex; flex-direction: column; align-items: center; }
  .ap-sp-name { margin-top: 26px; font-size: 16px; font-weight: 500; letter-spacing: .1px; }

  /* ═ App Store ═ */
  .ap-as {
    background: #fff; color: #000;
    font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  }
  .ap-as-nav { padding: 8px 16px 10px; }
  .ap-as-field {
    height: 36px; border-radius: 10px; background: #e9e9eb; color: #8e8e93;
    display: flex; align-items: center; gap: 6px; padding: 0 8px; font-size: 17px;
  }
  .ap-as-row { display: flex; gap: 14px; padding: 14px 16px 0; }
  .ap-as-n { font-size: 17px; font-weight: 600; letter-spacing: -.4px; line-height: 21px; }
  .ap-as-sub { font-size: 15px; color: #8e8e93; letter-spacing: -.2px; line-height: 19px; margin-top: 1px; }
  .ap-as-stars { display: flex; align-items: center; gap: 5px; margin-top: 6px; color: #8e8e93; }
  .ap-as-stars b { font-size: 12px; font-weight: 400; letter-spacing: -.1px; }
  .ap-as-get {
    min-width: 68px; height: 28px; border-radius: 14px; background: #e9e9eb; color: #007aff;
    font-size: 15px; font-weight: 700; letter-spacing: .2px;
    display: grid; place-items: center;
  }
  .ap-as-iap { font-size: 10px; color: #8e8e93; text-align: center; margin-top: 5px; letter-spacing: -.1px; }
  .ap-as-shots { display: flex; gap: 10px; padding: 14px 16px 16px; }
  .ap-as-shot { width: 108px; height: 192px; border-radius: 10px; background: #f0f0f3; border: .5px solid rgba(0,0,0,.07); }
  .ap-as-hr { height: .5px; background: rgba(0,0,0,.18); margin-left: 94px; }

  /* ═ Google Play ═ */
  .ap-gp {
    background: #fff; color: #202124;
    font-family: Roboto, "Helvetica Neue", Arial, sans-serif; padding-bottom: 18px;
  }
  .ap-gp-bar { height: 56px; display: flex; align-items: center; gap: 24px; padding: 0 16px; color: #5f6368; }
  .ap-gp-head { display: flex; gap: 16px; padding: 6px 16px 0; align-items: flex-start; }
  .ap-gp-t { font-size: 24px; line-height: 30px; font-weight: 400; font-family: "Google Sans", Roboto, Arial, sans-serif; }
  .ap-gp-dev { font-size: 14px; color: #01875f; font-weight: 500; margin-top: 4px; }
  .ap-gp-meta { font-size: 12px; color: #5f6368; margin-top: 2px; }
  .ap-gp-stats { display: flex; align-items: stretch; padding: 20px 16px 4px; }
  .ap-gp-st { flex: 1 1 0; text-align: center; padding: 0 4px; }
  .ap-gp-sv { font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 3px; }
  .ap-gp-sl { font-size: 12px; color: #5f6368; margin-top: 3px; }
  .ap-gp-div { width: 1px; background: #dadce0; margin: 4px 0; }
  .ap-gp-btn {
    margin: 18px 16px 0; height: 36px; border-radius: 8px; background: #01875f; color: #fff;
    font-size: 14px; font-weight: 500; display: grid; place-items: center;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  .ap-gp-shots { display: flex; gap: 8px; padding: 20px 16px 0; }
  .ap-gp-shot { width: 116px; height: 206px; border-radius: 8px; background: #f1f3f4; }

  /* ═ Chrome ═ */
  .ap-cx { font-family: system-ui, "Segoe UI", Roboto, Arial, sans-serif; }
  .ap-cx-win { background: #dee1e6; border-radius: 10px 10px 0 0; overflow: hidden; }
  .ap-cx-tabs { height: 40px; display: flex; align-items: flex-end; padding: 0 8px; }
  .ap-cx-tab {
    width: 232px; height: 34px; border-radius: 10px 10px 0 0; background: #fff;
    display: flex; align-items: center; gap: 9px; padding: 0 12px; font-size: 12px; color: #3c4043;
  }
  .ap-cx-newt { margin-left: 8px; color: #5f6368; }
  .ap-cx-bar { height: 42px; background: #fff; display: flex; align-items: center; gap: 12px; padding: 0 12px; color: #5f6368; }
  .ap-cx-omni {
    flex: 1 1 auto; height: 30px; border-radius: 15px; background: #f1f3f4;
    display: flex; align-items: center; gap: 8px; padding: 0 12px; font-size: 13px; color: #202124;
  }
  .ap-cx-acts { display: flex; align-items: center; gap: 12px; }
  .ap-cx-page {
    position: relative; height: 300px; background: #fff; border-radius: 0 0 10px 10px;
    padding: 26px 40px; color: #202124;
  }
  .ap-cx-ptitle { font-size: 22px; font-weight: 600; letter-spacing: -.3px; margin-bottom: 16px; }
  .ap-cx-pop {
    width: 320px; border-radius: 8px; background: #fff; overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,.16), 0 12px 34px rgba(0,0,0,.28);
    border: 1px solid rgba(0,0,0,.06);
  }
  .ap-cx-ph { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
  .ap-cx-pn { font-size: 14px; font-weight: 600; color: #202124; letter-spacing: -.1px; }
  .ap-cx-pv { font-size: 11px; color: #80868b; margin-top: 1px; }
  .ap-cx-body { padding: 12px 14px 14px; border-top: 1px solid #e8eaed; }
  .ap-cx-state { display: flex; align-items: center; gap: 10px; }
  .ap-cx-st { font-size: 13px; color: #202124; }
  .ap-cx-tg { width: 34px; height: 20px; border-radius: 10px; background: #1a73e8; margin-left: auto; position: relative; }
  .ap-cx-tg i { position: absolute; right: 2px; top: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; }
  .ap-cx-foot { display: flex; align-items: center; padding: 10px 14px; border-top: 1px solid #e8eaed; font-size: 12px; color: #1a73e8; }
  .ap-cx-anchor { position: absolute; top: 6px; right: 34px; }

  /* ═ watchOS ═ */
  .ap-wa { padding: 10px 0 6px; display: grid; place-items: center; background: #0a0a0b; }
  .ap-wa-case {
    width: 200px; height: 239px; border-radius: 52px; padding: 12px; position: relative;
    background: linear-gradient(160deg, #4a4a4f, #16161a 45%, #35353a);
    box-shadow: 0 10px 26px rgba(0,0,0,.6);
  }
  .ap-wa-crown {
    position: absolute; right: -5px; top: 74px; width: 6px; height: 30px; border-radius: 3px;
    background: linear-gradient(90deg, #6a6a70, #2b2b30);
  }
  .ap-wa-scr {
    position: relative; width: 176px; height: 215px; border-radius: 42px; background: #000;
    overflow: hidden; font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  }
  .ap-wa-t { position: absolute; right: 20px; top: 11px; font-size: 13px; font-weight: 600; color: #fff; letter-spacing: -.2px; }
  .ap-wa-n { position: absolute; }

  /* ═ Android themed icons ═ */
  .ap-th {
    padding: 26px 20px 24px; color: #fff;
    font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(160deg, #dfd7e6 0%, #b9b0c6 50%, #6f6880 100%);
  }
  .ap-th-row { display: flex; justify-content: space-between; }
  .ap-th-cell { display: flex; flex-direction: column; align-items: center; width: 104px; }
  .ap-th-lab { margin-top: 9px; font-size: 12px; line-height: 15px; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,.4); }
  .ap-th-sub { font-size: 11px; line-height: 14px; opacity: .8; text-align: center; }
  .ap-th-tint { border-radius: 50%; display: grid; place-items: center; flex: none; }
`);

  function rad(node, r) { node.style.borderRadius = r; return node; }

  /* ── 1 · iOS home screen, light ───────────────────────────── */

  L.register({
    id: 'ios-home-light',
    group: 'app',
    title: 'iOS — home screen',
    spec: '60 PX · R13.5',
    note: 'squircle, white tile baked in',
    width: 390,
    render: function (ctx) { return iosScreen(ctx, false); }
  });

  /* ── 2 · iOS home screen, dark ────────────────────────────── */

  L.register({
    id: 'ios-home-dark',
    group: 'app',
    title: 'iOS — home screen, dark wallpaper',
    spec: '60 PX · NEAR-BLACK TILE',
    note: 'a dark mark on a dark tile has nowhere to go',
    width: 390,
    render: function (ctx) { return iosScreen(ctx, true); }
  });

  /* ── 3 · Android home screen ──────────────────────────────── */

  L.register({
    id: 'android-home',
    group: 'app',
    title: 'Android — home screen, both masks',
    spec: '432 PX FG · 18% INSET',
    note: 'one adaptive icon, two system masks',
    width: 412,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-an');
      root.appendChild(andStatus());

      var g = E('div', 'ap-an-glance');
      g.appendChild(E('div', 'ap-an-day', 'Mon, 27 Jul'));
      g.appendChild(E('div', 'ap-an-wx', '18° Partly cloudy'));
      root.appendChild(g);

      var pair = E('div', 'ap-an-pair');
      pair.appendChild(andCell(ctx.logo(56, { shape: 'circle', bg: '#ffffff', pad: 0.18 }), 'circle mask'));
      pair.appendChild(andCell(ctx.logo(56, { shape: 'squircle', bg: '#ffffff', pad: 0.18 }), 'squircle mask'));
      root.appendChild(pair);

      [
        [['Camera', 'camera'], ['Photos', 'image'], ['Messages', 'comment'], ['Settings', 'settings']],
        [['Clock', 'reload'], ['Files', 'folder'], ['Maps', 'pin'], ['Contacts', 'user']],
        [['Drive', 'shield'], ['Keep', 'bookmark'], ['Store', 'download'], ['Notes', 'paperclip']]
      ].forEach(function (apps) {
        var row = E('div', 'ap-an-row');
        apps.forEach(function (a, i) {
          row.appendChild(andCell(rad(tile(56, null, GREY[i], a[1], 26), '50%'), a[0]));
        });
        root.appendChild(row);
      });

      var qsb = E('div', 'ap-an-qsb');
      qsb.appendChild(googleG(22));
      qsb.appendChild(E('div', 'kit-fill'));
      qsb.appendChild(L.icon('mic', 19));
      root.appendChild(qsb);

      var nav = E('div', 'ap-an-nav');
      nav.appendChild(E('i'));
      root.appendChild(nav);
      return root;
    }
  });

  /* ── 4 · Android app list row ─────────────────────────────── */

  L.register({
    id: 'android-app-list',
    group: 'app',
    title: 'Android — Settings, all apps',
    spec: '40 DP CIRCLE',
    note: 'system mask, no room for detail',
    width: 412,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-al');

      var bar = E('div', 'ap-al-bar');
      bar.appendChild(L.icon('arrow-left', 22));
      bar.appendChild(E('div', 'ap-al-t', 'All apps'));
      bar.appendChild(L.icon('search', 21));
      bar.appendChild(L.icon('dots', 21));
      root.appendChild(bar);
      root.appendChild(E('div', 'ap-al-h', '4 apps'));

      function row(iconNode, name, size) {
        var r = E('div', 'ap-al-row');
        r.appendChild(iconNode);
        r.appendChild(E('div', 'kit-fill kit-col', [
          E('div', 'ap-al-n kit-ell', name),
          E('div', 'ap-al-s', size)
        ]));
        return r;
      }

      root.appendChild(row(ctx.logo(40, { shape: 'circle', bg: '#ffffff', pad: 0.18 }), ctx.brand, '48.2 MB'));
      [['Calendar', 'pin', '62.4 MB'], ['Camera', 'camera', '118 MB'], ['Chrome', 'globe', '246 MB']]
        .forEach(function (a, i) {
          root.appendChild(row(rad(tile(40, null, GREY[i + 1], a[1], 19), '50%'), a[0], a[2]));
        });
      return root;
    }
  });

  /* ── 5 · macOS Dock ───────────────────────────────────────── */

  L.register({
    id: 'macos-dock',
    group: 'app',
    title: 'macOS — Dock',
    spec: '54 PX SQUIRCLE',
    note: 'running dot, tooltip, glass floor',
    width: 440,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-mdk');
      var bar = E('div', 'ap-mdk-bar');

      function slot(node, opts) {
        var s = E('div', 'ap-mdk-slot');
        var w = E('div', 'ap-mdk-ico');
        w.appendChild(node);
        s.appendChild(w);
        if (opts && opts.refl) {
          var r = E('div', 'ap-mdk-refl');
          opts.refl.style.marginTop = '-42px';   /* show only the bottom 12 px, flipped */
          r.appendChild(opts.refl);
          s.appendChild(r);
        }
        var dot = E('div', 'ap-mdk-dot');
        if (!opts || !opts.running) dot.style.opacity = '0';
        s.appendChild(dot);
        if (opts && opts.tip) {
          var t = E('div', 'ap-mdk-tip', opts.tip);
          t.appendChild(E('i'));
          s.appendChild(t);
        }
        return s;
      }

      ['globe', 'send', 'comment'].forEach(function (g, i) {
        bar.appendChild(slot(tile(54, 'ap-sqm', GREY[i], g, 25), { running: i === 0 }));
      });

      bar.appendChild(slot(ctx.logo(54, { shape: 'squircle', bg: '#ffffff' }), {
        running: true,
        tip: ctx.brand,
        refl: ctx.logo(54, { shape: 'squircle', bg: '#ffffff' })
      }));

      bar.appendChild(slot(tile(54, 'ap-sqm', GREY[2], 'settings', 25), {}));
      bar.appendChild(E('div', 'ap-mdk-sep'));

      var trash = E('div', 'ap-mdk-ico');
      var tc = sv(50, 50, '0 0 24 24');
      kids(tc, [pth('M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M6.6 7l.9 12.2A1.8 1.8 0 0 0 9.3 21h5.4a1.8 1.8 0 0 0 1.8-1.8L17.4 7', null, 'rgba(255,255,255,.85)', 1.3)]);
      trash.appendChild(tc);
      var ts = E('div', 'ap-mdk-slot');
      ts.appendChild(trash);
      ts.appendChild(E('div', 'ap-mdk-dot')).style.opacity = '0';
      bar.appendChild(ts);

      root.appendChild(bar);
      return root;
    }
  });

  /* ── 6 · macOS menu bar (template icon test) ──────────────── */

  L.register({
    id: 'macos-menubar',
    group: 'app',
    title: 'macOS — menu bar, template icon',
    spec: '18 PX MONOCHROME',
    note: 'flattened to one colour — the test most marks fail',
    width: 760,
    wide: true,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-mb ap-mb-pad');

      function bar(dark) {
        var b = E('div', 'ap-mb-bar ' + (dark ? 'ap-mb-d' : 'ap-mb-l'));
        var ink = dark ? '#f5f5f7' : '#1d1d1f';
        b.appendChild(appleMark(14, ink));
        b.appendChild(E('div', 'ap-mb-app', ctx.brand));
        b.appendChild(E('div', 'ap-mb-menus', [
          E('span', null, 'File'), E('span', null, 'Edit'), E('span', null, 'View'),
          E('span', null, 'Window'), E('span', null, 'Help')
        ]));

        var r = E('div', 'ap-mb-r');
        var mono = E('div', dark ? 'ap-monoi' : 'ap-mono');
        mono.appendChild(ctx.logo(18, { shape: 'sharp' }));
        r.appendChild(mono);
        r.appendChild(macCC(ink));
        r.appendChild(macWifi(18, ink));
        r.appendChild(macBatt(ink));
        r.appendChild(L.icon('search', 15));
        r.appendChild(E('div', 'ap-mb-clock', 'Mon 27 Jul  9:41'));
        r.style.color = ink;
        b.appendChild(r);
        return b;
      }

      root.appendChild(bar(false));
      var gap = E('div');
      gap.style.height = '22px';
      root.appendChild(gap);
      root.appendChild(bar(true));
      return root;
    }
  });

  /* ── 7 · Windows 11 taskbar + Start ───────────────────────── */

  var WIN_PINNED = [
    ['Edge', 'globe'], ['Mail', 'send'], ['Calendar', 'pin'], ['Photos', 'image'], ['Settings', 'settings'],
    ['Store', 'download'], ['Calculator', 'hash'], ['Clock', 'reload'], ['Notepad', 'paperclip'],
    ['Terminal', 'code'], ['Maps', 'globe']
  ];

  L.register({
    id: 'windows-taskbar-start',
    group: 'app',
    title: 'Windows 11 — taskbar & Start',
    spec: '24 PX / 32 PX · SHARP',
    note: 'no mask, no baked tile, dark mica behind',
    width: 760,
    wide: true,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-w');

      /* Start menu */
      var start = E('div', 'ap-w-start');
      var srch = E('div', 'ap-w-srch');
      srch.appendChild(L.icon('search', 14));
      srch.appendChild(E('span', null, 'Search for apps, settings and documents'));
      start.appendChild(srch);

      start.appendChild(E('div', 'ap-w-h', [
        E('span', null, 'Pinned'),
        E('span', 'ap-w-chip', 'All apps  ›')
      ]));

      var grid = E('div', 'ap-w-grid');
      var mine = E('div', 'ap-w-cell ap-w-on');
      mine.appendChild(ctx.logo(32, { shape: 'sharp' }));
      mine.appendChild(E('div', 'ap-w-lab', ctx.brand));
      grid.appendChild(mine);
      WIN_PINNED.forEach(function (a, i) {
        var c = E('div', 'ap-w-cell');
        c.appendChild(rad(tile(32, null, GREY[i % 4], a[1], 17), '4px'));
        c.appendChild(E('div', 'ap-w-lab', a[0]));
        grid.appendChild(c);
      });
      start.appendChild(grid);

      start.appendChild(E('div', 'ap-w-h', [
        E('span', null, 'Recommended'),
        E('span', 'ap-w-chip', 'More  ›')
      ]));
      var rec = E('div', 'ap-w-rec');
      [['Brand guidelines', 'Yesterday at 16:20'], ['Icon export queue', 'Fri at 09:05']].forEach(function (r) {
        var it = E('div', 'ap-w-recit');
        it.appendChild(rad(tile(24, null, GREY[2], 'folder', 13), '3px'));
        var t1 = E('div', null, r[0]);
        t1.style.fontSize = '12px';
        var t2 = E('div', null, r[1]);
        t2.style.cssText = 'font-size:11px;color:#b7b7b7;margin-top:1px';
        it.appendChild(E('div', 'kit-fill kit-col', [t1, t2]));
        rec.appendChild(it);
      });
      start.appendChild(rec);

      var acct = E('div', 'ap-w-acct');
      acct.appendChild(rad(tile(24, null, GREY[3], 'user', 13), '50%'));
      acct.appendChild(E('span', null, ctx.person));
      var pw = E('div', 'kit-fill');
      acct.appendChild(pw);
      acct.appendChild(L.icon('lock', 17));
      start.appendChild(acct);
      root.appendChild(start);

      /* taskbar */
      var tb = E('div', 'ap-w-tb');
      var c = E('div', 'ap-w-tbc');

      var st = E('div', 'ap-w-btn');
      st.appendChild(winMark(22));
      c.appendChild(st);

      ['search', 'grid'].forEach(function (g) {
        var b = E('div', 'ap-w-btn');
        b.appendChild(L.icon(g, 21));
        c.appendChild(b);
      });
      [['folder', 0], ['globe', 1], ['download', 2]].forEach(function (a) {
        var b = E('div', 'ap-w-btn');
        b.appendChild(rad(tile(24, null, GREY[a[1]], a[0], 13), '4px'));
        c.appendChild(b);
      });

      var me = E('div', 'ap-w-btn ap-w-on');
      me.appendChild(ctx.logo(24, { shape: 'sharp' }));
      me.appendChild(E('div', 'ap-w-ind'));
      c.appendChild(me);
      tb.appendChild(c);

      var tray = E('div', 'ap-w-tray');
      tray.appendChild(chevUp(13, '#e9e9e9'));
      var cluster = E('div', 'kit-row');
      cluster.style.gap = '8px';
      cluster.appendChild(macWifi(15, '#e9e9e9'));
      cluster.appendChild(speaker(15, '#e9e9e9'));
      cluster.appendChild(macBatt('#e9e9e9'));
      tray.appendChild(cluster);
      tray.appendChild(E('div', 'ap-w-clk', [
        E('div', null, '9:41 AM'),
        E('div', null, '27/07/2026')
      ]));
      tb.appendChild(tray);
      root.appendChild(tb);
      return root;
    }
  });

  /* ── 8 · PWA splash screen ────────────────────────────────── */

  L.register({
    id: 'pwa-splash',
    group: 'app',
    title: 'PWA — splash screen',
    spec: '192 PX ON BG COLOR',
    note: 'manifest background_color, icon as-is',
    width: 412,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-sp');
      root.style.background = ctx.accent;
      root.style.color = ctx.accentInk;
      var sb = andStatus();
      sb.style.color = ctx.accentInk;   /* theme_color tints the bar, icons flip with it */
      root.appendChild(sb);
      var mid = E('div', 'ap-sp-mid');
      mid.appendChild(ctx.logo(192, { shape: 'sharp' }));
      mid.appendChild(E('div', 'ap-sp-name', ctx.brand));
      root.appendChild(mid);
      return root;
    }
  });

  /* ── 9 · App Store search result ──────────────────────────── */

  L.register({
    id: 'app-store-row',
    group: 'app',
    title: 'App Store — search result',
    spec: '64 PX · R14',
    note: 'name, subtitle, rating, GET',
    width: 390,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-as');

      var nav = E('div', 'ap-as-nav');
      var field = E('div', 'ap-as-field');
      field.appendChild(L.icon('search', 17));
      field.appendChild(E('span', null, ctx.brand));
      field.children[1].style.color = '#000';
      nav.appendChild(field);
      root.appendChild(nav);

      function stars(count) {
        var s = E('div', 'ap-as-stars');
        for (var i = 0; i < 5; i++) {
          var st = L.icon('star', 11, true);
          if (i === 4) st.setAttribute('opacity', '0.3');
          s.appendChild(st);
        }
        s.appendChild(E('b', null, count));
        return s;
      }

      function row(iconNode, name, sub, count) {
        var r = E('div', 'ap-as-row');
        r.appendChild(iconNode);
        r.appendChild(E('div', 'kit-fill kit-col', [
          E('div', 'ap-as-n kit-ell', name),
          E('div', 'ap-as-sub kit-ell', sub),
          stars(count)
        ]));
        var right = E('div', 'kit-col');
        right.style.paddingTop = '14px';
        right.appendChild(E('div', 'ap-as-get', 'GET'));
        right.appendChild(E('div', 'ap-as-iap', 'In-App Purchases'));
        r.appendChild(right);
        return r;
      }

      var hair = E('div', 'ap-sqm ap-hair');
      hair.appendChild(ctx.logo(64, { shape: 'squircle', bg: '#ffffff' }));
      root.appendChild(row(hair, ctx.brand, ctx.tagline, '1.2K'));

      var shots = E('div', 'ap-as-shots');
      for (var i = 0; i < 3; i++) shots.appendChild(E('div', 'ap-as-shot'));
      root.appendChild(shots);
      root.appendChild(E('div', 'ap-as-hr'));

      root.appendChild(row(
        tile(64, 'ap-sqm', GREY[2], 'check', 30),
        'Invoice Ledger', 'Billing for small teams', '318'
      ));
      return root;
    }
  });

  /* ── 10 · Google Play listing ─────────────────────────────── */

  L.register({
    id: 'play-listing',
    group: 'app',
    title: 'Google Play — listing header',
    spec: '72 PX · R16',
    note: 'Play rounds the 512 you upload — opaque, no mask',
    width: 412,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-gp');

      var bar = E('div', 'ap-gp-bar');
      bar.appendChild(L.icon('arrow-left', 22));
      bar.appendChild(E('div', 'kit-fill'));
      bar.appendChild(L.icon('search', 21));
      bar.appendChild(L.icon('dots', 21));
      root.appendChild(bar);

      var head = E('div', 'ap-gp-head');
      head.appendChild(ctx.logo(72, { shape: 'rounded', radius: 16, bg: '#ffffff' }));
      head.appendChild(E('div', 'kit-fill kit-col', [
        E('div', 'ap-gp-t kit-ell', ctx.brand),
        E('div', 'ap-gp-dev', ctx.brand + ' Ltd'),
        E('div', 'ap-gp-meta', 'Contains ads · In-app purchases')
      ]));
      root.appendChild(head);

      var stats = E('div', 'ap-gp-stats');
      function st(v, glyph, label) {
        var c = E('div', 'ap-gp-st');
        var vv = E('div', 'ap-gp-sv', v);
        if (glyph) vv.appendChild(L.icon(glyph, 12, true));
        c.appendChild(vv);
        c.appendChild(E('div', 'ap-gp-sl', label));
        return c;
      }
      stats.appendChild(st('4.6', 'star', '12K reviews'));
      stats.appendChild(E('div', 'ap-gp-div'));
      stats.appendChild(st('500K+', null, 'Downloads'));
      stats.appendChild(E('div', 'ap-gp-div'));
      stats.appendChild(st('3+', null, 'Rated for 3+'));
      root.appendChild(stats);

      root.appendChild(E('div', 'ap-gp-btn', 'Install'));

      var shots = E('div', 'ap-gp-shots');
      for (var i = 0; i < 3; i++) shots.appendChild(E('div', 'ap-gp-shot'));
      root.appendChild(shots);
      return root;
    }
  });

  /* ── 11 · Chrome extension ────────────────────────────────── */

  L.register({
    id: 'chrome-extension',
    group: 'app',
    title: 'Chrome — extension icon & popup',
    spec: '16 PX / 28 PX',
    note: 'toolbar at 16, popup header at 28',
    width: 720,
    wide: true,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-cx');

      var win = E('div', 'ap-cx-win');
      var tabs = E('div', 'ap-cx-tabs');
      var tab = E('div', 'ap-cx-tab');
      tab.appendChild(rad(tile(16, null, GREY[2], 'globe', 10), '3px'));
      tab.appendChild(E('span', 'kit-ell', ctx.brand + ' — ' + ctx.tagline));
      tab.appendChild(L.icon('x', 13));
      tabs.appendChild(tab);
      tabs.appendChild(E('div', 'ap-cx-newt', L.icon('plus', 15)));
      win.appendChild(tabs);

      var bar = E('div', 'ap-cx-bar');
      bar.appendChild(L.icon('arrow-left', 18));
      bar.appendChild(L.icon('arrow-right', 18));
      bar.appendChild(L.icon('reload', 17));
      var omni = E('div', 'ap-cx-omni');
      omni.appendChild(L.icon('lock', 13));
      omni.appendChild(E('span', null, ctx.domain));
      bar.appendChild(omni);

      var acts = E('div', 'ap-cx-acts');
      acts.appendChild(puzzle(17, '#5f6368'));
      acts.appendChild(rad(tile(16, null, GREY[1], 'shield', 10), '3px'));
      acts.appendChild(rad(tile(16, null, GREY[3], 'bookmark', 10), '3px'));
      acts.appendChild(ctx.logo(16, { shape: 'sharp' }));
      acts.appendChild(rad(tile(20, null, 'linear-gradient(180deg,#8ab4f8,#5f8ee0)', 'user', 12, '#fff'), '50%'));
      acts.appendChild(L.icon('dots', 17));
      bar.appendChild(acts);
      win.appendChild(bar);

      var page = E('div', 'ap-cx-page');
      page.appendChild(E('div', 'ap-cx-ptitle', ctx.tagline));
      var copy = E('div', 'kit-col');
      ['96%', '88%', '92%', '54%'].forEach(function (w) { copy.appendChild(ph(w, 9)); });
      page.appendChild(copy);
      var copy2 = E('div', 'kit-col');
      copy2.style.marginTop = '22px';
      ['90%', '76%'].forEach(function (w) { copy2.appendChild(ph(w, 9)); });
      page.appendChild(copy2);

      var anchor = E('div', 'ap-cx-anchor');
      var pop = E('div', 'ap-cx-pop');
      var ph2 = E('div', 'ap-cx-ph');
      ph2.appendChild(ctx.logo(28, { shape: 'sharp' }));
      ph2.appendChild(E('div', 'kit-fill kit-col', [
        E('div', 'ap-cx-pn kit-ell', ctx.brand),
        E('div', 'ap-cx-pv', 'Version 1.4.2')
      ]));
      ph2.appendChild(L.icon('settings', 16));
      ph2.children[2].style.color = '#5f6368';
      pop.appendChild(ph2);

      var body = E('div', 'ap-cx-body');
      var state = E('div', 'ap-cx-state');
      state.appendChild(E('div', 'ap-cx-st', 'Active on ' + ctx.domain));
      var tg = E('div', 'ap-cx-tg');
      tg.appendChild(E('i'));
      state.appendChild(tg);
      body.appendChild(state);
      var lines = E('div', 'kit-col');
      lines.style.cssText = 'margin-top:14px;color:#202124';
      lines.appendChild(ph('92%', 8));
      lines.appendChild(ph('74%', 8));
      body.appendChild(lines);
      pop.appendChild(body);
      pop.appendChild(E('div', 'ap-cx-foot', 'Options'));
      anchor.appendChild(pop);
      page.appendChild(anchor);
      win.appendChild(page);
      root.appendChild(win);
      return root;
    }
  });

  /* ── 12 · watchOS honeycomb ───────────────────────────────── */

  L.register({
    id: 'watchos-honeycomb',
    group: 'app',
    title: 'watchOS — app grid',
    spec: '50 PX CIRCLE',
    note: 'circle mask on black, no label at all',
    width: 220,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-wa');
      var kase = E('div', 'ap-wa-case');
      var scr = E('div', 'ap-wa-scr');

      function at(node, x, y) {
        var w = E('div', 'ap-wa-n');
        w.style.left = x + 'px';
        w.style.top = y + 'px';
        w.appendChild(node);
        return w;
      }

      scr.appendChild(at(rad(tile(44, null, GREY[1], 'comment', 21), '50%'), 20, 58));
      scr.appendChild(at(rad(tile(44, null, GREY[2], 'heart', 21), '50%'), 110, 58));
      scr.appendChild(at(ctx.logo(50, { shape: 'circle', bg: '#ffffff' }), 63, 82));
      scr.appendChild(at(rad(tile(38, null, GREY[3], 'mic', 18), '50%'), 44, 130));
      scr.appendChild(at(rad(tile(38, null, GREY[0], 'settings', 18), '50%'), 98, 130));
      scr.appendChild(E('div', 'ap-wa-t', '9:41'));

      kase.appendChild(scr);
      kase.appendChild(E('div', 'ap-wa-crown'));
      root.appendChild(kase);
      return root;
    }
  });

  /* ── 13 · Android themed icons ────────────────────────────── */

  L.register({
    id: 'android-themed-icon',
    group: 'app',
    title: 'Android — themed icons',
    spec: '56 DP · MONO LAYER',
    note: 'Material You strips every colour out',
    width: 412,
    render: function (ctx) {
      var E = ctx.el;
      var root = E('div', 'ap-th');
      var row = E('div', 'ap-th-row');

      function cell(node, lab, sub) {
        var c = E('div', 'ap-th-cell');
        c.appendChild(node);
        c.appendChild(E('div', 'ap-th-lab', lab));
        c.appendChild(E('div', 'ap-th-sub', sub));
        return c;
      }
      function tint(bg, cls) {
        var t = E('div', 'ap-th-tint');
        t.style.width = '56px';
        t.style.height = '56px';
        t.style.background = bg;
        var m = E('div', cls);
        m.appendChild(ctx.logo(56, { shape: 'circle', pad: 0.18 }));
        t.appendChild(m);
        return t;
      }

      row.appendChild(cell(ctx.logo(56, { shape: 'circle', bg: '#ffffff', pad: 0.18 }),
        'Adaptive', 'colour, as shipped'));
      row.appendChild(cell(tint('#dde2f9', 'ap-mono'), 'Themed, light', 'mono layer on tonal'));
      row.appendChild(cell(tint('#2b3042', 'ap-monoi'), 'Themed, dark', 'mono layer on tonal'));
      root.appendChild(row);
      return root;
    }
  });
})();
