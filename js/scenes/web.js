/* js/scenes/web.js — website & product surfaces.
   The subject here is the horizontal lockup: mark, optical gap, wordmark.
   Gap is derived from the mark height (~0.46×) everywhere so the relationship
   stays constant from a 68 px marketing bar down to a 44 px mobile header. */
(function () {
  var L = window.LogoLab;
  var NS = 'http://www.w3.org/2000/svg';

  L.css(`
.wb-root {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
  color: #111827; line-height: 1.45; background: #fff;
}

/* the lockup */
.wb-lock { display: flex; align-items: center; gap: var(--wb-gap, 14px); }
.wb-word {
  font-weight: 600; letter-spacing: -0.01em; line-height: 1;
  white-space: nowrap; color: #111827;
}
.wb-glyph { display: block; fill: currentColor; }

/* 1 + 2 — marketing navbar */
.wb-nav {
  position: relative; display: flex; align-items: center;
  height: 68px; padding: 0 28px; background: #fff;
  border-bottom: 1px solid #ececf0;
}
.wb-nav-d { background: #0b0d10; border-bottom-color: rgba(255,255,255,.09); }
.wb-nav-d .wb-word { color: #e5e7eb; }
.wb-navmid {
  position: absolute; left: 50%; top: 0; height: 100%;
  transform: translateX(-50%);
  display: flex; align-items: center; gap: 28px;
}
.wb-navlink { font-size: 14.5px; font-weight: 500; color: #4b5563; letter-spacing: -0.005em; }
.wb-nav-d .wb-navlink { color: #9ca3af; }
.wb-navend { margin-left: auto; display: flex; align-items: center; gap: 4px; }
.wb-ghost {
  display: inline-flex; align-items: center; height: 36px; padding: 0 13px;
  border-radius: 8px; font-size: 14px; font-weight: 500; color: #374151;
}
.wb-nav-d .wb-ghost { color: #d1d5db; }
.wb-cta {
  display: inline-flex; align-items: center; height: 36px; padding: 0 17px;
  border-radius: 999px; font-size: 14px; font-weight: 600; letter-spacing: -0.005em;
}

/* 3 — site footer */
.wb-foot { background: #fafafa; border-top: 1px solid #ececf0; padding: 40px 28px 26px; }
.wb-footcols { display: flex; gap: 32px; align-items: flex-start; }
.wb-footbrand { width: 244px; flex: none; }
.wb-tag { margin-top: 14px; font-size: 13px; line-height: 1.55; color: #6b7280; max-width: 210px; }
.wb-col { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.wb-colh {
  font-size: 11.5px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; color: #9ca3af; margin-bottom: 3px;
}
.wb-flink { font-size: 13.5px; color: #4b5563; }
.wb-footrule { height: 1px; background: #e9eaee; margin: 34px 0 18px; }
.wb-footend { display: flex; align-items: center; }
.wb-copy { font-size: 12.5px; color: #9ca3af; }
.wb-socials { margin-left: auto; display: flex; gap: 8px; }
.wb-soc {
  width: 28px; height: 28px; border-radius: 50%; background: #f0f1f3;
  color: #6b7280; display: flex; align-items: center; justify-content: center;
}

/* 4 — hero lockup */
.wb-hero {
  padding: 58px 44px 62px; display: flex; flex-direction: column;
  align-items: center; text-align: center; background: #fff;
}
.wb-heroname { font-size: 46px; font-weight: 700; letter-spacing: -0.032em; line-height: 1.04; margin: 28px 0 0; }
.wb-herotag { font-size: 18px; color: #6b7280; letter-spacing: -0.01em; margin: 14px 0 0; }
.wb-herobtns { display: flex; gap: 10px; margin-top: 30px; }
.wb-btn {
  display: inline-flex; align-items: center; height: 44px; padding: 0 22px;
  border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
}
.wb-btn-sec { background: #fff; color: #374151; border: 1px solid #d5d7dd; }

/* 5 + 6 — product app shell */
.wb-shell { display: flex; height: 360px; background: #f7f8fa; }
.wb-side { width: 260px; flex: none; background: #101217; display: flex; flex-direction: column; padding: 12px 12px 10px; }
.wb-rail { width: 64px; flex: none; background: #101217; display: flex; flex-direction: column; align-items: center; padding: 15px 0 10px; }
.wb-sidetop { display: flex; align-items: center; padding: 3px 6px 0; }
.wb-sidetop .wb-word { color: #f4f5f7; }
.wb-switch { margin-left: auto; color: #6b7280; display: flex; }
.wb-sidediv { height: 1px; background: rgba(255,255,255,.07); margin: 14px -4px 0; }
.wb-raildiv { width: 26px; height: 1px; background: rgba(255,255,255,.1); margin: 15px 0 12px; }
.wb-sidelabel {
  font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  color: #6b7280; padding: 0 8px; margin: 16px 0 6px;
}
.wb-item {
  display: flex; align-items: center; gap: 10px; height: 32px; padding: 0 8px;
  border-radius: 6px; font-size: 13.5px; font-weight: 500; color: #9aa1ac;
}
.wb-item-on { background: rgba(255,255,255,.08); color: #f3f4f6; }
.wb-railbtn {
  width: 36px; height: 36px; border-radius: 8px; margin-bottom: 4px;
  display: flex; align-items: center; justify-content: center; color: #9aa1ac;
}
.wb-railbtn-on { background: rgba(255,255,255,.08); color: #f3f4f6; }
.wb-sidefoot {
  margin-top: auto; display: flex; align-items: center; gap: 9px;
  padding-top: 10px; border-top: 1px solid rgba(255,255,255,.07);
}
.wb-railfoot { margin-top: auto; padding-top: 10px; }
.wb-av {
  border-radius: 50%; flex: none; display: flex; align-items: center; justify-content: center;
  background: #4b5563; color: #fff; font-weight: 600; letter-spacing: .01em;
}
.wb-uname { font-size: 12.5px; font-weight: 500; color: #e5e7eb; line-height: 1.25; }
.wb-urole { font-size: 11px; color: #6b7280; line-height: 1.25; }
.wb-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.wb-maintop {
  height: 44px; flex: none; background: #fff; border-bottom: 1px solid #ececf0;
  display: flex; align-items: center; padding: 0 14px;
}
.wb-maint { font-size: 13.5px; font-weight: 600; }
.wb-mainicons { margin-left: auto; display: flex; gap: 10px; color: #9ca3af; }
.wb-mainbody { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.wb-card { background: #fff; border: 1px solid #ececf0; border-radius: 8px; padding: 12px; }

/* 7 — sign-in */
.wb-authpage { background: #f4f5f7; padding: 40px; display: flex; justify-content: center; }
.wb-authcard {
  width: 400px; background: #fff; border: 1px solid #e9eaee; border-radius: 14px;
  padding: 32px 32px 26px;
  box-shadow: 0 1px 2px rgba(16,24,40,.04), 0 16px 36px -20px rgba(16,24,40,.4);
}
.wb-authhead { display: flex; flex-direction: column; align-items: center; }
.wb-authtitle { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin: 18px 0 0; text-align: center; }
.wb-authsub { font-size: 13.5px; color: #6b7280; margin: 6px 0 0; }
.wb-form { margin-top: 26px; display: flex; flex-direction: column; gap: 14px; }
.wb-label { display: flex; align-items: center; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
.wb-forgot { margin-left: auto; font-size: 12.5px; font-weight: 500; }
.wb-input {
  height: 40px; border: 1px solid #d5d7dd; border-radius: 8px; background: #fff;
  display: flex; align-items: center; padding: 0 12px; font-size: 14px; color: #9ca3af;
}
.wb-input-v { color: #111827; letter-spacing: .12em; }
.wb-submit {
  height: 40px; border-radius: 8px; margin-top: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14.5px; font-weight: 600;
}
.wb-authfoot { margin-top: 20px; text-align: center; font-size: 13.5px; color: #6b7280; }
.wb-link { font-weight: 500; }

/* 8 — dashboard top bar */
.wb-dash {
  position: relative; display: flex; align-items: center; height: 56px;
  padding: 0 16px; background: #fff; border-bottom: 1px solid #e9eaee;
}
.wb-vr { width: 1px; height: 22px; background: #e9eaee; margin: 0 14px; }
.wb-crumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7280; }
.wb-crumb-on { color: #111827; font-weight: 500; }
.wb-sep { display: flex; color: #d1d5db; }
.wb-search {
  position: absolute; left: 50%; transform: translateX(-50%);
  width: 320px; height: 34px; border: 1px solid #e5e7eb; background: #f9fafb;
  border-radius: 8px; display: flex; align-items: center; gap: 8px;
  padding: 0 10px; font-size: 13.5px; color: #9ca3af;
}
.wb-kbd {
  margin-left: auto; font-size: 11px; color: #9ca3af; background: #fff;
  border: 1px solid #e0e2e7; border-radius: 4px; padding: 1px 5px;
}
.wb-dashend { margin-left: auto; display: flex; align-items: center; gap: 15px; }
.wb-bell { position: relative; display: flex; color: #6b7280; }
.wb-dot {
  position: absolute; top: -1px; right: -1px; width: 7px; height: 7px;
  border-radius: 50%; background: #ef4444; border: 1.5px solid #fff;
}
.wb-strip { height: 26px; background: #f7f8fa; }

/* 9 — empty state */
.wb-empty {
  background: #fff; padding: 64px 40px 76px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.wb-mute { opacity: .3; }
.wb-code { font-size: 12.5px; font-weight: 600; letter-spacing: .14em; color: #9ca3af; margin-top: 30px; }
.wb-title { font-size: 27px; font-weight: 700; letter-spacing: -0.028em; margin: 10px 0 0; }
.wb-lede { font-size: 15px; line-height: 1.55; color: #6b7280; max-width: 380px; margin: 12px 0 0; }
.wb-back { display: inline-flex; align-items: center; gap: 6px; margin-top: 24px; font-size: 14.5px; font-weight: 500; }

/* 10 — loading splash */
.wb-splash {
  height: 300px; background: #0a0b0d;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.wb-track {
  width: 168px; height: 2px; border-radius: 2px; overflow: hidden;
  background: rgba(255,255,255,.13); margin-top: 36px;
}
.wb-trackfill { height: 100%; border-radius: 2px; }

/* 11 — cookie consent */
.wb-cookiepage { position: relative; height: 214px; background: #f4f5f7; padding: 20px 20px 0; overflow: hidden; }
.wb-cookie {
  position: absolute; left: 20px; bottom: 20px; width: 380px; background: #fff;
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px;
  box-shadow: 0 2px 6px rgba(16,24,40,.06), 0 18px 34px -20px rgba(16,24,40,.5);
}
.wb-cookieh { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
.wb-cookiep { font-size: 12.5px; line-height: 1.5; color: #4b5563; margin-top: 10px; }
.wb-cookiebtns { display: flex; gap: 8px; margin-top: 14px; }
.wb-sm {
  display: inline-flex; align-items: center; height: 32px; padding: 0 14px;
  border-radius: 8px; font-size: 13px; font-weight: 600;
}
.wb-sm-sec { background: #fff; border: 1px solid #d5d7dd; color: #374151; }

/* 12 — mobile web header */
.wb-mobbar { height: 44px; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #ececf0; background: #fff; }
.wb-mobmenu { margin-left: auto; display: flex; color: #374151; }
.wb-mobbody { padding: 18px 16px 26px; background: #fff; }
.wb-mobtitle { font-size: 25px; font-weight: 700; letter-spacing: -0.03em; margin: 0; }
.wb-mobmeta { font-size: 12.5px; color: #9ca3af; margin: 6px 0 16px; }

/* 13 — docs sidebar */
.wb-docs { background: #fff; border-right: 1px solid #ececf0; padding: 16px 14px 22px; }
.wb-docstop { display: flex; align-items: center; }
.wb-ver {
  margin-left: auto; font-size: 10.5px; font-weight: 500; color: #4b5563;
  background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 999px; padding: 2px 8px;
}
.wb-docsearch {
  margin-top: 15px; height: 32px; border: 1px solid #e5e7eb; background: #f9fafb;
  border-radius: 8px; display: flex; align-items: center; gap: 7px;
  padding: 0 9px; font-size: 12.5px; color: #9ca3af;
}
.wb-docsec { font-size: 11.5px; font-weight: 600; color: #111827; padding: 0 8px; margin: 20px 0 6px; }
.wb-docitem { font-size: 13px; color: #4b5563; padding: 5px 8px; border-radius: 6px; }
.wb-docitem-on { background: #f3f4f6; font-weight: 500; }

/* 14 — accent CTA band */
.wb-band { padding: 44px 28px 48px; display: flex; flex-direction: column; align-items: center; text-align: center; }
.wb-bandh { font-size: 27px; font-weight: 700; letter-spacing: -0.026em; margin: 22px 0 0; }
.wb-bandp { font-size: 15px; margin: 10px 0 0; opacity: .78; }
.wb-bandbtns { display: flex; gap: 10px; margin-top: 26px; }
.wb-bandbtn {
  display: inline-flex; align-items: center; height: 42px; padding: 0 20px;
  border-radius: 999px; font-size: 14.5px; font-weight: 600;
}

/* 15 — transparent nav over a photo hero */
.wb-photo {
  position: relative; height: 320px; overflow: hidden;
  background: linear-gradient(158deg, #39424f 0%, #707a88 46%, #2c333d 100%);
}
.wb-veil {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(9,11,15,.42) 0%, rgba(9,11,15,.10) 45%, rgba(9,11,15,.52) 100%);
}
.wb-photonav { position: relative; display: flex; align-items: center; height: 68px; padding: 0 28px; }
.wb-photonav .wb-word { color: #fff; }
.wb-photolink { color: rgba(255,255,255,.85); }
.wb-photocta {
  display: inline-flex; align-items: center; height: 36px; padding: 0 17px;
  border-radius: 999px; background: #fff; color: #111827; font-size: 14px; font-weight: 600;
}
.wb-photobody { position: relative; padding: 44px 60px 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.wb-photoh { font-size: 38px; font-weight: 700; letter-spacing: -0.032em; line-height: 1.12; color: #fff; margin: 0; max-width: 560px; }
.wb-photop { font-size: 16px; color: rgba(255,255,255,.82); margin: 14px 0 0; max-width: 480px; line-height: 1.5; }
`);

  /* ── shared bits ──────────────────────────────────────────── */

  /* platform marks, drawn here so nothing leaves the module */
  var MARKS = {
    x: {
      box: '0 0 24 24',
      d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z'
    },
    github: {
      box: '0 0 16 16',
      d: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z'
    },
    linkedin: {
      box: '0 0 24 24',
      d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'
    }
  };

  function mark(name, size) {
    var m = MARKS[name];
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', m.box);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('class', 'wb-glyph');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', m.d);
    p.setAttribute('fill-rule', 'evenodd');
    svg.appendChild(p);
    return svg;
  }

  /* mark + wordmark. gap ≈ half the glyph height, which is the point of the group. */
  function lock(c, markPx, typePx, o) {
    o = o || {};
    var row = c.el('div', 'wb-lock' + (o.cls ? ' ' + o.cls : ''));
    row.style.setProperty('--wb-gap', Math.round(markPx * 0.46) + 'px');
    row.appendChild(c.logo(markPx, { shape: o.shape || 'auto' }));
    var w = c.el('span', 'wb-word', c.brand);
    w.style.fontSize = typePx + 'px';
    if (o.track) w.style.letterSpacing = o.track;
    if (o.color) w.style.color = o.color;
    if (o.weight) w.style.fontWeight = o.weight;
    row.appendChild(w);
    return row;
  }

  function ph(c, w, h) {
    var b = c.el('div', 'kit-ph');
    b.style.setProperty('--w', w);
    b.style.setProperty('--h', (h || 9) + 'px');
    return b;
  }

  function fill(c, cls, color, ink, label) {
    var n = c.el('div', cls, label);
    n.style.background = color;
    n.style.color = ink;
    return n;
  }

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/);
    var out = '';
    if (parts[0]) out += parts[0].charAt(0);
    if (parts.length > 1) out += parts[parts.length - 1].charAt(0);
    return (out || 'A').toUpperCase();
  }

  function avatar(c, size, name) {
    var a = c.el('div', 'wb-av', initials(name));
    a.style.width = size + 'px';
    a.style.height = size + 'px';
    a.style.fontSize = Math.round(size * 0.4) + 'px';
    return a;
  }

  function links(c, cls, list) {
    return list.map(function (t) { return c.el('a', cls, t); });
  }

  /* ── 1 + 2 · marketing navbar ─────────────────────────────── */

  function navbar(c, dark) {
    var bar = c.el('div', 'wb-root wb-nav' + (dark ? ' wb-nav-d' : ''));
    bar.appendChild(lock(c, 30, 17));
    bar.appendChild(c.el('nav', 'wb-navmid', links(c, 'wb-navlink', ['Product', 'Pricing', 'Docs', 'Blog'])));
    bar.appendChild(c.el('div', 'wb-navend', [
      c.el('a', 'wb-ghost', 'Sign in'),
      fill(c, 'wb-cta', c.accent, c.accentInk, 'Get started')
    ]));
    return bar;
  }

  L.register({
    id: 'web-nav-light', group: 'web', title: 'Marketing navbar — light',
    spec: 'BAR 68 · MARK 30', note: 'lockup gap = half the glyph',
    width: 900, wide: true,
    render: function (c) { return navbar(c, false); }
  });

  L.register({
    id: 'web-nav-dark', group: 'web', title: 'Marketing navbar — dark',
    spec: 'BAR 68 · ON #0B0D10', note: 'same lockup, inverted chrome',
    width: 900, wide: true,
    render: function (c) { return navbar(c, true); }
  });

  /* ── 3 · site footer ──────────────────────────────────────── */

  L.register({
    id: 'web-footer', group: 'web', title: 'Site footer',
    spec: 'MARK 26 · 4 COLUMNS', note: 'lockup over the tagline',
    width: 900, wide: true,
    render: function (c) {
      var foot = c.el('div', 'wb-root wb-foot');

      var brandCol = c.el('div', 'wb-footbrand');
      brandCol.appendChild(lock(c, 26, 16.5));
      brandCol.appendChild(c.el('p', 'wb-tag', c.tagline));

      var cols = [
        ['Product', ['Features', 'Integrations', 'Changelog', 'Pricing']],
        ['Company', ['About', 'Blog', 'Careers', 'Contact']],
        ['Resources', ['Documentation', 'API reference', 'Status', 'Support']],
        ['Legal', ['Privacy', 'Terms', 'Security', 'DPA']]
      ].map(function (col) {
        var n = c.el('div', 'wb-col');
        n.appendChild(c.el('div', 'wb-colh', col[0]));
        links(c, 'wb-flink', col[1]).forEach(function (a) { n.appendChild(a); });
        return n;
      });

      var row = c.el('div', 'wb-footcols', [brandCol]);
      cols.forEach(function (n) { row.appendChild(n); });
      foot.appendChild(row);

      foot.appendChild(c.el('div', 'wb-footrule'));

      var socials = c.el('div', 'wb-socials');
      ['x', 'github', 'linkedin'].forEach(function (n) {
        socials.appendChild(c.el('span', 'wb-soc', mark(n, 14)));
      });

      foot.appendChild(c.el('div', 'wb-footend', [
        c.el('span', 'wb-copy', '© ' + new Date().getFullYear() + ' ' + c.brand + '. All rights reserved.'),
        socials
      ]));
      return foot;
    }
  });

  /* ── 4 · hero lockup ──────────────────────────────────────── */

  L.register({
    id: 'web-hero', group: 'web', title: 'Hero lockup — stacked',
    spec: 'MARK 96 · NAME 46', note: 'the mark at its most generous',
    width: 500,
    render: function (c) {
      var hero = c.el('div', 'wb-root wb-hero');
      hero.appendChild(c.logo(96));
      hero.appendChild(c.el('h1', 'wb-heroname', c.brand));
      hero.appendChild(c.el('p', 'wb-herotag', c.tagline));
      hero.appendChild(c.el('div', 'wb-herobtns', [
        fill(c, 'wb-btn', c.accent, c.accentInk, 'Start free'),
        c.el('a', 'wb-btn wb-btn-sec', 'Read the docs')
      ]));
      return hero;
    }
  });

  /* ── 5 + 6 · product app shell ────────────────────────────── */

  var NAV = [
    ['home', 'Overview'], ['folder', 'Projects'], ['grid', 'Deployments'],
    ['users', 'Team'], ['settings', 'Settings']
  ];

  function shellMain(c, title) {
    var main = c.el('div', 'wb-main');
    var top = c.el('div', 'wb-maintop', c.el('span', 'wb-maint', title));
    var icons = c.el('div', 'wb-mainicons');
    icons.appendChild(c.icon('search', 15));
    icons.appendChild(c.icon('dots', 15));
    top.appendChild(icons);
    main.appendChild(top);

    var body = c.el('div', 'wb-mainbody');
    [['48%', '78%'], ['36%', '64%'], ['52%', '84%']].forEach(function (w) {
      var card = c.el('div', 'wb-card');
      card.appendChild(ph(c, w[0], 9));
      card.appendChild(ph(c, w[1], 6));
      body.appendChild(card);
    });
    main.appendChild(body);
    return main;
  }

  L.register({
    id: 'web-app-sidebar', group: 'web', title: 'App shell — sidebar expanded',
    spec: 'SIDEBAR 260 · MARK 28', note: 'lockup on a dark rail',
    width: 820, wide: true,
    render: function (c) {
      var shell = c.el('div', 'wb-root wb-shell');
      var side = c.el('div', 'wb-side');

      var top = c.el('div', 'wb-sidetop', lock(c, 28, 15, { color: '#f4f5f7' }));
      top.appendChild(c.el('span', 'wb-switch', c.icon('chevron-down', 15)));
      side.appendChild(top);
      side.appendChild(c.el('div', 'wb-sidediv'));

      side.appendChild(c.el('div', 'wb-sidelabel', 'Workspace'));
      NAV.forEach(function (n, i) {
        var item = c.el('div', 'wb-item' + (i === 2 ? ' wb-item-on' : ''));
        item.appendChild(c.icon(n[0], 16));
        item.appendChild(c.el('span', null, n[1]));
        side.appendChild(item);
      });

      side.appendChild(c.el('div', 'wb-sidefoot', [
        avatar(c, 26, c.person),
        c.el('div', 'kit-fill', [
          c.el('div', 'wb-uname kit-ell', c.person),
          c.el('div', 'wb-urole kit-ell', c.role)
        ]),
        c.el('span', 'wb-switch', c.icon('dots', 15))
      ]));

      shell.appendChild(side);
      shell.appendChild(shellMain(c, 'Deployments'));
      return shell;
    }
  });

  L.register({
    id: 'web-app-rail', group: 'web', title: 'App shell — rail collapsed',
    spec: 'RAIL 64 · MARK 28', note: 'glyph alone, no wordmark to lean on',
    width: 480,
    render: function (c) {
      var shell = c.el('div', 'wb-root wb-shell');
      var rail = c.el('div', 'wb-rail');
      rail.appendChild(c.logo(28));
      rail.appendChild(c.el('div', 'wb-raildiv'));
      NAV.forEach(function (n, i) {
        rail.appendChild(c.el('div', 'wb-railbtn' + (i === 2 ? ' wb-railbtn-on' : ''), c.icon(n[0], 18)));
      });
      rail.appendChild(c.el('div', 'wb-railfoot', avatar(c, 26, c.person)));
      shell.appendChild(rail);
      shell.appendChild(shellMain(c, 'Deployments'));
      return shell;
    }
  });

  /* ── 7 · sign-in card ─────────────────────────────────────── */

  L.register({
    id: 'web-signin', group: 'web', title: 'Sign-in card',
    spec: 'CARD 400 · MARK 56', note: 'centred, nothing else to look at',
    width: 480,
    render: function (c) {
      var page = c.el('div', 'wb-root wb-authpage');
      var card = c.el('div', 'wb-authcard');

      var head = c.el('div', 'wb-authhead');
      head.appendChild(c.logo(56));
      head.appendChild(c.el('h1', 'wb-authtitle', 'Sign in to ' + c.brand));
      head.appendChild(c.el('p', 'wb-authsub', 'Use your work email to continue.'));
      card.appendChild(head);

      var form = c.el('div', 'wb-form');

      var emailField = c.el('div', null, [
        c.el('div', 'wb-label', 'Email'),
        c.el('div', 'wb-input', 'you@' + c.domain)
      ]);

      var forgot = c.el('a', 'wb-forgot', 'Forgot password?');
      forgot.style.color = c.accent;
      var pwField = c.el('div', null, [
        c.el('div', 'wb-label', [c.el('span', null, 'Password'), forgot]),
        c.el('div', 'wb-input wb-input-v', '••••••••••')
      ]);

      form.appendChild(emailField);
      form.appendChild(pwField);
      form.appendChild(fill(c, 'wb-submit', c.accent, c.accentInk, 'Sign in'));
      card.appendChild(form);

      var signup = c.el('a', 'wb-link', 'Sign up');
      signup.style.color = c.accent;
      card.appendChild(c.el('div', 'wb-authfoot', [
        c.el('span', null, 'No account? '), signup
      ]));

      page.appendChild(card);
      return page;
    }
  });

  /* ── 8 · dashboard top bar ────────────────────────────────── */

  L.register({
    id: 'web-dashboard-bar', group: 'web', title: 'Dashboard top bar',
    spec: 'BAR 56 · MARK 26', note: 'mark next to a breadcrumb, no wordmark',
    width: 900, wide: true,
    render: function (c) {
      var root = c.el('div', 'wb-root');
      var bar = c.el('div', 'wb-dash');

      bar.appendChild(c.logo(26));
      bar.appendChild(c.el('div', 'wb-vr'));
      bar.appendChild(c.el('div', 'wb-crumbs', [
        c.el('span', null, c.brand),
        c.el('span', 'wb-sep', c.icon('chevron-right', 13)),
        c.el('span', null, 'Projects'),
        c.el('span', 'wb-sep', c.icon('chevron-right', 13)),
        c.el('span', 'wb-crumb-on', 'Overview')
      ]));

      bar.appendChild(c.el('div', 'wb-search', [
        c.icon('search', 15),
        c.el('span', null, 'Search projects, docs and people'),
        c.el('span', 'wb-kbd', '⌘K')
      ]));

      var bell = c.el('span', 'wb-bell', c.icon('bell', 18));
      bell.appendChild(c.el('span', 'wb-dot'));
      bar.appendChild(c.el('div', 'wb-dashend', [bell, avatar(c, 30, c.person)]));

      root.appendChild(bar);
      root.appendChild(c.el('div', 'wb-strip'));
      return root;
    }
  });

  /* ── 9 · 404 ──────────────────────────────────────────────── */

  L.register({
    id: 'web-404', group: 'web', title: 'Empty state — 404',
    spec: 'MARK 128 · 30% OPACITY', note: 'does it survive being knocked back',
    width: 480,
    render: function (c) {
      var page = c.el('div', 'wb-root wb-empty');
      page.appendChild(c.el('div', 'wb-mute', c.logo(128)));
      page.appendChild(c.el('div', 'wb-code kit-mono', '404 — NOT FOUND'));
      page.appendChild(c.el('h1', 'wb-title', 'Page not found'));
      page.appendChild(c.el('p', 'wb-lede',
        'The page you were looking for has moved or no longer exists. Check the address, or head back to the homepage.'));
      var back = c.el('a', 'wb-back', [c.icon('arrow-left', 16), c.el('span', null, 'Back to ' + c.domain)]);
      back.style.color = c.accent;
      page.appendChild(back);
      return page;
    }
  });

  /* ── 10 · loading splash ──────────────────────────────────── */

  L.register({
    id: 'web-splash', group: 'web', title: 'Loading splash',
    spec: 'MARK 80 · ON #0A0B0D', note: 'first paint, nothing else on screen',
    width: 440,
    render: function (c) {
      var s = c.el('div', 'wb-root wb-splash');
      s.appendChild(c.logo(80));
      var track = c.el('div', 'wb-track');
      var f = c.el('div', 'wb-trackfill');
      f.style.width = '62%';
      f.style.background = c.accent;
      track.appendChild(f);
      s.appendChild(track);
      return s;
    }
  });

  /* ── 11 · cookie banner ───────────────────────────────────── */

  L.register({
    id: 'web-cookie', group: 'web', title: 'Cookie consent banner',
    spec: 'CARD 380 · MARK 24', note: 'bottom-left, over live page',
    width: 460,
    render: function (c) {
      var page = c.el('div', 'wb-root wb-cookiepage');
      page.appendChild(ph(c, '44%', 15));
      page.appendChild(ph(c, '92%', 8));
      page.appendChild(ph(c, '86%', 8));
      page.appendChild(ph(c, '70%', 8));

      var card = c.el('div', 'wb-cookie');
      var head = c.el('div', 'wb-lock');
      head.style.setProperty('--wb-gap', '11px');
      head.appendChild(c.logo(24));
      head.appendChild(c.el('span', 'wb-cookieh', 'Cookies on ' + c.domain));
      card.appendChild(head);

      card.appendChild(c.el('p', 'wb-cookiep',
        'We use cookies to keep you signed in and to measure how the site is used.'));
      card.appendChild(c.el('div', 'wb-cookiebtns', [
        fill(c, 'wb-sm', c.accent, c.accentInk, 'Accept all'),
        c.el('button', 'wb-sm wb-sm-sec', 'Manage')
      ]));

      page.appendChild(card);
      return page;
    }
  });

  /* ── 12 · mobile web header ───────────────────────────────── */

  L.register({
    id: 'web-mobile-header', group: 'web', title: 'Mobile web header',
    spec: '375 PT · BAR 44 · MARK 24', note: 'the tightest lockup that still works',
    width: 375,
    render: function (c) {
      var root = c.el('div', 'wb-root');
      var bar = c.el('div', 'wb-mobbar');
      bar.appendChild(lock(c, 24, 15));
      bar.appendChild(c.el('span', 'wb-mobmenu', c.icon('menu', 20)));
      root.appendChild(bar);

      var body = c.el('div', 'wb-mobbody');
      body.appendChild(c.el('h1', 'wb-mobtitle', 'Changelog'));
      body.appendChild(c.el('div', 'wb-mobmeta', 'Updated 24 July 2026'));
      ['100%', '97%', '99%', '93%', '48%'].forEach(function (w) { body.appendChild(ph(c, w, 9)); });
      root.appendChild(body);
      return root;
    }
  });

  /* ── 13 · docs sidebar header ─────────────────────────────── */

  L.register({
    id: 'web-docs-sidebar', group: 'web', title: 'Docs sidebar header',
    spec: 'SIDEBAR 272 · MARK 22', note: 'lockup beside a version pill',
    width: 272,
    render: function (c) {
      var side = c.el('div', 'wb-root wb-docs');
      var top = c.el('div', 'wb-docstop', lock(c, 22, 15));
      top.appendChild(c.el('span', 'wb-ver', 'v2.4'));
      side.appendChild(top);

      side.appendChild(c.el('div', 'wb-docsearch', [
        c.icon('search', 14),
        c.el('span', 'kit-fill', 'Search docs'),
        c.el('span', 'wb-kbd', '⌘K')
      ]));

      [['Getting started', ['Introduction', 'Quickstart', 'Authentication']],
       ['Guides', ['Webhooks', 'Rate limits', 'Error handling']]
      ].forEach(function (sec, si) {
        side.appendChild(c.el('div', 'wb-docsec', sec[0]));
        sec[1].forEach(function (t, i) {
          var on = si === 0 && i === 2;
          var item = c.el('div', 'wb-docitem' + (on ? ' wb-docitem-on' : ''), t);
          if (on) item.style.color = c.accent;
          side.appendChild(item);
        });
      });
      return side;
    }
  });

  /* ── 14 · accent CTA band ─────────────────────────────────── */

  L.register({
    id: 'web-cta-band', group: 'web', title: 'CTA band — on brand colour',
    spec: 'MARK 44 · ON ACCENT', note: 'the mark on its own colour',
    width: 900, wide: true,
    render: function (c) {
      var band = c.el('div', 'wb-root wb-band');
      band.style.background = c.accent;
      band.style.color = c.accentInk;
      band.appendChild(c.logo(44));
      band.appendChild(c.el('h2', 'wb-bandh', 'Start shipping with ' + c.brand + ' today'));
      band.appendChild(c.el('p', 'wb-bandp', 'Set up in a few minutes. No credit card required.'));

      var primary = c.el('a', 'wb-bandbtn', 'Create an account');
      primary.style.background = c.accentInk;
      primary.style.color = c.accent;
      var secondary = c.el('a', 'wb-bandbtn', 'Talk to sales');
      secondary.style.border = '1px solid ' + c.accentInk;
      secondary.style.color = c.accentInk;

      band.appendChild(c.el('div', 'wb-bandbtns', [primary, secondary]));
      return band;
    }
  });

  /* ── 15 · transparent nav over a photo hero ───────────────── */

  L.register({
    id: 'web-hero-photo', group: 'web', title: 'Transparent nav over photo',
    spec: 'MARK 30 · NO BACKPLATE', note: 'mid-tone background, nothing to hide behind',
    width: 900, wide: true,
    render: function (c) {
      var hero = c.el('div', 'wb-root wb-photo');
      hero.appendChild(c.el('div', 'wb-veil'));

      var nav = c.el('div', 'wb-photonav');
      nav.appendChild(lock(c, 30, 17, { color: '#fff' }));
      nav.appendChild(c.el('nav', 'wb-navmid', links(c, 'wb-navlink wb-photolink', ['Product', 'Pricing', 'Docs', 'Blog'])));
      nav.appendChild(c.el('div', 'wb-navend', [c.el('a', 'wb-photocta', 'Get started')]));
      hero.appendChild(nav);

      var body = c.el('div', 'wb-photobody');
      body.appendChild(c.el('h1', 'wb-photoh', c.tagline));
      body.appendChild(c.el('p', 'wb-photop',
        c.brand + ' handles auth, billing and deploys so your team can stay on the product.'));
      hero.appendChild(body);
      return hero;
    }
  });
})();
