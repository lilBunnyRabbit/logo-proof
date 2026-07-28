/* js/scenes/social.js — social profile & feed surfaces.
   Prefix: .so-   Group: social
   The mark as a circle next to a name: the first place a founder sees it. */
(function () {
  'use strict';

  var L = window.LogoLab;
  if (!L) return;

  /* ── inline platform glyphs ─────────────────────────────────── */

  var NS = 'http://www.w3.org/2000/svg';

  function glyph(vb, w, h, ds, attrs, cls) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb);
    s.setAttribute('width', w);
    s.setAttribute('height', h);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls || 'so-fill');
    ds.forEach(function (d) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      if (attrs) Object.keys(attrs).forEach(function (k) { p.setAttribute(k, attrs[k]); });
      s.appendChild(p);
    });
    return s;
  }

  var D = {
    /* GitHub octicons, 16 viewBox */
    ghMark: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z',
    ghPeople: 'M2 5.5a3.5 3.5 0 1 1 5.9 2.55 5.5 5.5 0 0 1 3.03 4.08.75.75 0 1 1-1.48.24 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.48-.24A5.5 5.5 0 0 1 3.1 8.05 3.49 3.49 0 0 1 2 5.5ZM11 4a3 3 0 0 1 2.22 5.02 5.01 5.01 0 0 1 2.56 3.01.75.75 0 0 1-1.43.44 3.51 3.51 0 0 0-2.53-2.37.75.75 0 0 1-.57-.73v-.35a.75.75 0 0 1 .42-.67A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
    ghRepo: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.7.75.75 0 1 1-1.08 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.49 2.49 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.09a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
    ghStar: 'M8 .25a.75.75 0 0 1 .67.42l1.89 3.81 4.21.61a.75.75 0 0 1 .41 1.28l-3.04 2.97.72 4.19a.75.75 0 0 1-1.09.79L8 12.35l-3.77 1.98a.75.75 0 0 1-1.08-.79l.72-4.19L.82 6.37a.75.75 0 0 1 .41-1.28l4.21-.61L7.33.67A.75.75 0 0 1 8 .25Z',
    ghFork: 'M5 5.37a2.5 2.5 0 1 1 1.5 0v.88a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75v-.88a2.5 2.5 0 1 1 1.5 0v.88a2.25 2.25 0 0 1-2.25 2.25h-.5v1.87a2.5 2.5 0 1 1-1.5 0V8.5h-.5A2.25 2.25 0 0 1 3.5 6.25v-.88Zm.75 6.63a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0-9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
    /* X verified badge, 24 viewBox */
    xBadge: 'M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.68 2.63 13.43 1.75 12 1.75s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.64 9.33 1.75 10.57 1.75 12s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34Zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77Z',
    /* generic small icons drawn here so they match each platform's weight */
    cal: 'M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v10A1.5 1.5 0 0 1 15.5 17h-11A1.5 1.5 0 0 1 3 15.5zM3 8h14M7 2.5v3M13 2.5v3',
    thumb: 'M7 11 11.2 2.8A2.2 2.2 0 0 1 15 4.3V9h4.1a2 2 0 0 1 1.92 2.57l-1.9 6.4A3 3 0 0 1 16.24 20H7M7 11v9M3.8 20H7V11H3.8z',
    /* Reddit vote arrow, 20 viewBox */
    rdVote: 'M12.88 19H7.12A1.13 1.13 0 0 1 6 17.88V11H2.13a1.11 1.11 0 0 1-1.01-.7 1.25 1.25 0 0 1 .17-1.34L9.17.37a1.13 1.13 0 0 1 1.67 0l7.87 8.59a1.25 1.25 0 0 1 .17 1.34 1.11 1.11 0 0 1-1 .7H14v6.88A1.13 1.13 0 0 1 12.88 19Z'
  };

  function blanks(n, cls) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(L.el('span', cls));
    return out;
  }

  /* grey placeholder bar sized in px — kit-ph needs a block context */
  function ph(w, h) {
    var s = L.el('span', 'kit-ph');
    s.style.setProperty('--w', w);
    s.style.setProperty('--h', h || '9px');
    return s;
  }

  /* ── styles ─────────────────────────────────────────────────── */

  L.css(`
.so-fill { display:block; flex:none; fill:currentColor; stroke:none; }
.so-line { display:block; flex:none; fill:none; stroke:currentColor; stroke-width:1.6;
           stroke-linecap:round; stroke-linejoin:round; }

/* ── GitHub ────────────────────────────────────────────────── */
.so-gh {
  background:#fff; color:#1f2328;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;
  font-size:14px; line-height:1.5;
}
.so-ghp { padding:16px; }
.so-ghp-name { font-size:26px; font-weight:600; line-height:1.25; letter-spacing:-.5px; margin-top:16px; }
.so-ghp-login { font-size:20px; font-weight:300; line-height:24px; color:#59636e; }
.so-ghp-bio { margin-top:16px; font-size:16px; color:#1f2328; }
.so-ghp-btn {
  display:block; width:100%; margin-top:16px; padding:5px 16px;
  background:#f6f8fa; border:1px solid #d1d9e0; border-radius:6px;
  font-family:inherit; font-size:14px; font-weight:500; line-height:20px;
  color:#24292f; text-align:center;
}
.so-ghp-meta { display:flex; align-items:center; gap:6px; margin-top:16px; color:#59636e; font-size:14px; }
.so-ghp-meta b { color:#1f2328; font-weight:600; }
.so-ghp-sep { color:#59636e; }

.so-ghc { padding:16px; }
.so-ghc-wrap { display:flex; align-items:flex-start; gap:16px; }
.so-ghc-box { position:relative; flex:1 1 auto; min-width:0; border:1px solid #d1d9e0; border-radius:6px; }
.so-ghc-box::before, .so-ghc-box::after {
  content:""; position:absolute; top:11px; width:0; height:0;
  border-style:solid; border-width:8px 8px 8px 0;
}
.so-ghc-box::before { left:-8px; border-color:transparent #d1d9e0 transparent transparent; }
.so-ghc-box::after  { left:-7px; border-color:transparent #f6f8fa transparent transparent; }
.so-ghc-head {
  display:flex; align-items:center; gap:8px; padding:8px 16px;
  background:#f6f8fa; border-bottom:1px solid #d1d9e0; border-radius:5px 5px 0 0;
  font-size:14px; color:#59636e;
}
.so-ghc-head b { color:#1f2328; font-weight:600; }
.so-ghc-role {
  margin-left:auto; padding:0 7px; border:1px solid #d1d9e0; border-radius:2em;
  font-size:12px; line-height:18px; color:#59636e;
}
.so-ghc-body { padding:16px; font-size:14px; line-height:1.55; color:#1f2328; }
.so-ghc-body p { margin:0 0 14px; }
.so-ghc-ph { display:flex; flex-direction:column; }
.so-ghc-react { padding:0 16px 12px; }
.so-ghc-pill {
  display:inline-flex; align-items:center; gap:4px; height:26px; padding:0 8px;
  border:1px solid #d1d9e0; border-radius:100px; background:#fff;
  font-size:12px; color:#59636e;
}

.so-ghr { padding:16px; }
.so-ghr-bar { display:flex; align-items:center; gap:8px; padding-bottom:14px; border-bottom:1px solid #d1d9e0; }
.so-ghr-crumb { font-size:18px; color:#0969da; }
.so-ghr-crumb b { font-weight:600; }
.so-ghr-slash { color:#59636e; margin:0 2px; }
.so-ghr-public {
  padding:0 7px; border:1px solid #d1d9e0; border-radius:2em;
  font-size:12px; line-height:18px; color:#59636e;
}
.so-ghr-desc { margin-top:14px; font-size:14px; color:#59636e; }
.so-ghr-stats { display:flex; align-items:center; gap:16px; margin-top:10px; font-size:12px; color:#59636e; }
.so-ghr-stats span { display:flex; align-items:center; gap:5px; }
.so-ghr-stats b { color:#1f2328; font-weight:600; }
.so-ghr-h { display:flex; align-items:center; gap:8px; margin-top:18px; font-size:16px; font-weight:600; }
.so-ghr-count { padding:0 6px; background:rgba(175,184,193,.2); border-radius:2em; font-size:12px; font-weight:500; color:#1f2328; }
.so-ghr-avs { display:flex; align-items:center; gap:4px; flex-wrap:wrap; margin-top:12px; }
.so-ghr-blank { width:20px; height:20px; border-radius:50%; background:#d8dee4; display:block; flex:none; }
.so-ghr-more { margin-top:12px; font-size:14px; color:#0969da; }

/* ── X ─────────────────────────────────────────────────────── */
.so-x {
  background:#fff; color:#0f1419;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:15px; line-height:20px;
}
.so-xp-banner { height:200px; background:linear-gradient(135deg,#cfd9de,#aebcc4); }
.so-xp-body { padding:0 16px 16px; }
.so-xp-top { display:flex; align-items:flex-start; justify-content:space-between; }
.so-xp-av { margin-top:-66px; margin-bottom:12px; }
.so-xp-follow {
  margin-top:12px; height:36px; padding:0 16px; background:#0f1419; color:#fff;
  border:0; border-radius:9999px;
  font-family:inherit; font-size:15px; font-weight:700; line-height:36px;
}
.so-xp-name { display:flex; align-items:center; gap:4px; font-size:20px; font-weight:800; line-height:24px; letter-spacing:-.2px; }
.so-xp-at { font-size:15px; color:#536471; }
.so-xp-bio { margin-top:12px; font-size:15px; }
.so-xp-meta { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:12px; font-size:15px; color:#536471; }
.so-xp-meta span { display:flex; align-items:center; gap:4px; }
.so-xp-link { color:#1d9bf0; }
.so-xp-counts { display:flex; gap:20px; margin-top:12px; font-size:15px; color:#536471; }
.so-xp-counts b { color:#0f1419; font-weight:700; }

.so-xt { padding:12px 16px; border-bottom:1px solid #eff3f4; }
.so-xt-wrap { display:flex; align-items:flex-start; gap:12px; }
.so-xt-head { display:flex; align-items:center; gap:4px; }
.so-xt-nm { font-weight:700; }
.so-xt-mut { color:#536471; }
.so-xt-dots { margin-left:auto; color:#536471; }
.so-xt-body { margin-top:2px; font-size:15px; line-height:20px; }
.so-xt-acts { display:flex; justify-content:space-between; max-width:340px; margin-top:12px; color:#536471; }
.so-xt-act { display:flex; align-items:center; gap:6px; font-size:13px; }

/* ── LinkedIn ──────────────────────────────────────────────── */
.so-li {
  background:#fff; color:rgba(0,0,0,.9);
  font-family:-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  border:1px solid rgba(0,0,0,.08); border-radius:8px; overflow:hidden;
}
/* company cover is 1128 × 191 — 5.9:1, not a hero banner */
.so-lic-cover { height:95px; background:linear-gradient(135deg,#dbe6f0,#bdcedd); }
.so-lic-body { padding:0 24px 24px; }
.so-lic-logo { display:block; width:130px; margin-top:-44px; }
.so-lic-name { margin:14px 0 0; font-size:24px; font-weight:600; line-height:1.25; }
.so-lic-tag { margin-top:4px; font-size:16px; }
.so-lic-meta { margin-top:4px; font-size:14px; color:rgba(0,0,0,.6); }
.so-lic-acts { display:flex; align-items:center; gap:8px; margin-top:16px; }
.so-lic-follow {
  display:flex; align-items:center; gap:4px; height:32px; padding:0 16px;
  background:#0a66c2; color:#fff; border:0; border-radius:16px;
  font-family:inherit; font-size:16px; font-weight:600; line-height:32px;
}
.so-lic-ghost {
  height:32px; padding:0 16px; background:transparent; color:#0a66c2;
  border:1px solid #0a66c2; border-radius:16px;
  font-family:inherit; font-size:16px; font-weight:600; line-height:30px;
}
.so-lic-more {
  height:32px; padding:0 12px; background:transparent; color:rgba(0,0,0,.6);
  border:1px solid rgba(0,0,0,.6); border-radius:16px;
  font-family:inherit; font-size:16px; font-weight:600; line-height:30px;
}

.so-lip-head { display:flex; align-items:flex-start; gap:8px; padding:12px 16px 0; }
.so-lip-nm { font-size:14px; font-weight:600; line-height:1.3; }
.so-lip-sub { font-size:12px; color:rgba(0,0,0,.6); }
.so-lip-time { display:flex; align-items:center; gap:4px; font-size:12px; color:rgba(0,0,0,.6); }
.so-lip-dots { margin-left:auto; color:rgba(0,0,0,.6); }
.so-lip-body { padding:8px 16px 0; font-size:14px; line-height:20px; }
.so-lip-more { display:flex; align-items:center; gap:8px; margin-top:6px; }
.so-lip-see { color:rgba(0,0,0,.6); flex:none; }
.so-lip-counts { display:flex; align-items:center; gap:4px; padding:8px 16px; font-size:12px; color:rgba(0,0,0,.6); }
.so-lip-rx { display:flex; align-items:center; }
.so-lip-rx span {
  width:16px; height:16px; border-radius:50%; display:grid; place-items:center;
  color:#fff; border:1px solid #fff; margin-right:-3px;
}
.so-lip-rx .so-lip-b { background:#378fe9; }
.so-lip-rx .so-lip-r { background:#df704d; }
.so-lip-n { margin-left:6px; }
.so-lip-right { margin-left:auto; }
.so-lip-rule { height:1px; background:rgba(0,0,0,.08); margin:0 16px; }
.so-lip-acts { display:flex; padding:4px 8px; }
.so-lip-act {
  flex:1 1 auto; display:flex; align-items:center; justify-content:center; gap:6px;
  height:40px; color:rgba(0,0,0,.6); font-size:14px; font-weight:600;
}

/* ── Instagram ─────────────────────────────────────────────── */
.so-ig {
  background:#fff; color:#000;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:14px; line-height:18px;
}
.so-ig-bar { display:flex; align-items:center; gap:6px; height:44px; padding:0 16px; }
.so-ig-h { font-size:16px; font-weight:600; }
.so-ig-barr { margin-left:auto; display:flex; align-items:center; gap:18px; }
.so-ig-head { display:flex; align-items:center; padding:8px 16px 16px; }
.so-ig-ring {
  width:96px; height:96px; padding:3px; border-radius:50%; flex:none;
  background:linear-gradient(45deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888);
}
.so-ig-ringin { width:90px; height:90px; padding:2px; border-radius:50%; background:#fff; }
.so-ig-stats { display:flex; flex:1 1 auto; justify-content:space-around; }
.so-ig-stat { text-align:center; }
.so-ig-stat b { display:block; font-size:16px; font-weight:600; }
.so-ig-stat span { font-size:13px; }
.so-ig-nm { padding:0 16px; font-size:14px; font-weight:600; }
.so-ig-bio { padding:0 16px; font-size:14px; }
.so-ig-url { padding:0 16px; font-size:14px; font-weight:600; color:#00376b; }
.so-ig-btns { display:flex; gap:8px; padding:14px 16px; }
.so-ig-btn {
  flex:1 1 0; height:32px; background:#efefef; border:0; border-radius:8px;
  font-family:inherit; font-size:14px; font-weight:600; line-height:32px;
  color:#000; text-align:center;
}
.so-ig-tabs { display:flex; border-top:1px solid #dbdbdb; }
.so-ig-tab { flex:1 1 0; height:44px; display:grid; place-items:center; color:#8e8e8e; }
.so-ig-tab.so-ig-on { color:#000; box-shadow:inset 0 1px 0 #000; }
.so-ig-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
.so-ig-cell { aspect-ratio:1/1; background:#efefef; }
.so-ig-cell:nth-child(2n) { background:#e8e8e8; }
.so-ig-cell:nth-child(5) { background:#e2e2e2; }

/* ── YouTube ───────────────────────────────────────────────── */
.so-yt {
  background:#fff; color:#0f0f0f;
  font-family:Roboto,Arial,sans-serif; font-size:14px; line-height:20px;
}
.so-ytc { padding:16px; }
.so-ytc-banner { height:100px; border-radius:12px; background:linear-gradient(115deg,#d9dde0,#bfc6ca); }
.so-ytc-row { display:flex; align-items:center; gap:16px; margin-top:16px; }
.so-ytc-nm { font-size:24px; font-weight:500; line-height:30px; }
.so-ytc-meta { margin-top:2px; font-size:14px; color:#606060; }
.so-ytc-desc { margin-top:2px; font-size:14px; color:#606060; }
.so-ytc-desc b { color:#0f0f0f; font-weight:500; }
.so-ytc-sub {
  margin-left:auto; height:36px; padding:0 16px; background:#0f0f0f; color:#fff;
  border:0; border-radius:18px; white-space:nowrap;
  font-family:inherit; font-size:14px; font-weight:500; line-height:36px;
}
.so-ytc-tabs { display:flex; gap:24px; margin-top:16px; border-bottom:1px solid #e5e5e5; }
.so-ytc-tab { padding:0 2px 12px; font-size:16px; font-weight:500; color:#606060; }
.so-ytc-tab.so-ytc-on { color:#0f0f0f; box-shadow:inset 0 -3px 0 #0f0f0f; }

.so-ytr { display:flex; align-items:flex-start; gap:12px; padding:8px; }
.so-ytr-thumb {
  position:relative; width:168px; height:94px; flex:none; border-radius:12px;
  background:linear-gradient(115deg,#e3e6e8,#cfd4d7);
}
.so-ytr-dur {
  position:absolute; right:6px; bottom:6px; padding:1px 4px; border-radius:4px;
  background:rgba(0,0,0,.8); color:#fff; font-size:12px; font-weight:500; line-height:16px;
}
.so-ytr-title { font-size:16px; font-weight:500; line-height:22px; max-height:44px; }
.so-ytr-by { display:flex; align-items:center; gap:8px; margin-top:10px; }
.so-ytr-meta { font-size:12px; line-height:18px; color:#606060; }

/* ── Reddit ────────────────────────────────────────────────── */
.so-rd {
  background:#dae0e6; padding:12px;
  font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  color:#1c1c1c; font-size:14px; line-height:1.4;
}
.so-rd-card { background:#fff; border-radius:4px; overflow:hidden; }
.so-rd-banner { height:80px; background:linear-gradient(115deg,#cfd9e0,#a9b8c2); }
.so-rd-head { display:flex; align-items:flex-start; gap:12px; padding:0 20px 12px; }
.so-rd-av { margin-top:-28px; }
.so-rd-nm { font-size:20px; font-weight:700; line-height:24px; margin-top:8px; }
.so-rd-slug { font-size:14px; color:#7c7c7c; }
.so-rd-join {
  margin:12px 0 0 auto; height:32px; padding:0 20px; background:#0079d3; color:#fff;
  border:0; border-radius:9999px; flex:none;
  font-family:inherit; font-size:14px; font-weight:700; line-height:32px;
}
.so-rd-mem { display:flex; align-items:center; gap:6px; padding:0 20px 14px; font-size:12px; color:#7c7c7c; }
.so-rd-live { width:8px; height:8px; border-radius:50%; background:#46d160; display:block; }
.so-rd-post { display:flex; margin-top:12px; background:#fff; border-radius:4px; overflow:hidden; }
.so-rd-vote { width:40px; flex:none; padding:8px 0; background:#f8f9fa; text-align:center; color:#878a8c; }
.so-rd-vote svg { margin:0 auto; }
.so-rd-score { font-size:12px; font-weight:700; color:#1a1a1b; margin:4px 0; }
.so-rd-down { transform:rotate(180deg); }
.so-rd-body { padding:8px 8px 6px; min-width:0; }
.so-rd-line { display:flex; align-items:center; gap:4px; font-size:12px; color:#787c7e; }
.so-rd-line b { color:#1c1c1c; font-weight:700; }
.so-rd-title { margin:6px 0 8px; font-size:18px; font-weight:500; line-height:22px; color:#222; }
.so-rd-acts { display:flex; align-items:center; gap:14px; font-size:12px; font-weight:700; color:#878a8c; }
.so-rd-acts span { display:flex; align-items:center; gap:5px; }

/* ── Bluesky ───────────────────────────────────────────────── */
.so-bs {
  background:#fff; color:#0b0f14;
  font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:15px; line-height:20px;
}
.so-bs-banner { height:110px; background:linear-gradient(135deg,#c6dbef,#9fbdd8); }
.so-bs-body { padding:0 14px 12px; }
.so-bs-top { display:flex; align-items:flex-start; justify-content:space-between; }
.so-bs-av { margin-top:-42px; margin-bottom:8px; }
.so-bs-follow {
  margin-top:8px; height:34px; padding:0 16px; background:#0085ff; color:#fff;
  border:0; border-radius:9999px;
  font-family:inherit; font-size:15px; font-weight:600; line-height:34px;
}
.so-bs-nm { font-size:20px; font-weight:700; line-height:24px; }
.so-bs-at { font-size:15px; color:#42576c; }
.so-bs-bio { margin-top:10px; font-size:15px; }
.so-bs-counts { display:flex; gap:16px; margin-top:10px; font-size:15px; color:#42576c; }
.so-bs-counts b { color:#0b0f14; font-weight:700; }
.so-bs-tabs { display:flex; gap:20px; padding:0 14px; border-bottom:1px solid #e1e6eb; }
.so-bs-tab { padding:12px 0; font-size:15px; font-weight:600; color:#42576c; }
.so-bs-tab.so-bs-on { color:#0b0f14; box-shadow:inset 0 -3px 0 #0085ff; }

/* ── Mastodon ──────────────────────────────────────────────── */
.so-ms {
  background:#191b22; padding:10px; color:#fff;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size:15px; line-height:20px;
}
.so-ms-card { background:#282c37; border-radius:8px; overflow:hidden; }
.so-ms-hdr { height:110px; background:linear-gradient(135deg,#3d4455,#262a36); }
.so-ms-body { padding:0 14px 14px; }
.so-ms-top { display:flex; align-items:flex-start; justify-content:space-between; }
.so-ms-av { margin-top:-47px; margin-bottom:10px; }
.so-ms-follow {
  margin-top:10px; height:34px; padding:0 16px; background:#6364ff; color:#fff;
  border:0; border-radius:4px;
  font-family:inherit; font-size:15px; font-weight:700; line-height:34px;
}
.so-ms-nm { font-size:19px; font-weight:700; line-height:24px; }
.so-ms-at { font-size:15px; color:#9baec8; }
.so-ms-bio { margin-top:10px; font-size:15px; color:#d9e1e8; }
.so-ms-join { display:flex; align-items:center; gap:6px; margin-top:10px; font-size:13px; color:#9baec8; }
.so-ms-counts { display:flex; margin-top:12px; border-top:1px solid #393f4f; }
.so-ms-c { flex:1 1 0; padding:10px 0 0; }
.so-ms-c b { display:block; font-size:15px; font-weight:700; }
.so-ms-c span { font-size:12px; color:#9baec8; }

/* ── Twitch ────────────────────────────────────────────────── */
.so-tw {
  background:#1f1f23; padding:10px 0; color:#efeff1;
  font-family:Inter,Roobert,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size:13px; line-height:1.4;
}
.so-tw-h { padding:0 10px 8px; font-size:13px; font-weight:600; color:#efeff1; }
.so-tw-row { display:flex; align-items:center; gap:10px; height:42px; padding:0 10px; }
.so-tw-row.so-tw-act { background:#26262c; }
.so-tw-ring { padding:2px; border-radius:50%; background:#1f1f23; box-shadow:0 0 0 2px #9147ff; flex:none; }
.so-tw-blank { width:30px; height:30px; border-radius:50%; background:#3a3a3d; display:block; flex:none; }
.so-tw-nm { font-size:14px; font-weight:600; color:#efeff1; }
.so-tw-cat { font-size:12px; color:#adadb8; }
.so-tw-right { margin-left:auto; text-align:right; flex:none; }
.so-tw-v { display:flex; align-items:center; justify-content:flex-end; gap:5px; font-size:12px; color:#efeff1; }
.so-tw-dot { width:8px; height:8px; border-radius:50%; background:#eb0400; display:block; }
.so-tw-off { font-size:12px; color:#adadb8; }
.so-tw-row.so-tw-dim .so-tw-nm { color:#dedee3; }

/* ── size ladder ───────────────────────────────────────────── */
/* designed at the tile's own width so the scale factor is ~1 and every
   step renders at the size printed under it */
.so-lad { background:#fff; color:#111; padding:18px 20px 14px; }
.so-lad-row { display:flex; flex-wrap:nowrap; align-items:flex-end; justify-content:space-between;
              gap:12px; padding-bottom:12px; border-bottom:1px solid #e3e5e8; }
.so-lad-i { display:flex; flex-direction:column; align-items:center; gap:8px; }
.so-lad-cap { font:600 11px/1.2 ui-monospace,"SF Mono",Menlo,Consolas,monospace; color:#111; text-align:center; }
.so-lad-foot { margin-top:10px; font:10px/1.5 ui-monospace,"SF Mono",Menlo,Consolas,monospace; color:#6b7280; letter-spacing:.03em; text-transform:uppercase; }
  `);

  var GH_RING = '0 0 0 1px rgba(31,35,40,.15)';

  /* ── 1. GitHub profile sidebar ──────────────────────────────── */

  L.register({
    id: 'so-gh-profile',
    group: 'social',
    title: 'GitHub — profile sidebar',
    spec: 'AVATAR 260 PX',
    note: 'the biggest circle you get',
    width: 300,
    render: function (c) {
      return c.el('div', 'so-gh so-ghp', [
        c.logo(260, { shape: 'circle', ring: GH_RING }),
        c.el('div', 'so-ghp-name', c.brand),
        c.el('div', 'so-ghp-login', c.handle),
        c.el('div', 'so-ghp-bio', c.tagline),
        c.el('div', 'so-ghp-btn', 'Follow'),
        c.el('div', 'so-ghp-meta', [
          glyph('0 0 16 16', 16, 16, [D.ghPeople]),
          c.el('b', null, '1.2k'),
          document.createTextNode('followers'),
          c.el('span', 'so-ghp-sep', '·'),
          c.el('b', null, '18'),
          document.createTextNode('following')
        ])
      ]);
    }
  });

  /* ── 2. GitHub issue comment ────────────────────────────────── */

  L.register({
    id: 'so-gh-comment',
    group: 'social',
    title: 'GitHub — issue comment',
    spec: 'AVATAR 40 PX',
    note: 'grey header strip, 6 px box',
    width: 560,
    wide: true,
    render: function (c) {
      var box = c.el('div', 'so-ghc-box', [
        c.el('div', 'so-ghc-head', [
          c.el('b', null, c.brand),
          document.createTextNode('commented 2 days ago'),
          c.el('span', 'so-ghc-role', 'Owner')
        ]),
        c.el('div', 'so-ghc-body', [
          c.el('p', null, 'Reproduced on 2.4.1. The sidebar collapses one frame before the layout settles, so the header measures the old width and the mark lands 8 px low.'),
          c.el('div', 'so-ghc-ph', [ph('100%'), ph('96%'), ph('58%')])
        ]),
        c.el('div', 'so-ghc-react', c.el('span', 'so-ghc-pill', [
          document.createTextNode('👍'),
          c.el('span', null, '4')
        ]))
      ]);
      return c.el('div', 'so-gh so-ghc', c.el('div', 'so-ghc-wrap', [
        c.logo(40, { shape: 'circle', ring: GH_RING }),
        box
      ]));
    }
  });

  /* ── 3. GitHub repo contributors ────────────────────────────── */

  L.register({
    id: 'so-gh-contributors',
    group: 'social',
    title: 'GitHub — contributors row',
    spec: 'AVATAR 20 PX',
    note: 'yours first, in a crowd',
    width: 340,
    render: function (c) {
      var repo = String(c.brand).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'core';
      return c.el('div', 'so-gh so-ghr', [
        c.el('div', 'so-ghr-bar', [
          glyph('0 0 16 16', 22, 22, [D.ghMark]),
          c.el('span', 'so-ghr-crumb', [
            document.createTextNode(c.handle),
            c.el('span', 'so-ghr-slash', '/'),
            c.el('b', null, repo)
          ]),
          c.el('span', 'so-ghr-public', 'Public')
        ]),
        c.el('div', 'so-ghr-desc', c.tagline),
        c.el('div', 'so-ghr-stats', [
          c.el('span', null, [glyph('0 0 16 16', 14, 14, [D.ghStar]), c.el('b', null, '482'), document.createTextNode('stars')]),
          c.el('span', null, [glyph('0 0 16 16', 14, 14, [D.ghFork]), c.el('b', null, '37'), document.createTextNode('forks')])
        ]),
        c.el('div', 'so-ghr-h', [
          document.createTextNode('Contributors'),
          c.el('span', 'so-ghr-count', '18')
        ]),
        c.el('div', 'so-ghr-avs', [c.logo(20, { shape: 'circle', ring: GH_RING })].concat(blanks(5, 'so-ghr-blank'))),
        c.el('div', 'so-ghr-more', '+ 12 contributors')
      ]);
    }
  });

  /* ── 4. X profile header ────────────────────────────────────── */

  L.register({
    id: 'so-x-profile',
    group: 'social',
    title: 'X — profile header',
    spec: 'AVATAR 133 PX',
    note: '4 px white ring, 3:1 banner',
    width: 600,
    wide: true,
    render: function (c) {
      return c.el('div', 'so-x', [
        c.el('div', 'so-xp-banner'),
        c.el('div', 'so-xp-body', [
          c.el('div', 'so-xp-top', [
            c.el('div', 'so-xp-av', c.logo(133, { shape: 'circle', ring: '0 0 0 4px #fff' })),
            c.el('button', 'so-xp-follow', 'Follow')
          ]),
          c.el('div', 'so-xp-name', [
            document.createTextNode(c.brand),
            glyph('0 0 24 24', 20, 20, [D.xBadge], { fill: '#1d9bf0' })
          ]),
          c.el('div', 'so-xp-at', '@' + c.handle),
          c.el('div', 'so-xp-bio', c.tagline),
          c.el('div', 'so-xp-meta', [
            c.el('span', 'so-xp-link', [c.icon('link', 16), document.createTextNode(c.domain)]),
            c.el('span', null, [glyph('0 0 20 20', 16, 16, [D.cal], null, 'so-line'), document.createTextNode('Joined March 2024')])
          ]),
          c.el('div', 'so-xp-counts', [
            c.el('span', null, [c.el('b', null, '312'), document.createTextNode(' Following')]),
            c.el('span', null, [c.el('b', null, '1,248'), document.createTextNode(' Followers')])
          ])
        ])
      ]);
    }
  });

  /* ── 5. X timeline post ─────────────────────────────────────── */

  L.register({
    id: 'so-x-post',
    group: 'social',
    title: 'X — timeline post',
    spec: 'AVATAR 40 PX',
    note: 'the size that actually gets seen',
    width: 390,
    render: function (c) {
      function act(name, count) {
        return c.el('div', 'so-xt-act', [c.icon(name, 18), count ? document.createTextNode(count) : null]);
      }
      return c.el('div', 'so-x so-xt', c.el('div', 'so-xt-wrap', [
        c.logo(40, { shape: 'circle' }),
        c.el('div', 'kit-fill', [
          c.el('div', 'so-xt-head', [
            c.el('span', 'so-xt-nm', c.brand),
            glyph('0 0 24 24', 17, 17, [D.xBadge], { fill: '#1d9bf0' }),
            c.el('span', 'so-xt-mut', '@' + c.handle),
            c.el('span', 'so-xt-mut', '·'),
            c.el('span', 'so-xt-mut', '2h'),
            c.el('span', 'so-xt-dots', c.icon('dots', 18))
          ]),
          c.el('div', 'so-xt-body', 'Setup is down from eleven steps to four this morning, and the docs are generated from the same schema the installer reads.'),
          c.el('div', 'so-xt-acts', [
            act('comment', '12'),
            act('retweet', '34'),
            act('heart', '218'),
            act('share', '')
          ])
        ])
      ]));
    }
  });

  /* ── 6. LinkedIn company page ───────────────────────────────── */

  L.register({
    id: 'so-li-company',
    group: 'social',
    title: 'LinkedIn — company page',
    spec: 'LOGO 130 PX SQ',
    note: 'square, not a circle',
    width: 560,
    wide: true,
    render: function (c) {
      return c.el('div', 'so-li', [
        c.el('div', 'so-lic-cover'),
        c.el('div', 'so-lic-body', [
          c.el('div', 'so-lic-logo', c.logo(130, { shape: 'rounded', radius: 8, ring: '0 0 0 2px #fff' })),
          c.el('h1', 'so-lic-name', c.brand),
          c.el('div', 'so-lic-tag', c.tagline),
          c.el('div', 'so-lic-meta', 'Software Development · Ljubljana, Slovenia · 1,204 followers'),
          c.el('div', 'so-lic-acts', [
            c.el('button', 'so-lic-follow', [c.icon('plus', 16), document.createTextNode('Follow')]),
            c.el('button', 'so-lic-ghost', 'Visit website'),
            c.el('button', 'so-lic-more', 'More')
          ])
        ])
      ]);
    }
  });

  /* ── 7. LinkedIn feed post ──────────────────────────────────── */

  L.register({
    id: 'so-li-post',
    group: 'social',
    title: 'LinkedIn — feed post',
    spec: 'LOGO 48 PX SQ',
    note: '4 px corners, company slot',
    width: 400,
    render: function (c) {
      function act(node, label) {
        return c.el('div', 'so-lip-act', [node, document.createTextNode(label)]);
      }
      return c.el('div', 'so-li', [
        c.el('div', 'so-lip-head', [
          c.logo(48, { shape: 'rounded', radius: 4 }),
          c.el('div', 'kit-fill', [
            c.el('div', 'so-lip-nm', c.brand),
            c.el('div', 'so-lip-sub', '1,204 followers'),
            c.el('div', 'so-lip-time', [document.createTextNode('3d ·'), c.icon('globe', 12)])
          ]),
          c.el('div', 'so-lip-dots', c.icon('dots', 20))
        ]),
        c.el('div', 'so-lip-body', [
          c.el('div', null, 'We spent the quarter rewriting how a new team gets set up. Onboarding is four steps instead of eleven, and every screenshot in the guide is generated from the build.'),
          c.el('div', 'so-lip-more', [ph('180px'), c.el('span', 'so-lip-see', '…see more')])
        ]),
        c.el('div', 'so-lip-counts', [
          c.el('span', 'so-lip-rx', [
            c.el('span', 'so-lip-b', glyph('0 0 24 24', 11, 11, [D.thumb])),
            c.el('span', 'so-lip-r', c.icon('heart', 10, true))
          ]),
          c.el('span', 'so-lip-n', '38'),
          c.el('span', 'so-lip-right', '6 comments · 2 reposts')
        ]),
        c.el('div', 'so-lip-rule'),
        c.el('div', 'so-lip-acts', [
          act(glyph('0 0 24 24', 20, 20, [D.thumb], null, 'so-line'), 'Like'),
          act(c.icon('comment', 20), 'Comment'),
          act(c.icon('retweet', 20), 'Repost'),
          act(c.icon('send', 20), 'Send')
        ])
      ]);
    }
  });

  /* ── 8. Instagram profile ───────────────────────────────────── */

  L.register({
    id: 'so-ig-profile',
    group: 'social',
    title: 'Instagram — profile (mobile)',
    spec: 'AVATAR 86 PX',
    note: 'inside the story ring',
    width: 375,
    render: function (c) {
      function stat(n, label) {
        return c.el('div', 'so-ig-stat', [c.el('b', null, n), c.el('span', null, label)]);
      }
      var cells = blanks(6, 'so-ig-cell');
      return c.el('div', 'so-ig', [
        c.el('div', 'so-ig-bar', [
          c.el('span', 'so-ig-h', c.handle),
          c.icon('chevron-down', 14),
          c.el('span', 'so-ig-barr', [c.icon('plus', 22), c.icon('menu', 22)])
        ]),
        c.el('div', 'so-ig-head', [
          c.el('div', 'so-ig-ring', c.el('div', 'so-ig-ringin', c.logo(86, { shape: 'circle' }))),
          c.el('div', 'so-ig-stats', [
            stat('142', 'posts'),
            stat('4,318', 'followers'),
            stat('260', 'following')
          ])
        ]),
        c.el('div', 'so-ig-nm', c.brand),
        c.el('div', 'so-ig-bio', c.tagline),
        c.el('div', 'so-ig-url', c.domain),
        c.el('div', 'so-ig-btns', [
          c.el('button', 'so-ig-btn', 'Edit profile'),
          c.el('button', 'so-ig-btn', 'Share profile')
        ]),
        c.el('div', 'so-ig-tabs', [
          c.el('div', 'so-ig-tab so-ig-on', c.icon('grid', 22)),
          c.el('div', 'so-ig-tab', c.icon('user', 22))
        ]),
        c.el('div', 'so-ig-grid', cells)
      ]);
    }
  });

  /* ── 9. YouTube channel header ──────────────────────────────── */

  L.register({
    id: 'so-yt-channel',
    group: 'social',
    title: 'YouTube — channel header',
    spec: 'AVATAR 80 PX',
    note: 'banner cropped 6:1',
    width: 620,
    wide: true,
    render: function (c) {
      function tab(t, on) { return c.el('div', 'so-ytc-tab' + (on ? ' so-ytc-on' : ''), t); }
      return c.el('div', 'so-yt so-ytc', [
        c.el('div', 'so-ytc-banner'),
        c.el('div', 'so-ytc-row', [
          c.logo(80, { shape: 'circle' }),
          c.el('div', 'kit-fill', [
            c.el('div', 'so-ytc-nm', c.brand),
            c.el('div', 'so-ytc-meta', '@' + c.handle + ' · 12.4K subscribers · 87 videos'),
            c.el('div', 'so-ytc-desc', [
              document.createTextNode(c.tagline + ' '),
              c.el('b', null, '...more')
            ])
          ]),
          c.el('button', 'so-ytc-sub', 'Subscribe')
        ]),
        c.el('div', 'so-ytc-tabs', [
          tab('Home', true), tab('Videos'), tab('Shorts'), tab('Playlists'), tab('About')
        ])
      ]);
    }
  });

  /* ── 10. YouTube subscriptions row ──────────────────────────── */

  L.register({
    id: 'so-yt-row',
    group: 'social',
    title: 'YouTube — subscriptions row',
    spec: 'AVATAR 36 PX',
    note: 'next to a 168 × 94 thumbnail',
    width: 420,
    render: function (c) {
      return c.el('div', 'so-yt so-ytr', [
        c.el('div', 'so-ytr-thumb', c.el('span', 'so-ytr-dur', '8:42')),
        c.el('div', 'kit-fill', [
          c.el('div', 'so-ytr-title kit-clamp2', 'Rebuilding onboarding in a week — what we cut, and the two things we kept'),
          c.el('div', 'so-ytr-by', [
            c.logo(36, { shape: 'circle' }),
            c.el('div', 'so-ytr-meta kit-ell', c.brand + ' · 12K views · 3 days ago')
          ])
        ])
      ]);
    }
  });

  /* ── 11. Reddit subreddit ───────────────────────────────────── */

  L.register({
    id: 'so-rd-sub',
    group: 'social',
    title: 'Reddit — subreddit header',
    spec: 'AVATAR 72 / 20 PX',
    note: 'header circle and post row',
    width: 420,
    render: function (c) {
      var up = glyph('0 0 20 20', 14, 14, [D.rdVote]);
      var down = glyph('0 0 20 20', 14, 14, [D.rdVote], null, 'so-fill so-rd-down');
      return c.el('div', 'so-rd', [
        c.el('div', 'so-rd-card', [
          c.el('div', 'so-rd-banner'),
          c.el('div', 'so-rd-head', [
            c.el('div', 'so-rd-av', c.logo(72, { shape: 'circle', ring: '0 0 0 4px #fff' })),
            c.el('div', 'kit-fill', [
              c.el('div', 'so-rd-nm', c.brand),
              c.el('div', 'so-rd-slug', 'r/' + c.handle)
            ]),
            c.el('button', 'so-rd-join', 'Join')
          ]),
          c.el('div', 'so-rd-mem', [
            document.createTextNode('12.4k members'),
            c.el('span', 'so-rd-live'),
            document.createTextNode('84 online')
          ])
        ]),
        c.el('div', 'so-rd-post', [
          c.el('div', 'so-rd-vote', [up, c.el('div', 'so-rd-score', '218'), down]),
          c.el('div', 'so-rd-body kit-fill', [
            c.el('div', 'so-rd-line', [
              c.logo(20, { shape: 'circle' }),
              c.el('b', null, 'r/' + c.handle),
              document.createTextNode('· Posted by u/' + c.person + ' 5h')
            ]),
            c.el('div', 'so-rd-title', 'Weekly build thread — what shipped, what slipped'),
            c.el('div', 'so-rd-acts', [
              c.el('span', null, [c.icon('comment', 16), document.createTextNode('37 Comments')]),
              c.el('span', null, [c.icon('share', 16), document.createTextNode('Share')]),
              c.el('span', null, [c.icon('bookmark', 16), document.createTextNode('Save')])
            ])
          ])
        ])
      ]);
    }
  });

  /* ── 12. Bluesky profile ────────────────────────────────────── */

  L.register({
    id: 'so-bsky-profile',
    group: 'social',
    title: 'Bluesky — profile card',
    spec: 'AVATAR 84 PX',
    note: 'domain as the handle',
    width: 380,
    render: function (c) {
      return c.el('div', 'so-bs', [
        c.el('div', 'so-bs-banner'),
        c.el('div', 'so-bs-body', [
          c.el('div', 'so-bs-top', [
            c.el('div', 'so-bs-av', c.logo(84, { shape: 'circle', ring: '0 0 0 2px #fff' })),
            c.el('button', 'so-bs-follow', 'Follow')
          ]),
          c.el('div', 'so-bs-nm', c.brand),
          c.el('div', 'so-bs-at', '@' + c.domain),
          c.el('div', 'so-bs-bio', c.tagline),
          c.el('div', 'so-bs-counts', [
            c.el('span', null, [c.el('b', null, '1,248'), document.createTextNode(' followers')]),
            c.el('span', null, [c.el('b', null, '312'), document.createTextNode(' following')]),
            c.el('span', null, [c.el('b', null, '96'), document.createTextNode(' posts')])
          ])
        ]),
        c.el('div', 'so-bs-tabs', [
          c.el('div', 'so-bs-tab so-bs-on', 'Posts'),
          c.el('div', 'so-bs-tab', 'Replies'),
          c.el('div', 'so-bs-tab', 'Media'),
          c.el('div', 'so-bs-tab', 'Likes')
        ])
      ]);
    }
  });

  /* ── 13. Mastodon profile ───────────────────────────────────── */

  L.register({
    id: 'so-mastodon-profile',
    group: 'social',
    title: 'Mastodon — profile card',
    spec: 'AVATAR 94 PX SQ',
    note: 'rounded square, dark UI',
    width: 400,
    render: function (c) {
      function count(n, label) {
        return c.el('div', 'so-ms-c', [c.el('b', null, n), c.el('span', null, label)]);
      }
      return c.el('div', 'so-ms', c.el('div', 'so-ms-card', [
        c.el('div', 'so-ms-hdr'),
        c.el('div', 'so-ms-body', [
          c.el('div', 'so-ms-top', [
            c.el('div', 'so-ms-av', c.logo(94, { shape: 'rounded', radius: 8, ring: '0 0 0 4px #282c37' })),
            c.el('button', 'so-ms-follow', 'Follow')
          ]),
          c.el('div', 'so-ms-nm', c.brand),
          c.el('div', 'so-ms-at', '@' + c.handle + '@mastodon.social'),
          c.el('div', 'so-ms-bio', c.tagline),
          c.el('div', 'so-ms-join', [
            glyph('0 0 20 20', 14, 14, [D.cal], null, 'so-line'),
            document.createTextNode('Joined March 2024')
          ]),
          c.el('div', 'so-ms-counts', [
            count('96', 'Posts'),
            count('312', 'Following'),
            count('1,248', 'Followers')
          ])
        ])
      ]));
    }
  });

  /* ── 14. Twitch followed channels ───────────────────────────── */

  L.register({
    id: 'so-twitch-sidebar',
    group: 'social',
    title: 'Twitch — followed channels',
    spec: 'AVATAR 30 PX',
    note: 'live ring, dark rail',
    width: 240,
    render: function (c) {
      var others = [
        ['northgate_dev', 'Software and Game Development', '1.2K'],
        ['kaya_builds', 'Science & Technology', '684'],
        ['lowpolylab', 'Game Development', '312'],
        ['mira_codes', 'Just Chatting', null],
        ['terminal_hours', 'Software and Game Development', null]
      ];

      var rows = others.map(function (o) {
        return c.el('div', 'so-tw-row so-tw-dim', [
          c.el('span', 'so-tw-blank'),
          c.el('div', 'kit-fill', [
            c.el('div', 'so-tw-nm kit-ell', o[0]),
            c.el('div', 'so-tw-cat kit-ell', o[1])
          ]),
          c.el('div', 'so-tw-right', o[2]
            ? c.el('div', 'so-tw-v', [c.el('span', 'so-tw-dot'), document.createTextNode(o[2])])
            : c.el('div', 'so-tw-off', 'Offline'))
        ]);
      });

      var mine = c.el('div', 'so-tw-row so-tw-act', [
        c.el('div', 'so-tw-ring', c.logo(30, { shape: 'circle' })),
        c.el('div', 'kit-fill', [
          c.el('div', 'so-tw-nm kit-ell', c.brand),
          c.el('div', 'so-tw-cat kit-ell', 'Software and Game Development')
        ]),
        c.el('div', 'so-tw-right', c.el('div', 'so-tw-v', [
          c.el('span', 'so-tw-dot'),
          document.createTextNode('2.4K')
        ]))
      ]);

      return c.el('div', 'so-tw', [c.el('div', 'so-tw-h', 'Followed Channels'), mine].concat(rows));
    }
  });

  /* ── 15. avatar size ladder ─────────────────────────────────── */

  L.register({
    id: 'so-avatar-ladder',
    group: 'social',
    title: 'Avatar ladder — 16 to 96 px',
    spec: '16 → 96 PX',
    note: 'true size — every step a feed asks for',
    width: 700,
    wide: true,
    render: function (c) {
      var steps = [16, 20, 24, 32, 40, 48, 64, 96];
      var row = c.el('div', 'so-lad-row', steps.map(function (s) {
        return c.el('div', 'so-lad-i', [
          c.logo(s, { shape: 'circle' }),
          c.el('div', 'so-lad-cap', String(s))
        ]);
      }));
      return c.el('div', 'so-lad', [
        row,
        c.el('div', 'so-lad-foot', '16 tab · 20 comment · 24 list · 32 chat · 40 feed · 48 card · 64 tile · 96 profile')
      ]);
    }
  });
})();
