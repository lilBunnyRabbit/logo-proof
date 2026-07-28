/* js/scenes/messaging.js — chat & messaging: the 32–40 px world.
   Chat-list scale and in-conversation scale for WhatsApp, iMessage, Telegram,
   Slack, Discord, plus the notification surfaces that reuse the same crop. */
(function () {
  'use strict';

  var L = window.LogoLab;
  var E = L.el;
  var NS = 'http://www.w3.org/2000/svg';

  /* ─────────────────────────────────────────────────────────────
     CSS — every class in this file starts with .ms-
     ───────────────────────────────────────────────────────────── */

  L.css(`
/* shared atoms */
.ms-fa { flex:none; display:grid; place-items:center; overflow:hidden;
         font-weight:600; color:#fff; letter-spacing:.02em; background:#c9ced3; }
.ms-dot { flex:none; border-radius:50%; display:block; }
.ms-avw { position:relative; flex:none; }
.ms-avw > .ms-dot { position:absolute; }
.ms-sv { display:block; flex:none; }
.ms-ph { display:block; }

/* iOS status bar */
.ms-sb { height:44px; display:flex; align-items:center; justify-content:space-between;
         padding:0 20px 0 27px; font-size:15px; font-weight:600; letter-spacing:-.2px; }
.ms-sb-r { display:flex; align-items:center; gap:6px; }
.ms-sb-sig { display:flex; align-items:flex-end; gap:2px; height:11px; }
.ms-sb-sig i { display:block; width:3px; border-radius:1px; background:currentColor; }
.ms-sb-bat { position:relative; width:25px; height:12px; padding:1.5px;
             border:1px solid currentColor; border-radius:3.5px; opacity:.85; }
.ms-sb-bat i { display:block; height:100%; width:74%; border-radius:1.5px; background:currentColor; }
.ms-sb-bat::after { content:''; position:absolute; right:-3px; top:3.5px; width:2px; height:4px;
                    border-radius:0 2px 2px 0; background:currentColor; opacity:.4; }

/* ── 1 · WhatsApp chat list ──────────────────────────────────── */
.ms-wa { background:#fff; color:#000;
  font-family:-apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }
.ms-wa-top { display:flex; align-items:center; justify-content:space-between;
             height:40px; padding:0 16px; color:#007aff; font-size:17px; }
.ms-wa-top .ms-wa-ic { display:flex; align-items:center; gap:20px; }
.ms-wa-h1 { font-size:34px; font-weight:700; letter-spacing:-.8px; padding:0 16px 6px; }
.ms-wa-sr { margin:0 16px 10px; height:36px; border-radius:10px; background:#e9e9eb;
            display:flex; align-items:center; gap:6px; padding:0 8px; color:#8e8e93; font-size:17px; }
.ms-wa-chips { display:flex; gap:8px; padding:0 16px 12px; }
.ms-wa-chip { height:30px; padding:0 13px; border-radius:15px; background:#f0f2f5;
              color:#3b4a54; font-size:14px; font-weight:500; display:flex; align-items:center; }
.ms-wa-chip.ms-on { background:#d8f2e3; color:#0f7a5a; }
.ms-wa-row { display:flex; align-items:center; gap:12px; padding-left:16px; }
.ms-wa-bd { flex:1 1 auto; min-width:0; padding:11px 16px 11px 0; border-bottom:1px solid #e8e8ea; }
.ms-wa-row:last-child .ms-wa-bd { border-bottom:0; }
.ms-wa-l1 { display:flex; align-items:baseline; gap:8px; }
.ms-wa-nm { font-size:17px; letter-spacing:-.25px; flex:1 1 auto; min-width:0; }
.ms-wa-tm { font-size:14px; color:#8e8e93; flex:none; }
.ms-wa-l2 { display:flex; align-items:center; gap:8px; margin-top:3px; min-height:20px; color:#8e8e93; }
.ms-wa-mg { font-size:15px; letter-spacing:-.1px; flex:1 1 auto; min-width:0; }
.ms-wa-pill { flex:none; min-width:21px; height:21px; padding:0 6px; border-radius:11px;
              background:#25d366; color:#fff; font-size:13px; font-weight:600;
              display:flex; align-items:center; justify-content:center; }
/* dark theme */
.ms-wa.ms-dk { background:#0b141a; color:#e9edef; }
.ms-wa.ms-dk .ms-wa-sr { background:#202c33; color:#8696a0; }
.ms-wa.ms-dk .ms-wa-chip { background:#202c33; color:#8696a0; }
.ms-wa.ms-dk .ms-wa-chip.ms-on { background:#103529; color:#00a884; }
.ms-wa.ms-dk .ms-wa-bd { border-bottom-color:#222d34; }
.ms-wa.ms-dk .ms-wa-tm, .ms-wa.ms-dk .ms-wa-l2 { color:#8696a0; }
.ms-wa.ms-dk .ms-wa-pill { background:#00a884; color:#111b21; }

/* ── 2 · WhatsApp conversation ───────────────────────────────── */
.ms-wc { font-family:"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif; color:#111b21; }
.ms-wc-hd { height:59px; background:#f0f2f5; display:flex; align-items:center; gap:12px; padding:0 16px; }
.ms-wc-nm { font-size:16px; color:#111b21; }
.ms-wc-on { font-size:13px; color:#667781; margin-top:1px; }
.ms-wc-ic { display:flex; align-items:center; gap:22px; color:#54656f; margin-left:auto; }
.ms-wc-bd { position:relative; padding:12px 32px 14px; background-color:#efeae2;
  background-image:
    radial-gradient(circle at 14px 12px, rgba(11,20,26,.05) 1.7px, transparent 1.8px),
    radial-gradient(circle at 52px 44px, rgba(11,20,26,.04) 1.3px, transparent 1.4px),
    radial-gradient(circle at 34px 70px, rgba(11,20,26,.035) 2.1px, transparent 2.2px);
  background-size:78px 96px, 78px 96px, 78px 96px; }
.ms-wc-day { display:flex; justify-content:center; margin-bottom:12px; }
.ms-wc-day span { background:#fff; color:#54656f; font-size:12.5px; text-transform:uppercase;
  letter-spacing:.02em; padding:5px 12px; border-radius:7.5px; box-shadow:0 1px .5px rgba(11,20,26,.13); }
.ms-wc-r { display:flex; margin-bottom:10px; }
.ms-wc-r.ms-out { justify-content:flex-end; }
.ms-wc-b { position:relative; max-width:76%; padding:6px 7px 8px 9px; border-radius:7.5px;
  font-size:14.2px; line-height:19px; box-shadow:0 1px .5px rgba(11,20,26,.13); }
.ms-wc-b.ms-in { background:#fff; border-top-left-radius:0; }
.ms-wc-b.ms-out { background:#d9fdd3; border-top-right-radius:0; }
.ms-wc-b.ms-in::before { content:''; position:absolute; top:0; left:-8px; width:0; height:0;
  border-style:solid; border-width:0 8px 8px 0; border-color:transparent #fff transparent transparent; }
.ms-wc-b.ms-out::before { content:''; position:absolute; top:0; right:-8px; width:0; height:0;
  border-style:solid; border-width:0 0 8px 8px; border-color:transparent transparent transparent #d9fdd3; }
.ms-wc-pad { display:inline-block; width:62px; height:1px; }
.ms-wc-meta { position:absolute; right:8px; bottom:5px; display:flex; align-items:center; gap:3px;
  font-size:11px; line-height:15px; color:#667781; }
.ms-wc-cmp { height:62px; background:#f0f2f5; display:flex; align-items:center; gap:14px; padding:0 16px; color:#54656f; }
.ms-wc-inp { flex:1 1 auto; height:42px; border-radius:8px; background:#fff; display:flex;
  align-items:center; padding:0 12px; font-size:15px; color:#8696a0; }

/* ── 3 · iMessage list ───────────────────────────────────────── */
.ms-il { background:#fff; color:#000;
  font-family:-apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }
.ms-il-top { display:flex; align-items:center; justify-content:space-between;
             height:40px; padding:0 16px; color:#007aff; }
.ms-il-h1 { font-size:34px; font-weight:700; letter-spacing:-.8px; padding:0 16px 8px; }
.ms-il-sr { margin:0 16px 8px; height:36px; border-radius:10px; background:#e3e3e8;
  display:flex; align-items:center; gap:6px; padding:0 8px; color:#8e8e93; font-size:17px; }
.ms-il-row { display:flex; align-items:center; gap:10px; padding-left:8px; }
.ms-il-un { flex:none; width:18px; display:flex; justify-content:center; }
.ms-il-chev { color:#c4c4c6; align-self:center; }
.ms-il-bd { flex:1 1 auto; min-width:0; padding:8px 16px 9px 0; border-bottom:1px solid #c6c6c8; }
.ms-il-row:last-child .ms-il-bd { border-bottom:0; }
.ms-il-l1 { display:flex; align-items:baseline; gap:6px; }
.ms-il-nm { font-size:16px; font-weight:600; letter-spacing:-.3px; flex:1 1 auto; min-width:0; }
.ms-il-tm { font-size:15px; color:#8a8a8e; flex:none; letter-spacing:-.2px; }
.ms-il-pv { font-size:15px; line-height:20px; color:#8a8a8e; letter-spacing:-.2px; margin-top:1px; }

/* ── 4 · iMessage conversation ───────────────────────────────── */
.ms-ic { background:#fff; color:#000;
  font-family:-apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }
.ms-ic-hd { position:relative; background:#f9f9f9; border-bottom:1px solid #d4d4d6;
  padding:2px 0 8px; display:flex; flex-direction:column; align-items:center; }
.ms-ic-back { position:absolute; left:10px; top:16px; display:flex; align-items:center;
  gap:2px; color:#007aff; font-size:17px; }
.ms-ic-cam { position:absolute; right:16px; top:16px; color:#007aff; }
.ms-ic-who { font-size:12px; letter-spacing:-.1px; margin-top:4px; display:flex; align-items:center; gap:3px; }
.ms-ic-bd { padding:10px 14px 4px; }
.ms-ic-stamp { text-align:center; font-size:11px; color:#8a8a8e; padding:6px 0 10px; }
.ms-ic-stamp b { font-weight:600; color:#6d6d72; }
/* z-index:0 makes the row a stacking context so the z-index:-1 tails
   sit above the scene background but under the bubble */
.ms-ic-r { position:relative; z-index:0; display:flex; margin-bottom:4px; }
.ms-ic-r.ms-out { justify-content:flex-end; }
.ms-ic-b { position:relative; max-width:255px; padding:7px 13px 8px; border-radius:18px;
  font-size:17px; line-height:22px; letter-spacing:-.3px; }
.ms-ic-b.ms-in { background:#e9e9eb; color:#000; }
.ms-ic-b.ms-out { background:#007aff; color:#fff; }
.ms-ic-b::before, .ms-ic-b::after { content:''; position:absolute; z-index:-1;
  bottom:-2px; width:11px; height:16px; }
.ms-ic-b.ms-in::before { left:-6px; background:#e9e9eb; border-bottom-right-radius:13px 11px; }
.ms-ic-b.ms-in::after { left:-11px; background:#fff; border-bottom-right-radius:8px; }
.ms-ic-b.ms-out::before { right:-6px; background:#007aff; border-bottom-left-radius:13px 11px; }
.ms-ic-b.ms-out::after { right:-11px; background:#fff; border-bottom-left-radius:8px; }
.ms-ic-del { text-align:right; font-size:11px; color:#8a8a8e; padding:2px 4px 8px; }
.ms-ic-cmp { display:flex; align-items:center; gap:10px; padding:8px 12px 14px; }
.ms-ic-plus { width:32px; height:32px; border-radius:50%; background:#e9e9eb; color:#8a8a8e;
  display:grid; place-items:center; flex:none; }
.ms-ic-inp { flex:1 1 auto; height:34px; border:1px solid #d1d1d6; border-radius:17px;
  display:flex; align-items:center; justify-content:space-between; padding:0 8px 0 13px;
  font-size:17px; color:#a3a3a8; letter-spacing:-.3px; }

/* ── 5 · Telegram chat list ──────────────────────────────────── */
.ms-tg { background:#fff; color:#000;
  font-family:"Open Sans","Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
.ms-tg-top { display:flex; align-items:center; gap:10px; height:54px; padding:0 12px; }
.ms-tg-sr { flex:1 1 auto; height:32px; border-radius:16px; background:#f1f2f4;
  display:flex; align-items:center; gap:6px; padding:0 10px; color:#a8a8a8; font-size:14px; }
.ms-tg-row { display:flex; align-items:center; gap:11px; padding:11px; }
.ms-tg-bd { flex:1 1 auto; min-width:0; }
.ms-tg-l1 { display:flex; align-items:baseline; gap:8px; }
.ms-tg-nm { font-size:15px; font-weight:500; flex:1 1 auto; min-width:0; }
.ms-tg-tm { font-size:12px; color:#a8a8a8; flex:none; }
.ms-tg-l2 { display:flex; align-items:center; gap:8px; margin-top:3px; min-height:19px; color:#707579; }
.ms-tg-mg { font-size:14px; flex:1 1 auto; min-width:0; }
.ms-tg-pre { color:#3390ec; }
.ms-tg-badge { flex:none; min-width:19px; height:19px; padding:0 5px; border-radius:10px;
  background:#40a7e3; color:#fff; font-size:12px; font-weight:600;
  display:flex; align-items:center; justify-content:center; }
.ms-tg-badge.ms-mute { background:#c7c7c7; }

/* ── 6 · Slack sidebar ───────────────────────────────────────── */
.ms-sl { display:flex; font-family:Lato,"Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-sl-side { width:260px; flex:none; background:#3f0e40; color:rgba(255,255,255,.7); padding-bottom:14px; }
.ms-sl-ws { display:flex; align-items:center; gap:10px; height:56px; padding:0 16px; }
.ms-sl-wn { font-size:15px; font-weight:900; color:#fff; letter-spacing:-.2px; }
.ms-sl-new { margin-left:auto; width:36px; height:36px; border-radius:50%; background:#fff;
  color:#3f0e40; display:grid; place-items:center; flex:none; }
.ms-sl-me { display:flex; align-items:center; gap:8px; padding:0 16px 12px; font-size:15px; color:rgba(255,255,255,.7); }
.ms-sl-item { display:flex; align-items:center; gap:10px; height:28px; padding:0 16px;
  font-size:15px; color:rgba(255,255,255,.7); }
.ms-sl-item.ms-unread { color:#fff; font-weight:700; }
.ms-sl-item.ms-on { background:#1164a3; color:#fff; }
.ms-sl-sec { display:flex; align-items:center; gap:8px; height:28px; padding:0 16px;
  margin-top:12px; font-size:15px; color:rgba(255,255,255,.7); }
.ms-sl-badge { margin-left:auto; background:#cd2553; color:#fff; font-size:12px; font-weight:700;
  min-width:19px; height:19px; border-radius:10px; padding:0 6px;
  display:flex; align-items:center; justify-content:center; }
.ms-sl-tag { background:rgba(255,255,255,.16); color:#fff; font-size:10px; font-weight:700;
  letter-spacing:.02em; border-radius:2px; padding:1px 4px; }
.ms-sl-canvas { flex:1 1 auto; background:#fff; overflow:hidden; }
.ms-sl-ch { height:56px; border-bottom:1px solid #e2e2e2; display:flex; align-items:center;
  padding:0 12px; font-size:18px; font-weight:900; color:#1d1c1d; white-space:nowrap; }
.ms-sl-cbody { padding:14px 12px; color:#1d1c1d; }

/* ── 7 · Slack message row ───────────────────────────────────── */
.ms-sm { background:#fff; color:#1d1c1d; padding:12px 0 16px;
  font-family:Lato,"Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-sm-row { display:flex; padding:8px 20px; }
.ms-sm-row.ms-hover { background:#f8f8f8; }
.ms-sm-bd { flex:1 1 auto; min-width:0; margin-left:8px; }
.ms-sm-h { display:flex; align-items:baseline; gap:8px; }
.ms-sm-nm { font-size:15px; font-weight:900; color:#1d1c1d; letter-spacing:-.1px; }
.ms-sm-tag { background:#e8e8e8; color:#616061; font-size:10px; font-weight:700; letter-spacing:.02em;
  border-radius:2px; padding:1px 4px; position:relative; top:-1px; }
.ms-sm-tm { font-size:12px; color:#616061; }
.ms-sm-tx { font-size:15px; line-height:22px; color:#1d1c1d; margin-top:2px; }
.ms-sm-rx { display:flex; gap:8px; margin-top:8px; }
.ms-sm-pill { display:flex; align-items:center; gap:6px; height:24px; padding:0 8px; border-radius:12px;
  background:#e8f5fa; border:1px solid #1264a3; font-size:12px; font-weight:700; color:#1264a3; }
.ms-sm-pill.ms-add { background:#fff; border:1px solid #ddd; color:#616061; padding:0 9px; }
.ms-sm-th { display:flex; align-items:center; gap:8px; margin-top:8px; }
.ms-sm-thn { font-size:13px; font-weight:700; color:#1264a3; }
.ms-sm-tha { font-size:13px; color:#616061; }
.ms-sm-cont { display:flex; padding:2px 20px 2px 64px; align-items:center; }

/* ── 8 · Slack workspace switcher ────────────────────────────── */
.ms-sw { display:flex; font-family:Lato,"Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-sw-rail { width:64px; flex:none; background:#2c0a2d; padding:14px 0 12px;
  display:flex; flex-direction:column; align-items:center; gap:14px; }
.ms-sw-slot { position:relative; width:64px; display:flex; justify-content:center; }
.ms-sw-ind { position:absolute; left:0; top:5px; width:3px; height:26px;
  border-radius:0 3px 3px 0; background:#fff; }
.ms-sw-nb { position:absolute; top:-4px; right:8px; min-width:18px; height:18px; padding:0 5px;
  border-radius:9px; background:#cd2553; color:#fff; font-size:11px; font-weight:700;
  display:flex; align-items:center; justify-content:center; box-shadow:0 0 0 2px #2c0a2d; }
.ms-sw-add { width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,.1);
  color:rgba(255,255,255,.75); display:grid; place-items:center; }
.ms-sw-side { flex:1 1 auto; background:#3f0e40; color:rgba(255,255,255,.7); padding:0 16px 16px; }
.ms-sw-ws { display:flex; align-items:center; gap:8px; height:56px; }
.ms-sw-wn { font-size:15px; font-weight:900; color:#fff; }
.ms-sw-sub { font-size:13px; color:rgba(255,255,255,.7); display:flex; align-items:center; gap:6px; }
.ms-sw-rows { margin-top:18px; color:#fff; }

/* ── 9 · Discord server rail ─────────────────────────────────── */
.ms-dr { display:flex; font-family:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-dr-rail { width:72px; flex:none; background:#1e1f22; padding:12px 0;
  display:flex; flex-direction:column; align-items:center; gap:8px; }
.ms-dr-slot { position:relative; width:72px; display:flex; justify-content:center; }
.ms-dr-ind { position:absolute; left:0; top:50%; width:4px; margin-top:-20px; height:40px;
  border-radius:0 4px 4px 0; background:#fff; }
.ms-dr-ind.ms-mini { height:8px; margin-top:-4px; }
.ms-dr-home { width:48px; height:48px; border-radius:16px; background:#5865f2; color:#fff;
  display:grid; place-items:center; }
.ms-dr-hr { width:32px; height:2px; border-radius:1px; background:#35363c; margin:2px 0; }
.ms-dr-add { width:48px; height:48px; border-radius:50%; background:#313338; color:#23a55a;
  display:grid; place-items:center; }
.ms-dr-side { width:240px; flex:none; background:#2b2d31; display:flex; flex-direction:column; }
.ms-dr-hd { height:48px; display:flex; align-items:center; padding:0 16px; gap:8px;
  font-size:15px; font-weight:600; color:#f2f3f5; box-shadow:0 1px 0 rgba(4,4,5,.2); }
.ms-dr-cat { padding:16px 8px 4px 16px; font-size:12px; font-weight:600; letter-spacing:.02em;
  text-transform:uppercase; color:#949ba4; }
.ms-dr-ch { position:relative; display:flex; align-items:center; gap:6px; height:32px; margin:0 8px;
  padding:0 8px; border-radius:4px; color:#80848e; font-size:16px; }
.ms-dr-ch.ms-unread { color:#f2f3f5; font-weight:500; }
.ms-dr-ch.ms-on { background:#404249; color:#fff; }
.ms-dr-pip { position:absolute; left:-8px; width:8px; height:8px; border-radius:0 4px 4px 0; background:#fff; }
.ms-dr-user { margin-top:auto; height:52px; background:#232428; display:flex; align-items:center;
  gap:8px; padding:0 8px; }
.ms-dr-un { font-size:14px; font-weight:600; color:#f2f3f5; line-height:1.2; }
.ms-dr-us { font-size:12px; color:#b5bac1; line-height:1.2; }
.ms-dr-uic { margin-left:auto; display:flex; gap:4px; color:#b5bac1; }

/* ── 10 · Discord message row ────────────────────────────────── */
.ms-dm { background:#313338; padding:16px 0 20px;
  font-family:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-dm-wrap { position:relative; background:#2e3035; padding:2px 0 8px; }
.ms-dm-rep { position:relative; display:flex; align-items:center; gap:6px;
  height:22px; padding:0 16px 0 72px; color:#b5bac1; font-size:14px; }
.ms-dm-rep::before { content:''; position:absolute; left:35px; bottom:6px; width:33px; height:12px;
  border-left:2px solid #4e5058; border-top:2px solid #4e5058; border-top-left-radius:8px; }
.ms-dm-rn { font-size:14px; font-weight:500; }
.ms-dm-rt { font-size:14px; color:#b5bac1; min-width:0; }
.ms-dm-row { display:flex; padding:2px 16px; }
.ms-dm-bd { flex:1 1 auto; min-width:0; margin-left:16px; }
.ms-dm-h { display:flex; align-items:center; gap:6px; }
.ms-dm-nm { font-size:16px; font-weight:500; letter-spacing:-.1px; }
.ms-dm-tag { background:#5865f2; color:#fff; font-size:10px; font-weight:500; line-height:15px;
  border-radius:3px; padding:0 4px; height:15px; }
.ms-dm-tm { font-size:12px; color:#949ba4; margin-left:2px; }
.ms-dm-tx { font-size:16px; line-height:22px; color:#dbdee1; margin-top:1px; }
.ms-dm-bar { position:absolute; top:-16px; right:16px; height:32px; display:flex; align-items:center;
  gap:2px; padding:0 4px; background:#313338; border:1px solid #2e3035; border-radius:8px;
  box-shadow:0 0 0 1px rgba(4,4,5,.15), 0 4px 8px rgba(0,0,0,.2); color:#b5bac1; }
.ms-dm-bar i { display:grid; place-items:center; width:28px; height:28px; }

/* ── 11 · Discord member list ────────────────────────────────── */
.ms-dl { display:flex; font-family:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-dl-chat { flex:1 1 auto; background:#313338; padding:16px 12px; }
.ms-dl-panel { width:240px; flex:none; background:#2b2d31; padding-bottom:16px; }
.ms-dl-h { padding:24px 8px 4px 16px; font-size:12px; font-weight:600; letter-spacing:.02em;
  text-transform:uppercase; color:#949ba4; }
.ms-dl-row { display:flex; align-items:center; gap:12px; height:42px; margin:0 8px; padding:0 8px;
  border-radius:4px; }
.ms-dl-row.ms-on { background:#35373c; }
.ms-dl-nm { font-size:16px; color:#b5bac1; font-weight:500; }
.ms-dl-nm.ms-me { color:#f2f3f5; }
.ms-dl-tag { background:#5865f2; color:#fff; font-size:10px; font-weight:500; line-height:15px;
  border-radius:3px; padding:0 4px; }
.ms-dl-off { opacity:.3; }

/* ── 12 · Discord invite card ────────────────────────────────── */
.ms-di { background:#313338; padding:16px;
  font-family:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif; }
.ms-di-card { background:#2b2d31; border-radius:4px; padding:16px; }
.ms-di-h { font-size:12px; font-weight:700; letter-spacing:.02em; text-transform:uppercase;
  color:#b5bac1; margin-bottom:12px; }
.ms-di-row { display:flex; align-items:center; gap:12px; }
.ms-di-nm { font-size:16px; font-weight:600; color:#f2f3f5; }
.ms-di-st { display:flex; align-items:center; gap:12px; margin-top:4px; font-size:14px; color:#b5bac1; }
.ms-di-st span { display:flex; align-items:center; gap:6px; }
.ms-di-btn { margin-left:auto; flex:none; background:#248046; color:#fff; font-size:14px; font-weight:500;
  height:38px; padding:0 16px; border-radius:3px; display:grid; place-items:center; }

/* ── 13 · iOS lock screen + 16 · Android shade share a wall ──── */
.ms-wall { position:relative;
  background-color:#141a24;
  background-image:
    radial-gradient(120% 70% at 18% 6%, rgba(96,120,170,.55) 0%, rgba(96,120,170,0) 60%),
    radial-gradient(90% 55% at 88% 22%, rgba(180,120,150,.4) 0%, rgba(180,120,150,0) 62%),
    radial-gradient(120% 80% at 50% 108%, rgba(10,14,22,.9) 0%, rgba(10,14,22,0) 70%); }
.ms-lk { min-height:432px; display:flex; flex-direction:column; color:#fff;
  font-family:-apple-system,"SF Pro Display","Helvetica Neue",Arial,sans-serif; }
.ms-lk-lock { display:flex; justify-content:center; padding-top:14px; opacity:.9; }
.ms-lk-date { text-align:center; font-size:21px; font-weight:600; letter-spacing:.2px; margin-top:14px; opacity:.95; }
.ms-lk-time { text-align:center; font-size:78px; font-weight:300; letter-spacing:-2px; line-height:1.02; margin-top:2px; }
.ms-lk-note { margin:auto 10px 16px; padding:12px 14px; border-radius:22px;
  background:rgba(255,255,255,.16); border:.5px solid rgba(255,255,255,.16);
  backdrop-filter:blur(24px) saturate(1.6); -webkit-backdrop-filter:blur(24px) saturate(1.6);
  display:flex; gap:10px; }
.ms-lk-app { font-size:13px; font-weight:500; letter-spacing:.3px; text-transform:uppercase;
  color:rgba(255,255,255,.86); flex:1 1 auto; min-width:0; }
.ms-lk-now { font-size:13px; color:rgba(255,255,255,.6); flex:none; }
.ms-lk-t { font-size:15px; font-weight:600; margin-top:1px; }
.ms-lk-p { font-size:15px; line-height:20px; color:rgba(255,255,255,.92); }

/* ── 14 · macOS notification banner ──────────────────────────── */
.ms-mc { padding:26px 22px 34px; background:
    radial-gradient(90% 80% at 20% 0%, #4b5f9e 0%, #29335c 55%, #1b2140 100%);
  font-family:-apple-system,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }
.ms-mc-bar { height:24px; margin:-26px -22px 22px;
  background:rgba(255,255,255,.16); backdrop-filter:blur(12px);
  display:flex; align-items:center; padding:0 14px; gap:18px;
  font-size:12px; font-weight:500; color:rgba(255,255,255,.92); }
.ms-mc-card { display:flex; gap:10px; padding:12px; border-radius:16px;
  max-width:344px; margin-left:auto;
  background:rgba(246,246,247,.86); border:.5px solid rgba(255,255,255,.6);
  backdrop-filter:blur(28px) saturate(1.8); -webkit-backdrop-filter:blur(28px) saturate(1.8);
  box-shadow:0 10px 28px rgba(0,0,0,.32), 0 1px 2px rgba(0,0,0,.18); color:#1d1d1f; }
.ms-mc-t { font-size:13px; font-weight:600; letter-spacing:-.1px; }
.ms-mc-p { font-size:13px; line-height:17px; color:rgba(0,0,0,.82); margin-top:1px; }
.ms-mc-btns { display:flex; flex-direction:column; gap:6px; flex:none; }
.ms-mc-btn { width:82px; height:28px; border-radius:8px; background:rgba(255,255,255,.82);
  border:.5px solid rgba(0,0,0,.1); box-shadow:0 1px 1px rgba(0,0,0,.06);
  display:grid; place-items:center; font-size:13px; color:#1d1d1f; }

/* ── 15 · Gmail inbox ────────────────────────────────────────── */
.ms-gm { background:#fff; color:#202124; padding-bottom:8px;
  font-family:Roboto,"Helvetica Neue",Arial,sans-serif; }
.ms-gm-sr { margin:8px; height:48px; border-radius:8px; background:#f1f3f4;
  display:flex; align-items:center; gap:14px; padding:0 12px; color:#5f6368; font-size:16px; }
.ms-gm-row { display:flex; gap:16px; padding:11px 16px 13px; }
.ms-gm-bd { flex:1 1 auto; min-width:0; }
.ms-gm-l1 { display:flex; align-items:baseline; gap:8px; }
.ms-gm-fr { font-size:14px; flex:1 1 auto; min-width:0; }
.ms-gm-tm { font-size:12px; color:#5f6368; flex:none; }
.ms-gm-l2 { display:flex; align-items:baseline; gap:8px; }
.ms-gm-sj { font-size:14px; flex:1 1 auto; min-width:0; }
.ms-gm-sn { font-size:14px; color:#5f6368; margin-top:1px; }
.ms-gm-row.ms-unread .ms-gm-fr, .ms-gm-row.ms-unread .ms-gm-sj { font-weight:700; }
.ms-gm-row.ms-unread .ms-gm-tm { color:#202124; font-weight:700; }
.ms-gm-star { flex:none; color:#dadce0; align-self:flex-end; }

/* ── 16 · Android heads-up notification ──────────────────────── */
.ms-an { padding:16px 12px 30px;
  font-family:Roboto,"Segoe UI","Helvetica Neue",Arial,sans-serif; }
.ms-an-card { background:#eff1f5; border-radius:28px; padding:14px 16px; color:#1b1c1e;
  box-shadow:0 4px 14px rgba(0,0,0,.25); }
.ms-an-h { display:flex; align-items:center; gap:8px; font-size:12px; color:#444746; }
.ms-an-mono { filter:grayscale(1) brightness(0); opacity:.78; }
.ms-an-t { font-size:14px; font-weight:500; margin-top:8px; }
.ms-an-p { font-size:14px; line-height:19px; color:#444746; margin-top:1px; }
.ms-an-acts { display:flex; gap:8px; margin-top:12px; }
.ms-an-btn { height:32px; padding:0 16px; border-radius:16px; background:#e2e2e9;
  color:#0b57d0; font-size:14px; font-weight:500; display:grid; place-items:center; }
.ms-an-big { display:block; flex:none; margin-left:12px; }
`);

  /* ─────────────────────────────────────────────────────────────
     helpers
     ───────────────────────────────────────────────────────────── */

  function px(n) { return n + 'px'; }

  /* grey placeholder bar — kit-ph carries no display, so blockify it */
  function ph(w, h) {
    var n = E('span', 'kit-ph ms-ph');
    n.style.setProperty('--w', w);
    n.style.setProperty('--h', h || '9px');
    return n;
  }
  /* flat stand-in avatar: everybody who is not the brand */
  function flat(size, radius, bg, label, color) {
    var n = E('div', 'ms-fa');
    n.style.width = px(size);
    n.style.height = px(size);
    n.style.borderRadius = typeof radius === 'number' ? px(radius) : radius;
    n.style.background = bg || '#c9ced3';
    if (label) {
      n.textContent = label;
      n.style.fontSize = px(Math.round(size * 0.36));
      if (color) n.style.color = color;
    }
    return n;
  }

  /* initials for the stand-in avatars */
  function ini(name, n) {
    var s = String(name || '').trim().split(/\s+/).map(function (p) { return p.charAt(0); }).join('');
    return s.slice(0, n || 1).toUpperCase();
  }

  /* presence dot with a cut-out ring in the surface colour */
  function dot(size, color, ringW, ringColor) {
    var n = E('span', 'ms-dot');
    n.style.width = px(size);
    n.style.height = px(size);
    n.style.background = color;
    if (ringW) n.style.boxShadow = '0 0 0 ' + px(ringW) + ' ' + ringColor;
    return n;
  }

  /* avatar + absolutely placed presence dot */
  function withDot(avatar, d, right, bottom) {
    d.style.right = px(right);
    d.style.bottom = px(bottom);
    return E('div', 'ms-avw', [avatar, d]);
  }

  /* inline svg: parts = [{d, f, s, w}] or [{e:[cx,cy,rx,ry], f}] */
  function svg(w, h, vb, parts) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb);
    s.setAttribute('width', w);
    s.setAttribute('height', h);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ms-sv');
    parts.forEach(function (p) {
      var node;
      if (p.e) {
        node = document.createElementNS(NS, 'ellipse');
        node.setAttribute('cx', p.e[0]); node.setAttribute('cy', p.e[1]);
        node.setAttribute('rx', p.e[2]); node.setAttribute('ry', p.e[3]);
      } else {
        node = document.createElementNS(NS, 'path');
        node.setAttribute('d', p.d);
      }
      node.setAttribute('fill', p.f || 'none');
      if (p.s) {
        node.setAttribute('stroke', p.s);
        node.setAttribute('stroke-width', p.w || 1.6);
        node.setAttribute('stroke-linecap', 'round');
        node.setAttribute('stroke-linejoin', 'round');
      }
      s.appendChild(node);
    });
    return s;
  }

  /* platform glyphs drawn here, never borrowed from the core set */
  var G = {
    ticks: function (size, color) {
      return svg(size, size * 0.72, '0 0 15 11', [
        { d: 'M1 5.7 3.3 8.3 7.9 2.3', s: color, w: 1.5 },
        { d: 'M5 5.7 7.3 8.3 11.9 2.3', s: color, w: 1.5 }
      ]);
    },
    video: function (size, color) {
      return svg(size, size, '0 0 24 24', [{ f: color, d: 'M16 8.5V7a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 2 7v10a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 16 17v-1.5l6 4.5V4z' }]);
    },
    pencil: function (size, color) {
      return svg(size, size, '0 0 24 24', [{ f: color, d: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75zm17.7-10.2a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z' }]);
    },
    reply: function (size, color) {
      return svg(size, size, '0 0 24 24', [{ f: color, d: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' }]);
    },
    star: function (size, color) {
      return svg(size, size, '0 0 24 24', [{ d: 'M12 4.2l2.4 5.2 5.6.7-4.1 3.9 1 5.7-4.9-2.7-4.9 2.7 1-5.7-4.1-3.9 5.6-.7z', s: color, w: 1.7 }]);
    },
    /* Discord's mark — simplified, drawn here so the rail reads as Discord */
    clyde: function (size, color, holes) {
      return svg(size, size * 0.78, '0 0 24 24', [
        { f: color, d: 'M8.9 3.2C7.2 3.5 5.6 4 4.1 4.7 1.4 9 .5 13.6 1 18.2c1.8 1.4 3.9 2.4 6.1 3l1.2-1.9c-1-.4-1.9-.9-2.8-1.5l.6-.5c3.9 1.8 8.3 1.8 12.2 0l.6.5c-.9.6-1.8 1.1-2.8 1.5l1.2 1.9c2.2-.6 4.3-1.6 6.1-3 .5-4.6-.4-9.2-3.1-13.5-1.5-.7-3.1-1.2-4.8-1.5l-.6 1.1c-1.6-.2-3.2-.2-4.8 0z' },
        { f: holes, e: [8.3, 13.1, 2.1, 2.4] },
        { f: holes, e: [15.7, 13.1, 2.1, 2.4] }
      ]);
    }
  };

  /* iOS status bar. light = sits on a light surface (dark glyphs) */
  function iosBar(light, time) {
    var ink = light ? '#000' : '#fff';
    var bar = E('div', 'ms-sb', [E('span', null, time || '9:41')]);
    bar.style.color = ink;
    var sig = E('div', 'ms-sb-sig');
    [4, 6, 8, 10.5].forEach(function (h) {
      var b = E('i');
      b.style.height = px(h);
      sig.appendChild(b);
    });
    var wifi = svg(16, 12, '0 0 20 15', [
      { d: 'M1 5.1a13.6 13.6 0 0 1 18 0', s: ink, w: 2 },
      { d: 'M4.1 8.4a9 9 0 0 1 11.8 0', s: ink, w: 2 },
      { d: 'M7.2 11.6a4.5 4.5 0 0 1 5.6 0', s: ink, w: 2 },
      { f: ink, e: [10, 14, 1.2, 1.2] }
    ]);
    var bat = E('div', 'ms-sb-bat', [E('i')]);
    bar.appendChild(E('div', 'ms-sb-r', [sig, wifi, bat]));
    return bar;
  }

  /* ─────────────────────────────────────────────────────────────
     1 · WhatsApp — chat list
     ───────────────────────────────────────────────────────────── */

  function waRow(ctx, o) {
    var l2 = E('div', 'ms-wa-l2', [
      o.msg ? E('div', 'ms-wa-mg kit-ell', o.msg) : E('div', 'ms-wa-mg', ph('62%', '9px')),
      o.unread ? E('span', 'ms-wa-pill', String(o.unread)) : null
    ]);
    return E('div', 'ms-wa-row', [
      o.avatar,
      E('div', 'ms-wa-bd', [
        E('div', 'ms-wa-l1', [
          E('div', 'ms-wa-nm kit-ell', o.name),
          E('span', 'ms-wa-tm', o.time)
        ]),
        l2
      ])
    ]);
  }

  function waList(ctx, dark) {
    var grey = dark ? '#2a3942' : '#d7dde0';
    var root = E('div', 'ms-wa' + (dark ? ' ms-dk' : ''));
    root.appendChild(iosBar(!dark));

    root.appendChild(E('div', 'ms-wa-top', [
      E('span', null, 'Edit'),
      E('div', 'ms-wa-ic', [ctx.icon('camera', 22), G.pencil(22, '#007aff')])
    ]));
    root.appendChild(E('div', 'ms-wa-h1', 'Chats'));
    root.appendChild(E('div', 'ms-wa-sr', [ctx.icon('search', 17), E('span', null, 'Search')]));
    root.appendChild(E('div', 'ms-wa-chips', [
      E('span', 'ms-wa-chip ms-on', 'All'),
      E('span', 'ms-wa-chip', 'Unread'),
      E('span', 'ms-wa-chip', 'Groups')
    ]));

    root.appendChild(waRow(ctx, {
      avatar: ctx.logo(49, { shape: 'circle' }),
      name: ctx.brand,
      time: '09:41',
      msg: 'Your export pack is ready to download',
      unread: 2
    }));
    root.appendChild(waRow(ctx, {
      avatar: flat(49, '50%', grey),
      name: 'Marta Vidmar', time: 'Yesterday',
      msg: 'Sounds good — see you at ten'
    }));
    root.appendChild(waRow(ctx, {
      avatar: flat(49, '50%', grey),
      name: 'Design review', time: 'Tuesday'
    }));
    root.appendChild(waRow(ctx, {
      avatar: flat(49, '50%', grey),
      name: 'Rok Zupan', time: '18/07'
    }));
    return root;
  }

  L.register({
    id: 'wa-list',
    group: 'messaging',
    title: 'WhatsApp — chat list',
    spec: 'AVATAR 49 PX',
    note: 'light, one unread pill',
    width: 375,
    render: function (ctx) { return waList(ctx, false); }
  });

  L.register({
    id: 'wa-list-dark',
    group: 'messaging',
    title: 'WhatsApp — chat list, dark',
    spec: 'AVATAR 49 PX',
    note: '#0b141a chrome, teal pill',
    width: 375,
    render: function (ctx) { return waList(ctx, true); }
  });

  /* ─────────────────────────────────────────────────────────────
     2 · WhatsApp — conversation
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'wa-thread',
    group: 'messaging',
    title: 'WhatsApp — conversation',
    spec: 'HEADER 40 PX',
    note: '#efeae2 wallpaper, tailed bubbles',
    width: 420,
    render: function (ctx) {
      function bubble(kind, text, time, ticks) {
        var meta = E('span', 'ms-wc-meta', [E('span', null, time)]);
        if (ticks) meta.appendChild(G.ticks(15, '#53bdeb'));
        var b = E('div', 'ms-wc-b ms-' + kind, [
          E('span', null, [text, E('span', 'ms-wc-pad')]),
          meta
        ]);
        return E('div', 'ms-wc-r' + (kind === 'out' ? ' ms-out' : ''), [b]);
      }

      var head = E('div', 'ms-wc-hd', [
        ctx.logo(40, { shape: 'circle' }),
        E('div', 'kit-col', [
          E('div', 'ms-wc-nm', ctx.brand),
          E('div', 'ms-wc-on', 'online')
        ]),
        E('div', 'ms-wc-ic', [G.video(21, '#54656f'), ctx.icon('search', 19), ctx.icon('dots', 19)])
      ]);

      var body = E('div', 'ms-wc-bd', [
        E('div', 'ms-wc-day', [E('span', null, 'Today')]),
        bubble('in', 'Morning — is the Tuesday export still on track?', '09:38', false),
        bubble('out', 'Yes. It finished overnight and the files are in the shared folder.', '09:41', true)
      ]);

      var composer = E('div', 'ms-wc-cmp', [
        ctx.icon('smile', 24),
        ctx.icon('paperclip', 24),
        E('div', 'ms-wc-inp', 'Type a message'),
        ctx.icon('mic', 24)
      ]);

      return E('div', 'ms-wc', [head, body, composer]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     3 · iMessage — conversation list
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'imessage-list',
    group: 'messaging',
    title: 'iMessage — conversation list',
    spec: 'AVATAR 46 PX',
    note: 'iOS, 2-line preview',
    width: 375,
    render: function (ctx) {
      function row(o) {
        var chev = ctx.icon('chevron-right', 13);
        chev.setAttribute('class', 'kit-i ms-il-chev');
        return E('div', 'ms-il-row', [
          E('div', 'ms-il-un', [o.unread ? dot(10, '#007aff') : null]),
          o.avatar,
          E('div', 'ms-il-bd', [
            E('div', 'ms-il-l1', [
              E('div', 'ms-il-nm kit-ell', o.name),
              E('span', 'ms-il-tm', o.time),
              chev
            ]),
            o.preview
              ? E('div', 'ms-il-pv kit-clamp2', o.preview)
              : E('div', 'ms-il-pv', [ph('86%'), ph('54%')])
          ])
        ]);
      }

      var root = E('div', 'ms-il', [
        iosBar(true),
        E('div', 'ms-il-top', [
          E('span', null, 'Edit'),
          G.pencil(22, '#007aff')
        ]),
        E('div', 'ms-il-h1', 'Messages'),
        E('div', 'ms-il-sr', [ctx.icon('search', 17), E('span', null, 'Search')])
      ]);

      root.appendChild(row({
        unread: true,
        avatar: ctx.logo(46, { shape: 'circle' }),
        name: ctx.brand,
        time: '9:41',
        preview: 'Your verification code is 418 209. It expires in ten minutes.'
      }));
      root.appendChild(row({
        avatar: flat(46, '50%', '#c8c9ce', 'MV'),
        name: 'Marta Vidmar', time: 'Yesterday',
        preview: 'Can we move the call to three? I am on site until two.'
      }));
      root.appendChild(row({
        avatar: flat(46, '50%', '#c8c9ce', 'RZ'),
        name: 'Rok Zupan', time: 'Tuesday'
      }));
      root.appendChild(row({
        avatar: flat(46, '50%', '#c8c9ce', 'B4'),
        name: 'Building 4', time: '17/07'
      }));
      return root;
    }
  });

  /* ─────────────────────────────────────────────────────────────
     4 · iMessage — conversation
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'imessage-thread',
    group: 'messaging',
    title: 'iMessage — conversation',
    spec: 'HEADER 50 PX',
    note: 'avatar centred over a 12 px name',
    width: 375,
    render: function (ctx) {
      var chev = ctx.icon('chevron-right', 11);
      chev.style.color = '#8a8a8e';

      var head = E('div', 'ms-ic-hd', [
        E('div', 'ms-ic-back', [ctx.icon('chevron-left', 22), E('span', null, '4')]),
        E('div', 'ms-ic-cam', [G.video(22, '#007aff')]),
        ctx.logo(50, { shape: 'circle' }),
        E('div', 'ms-ic-who', [E('span', null, ctx.brand), chev])
      ]);

      function bubble(kind, text) {
        return E('div', 'ms-ic-r' + (kind === 'out' ? ' ms-out' : ''), [
          E('div', 'ms-ic-b ms-' + kind, [E('span', null, text)])
        ]);
      }

      var body = E('div', 'ms-ic-bd', [
        E('div', 'ms-ic-stamp', [E('b', null, 'Today'), document.createTextNode(' 9:41')]),
        bubble('in', 'Is the pickup still on for this afternoon?'),
        bubble('out', 'Yes — the driver is 20 minutes out. I will send the code.'),
        E('div', 'ms-ic-del', 'Delivered')
      ]);

      var cmp = E('div', 'ms-ic-cmp', [
        E('div', 'ms-ic-plus', [ctx.icon('plus', 18)]),
        E('div', 'ms-ic-inp', [E('span', null, 'iMessage'), ctx.icon('mic', 19)])
      ]);

      return E('div', 'ms-ic', [iosBar(true), head, body, cmp]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     5 · Telegram — chat list
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'telegram-list',
    group: 'messaging',
    title: 'Telegram — chat list',
    spec: 'AVATAR 54 PX',
    note: 'desktop, #40a7e3 badge',
    width: 340,
    render: function (ctx) {
      function row(o) {
        var l2 = E('div', 'ms-tg-l2', [
          o.msg
            ? E('div', 'ms-tg-mg kit-ell', [o.pre ? E('span', 'ms-tg-pre', o.pre) : null, o.msg])
            : E('div', 'ms-tg-mg', ph('64%', '9px')),
          o.badge ? E('span', 'ms-tg-badge' + (o.mute ? ' ms-mute' : ''), String(o.badge)) : null
        ]);
        return E('div', 'ms-tg-row', [
          o.avatar,
          E('div', 'ms-tg-bd', [
            E('div', 'ms-tg-l1', [
              E('div', 'ms-tg-nm kit-ell', o.name),
              E('span', 'ms-tg-tm', o.time)
            ]),
            l2
          ])
        ]);
      }

      var root = E('div', 'ms-tg', [
        E('div', 'ms-tg-top', [
          ctx.icon('menu', 20),
          E('div', 'ms-tg-sr', [ctx.icon('search', 15), E('span', null, 'Search')])
        ])
      ]);

      root.appendChild(row({
        avatar: ctx.logo(54, { shape: 'circle' }),
        name: ctx.brand, time: '09:41',
        msg: 'Release 2.4 is live on all channels', badge: 3
      }));
      root.appendChild(row({
        avatar: withDot(flat(54, '50%', 'linear-gradient(#6ec9cb,#40a7e3)', 'MV'), dot(12, '#4dcd5e', 2, '#fff'), 1, 1),
        name: 'Marta Vidmar', time: '08:52',
        msg: 'be there in ten', pre: 'You: '
      }));
      root.appendChild(row({
        avatar: flat(54, '50%', 'linear-gradient(#e17076,#ee7aae)', 'DR'),
        name: 'Design review', time: 'Tue', badge: 12, mute: true
      }));
      root.appendChild(row({
        avatar: flat(54, '50%', 'linear-gradient(#a695e7,#7bc862)', 'RZ'),
        name: 'Rok Zupan', time: '17.07'
      }));
      return root;
    }
  });

  /* ─────────────────────────────────────────────────────────────
     6 · Slack — sidebar
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'slack-sidebar',
    group: 'messaging',
    title: 'Slack — sidebar',
    spec: 'WORKSPACE 36 PX',
    note: 'aubergine rail, 20 px DM rows',
    width: 340,
    render: function (ctx) {
      function chan(name, mod, badge) {
        var hash = ctx.icon('hash', 15);
        return E('div', 'ms-sl-item' + (mod ? ' ' + mod : ''), [
          hash, E('span', 'kit-ell kit-fill', name),
          badge ? E('span', 'ms-sl-badge', String(badge)) : null
        ]);
      }
      function dm(avatar, name, tag) {
        return E('div', 'ms-sl-item', [
          avatar, E('span', 'kit-ell', name), tag ? E('span', 'ms-sl-tag', 'APP') : null
        ]);
      }

      var side = E('div', 'ms-sl-side', [
        E('div', 'ms-sl-ws', [
          ctx.logo(36, { shape: 'rounded', radius: 8 }),
          E('div', 'ms-sl-wn kit-ell', ctx.brand),
          ctx.icon('chevron-down', 13),
          E('div', 'ms-sl-new', [G.pencil(18, '#3f0e40')])
        ]),
        E('div', 'ms-sl-me', [dot(9, '#2bac76'), E('span', null, ctx.person)]),
        E('div', 'ms-sl-item', [ctx.icon('comment', 15), E('span', null, 'Threads')]),
        E('div', 'ms-sl-item', [ctx.icon('send', 15), E('span', null, 'Drafts & sent')]),
        E('div', 'ms-sl-sec', [ctx.icon('chevron-down', 12), E('span', null, 'Channels')]),
        chan('announcements', 'ms-unread'),
        chan('design-review', 'ms-on'),
        chan('general'),
        chan('release-notes', null, 3),
        E('div', 'ms-sl-sec', [ctx.icon('chevron-down', 12), E('span', null, 'Direct messages')]),
        dm(ctx.logo(20, { shape: 'rounded', radius: 4 }), ctx.brand, true),
        dm(withDot(flat(20, 4, '#8d6a9f', 'M'), dot(8, '#2bac76', 1.5, '#3f0e40'), -2, -2), 'Marta Vidmar'),
        dm(withDot(flat(20, 4, '#6a7f9f', 'R'), dot(8, 'transparent', 1.5, 'rgba(255,255,255,.6)'), -2, -2), 'Rok Zupan')
      ]);

      var canvas = E('div', 'ms-sl-canvas', [
        E('div', 'ms-sl-ch', '# design-review'),
        E('div', 'ms-sl-cbody', [
          E('div', 'kit-row', [flat(36, 4, '#dcdcdc')]),
          E('div', null, [ph('90%'), ph('70%'), ph('80%')])
        ])
      ]);

      return E('div', 'ms-sl', [side, canvas]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     7 · Slack — message row
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'slack-message',
    group: 'messaging',
    title: 'Slack — message row',
    spec: 'AVATAR 36 PX R4',
    note: 'white canvas, reaction pill',
    width: 660,
    wide: true,
    render: function (ctx) {
      var row = E('div', 'ms-sm-row ms-hover', [
        ctx.logo(36, { shape: 'rounded', radius: 4 }),
        E('div', 'ms-sm-bd', [
          E('div', 'ms-sm-h', [
            E('span', 'ms-sm-nm', ctx.brand),
            E('span', 'ms-sm-tag', 'APP'),
            E('span', 'ms-sm-tm', '9:41 AM')
          ]),
          E('div', 'ms-sm-tx', 'Build 2.4.0 finished in 4 m 12 s. Artefacts are attached to the release.'),
          E('div', 'ms-sm-rx', [
            E('span', 'ms-sm-pill', [E('span', null, '🎉'), E('span', null, '3')]),
            E('span', 'ms-sm-pill ms-add', [ctx.icon('smile', 14), E('span', null, '+')])
          ]),
          E('div', 'ms-sm-th', [
            flat(20, 4, '#8d6a9f', 'M'),
            flat(20, 4, '#6a7f9f', 'R'),
            E('span', 'ms-sm-thn', '2 replies'),
            E('span', 'ms-sm-tha', 'Last reply 34 minutes ago')
          ])
        ])
      ]);

      var cont = E('div', 'ms-sm-cont', [E('div', 'kit-fill', ph('62%', '10px'))]);

      return E('div', 'ms-sm', [row, cont]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     8 · Slack — workspace switcher rail
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'slack-switcher',
    group: 'messaging',
    title: 'Slack — workspace switcher',
    spec: 'TILE 36 PX R8',
    note: 'active ring + white indicator',
    width: 340,
    render: function (ctx) {
      function slot(node, active, badge) {
        return E('div', 'ms-sw-slot', [
          active ? E('span', 'ms-sw-ind') : null,
          node,
          badge ? E('span', 'ms-sw-nb', String(badge)) : null
        ]);
      }

      var mine = ctx.logo(36, {
        shape: 'rounded', radius: 8,
        ring: '0 0 0 2px #2c0a2d, 0 0 0 4px #fff'
      });

      var rail = E('div', 'ms-sw-rail', [
        slot(mine, true),
        slot(flat(36, 8, '#4a154b', 'NB'), false, 7),
        slot(flat(36, 8, '#2d6b6b', 'CP'), false),
        slot(flat(36, 8, '#5c4b8a', 'FW'), false),
        E('div', 'ms-sw-add', [ctx.icon('plus', 18)])
      ]);

      var side = E('div', 'ms-sw-side', [
        E('div', 'ms-sw-ws', [
          E('div', 'ms-sw-wn', ctx.brand),
          ctx.icon('chevron-down', 13)
        ]),
        E('div', 'ms-sw-sub', [dot(9, '#2bac76'), E('span', null, ctx.person)]),
        E('div', 'ms-sw-rows', [ph('68%'), ph('54%'), ph('76%'), ph('44%')])
      ]);

      return E('div', 'ms-sw', [rail, side]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     9 · Discord — server rail
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'discord-rail',
    group: 'messaging',
    title: 'Discord — server rail',
    spec: 'ICON 48 PX',
    note: 'active = 16 px radius + pill',
    width: 312,
    render: function (ctx) {
      function slot(node, ind) {
        return E('div', 'ms-dr-slot', [
          ind ? E('span', 'ms-dr-ind' + (ind === 'sm' ? ' ms-mini' : '')) : null,
          node
        ]);
      }

      var rail = E('div', 'ms-dr-rail', [
        slot(E('div', 'ms-dr-home', [G.clyde(28, '#fff', '#5865f2')])),
        E('div', 'ms-dr-hr'),
        slot(ctx.logo(48, { shape: 'rounded', radius: 16 }), 'lg'),
        slot(flat(48, '50%', '#5865f2', 'NB')),
        slot(flat(48, '50%', '#3ba55c', 'CP'), 'sm'),
        slot(flat(48, '50%', '#4f545c', 'FW')),
        E('div', 'ms-dr-add', [ctx.icon('plus', 24)])
      ]);

      function chan(name, mod) {
        return E('div', 'ms-dr-ch' + (mod ? ' ' + mod : ''), [
          mod === 'ms-unread' ? E('span', 'ms-dr-pip') : null,
          ctx.icon('hash', 20),
          E('span', 'kit-ell', name)
        ]);
      }

      var side = E('div', 'ms-dr-side', [
        E('div', 'ms-dr-hd', [E('span', 'kit-ell kit-fill', ctx.brand), ctx.icon('chevron-down', 16)]),
        E('div', 'ms-dr-cat', 'Text channels'),
        chan('welcome'),
        chan('general', 'ms-on'),
        chan('releases', 'ms-unread'),
        chan('support'),
        E('div', 'ms-dr-user', [
          withDot(flat(32, '50%', '#4f545c', ini(ctx.person)), dot(10, '#23a55a', 3, '#232428'), -1, -1),
          E('div', null, [
            E('div', 'ms-dr-un', ctx.person),
            E('div', 'ms-dr-us', 'Online')
          ]),
          E('div', 'ms-dr-uic', [ctx.icon('mic', 18), ctx.icon('settings', 18)])
        ])
      ]);

      return E('div', 'ms-dr', [rail, side]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     10 · Discord — message row
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'discord-message',
    group: 'messaging',
    title: 'Discord — message row',
    spec: 'AVATAR 40 PX',
    note: '#313338, hovered, role colour',
    width: 660,
    wide: true,
    render: function (ctx) {
      var name = E('span', 'ms-dm-nm', ctx.brand);
      name.style.color = ctx.accent;

      var repName = E('span', 'ms-dm-rn', 'Marta Vidmar');
      repName.style.color = '#dbdee1';

      var bar = E('div', 'ms-dm-bar', [
        E('i', null, ctx.icon('smile', 20)),
        E('i', null, G.reply(20, 'currentColor')),
        E('i', null, ctx.icon('dots', 20))
      ]);

      var wrap = E('div', 'ms-dm-wrap', [
        bar,
        E('div', 'ms-dm-rep', [
          flat(16, '50%', '#8d6a9f'),
          repName,
          E('span', 'ms-dm-rt kit-ell', 'did the 2.4 build get signed off?')
        ]),
        E('div', 'ms-dm-row', [
          ctx.logo(40, { shape: 'circle' }),
          E('div', 'ms-dm-bd', [
            E('div', 'ms-dm-h', [
              name,
              E('span', 'ms-dm-tag', 'APP'),
              E('span', 'ms-dm-tm', 'Today at 09:41')
            ]),
            E('div', 'ms-dm-tx', 'It did — 2.4.0 is out on all channels and the notes are in the changelog.'),
            E('div', 'ms-dm-tx', [ph('58%', '10px')])
          ])
        ])
      ]);

      return E('div', 'ms-dm', [wrap]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     11 · Discord — member list
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'discord-members',
    group: 'messaging',
    title: 'Discord — member list',
    spec: 'AVATAR 32 PX',
    note: 'presence dot cut out; offline at 30%',
    width: 312,
    render: function (ctx) {
      function member(avatar, name, o) {
        o = o || {};
        var n = E('span', 'ms-dl-nm' + (o.me ? ' ms-me' : ''), name);
        var cls = 'ms-dl-row' + (o.on ? ' ms-on' : '') + (o.off ? ' ms-dl-off' : '');
        return E('div', cls, [avatar, n, o.tag ? E('span', 'ms-dl-tag', 'APP') : null]);
      }
      function av(bg, label, presence) {
        var a = flat(32, '50%', bg, label);
        if (!presence) return a;
        return withDot(a, dot(10, presence, 3, '#2b2d31'), -2, -2);
      }

      var panel = E('div', 'ms-dl-panel', [
        E('div', 'ms-dl-h', 'Online — 4'),
        member(withDot(ctx.logo(32, { shape: 'circle' }), dot(10, '#23a55a', 3, '#2b2d31'), -2, -2),
          ctx.brand, { me: true, tag: true, on: true }),
        member(av('#8d6a9f', ini(ctx.person), '#23a55a'), ctx.person),
        member(av('#5865f2', 'R', '#f0b232'), 'Rok Zupan'),
        member(av('#3ba55c', 'N', '#23a55a'), 'Nina Berg'),
        E('div', 'ms-dl-h', 'Offline — 2'),
        member(av('#4f545c', 'T'), 'Tomaž Kralj', { off: true }),
        member(av('#4f545c', 'L'), 'Lara Novak', { off: true })
      ]);

      var chat = E('div', 'ms-dl-chat', [
        E('div', null, [ph('84%'), ph('62%'), ph('72%'), ph('40%')])
      ]);
      chat.style.color = '#dbdee1';

      return E('div', 'ms-dl', [chat, panel]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     12 · Discord — server invite card
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'discord-invite',
    group: 'messaging',
    title: 'Discord — server invite',
    spec: 'ICON 50 PX R15',
    note: 'dark embed, green Join',
    width: 420,
    render: function (ctx) {
      var card = E('div', 'ms-di-card', [
        E('div', 'ms-di-h', 'You have been invited to join a server'),
        E('div', 'ms-di-row', [
          ctx.logo(50, { shape: 'rounded', radius: 15 }),
          E('div', 'kit-fill', [
            E('div', 'ms-di-nm kit-ell', ctx.brand),
            E('div', 'ms-di-st', [
              E('span', null, [dot(8, '#23a55a'), E('span', null, '12 Online')]),
              E('span', null, [dot(8, '#80848e'), E('span', null, '148 Members')])
            ])
          ]),
          E('div', 'ms-di-btn', 'Join')
        ])
      ]);
      return E('div', 'ms-di', [card]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     13 · iOS lock screen notification
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'ios-lockscreen',
    group: 'messaging',
    title: 'iOS — lock screen notification',
    spec: 'APP ICON 38 PX R9',
    note: 'frosted card over wallpaper',
    width: 375,
    render: function (ctx) {
      var lock = ctx.icon('lock', 15);

      var card = E('div', 'ms-lk-note', [
        ctx.logo(38, { shape: 'rounded', radius: 9 }),
        E('div', 'kit-fill', [
          E('div', 'kit-row', [
            E('div', 'ms-lk-app kit-ell', ctx.brand),
            E('span', 'ms-lk-now', 'now')
          ]),
          E('div', 'ms-lk-t', 'Export pack ready'),
          E('div', 'ms-lk-p', 'All 12 files have been generated and are waiting in your downloads.')
        ])
      ]);

      return E('div', 'ms-lk ms-wall', [
        E('div', 'ms-lk-lock', [lock]),
        E('div', 'ms-lk-date', 'Sunday, 27 July'),
        E('div', 'ms-lk-time', '9:41'),
        card
      ]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     14 · macOS notification banner
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'macos-banner',
    group: 'messaging',
    title: 'macOS — notification banner',
    spec: 'APP ICON 42 PX',
    note: 'squircle on frosted light card',
    width: 420,
    render: function (ctx) {
      var bar = E('div', 'ms-mc-bar', [
        E('b', null, ctx.brand),
        E('span', null, 'File'),
        E('span', null, 'Edit'),
        E('span', null, 'View')
      ]);

      var card = E('div', 'ms-mc-card', [
        ctx.logo(42, { shape: 'squircle' }),
        E('div', 'kit-fill', [
          E('div', 'ms-mc-t', ctx.brand),
          E('div', 'ms-mc-p', 'Export pack ready — 12 files written to Downloads.')
        ]),
        E('div', 'ms-mc-btns', [
          E('div', 'ms-mc-btn', 'Close'),
          E('div', 'ms-mc-btn', 'Options')
        ])
      ]);

      return E('div', 'ms-mc', [bar, card]);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     15 · Gmail inbox rows
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'gmail-inbox',
    group: 'messaging',
    title: 'Gmail — inbox rows',
    spec: 'AVATAR 40 PX',
    note: 'sender circle, 14 px rows',
    width: 375,
    render: function (ctx) {
      function row(o) {
        return E('div', 'ms-gm-row' + (o.unread ? ' ms-unread' : ''), [
          o.avatar,
          E('div', 'ms-gm-bd', [
            E('div', 'ms-gm-l1', [
              E('div', 'ms-gm-fr kit-ell', o.from),
              E('span', 'ms-gm-tm', o.time)
            ]),
            E('div', 'ms-gm-l2', [
              E('div', 'ms-gm-sj kit-ell', o.subject),
              E('span', 'ms-gm-star', G.star(19, 'currentColor'))
            ]),
            o.snippet
              ? E('div', 'ms-gm-sn kit-ell', o.snippet)
              : E('div', 'ms-gm-sn', ph('72%', '9px'))
          ])
        ]);
      }

      var root = E('div', 'ms-gm', [
        E('div', 'ms-gm-sr', [
          ctx.icon('menu', 20),
          E('span', 'kit-fill', 'Search in mail'),
          flat(30, '50%', '#1a73e8', ini(ctx.person))
        ])
      ]);

      root.appendChild(row({
        unread: true,
        avatar: ctx.logo(40, { shape: 'circle' }),
        from: ctx.brand, time: '09:41',
        subject: 'Your export pack is ready',
        snippet: 'All 12 files have been generated and are waiting in your account.'
      }));
      root.appendChild(row({
        avatar: flat(40, '50%', '#d93025', 'M'),
        from: 'Marta Vidmar', time: '08:12',
        subject: 'Re: Design review notes'
      }));
      root.appendChild(row({
        avatar: flat(40, '50%', '#188038', 'R'),
        from: 'Rok Zupan', time: '26 Jul',
        subject: 'Invoice 2025-114'
      }));
      root.appendChild(row({
        avatar: flat(40, '50%', '#e37400', 'B'),
        from: 'Building 4 residents', time: '25 Jul',
        subject: 'Lift service on Thursday'
      }));
      return root;
    }
  });

  /* ─────────────────────────────────────────────────────────────
     16 · Android heads-up notification
     ───────────────────────────────────────────────────────────── */

  L.register({
    id: 'android-notification',
    group: 'messaging',
    title: 'Android — heads-up notification',
    spec: 'SMALL ICON 20 PX',
    note: 'status icon flattens to a silhouette',
    width: 375,
    render: function (ctx) {
      var mono = E('span', 'ms-an-mono', ctx.logo(20, { shape: 'sharp' }));

      var card = E('div', 'ms-an-card', [
        E('div', 'ms-an-h', [
          mono,
          E('span', null, ctx.brand),
          E('span', null, '•'),
          E('span', 'kit-fill', 'now'),
          ctx.icon('chevron-down', 16)
        ]),
        E('div', 'kit-row', [
          E('div', 'kit-fill', [
            E('div', 'ms-an-t', 'Export pack ready'),
            E('div', 'ms-an-p', 'All 12 files have been generated.')
          ]),
          E('span', 'ms-an-big', ctx.logo(40, { shape: 'circle' }))
        ]),
        E('div', 'ms-an-acts', [
          E('div', 'ms-an-btn', 'Open'),
          E('div', 'ms-an-btn', 'Mark as read')
        ])
      ]);

      return E('div', 'ms-an ms-wall', [card]);
    }
  });
})();
