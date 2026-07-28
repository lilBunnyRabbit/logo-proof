/* js/scenes/link.js — Link previews.
   Two jobs live here: cards where the mark IS the thumbnail, and cards where the
   mark is a 16 px site badge parked next to somebody else's big image. Plus the
   1200×630 Open Graph plate the rest of them are cropping. */
(function () {
  'use strict';

  var L = window.LogoLab;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ── colour helpers ────────────────────────────────────────── */

  function chan(h) {
    h = String(h || '#2b2f36').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h.slice(0, 6), 16);
    if (!isFinite(n)) return [43, 47, 54];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) {
    var c = chan(h);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }
  function shade(h, k) {
    var c = chan(h);
    return 'rgb(' + Math.round(c[0] * (1 - k)) + ',' + Math.round(c[1] * (1 - k)) + ',' + Math.round(c[2] * (1 - k)) + ')';
  }

  /* ── inline platform glyphs ────────────────────────────────── */

  function glyph(w, h, vb, paths) {
    var s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', vb);
    s.setAttribute('width', w);
    s.setAttribute('height', h);
    s.setAttribute('class', 'lk-glyph');
    s.setAttribute('aria-hidden', 'true');
    paths.forEach(function (p) {
      var n = document.createElementNS(SVGNS, 'path');
      n.setAttribute('d', p.d);
      n.setAttribute('fill', p.fill || 'none');
      if (p.stroke) {
        n.setAttribute('stroke', p.stroke);
        n.setAttribute('stroke-width', p.sw || 1.6);
        n.setAttribute('stroke-linecap', 'round');
        n.setAttribute('stroke-linejoin', 'round');
      }
      s.appendChild(n);
    });
    return s;
  }

  /* X verified badge — burst plus tick, drawn as one glyph */
  function xBadge(size) {
    return glyph(size, size, '0 0 24 24', [
      { fill: '#1d9bf0', d: 'M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z' },
      { fill: '#ffffff', d: 'M10.96 16.32L6.9 12.26l1.42-1.41 2.64 2.64 5.32-5.32 1.42 1.41z' }
    ]);
  }

  /* WhatsApp delivered-and-read double tick */
  function waTicks() {
    return glyph(16, 16, '0 0 16 16', [
      { stroke: '#53bdeb', sw: 1.5, d: 'M1.4 8.4l2.5 2.5 5.4-5.6' },
      { stroke: '#53bdeb', sw: 1.5, d: 'M6.3 8.4l2.5 2.5 5.4-5.6' }
    ]);
  }

  /* ── copy shared across the cards ──────────────────────────── */

  function copy(ctx) {
    var tag = ctx.tagline || 'Documentation, pricing and the changelog';
    return {
      title: ctx.brand + ' — ' + tag,
      short: ctx.brand,
      desc: 'Docs, pricing and the changelog in one place. Setup takes about ten minutes and works with the tools your team already runs.',
      descShort: 'Docs, pricing and the changelog in one place.',
      url: ctx.domain,
      href: ctx.domain + '/changelog'
    };
  }

  /* Initials avatar — a human sender is not the logo, so do not fake one. */
  function initials(ctx, name, size, radius, bg) {
    var t = String(name || 'A').trim().split(/\s+/).map(function (w) { return w.charAt(0); })
      .join('').slice(0, 2).toUpperCase();
    var n = ctx.el('div', 'lk-ini', t);
    n.style.width = size + 'px';
    n.style.height = size + 'px';
    n.style.borderRadius = radius;
    n.style.fontSize = Math.round(size * 0.4) + 'px';
    n.style.background = bg || '#4a5568';
    return n;
  }

  function ph(ctx, w, h) {
    var n = ctx.el('div', 'kit-ph');
    n.style.setProperty('--w', w);
    n.style.setProperty('--h', (h || 8) + 'px');
    return n;
  }

  /* ── the artwork every card is cropping ────────────────────── */

  function field(ctx, w, h, o) {
    o = o || {};
    var a = ctx.accent || '#2b2f36';
    var n = ctx.el('div', 'lk-art');
    n.style.width = w + 'px';
    n.style.height = h + 'px';
    n.style.background =
      'radial-gradient(' + Math.round(w * 0.86) + 'px ' + Math.round(h * 1.15) + 'px at 50% 24%,' +
      rgba(a, 0.62) + ' 0%,' + rgba(a, 0.12) + ' 46%,' + rgba(a, 0) + ' 72%),' +
      'linear-gradient(152deg,' + shade(a, 0.58) + ' 0%,#0b0e14 58%,#07080c 100%)';

    var mark = o.mark || Math.round(Math.min(w * 0.24, h * 0.42));
    var stack = ctx.el('div', 'lk-art-in');
    stack.appendChild(ctx.logo(mark, { shape: 'sharp', bg: 'transparent' }));

    var ws = o.wordSize || Math.round(h * 0.115);
    if (o.word !== false && w >= 240 && ws >= 12) {
      var wd = ctx.el('div', 'lk-word', ctx.brand);
      wd.style.fontSize = ws + 'px';
      wd.style.marginTop = Math.round(mark * 0.2) + 'px';
      stack.appendChild(wd);
    }
    if (o.rule) {
      var r = ctx.el('div', 'lk-rule');
      r.style.width = (o.ruleW || 88) + 'px';
      r.style.height = '4px';
      r.style.background = a;
      r.style.marginTop = '30px';
      stack.appendChild(r);
    }
    if (o.tagline && ctx.tagline) {
      var t = ctx.el('div', 'lk-tag', ctx.tagline);
      t.style.fontSize = (o.tagSize || 30) + 'px';
      t.style.marginTop = '28px';
      stack.appendChild(t);
    }
    n.appendChild(stack);

    if (o.domain) {
      var d = ctx.el('div', 'lk-artdom', ctx.domain);
      d.style.bottom = (o.insetY || 44) + 'px';
      d.style.right = (o.insetX || 56) + 'px';
      n.appendChild(d);
    }
    return n;
  }

  /* ── CSS ───────────────────────────────────────────────────── */

  L.css(`
/* the OG artwork field */
.lk-art { position:relative; overflow:hidden; flex:none; display:flex;
          align-items:center; justify-content:center; }
.lk-art-in { display:flex; flex-direction:column; align-items:center; }
.lk-word { color:#fff; font-weight:700; letter-spacing:-.02em; line-height:1.1; white-space:nowrap; }
.lk-tag { color:rgba(255,255,255,.62); font-weight:400; letter-spacing:-.01em; line-height:1.25;
          text-align:center; max-width:820px; }
.lk-artdom { position:absolute; color:rgba(255,255,255,.42); letter-spacing:.06em;
             font:500 20px/1 ui-monospace,"SF Mono",Menlo,Consolas,monospace; }
.lk-glyph { display:block; flex:none; }
.lk-ini { display:flex; align-items:center; justify-content:center; flex:none;
          color:#fff; font-weight:700; letter-spacing:.02em; }
/* scene roots carry their own border, so keep the intrinsic width honest */
.lk-xs, .lk-li { box-sizing:border-box; }

/* ── X — summary_large_image ── */
.lk-x { background:#fff; color:#0f1419; padding:12px 16px 8px;
        font-family:"TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
.lk-x-row { display:flex; gap:12px; }
.lk-x-id { display:flex; align-items:center; gap:4px; }
.lk-x-nm { font-size:15px; font-weight:700; line-height:20px; }
.lk-x-at { font-size:15px; font-weight:400; color:#536471; line-height:20px; }
.lk-x-txt { font-size:15px; line-height:20px; margin:2px 0 12px; }
.lk-x-lnk { color:#1d9bf0; }
.lk-x-card { border:1px solid #cfd9de; border-radius:16px; overflow:hidden; position:relative; }
.lk-x-dom { position:absolute; left:12px; bottom:12px; padding:1px 6px; border-radius:4px;
            background:rgba(255,255,255,.92); color:#536471; font-size:12px; line-height:16px; }
.lk-x-acts { display:flex; justify-content:space-between; max-width:425px; margin-top:12px; color:#536471; }
.lk-x-act { display:flex; align-items:center; gap:6px; font-size:13px; line-height:16px; }

/* ── X — summary (small) ── */
.lk-xs { display:flex; background:#fff; color:#0f1419; overflow:hidden;
         border:1px solid #cfd9de; border-radius:16px;
         font-family:"TwitterChirp",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
.lk-xs-th { width:128px; height:128px; flex:none; display:flex; align-items:center; justify-content:center;
            border-right:1px solid #cfd9de; }
.lk-xs-b { padding:12px; display:flex; flex-direction:column; justify-content:center; min-width:0; }
.lk-xs-t { font-size:15px; line-height:20px; }
.lk-xs-d { font-size:15px; line-height:20px; color:#536471; margin-top:2px; }
.lk-xs-u { font-size:15px; line-height:20px; color:#536471; margin-top:2px; }

/* ── Facebook — link post ── */
.lk-fb { background:#fff; color:#050505; border-radius:8px; overflow:hidden;
         font-family:system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif; }
.lk-fb-hd { display:flex; align-items:center; gap:8px; padding:12px 16px 0; }
.lk-fb-nm { font-size:15px; font-weight:600; line-height:20px; }
.lk-fb-sub { display:flex; align-items:center; gap:4px; font-size:13px; color:#65676b; line-height:16px; }
.lk-fb-txt { padding:8px 16px 12px; font-size:15px; line-height:20px; }
.lk-fb-cap { background:#f2f3f5; border-top:1px solid #dadde1; border-bottom:1px solid #dadde1; padding:10px 12px; }
.lk-fb-dom { font-size:13px; line-height:16px; color:#65676b; text-transform:uppercase; }
.lk-fb-t { font-size:16px; font-weight:600; line-height:20px; margin-top:2px; }
.lk-fb-d { font-size:15px; line-height:20px; color:#65676b; margin-top:2px; }
.lk-fb-eng { display:flex; align-items:center; justify-content:space-between;
             padding:10px 16px; font-size:15px; color:#65676b; }
.lk-fb-rx { display:flex; align-items:center; gap:4px; font-size:13px; }
.lk-fb-bar { display:flex; border-top:1px solid #ced0d4; margin:0 16px 6px; }
.lk-fb-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
             padding:8px 0; font-size:15px; font-weight:600; color:#65676b; }

/* ── LinkedIn — shared link ── */
.lk-li { background:#fff; color:#000000E6; border:1px solid #00000014; border-radius:8px; overflow:hidden;
         font-family:-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
.lk-li-hd { display:flex; gap:8px; padding:12px 16px 0; }
.lk-li-nm { font-size:14px; font-weight:600; line-height:20px; }
.lk-li-sub { font-size:12px; color:#00000099; line-height:16px; }
.lk-li-txt { padding:8px 16px 12px; font-size:14px; line-height:20px; }
.lk-li-cap { background:#f9fafb; border-top:1px solid #00000014; padding:8px 12px 12px; }
.lk-li-t { font-size:16px; font-weight:600; line-height:20px; color:#000000E6; }
.lk-li-m { font-size:12px; line-height:16px; color:#00000099; margin-top:3px; }
.lk-li-cnt { display:flex; justify-content:space-between; padding:8px 16px 6px;
             font-size:12px; color:#00000099; }
.lk-li-bar { display:flex; border-top:1px solid #00000014; margin:0 8px; }
.lk-li-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
             padding:10px 0; font-size:14px; font-weight:600; color:#00000099; }

/* ── Slack — unfurl ── */
.lk-sl { background:#fff; color:#1d1c1d; padding:10px 20px 16px;
         font-family:"Lato",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
.lk-sl-row { display:flex; gap:8px; }
.lk-sl-id { display:flex; align-items:baseline; gap:8px; }
.lk-sl-nm { font-size:15px; font-weight:900; line-height:1.46668; }
.lk-sl-ts { font-size:12px; color:#616061; line-height:1.5; }
.lk-sl-msg { font-size:15px; line-height:1.46668; }
.lk-sl-lnk { color:#1264a3; }
.lk-sl-att { display:flex; gap:12px; margin-top:8px; }
.lk-sl-bar { width:4px; border-radius:8px; flex:none; }
.lk-sl-svc { display:flex; align-items:center; gap:8px; margin-bottom:2px; }
.lk-sl-svcn { font-size:13px; font-weight:700; line-height:1.38463; }
.lk-sl-t { font-size:15px; font-weight:700; line-height:1.46668; color:#1264a3; }
.lk-sl-d { font-size:15px; line-height:1.46668; margin-top:1px; }
.lk-sl-img { width:360px; margin-top:8px; border-radius:8px; overflow:hidden; }

/* ── Discord — embed ── */
.lk-dc { background:#313338; color:#dbdee1; padding:10px 16px 18px;
         font-family:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif; }
.lk-dc-row { display:flex; gap:16px; }
.lk-dc-id { display:flex; align-items:baseline; gap:8px; }
.lk-dc-nm { font-size:16px; font-weight:500; line-height:1.375; color:#f2f3f5; }
.lk-dc-ts { font-size:12px; color:#949ba4; }
.lk-dc-msg { font-size:16px; line-height:1.375; }
.lk-dc-lnk { color:#00a8fc; }
.lk-dc-em { display:flex; max-width:432px; margin-top:8px; background:#2b2d31;
            border-radius:4px; overflow:hidden; }
.lk-dc-embar { width:4px; flex:none; }
.lk-dc-emin { flex:1; display:flex; gap:16px; padding:8px 16px 16px 12px; min-width:0; }
.lk-dc-au { display:flex; align-items:center; gap:8px; margin-top:8px; }
.lk-dc-aun { font-size:14px; font-weight:600; color:#f2f3f5; }
.lk-dc-t { font-size:16px; font-weight:600; line-height:22px; color:#00a8fc; margin-top:8px; }
.lk-dc-d { font-size:14px; line-height:18px; color:#dbdee1; margin-top:8px; }
.lk-dc-th { width:80px; height:80px; flex:none; border-radius:4px; overflow:hidden; margin-top:8px; }

/* ── iMessage — rich link ── */
.lk-im { background:#fff; color:#000; padding:16px 14px 12px;
         font-family:-apple-system,"SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif; }
.lk-im-out { display:flex; justify-content:flex-end; }
.lk-im-b1 { max-width:230px; padding:7px 13px; border-radius:18px; background:#007aff; color:#fff;
            font-size:17px; line-height:22px; letter-spacing:-.01em; }
.lk-im-card { width:250px; border-radius:18px; overflow:hidden; background:#f2f2f7; margin-top:6px; }
.lk-im-ft { background:#fff; padding:8px 12px 10px; }
.lk-im-t { font-size:13px; font-weight:600; line-height:16px; color:#000; }
.lk-im-dom { font-size:12px; line-height:15px; color:#8e8e93; margin-top:1px; }
.lk-im-dl { text-align:right; font-size:11px; font-weight:600; color:#8e8e93; margin-top:4px; }

/* ── WhatsApp — link preview ── */
.lk-wa { background:#efeae2; color:#111b21; padding:14px 12px;
         font-family:"Segoe UI","Helvetica Neue",Helvetica,"Lucida Grande",Arial,sans-serif; }
.lk-wa-out { display:flex; justify-content:flex-end; }
.lk-wa-b { width:300px; padding:3px; border-radius:7.5px; background:#d9fdd3;
           box-shadow:0 1px .5px rgba(11,20,26,.13); }
.lk-wa-prev { background:rgba(0,0,0,.05); border-radius:6px; overflow:hidden; }
.lk-wa-meta { padding:6px 10px 8px; }
.lk-wa-t { font-size:14px; font-weight:500; line-height:19px; }
.lk-wa-d { font-size:13px; line-height:17px; color:#667781; margin-top:1px; }
.lk-wa-dom { font-size:13px; line-height:17px; color:#667781; margin-top:3px; }
.lk-wa-body { padding:4px 7px 0 9px; font-size:14.2px; line-height:19px; }
.lk-wa-url { color:#027eb5; text-decoration:underline; }
.lk-wa-time { display:flex; align-items:center; justify-content:flex-end; gap:3px;
              padding:2px 7px 3px 0; font-size:11px; color:rgba(17,27,33,.5); }

/* ── Notion — bookmark block ── */
.lk-nt { background:#fff; color:#37352f; padding:6px 0;
         font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
.lk-nt-h { font-size:19px; font-weight:600; line-height:1.3; margin-bottom:8px; }
.lk-nt-p { display:flex; flex-direction:column; align-items:flex-start; margin-bottom:14px; }
.lk-nt-bm { display:flex; border:1px solid #e9e9e7; border-radius:3px; overflow:hidden; }
.lk-nt-l { flex:1 1 auto; min-width:0; padding:12px 14px 14px; display:flex; flex-direction:column; }
.lk-nt-t { font-size:14px; line-height:20px; }
.lk-nt-d { font-size:12px; line-height:16px; color:rgba(55,53,47,.6); margin-top:2px; }
.lk-nt-u { display:flex; align-items:center; gap:6px; margin-top:auto; padding-top:8px;
           font-size:12px; line-height:16px; }
.lk-nt-img { width:100px; height:100px; flex:none; }

/* ── Open Graph plate ── */
.lk-og { position:relative; }

/* ── Email — newsletter header ── */
.lk-em { background:#f4f4f5; padding:18px 0 22px;
         font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif; color:#1a1a1a; }
.lk-em-pre { width:600px; margin:0 auto 10px; padding:0 26px; display:flex;
             justify-content:space-between; font-size:11px; line-height:16px; color:#8a8a8f; }
.lk-em-body { width:600px; margin:0 auto; background:#fff; border:1px solid #e6e6e9; }
.lk-em-band { display:flex; align-items:center; justify-content:center; gap:12px;
              padding:26px 24px; background:#f7f7f8; border-bottom:1px solid #e6e6e9; }
.lk-em-word { font-size:22px; font-weight:700; letter-spacing:-.015em; color:#17171a; }
.lk-em-main { padding:28px 32px 30px; }
.lk-em-h1 { font-size:22px; font-weight:700; line-height:28px; margin-bottom:12px; }
.lk-em-copy { display:flex; flex-direction:column; align-items:flex-start; color:#1a1a1a; }
.lk-em-cta { display:inline-block; margin-top:20px; padding:11px 20px; border-radius:6px;
             font-size:14px; font-weight:600; }
.lk-em-ft { padding:18px 32px 24px; border-top:1px solid #ececef; text-align:center;
            font-size:12px; line-height:18px; color:#8a8a8f; }

  `);

  /* ══ 1. X — summary_large_image ═════════════════════════════ */

  L.register({
    id: 'link-x-large',
    group: 'link',
    title: 'X — summary_large_image',
    spec: '16:9 · 514 PX',
    note: 'the card most people actually ship',
    width: 600,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'lk-x');

      /* 600 column − 32 padding − 40 avatar − 12 gap − 2 card border = 514.
         Any wider and the card clips the art off-centre. */
      var art = field(ctx, 514, 289, { mark: 120 });
      var card = ctx.el('div', 'lk-x-card', [art, ctx.el('span', 'lk-x-dom', ctx.domain)]);

      var body = ctx.el('div', 'kit-fill', [
        ctx.el('div', 'lk-x-id', [
          ctx.el('span', 'lk-x-nm', ctx.brand),
          xBadge(17),
          ctx.el('span', 'lk-x-at', '@' + ctx.handle + ' · 4h')
        ]),
        ctx.el('div', 'lk-x-txt', [
          'We moved the docs and the changelog under one roof. Same address, faster search, and every release now has a written note. ',
          ctx.el('span', 'lk-x-lnk', ctx.domain)
        ]),
        card,
        ctx.el('div', 'lk-x-acts', [
          ctx.el('span', 'lk-x-act', [ctx.icon('comment', 18), '12']),
          ctx.el('span', 'lk-x-act', [ctx.icon('retweet', 18), '31']),
          ctx.el('span', 'lk-x-act', [ctx.icon('heart', 18), '204']),
          ctx.el('span', 'lk-x-act', [ctx.icon('eye', 18), '9,431']),
          ctx.el('span', 'lk-x-act', [ctx.icon('share', 18)])
        ])
      ]);

      root.appendChild(ctx.el('div', 'lk-x-row', [
        ctx.logo(40, { shape: 'circle' }),
        body
      ]));
      return root;
    }
  });

  /* ══ 2. X — summary (small) ═════════════════════════════════ */

  L.register({
    id: 'link-x-small',
    group: 'link',
    title: 'X — summary (small)',
    spec: '128 PX THUMB',
    note: 'the mark is the whole thumbnail',
    width: 438,
    render: function (ctx) {
      var c = copy(ctx);
      var thumb = ctx.el('div', 'lk-xs-th');
      thumb.style.background = ctx.accent;
      thumb.appendChild(ctx.logo(72, { shape: 'sharp', bg: 'transparent' }));

      return ctx.el('div', 'lk-xs', [
        thumb,
        ctx.el('div', 'lk-xs-b', [
          ctx.el('div', 'lk-xs-t kit-ell', c.title),
          ctx.el('div', 'lk-xs-d kit-clamp2', c.desc),
          ctx.el('div', 'lk-xs-u kit-ell', ctx.domain)
        ])
      ]);
    }
  });

  /* ══ 3. Facebook — link post ════════════════════════════════ */

  L.register({
    id: 'link-facebook',
    group: 'link',
    title: 'Facebook — link post',
    spec: '1.91:1 · 500 PX',
    note: 'grey caption strip, uppercase domain',
    width: 500,
    wide: true,
    render: function (ctx) {
      var c = copy(ctx);
      return ctx.el('div', 'lk-fb', [
        ctx.el('div', 'lk-fb-hd', [
          ctx.logo(40, { shape: 'circle' }),
          ctx.el('div', 'kit-fill', [
            ctx.el('div', 'lk-fb-nm', ctx.brand),
            ctx.el('div', 'lk-fb-sub', ['3 h · ', ctx.icon('globe', 12)])
          ]),
          ctx.icon('dots', 20)
        ]),
        ctx.el('div', 'lk-fb-txt', 'New site, same address. Everything about the product now lives in one place.'),
        field(ctx, 500, 262),
        ctx.el('div', 'lk-fb-cap', [
          ctx.el('div', 'lk-fb-dom', ctx.domain),
          ctx.el('div', 'lk-fb-t kit-ell', c.title),
          ctx.el('div', 'lk-fb-d kit-ell', c.descShort)
        ]),
        ctx.el('div', 'lk-fb-eng', [
          ctx.el('span', 'lk-fb-rx', ['👍❤️', ctx.el('span', null, '148')]),
          ctx.el('span', null, '9 comments · 4 shares')
        ]),
        ctx.el('div', 'lk-fb-bar', [
          ctx.el('span', 'lk-fb-btn', [ctx.icon('heart', 18), 'Like']),
          ctx.el('span', 'lk-fb-btn', [ctx.icon('comment', 18), 'Comment']),
          ctx.el('span', 'lk-fb-btn', [ctx.icon('share', 18), 'Share'])
        ])
      ]);
    }
  });

  /* ══ 4. LinkedIn — shared link ══════════════════════════════ */

  L.register({
    id: 'link-linkedin',
    group: 'link',
    title: 'LinkedIn — shared link',
    spec: '1.91:1 · 550 PX',
    note: 'square company logo, #f9fafb caption',
    width: 552,
    wide: true,
    render: function (ctx) {
      var c = copy(ctx);
      return ctx.el('div', 'lk-li', [
        ctx.el('div', 'lk-li-hd', [
          ctx.logo(48, { shape: 'sharp' }),
          ctx.el('div', 'kit-fill', [
            ctx.el('div', 'lk-li-nm', ctx.brand),
            ctx.el('div', 'lk-li-sub kit-ell', (ctx.tagline || 'Software') + ' · 2,140 followers'),
            ctx.el('div', 'lk-li-sub', '3d · Edited')
          ]),
          ctx.icon('dots', 20)
        ]),
        ctx.el('div', 'lk-li-txt', 'We rebuilt the site around the documentation. Short note on why we did it and what changes for existing customers.'),
        field(ctx, 550, 288),
        ctx.el('div', 'lk-li-cap', [
          ctx.el('div', 'lk-li-t kit-clamp2', c.title),
          ctx.el('div', 'lk-li-m', ctx.domain + ' • 3 min read')
        ]),
        ctx.el('div', 'lk-li-cnt', [
          ctx.el('span', null, '86 · Anders Holm and 85 others'),
          ctx.el('span', null, '7 comments')
        ]),
        ctx.el('div', 'lk-li-bar', [
          ctx.el('span', 'lk-li-btn', [ctx.icon('heart', 18), 'Like']),
          ctx.el('span', 'lk-li-btn', [ctx.icon('comment', 18), 'Comment']),
          ctx.el('span', 'lk-li-btn', [ctx.icon('retweet', 18), 'Repost']),
          ctx.el('span', 'lk-li-btn', [ctx.icon('send', 18), 'Send'])
        ])
      ]);
    }
  });

  /* ══ 5. Slack — unfurl ══════════════════════════════════════ */

  L.register({
    id: 'link-slack',
    group: 'link',
    title: 'Slack — unfurl',
    spec: '16 PX SITE ICON',
    note: 'accent bar, favicon beside the site name',
    width: 560,
    wide: true,
    render: function (ctx) {
      var c = copy(ctx);
      var bar = ctx.el('div', 'lk-sl-bar');
      bar.style.background = ctx.accent;

      var att = ctx.el('div', 'lk-sl-att', [
        bar,
        ctx.el('div', 'kit-fill', [
          ctx.el('div', 'lk-sl-svc', [
            ctx.logo(16, { shape: 'sharp' }),
            ctx.el('span', 'lk-sl-svcn', ctx.brand)
          ]),
          ctx.el('div', 'lk-sl-t', c.title),
          ctx.el('div', 'lk-sl-d', c.desc),
          ctx.el('div', 'lk-sl-img', field(ctx, 360, 189))
        ])
      ]);

      return ctx.el('div', 'lk-sl', [
        ctx.el('div', 'lk-sl-row', [
          initials(ctx, ctx.person, 36, '4px', '#3f5a7d'),
          ctx.el('div', 'kit-fill', [
            ctx.el('div', 'lk-sl-id', [
              ctx.el('span', 'lk-sl-nm', ctx.person),
              ctx.el('span', 'lk-sl-ts', '9:41 AM')
            ]),
            ctx.el('div', 'lk-sl-msg', [
              'Posting the new site here so it does not get buried in the thread — ',
              ctx.el('span', 'lk-sl-lnk', c.href)
            ]),
            att
          ])
        ])
      ]);
    }
  });

  /* ══ 6. Discord — embed ═════════════════════════════════════ */

  L.register({
    id: 'link-discord',
    group: 'link',
    title: 'Discord — embed',
    spec: '80 PX THUMB',
    note: 'on #313338, 20 px author icon',
    width: 560,
    wide: true,
    render: function (ctx) {
      var c = copy(ctx);
      var bar = ctx.el('div', 'lk-dc-embar');
      bar.style.background = ctx.accent;

      var thumb = ctx.el('div', 'lk-dc-th', field(ctx, 80, 80, { mark: 46, word: false }));

      var embed = ctx.el('div', 'lk-dc-em', [
        bar,
        ctx.el('div', 'lk-dc-emin', [
          ctx.el('div', 'kit-fill', [
            ctx.el('div', 'lk-dc-au', [
              ctx.logo(20, { shape: 'circle' }),
              ctx.el('span', 'lk-dc-aun', ctx.brand)
            ]),
            ctx.el('div', 'lk-dc-t', c.title),
            ctx.el('div', 'lk-dc-d', c.desc)
          ]),
          thumb
        ])
      ]);

      return ctx.el('div', 'lk-dc', [
        ctx.el('div', 'lk-dc-row', [
          initials(ctx, ctx.person, 40, '50%', '#5865f2'),
          ctx.el('div', 'kit-fill', [
            ctx.el('div', 'lk-dc-id', [
              ctx.el('span', 'lk-dc-nm', ctx.person),
              ctx.el('span', 'lk-dc-ts', 'Today at 09:41')
            ]),
            ctx.el('div', 'lk-dc-msg', [
              'Site is live — docs and changelog in one place ',
              ctx.el('span', 'lk-dc-lnk', c.href)
            ]),
            embed
          ])
        ])
      ]);
    }
  });

  /* ══ 7. iMessage — rich link ════════════════════════════════ */

  L.register({
    id: 'link-imessage',
    group: 'link',
    title: 'iMessage — rich link',
    spec: '250 PX BUBBLE',
    note: '18 px radius, white footer strip',
    width: 320,
    render: function (ctx) {
      var c = copy(ctx);
      var card = ctx.el('div', 'lk-im-card', [
        field(ctx, 250, 131),
        ctx.el('div', 'lk-im-ft', [
          ctx.el('div', 'lk-im-t kit-clamp2', c.title),
          ctx.el('div', 'lk-im-dom kit-ell', ctx.domain)
        ])
      ]);

      return ctx.el('div', 'lk-im', [
        ctx.el('div', 'lk-im-out', ctx.el('div', 'lk-im-b1', 'Here is the site I mentioned earlier.')),
        ctx.el('div', 'lk-im-out', card),
        ctx.el('div', 'lk-im-dl', 'Delivered')
      ]);
    }
  });

  /* ══ 8. WhatsApp — link preview ═════════════════════════════ */

  L.register({
    id: 'link-whatsapp',
    group: 'link',
    title: 'WhatsApp — link preview',
    spec: '300 PX BUBBLE',
    note: 'outgoing #d9fdd3, preview on top',
    width: 340,
    render: function (ctx) {
      var c = copy(ctx);
      var bubble = ctx.el('div', 'lk-wa-b', [
        ctx.el('div', 'lk-wa-prev', [
          field(ctx, 294, 154),
          ctx.el('div', 'lk-wa-meta', [
            ctx.el('div', 'lk-wa-t kit-ell', c.title),
            ctx.el('div', 'lk-wa-d kit-ell', c.descShort),
            ctx.el('div', 'lk-wa-dom', ctx.domain)
          ])
        ]),
        ctx.el('div', 'lk-wa-body', ctx.el('span', 'lk-wa-url', 'https' + '://' + ctx.domain)),
        ctx.el('div', 'lk-wa-time', ['09:41', waTicks()])
      ]);
      return ctx.el('div', 'lk-wa', ctx.el('div', 'lk-wa-out', bubble));
    }
  });

  /* ══ 9. Notion — bookmark block ═════════════════════════════ */

  L.register({
    id: 'link-notion',
    group: 'link',
    title: 'Notion — bookmark block',
    spec: '100 PX SQUARE',
    note: '1 px border, 16 px favicon in the url row',
    width: 660,
    wide: true,
    render: function (ctx) {
      var c = copy(ctx);
      return ctx.el('div', 'lk-nt', [
        ctx.el('div', 'lk-nt-h', 'Vendors & references'),
        ctx.el('div', 'lk-nt-p', [ph(ctx, '92%', 9), ph(ctx, '78%', 9)]),
        ctx.el('div', 'lk-nt-bm', [
          ctx.el('div', 'lk-nt-l', [
            ctx.el('div', 'lk-nt-t kit-ell', c.title),
            ctx.el('div', 'lk-nt-d kit-clamp2', c.desc),
            ctx.el('div', 'lk-nt-u', [
              ctx.logo(16, { shape: 'sharp' }),
              ctx.el('span', 'kit-ell', ctx.domain + '/changelog')
            ])
          ]),
          ctx.el('div', 'lk-nt-img', field(ctx, 100, 100, { mark: 56, word: false }))
        ])
      ]);
    }
  });

  /* ══ 10. The Open Graph plate itself ════════════════════════ */

  L.register({
    id: 'link-og-plate',
    group: 'link',
    title: 'Open Graph image',
    spec: '1200 × 630',
    note: 'the artwork every card above is cropping',
    width: 1200,
    wide: true,
    render: function (ctx) {
      var n = ctx.el('div', 'lk-og', field(ctx, 1200, 630, {
        mark: 200,
        wordSize: 64,
        rule: true,
        ruleW: 88,
        tagline: true,
        tagSize: 30,
        domain: true,
        insetX: 56,
        insetY: 44
      }));
      return n;
    }
  });

  /* ══ 11. Email — newsletter header ══════════════════════════ */

  L.register({
    id: 'link-email-header',
    group: 'link',
    title: 'Email — newsletter header',
    spec: '600 PX TABLE',
    note: '44 px mark on a light band',
    width: 600,
    wide: true,
    render: function (ctx) {
      var cta = ctx.el('span', 'lk-em-cta', 'Read the changelog');
      cta.style.background = ctx.accent;
      cta.style.color = ctx.accentInk;

      return ctx.el('div', 'lk-em', [
        ctx.el('div', 'lk-em-pre', [
          ctx.el('span', null, ctx.brand + ' · Monthly notes'),
          ctx.el('span', null, 'View in browser')
        ]),
        ctx.el('div', 'lk-em-body', [
          ctx.el('div', 'lk-em-band', [
            ctx.logo(44, { shape: 'auto' }),
            ctx.el('span', 'lk-em-word', ctx.brand)
          ]),
          ctx.el('div', 'lk-em-main', [
            ctx.el('h1', 'lk-em-h1', 'What shipped in July'),
            ctx.el('div', 'lk-em-copy', [
              ph(ctx, '100%', 9), ph(ctx, '96%', 9), ph(ctx, '88%', 9), ph(ctx, '54%', 9)
            ]),
            cta
          ]),
          ctx.el('div', 'lk-em-ft', [
            ctx.el('div', null, ctx.brand + ' · ' + ctx.domain),
            ctx.el('div', null, 'You are getting this because you have an account. Unsubscribe.')
          ])
        ])
      ]);
    }
  });

  /* Cut: a Google SERP row ("16 px mark in a chip") and a Bluesky external
     embed ("16:9 art in a bordered card"). favicon.js#fav-serp already makes
     the first judgement with the right 26 px disc, and link-x-large already
     makes the second — neither asked anything new of the mark. */
})();
