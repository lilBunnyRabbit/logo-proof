/* js/scenes/print.js — Print & physical.
   Ink on a substrate. Every tile is an object sitting on a surface: paper is
   off-white and casts a shadow, cloth has a weave, kraft is kraft, the sign
   burns at night. Print is also the only place the mark is allowed to be big —
   so each tile shows it at the size it is actually reproduced, and the ruler
   tile says how small it may go before it stops being a mark. */
(function () {
  'use strict';

  var L = window.LogoLab;

  /* ── one invented, boring identity, reused everywhere ─────────── */
  var PHONE  = '+1 415 555 0128';
  var STREET = '340 Bryant Street, Suite 210';
  var CITY   = 'San Francisco, CA 94107';
  var TODAY  = '24 July 2026';
  var CLIENT = 'Northbay Logistics Ltd';

  L.css(`
/* ── substrates ───────────────────────────────────────────────── */
.pr-studio   { background: #eae7e1; padding: 34px; }
.pr-studio-w { padding: 44px 40px 50px; }
.pr-studio-c { background: #edeae4; }
.pr-studio-k { background: #ddd8d0; padding: 26px; }
.pr-desk {
  padding: 54px;
  background: #cdc1af
    repeating-linear-gradient(96deg, rgba(0,0,0,.035) 0 2px, rgba(255,255,255,.03) 2px 9px);
}
.pr-paper {
  background: #faf9f7;
  box-shadow: 0 1px 2px rgba(0,0,0,.11), 0 12px 26px -12px rgba(0,0,0,.42),
              0 30px 50px -34px rgba(0,0,0,.45);
}
/* ink treatments — wrappers only, never the mark's own box */
.pr-ink   { line-height: 0; }
.pr-ink-k { opacity: .84; }
.pr-soft  { line-height: 0; filter: blur(.45px) saturate(1.06) contrast(1.04); }
.pr-bars  { display: flex; flex-direction: column; align-items: flex-start; }

/* ── 1–2 business card ────────────────────────────────────────────
   3.5 × 2 in drawn at 970 px, i.e. 277 dpi. Stock is square-cut: the
   3 px is the paper edge, not a corner die (a real round die is 1/8 in,
   which would be 35 px here). */
.pr-card {
  aspect-ratio: 7 / 4; border-radius: 3px; position: relative; overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,.16), 0 26px 46px -20px rgba(0,0,0,.5),
              inset 0 1px 0 rgba(255,255,255,.14);
}
.pr-card-front { display: grid; place-items: center; }
.pr-card-back {
  background: #faf9f7; display: flex; flex-direction: column;
  justify-content: space-between; padding: 58px 64px;
  box-shadow: 0 2px 4px rgba(0,0,0,.14), 0 26px 46px -20px rgba(0,0,0,.45),
              inset 0 0 0 1px rgba(0,0,0,.04);
}
/* 46 px at 277 dpi = 12 pt; 30 px = 7.8 pt */
.pr-cb-name { font: 600 46px/1.05 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: -.012em; color: #17181a; }
.pr-cb-role { font: 400 30px/1.2 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #6d7278; margin-top: 10px; }
.pr-cb-rule { width: 118px; height: 2px; margin: 24px 0 20px; }
.pr-cb-lines { font: 400 30px/1.8 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #3d4147; }

/* the three colourways side by side — cards at half size, 970 → 485 */
.pr-cw { display: grid; gap: 30px; }
.pr-cw-row { display: grid; grid-template-columns: 96px 1fr; align-items: center; gap: 22px; }
.pr-cw-l { display: grid; gap: 4px; }
.pr-cw-n { font: 400 11px/1 "SF Mono", SFMono-Regular, Menlo, monospace; letter-spacing: .12em; color: #948d85; }
.pr-cw-t { font: 500 13px/1.2 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #46423d; }
.pr-cw-pair { display: grid; grid-template-columns: 485px 485px; gap: 26px; }

/* ── 3 letterhead — A4 ────────────────────────────────────────── */
.pr-a4 {
  aspect-ratio: 210 / 297; background: #faf9f7; display: flex; flex-direction: column;
  padding: 60px 62px 46px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #22252a;
  box-shadow: 0 1px 2px rgba(0,0,0,.11), 0 14px 28px -12px rgba(0,0,0,.4),
              0 34px 54px -34px rgba(0,0,0,.45);
}
.pr-lh-head { display: flex; align-items: center; gap: 14px; }
.pr-lh-brand { font-size: 19px; font-weight: 600; letter-spacing: -.005em; }
.pr-lh-web { margin-left: auto; font-size: 10.5px; color: #8b8781; letter-spacing: .02em; }
.pr-hair { height: 1px; background: #dcd8d2; }
.pr-lh-date { font-size: 10.5px; color: #86827c; margin: 30px 0 22px; }
.pr-lh-to { width: 46%; }
.pr-lh-sal { font-size: 12px; margin: 30px 0 16px; }
.pr-lh-p { width: 100%; margin-bottom: 17px; }
.pr-lh-off { font-size: 12px; margin-top: 8px; }
.pr-lh-nm { font-size: 12px; font-weight: 600; margin-top: 22px; }
.pr-lh-rl { font-size: 11px; color: #7d7973; }
.pr-lh-foot {
  display: flex; gap: 18px; font-size: 9.5px; color: #8d8983; margin-top: 12px;
  letter-spacing: .015em;
}
.pr-lh-foot span:last-child { margin-left: auto; }

/* ── 4 email signature ────────────────────────────────────────── */
.pr-mail { background: #fff; padding: 26px 28px 30px; font-family: Arial, Helvetica, sans-serif; }
.pr-mail-q { font-size: 12.5px; color: #5f6368; margin-bottom: 10px; }
.pr-mail-quote { border-left: 1px solid #cccccc; padding: 2px 0 2px 12px; margin: 0 0 22px 6px; width: 78%; }
.pr-mail-body { font-size: 13.5px; line-height: 1.55; color: #202124; margin-bottom: 24px; width: 88%; }
.pr-sig { display: flex; align-items: center; gap: 16px; }
.pr-sig-rule { width: 1px; height: 62px; background: #dadce0; }
.pr-sig-col { font-size: 13px; line-height: 1.5; color: #5f6368; }
.pr-sig-name { font-weight: 700; color: #202124; }
.pr-sig-brand { font-weight: 700; color: #202124; }
.pr-sig-tel { font-size: 12.5px; }

/* ── 5 die-cut sticker ────────────────────────────────────────── */
.pr-stick {
  padding: 12px; background: #fff; border-radius: 26%;
  transform: rotate(-4.5deg); line-height: 0;
  box-shadow: 0 2px 3px rgba(0,0,0,.2), 0 14px 26px -10px rgba(0,0,0,.5),
              inset 0 1px 0 rgba(255,255,255,.9), 0 0 0 .5px rgba(0,0,0,.06);
}
.pr-stick-wrap { display: grid; place-items: center; }

/* ── 6 t-shirt ────────────────────────────────────────────────── */
.pr-tees { display: flex; gap: 36px; justify-content: center; }
.pr-tee { position: relative; width: 360px; height: 434px; }
.pr-tee-sl { position: absolute; top: 42px; width: 86px; height: 142px; }
.pr-tee-sl.l { left: 0; border-radius: 30px 8px 26px 44px; transform: rotate(-7deg); }
.pr-tee-sl.r { right: 0; border-radius: 8px 30px 44px 26px; transform: rotate(7deg); }
.pr-tee-body {
  position: absolute; left: 46px; top: 38px; width: 268px; height: 396px;
  border-radius: 34px 34px 10px 10px;
}
.pr-tee-col {
  position: absolute; left: 50%; top: 24px; transform: translateX(-50%);
  width: 108px; height: 40px; border-radius: 0 0 54px 54px / 0 0 34px 34px;
  box-shadow: inset 0 -3px 0 rgba(0,0,0,.16);
}
.pr-tee-sh {
  position: absolute; left: 46px; top: 38px; width: 268px; height: 396px;
  border-radius: 34px 34px 10px 10px; pointer-events: none;
  background:
    linear-gradient(100deg, rgba(0,0,0,.16) 0 6%, rgba(255,255,255,.07) 30%,
                    rgba(255,255,255,.05) 62%, rgba(0,0,0,.17) 100%),
    repeating-linear-gradient(90deg, rgba(0,0,0,.03) 0 1px, transparent 1px 3px);
}
.pr-tee-art { position: absolute; line-height: 0; }
.pr-tee-cap {
  margin-top: 14px; text-align: center;
  font: 10.5px ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: .08em; text-transform: uppercase; color: #7f7a72;
}

/* ── 7 tote ───────────────────────────────────────────────────── */
.pr-tote { position: relative; width: 252px; margin: 0 auto; padding-top: 96px; }
.pr-tote-h {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  width: 152px; height: 104px; border: 11px solid #cdbf9f; border-bottom: 0;
  border-radius: 80px 80px 0 0;
}
.pr-tote-h.b { width: 176px; height: 92px; border-color: #bdae8d; top: 6px; }
.pr-tote-bag {
  position: relative; height: 286px;
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 3px),
    #ded2b4;
  display: grid; place-items: center;
  box-shadow: inset 3px 0 8px -4px rgba(0,0,0,.28), inset -3px 0 8px -4px rgba(0,0,0,.28),
              inset 0 -14px 20px -14px rgba(0,0,0,.3), 0 14px 22px -14px rgba(0,0,0,.45);
}
.pr-tote-hem {
  position: absolute; left: 0; right: 0; top: 16px; height: 0;
  border-top: 1px dashed rgba(90,70,40,.38);
}
.pr-tote-hem.b { top: auto; bottom: 22px; }

/* ── 8 embroidered patch ──────────────────────────────────────── */
.pr-denim {
  padding: 38px;
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.045) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(-45deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px),
    #2f3a4c;
}
.pr-patch {
  width: 214px; height: 214px; border-radius: 50%; margin: 0 auto; padding: 13px;
  box-shadow: 0 3px 5px rgba(0,0,0,.35), 0 16px 26px -12px rgba(0,0,0,.6);
}
.pr-patch-field {
  width: 100%; height: 100%; border-radius: 50%; display: grid; place-items: center;
  background: #f1ebde
    repeating-linear-gradient(52deg, rgba(120,100,70,.09) 0 1px, transparent 1px 4px);
  box-shadow: inset 0 -7px 15px rgba(120,100,70,.18), inset 0 6px 12px rgba(255,255,255,.7);
}

/* ── 9 storefront sign at night ───────────────────────────────── */
.pr-night {
  position: relative; overflow: hidden; padding: 44px 34px 0;
  background: #101318
    repeating-linear-gradient(90deg, rgba(255,255,255,.028) 0 1px, transparent 1px 62px);
}
.pr-wall { position: absolute; inset: 0; pointer-events: none; }
.pr-panel {
  position: relative; margin: 0 auto; width: 348px; padding: 22px 26px;
  border-radius: 5px; display: flex; align-items: center; justify-content: center; gap: 18px;
}
.pr-panel-wm {
  font: 600 30px/1 "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -.01em; white-space: nowrap;
}
.pr-standoff {
  position: absolute; bottom: -13px; width: 8px; height: 13px;
  background: linear-gradient(180deg, #3a3f47, #1a1d22);
}
.pr-shop {
  position: relative; margin: 62px -34px 0; height: 118px;
  background: linear-gradient(180deg, #0b0d10, #16191e);
  border-top: 1px solid rgba(255,255,255,.06);
}
.pr-glass {
  position: absolute; left: 26px; right: 26px; top: 16px; bottom: 0;
  background: linear-gradient(180deg, rgba(255,236,200,.10), rgba(255,236,200,.03));
  border: 1px solid rgba(255,255,255,.08); border-bottom: 0;
}
.pr-vinyl {
  position: absolute; left: 18px; top: 16px;
  font: 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: .1em; color: rgba(255,246,226,.55);
}
.pr-door {
  position: absolute; right: 40px; top: 22px; bottom: 0; width: 74px;
  background: linear-gradient(180deg, rgba(255,232,190,.16), rgba(255,232,190,.05));
  border: 1px solid rgba(255,255,255,.09); border-bottom: 0;
}

/* ── 10 lanyard badge ─────────────────────────────────────────── */
.pr-lanyard { position: relative; padding: 0 0 34px; }
.pr-strap {
  position: absolute; top: 0; width: 30px; height: 168px; transform-origin: 50% 0;
  display: grid; place-items: center; overflow: hidden;
}
.pr-strap.l { left: 96px; transform: rotate(19deg); }
.pr-strap.r { right: 96px; transform: rotate(-19deg); }
.pr-strap-t {
  font: 700 10px "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: .22em; text-transform: uppercase; white-space: nowrap;
  transform: rotate(-90deg);
}
.pr-clip {
  position: absolute; left: 50%; top: 150px; transform: translateX(-50%);
  width: 44px; height: 26px; border-radius: 3px 3px 6px 6px;
  background: linear-gradient(180deg, #d7dade, #9ea4ab 55%, #c3c8ce);
  box-shadow: 0 2px 4px rgba(0,0,0,.3);
}
.pr-sleeve {
  position: relative; width: 300px; margin: 168px auto 0; padding: 9px;
  border-radius: 12px; background: rgba(244,247,250,.72);
  box-shadow: 0 3px 6px rgba(0,0,0,.16), 0 20px 34px -18px rgba(0,0,0,.5),
              inset 0 0 0 1px rgba(255,255,255,.9);
}
.pr-sleeve::after {
  content: ""; position: absolute; inset: 0; border-radius: 12px; pointer-events: none;
  background: linear-gradient(112deg, rgba(255,255,255,.55) 0 32%, rgba(255,255,255,.06) 46%,
                               rgba(255,255,255,0) 60%);
}
.pr-slot {
  position: absolute; left: 50%; top: -14px; transform: translateX(-50%);
  width: 62px; height: 12px; border-radius: 6px;
  background: rgba(228,233,238,.85); box-shadow: inset 0 1px 2px rgba(0,0,0,.25);
}
.pr-bcard {
  background: #fff; border-radius: 6px; padding: 20px 20px 0; overflow: hidden;
  display: flex; flex-direction: column; height: 404px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.pr-bc-top { display: flex; align-items: flex-start; }
.pr-bc-event {
  font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: #6b7280; line-height: 1.5; width: 150px;
}
.pr-bc-name { font-size: 26px; font-weight: 600; letter-spacing: -.015em; color: #14161a; }
.pr-bc-role { font-size: 14px; color: #6b7280; margin-top: 4px; }
.pr-bc-band {
  margin: 0 -20px; padding: 13px 20px; display: flex; align-items: center;
  font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
}
.pr-bc-band span:last-child { margin-left: auto; letter-spacing: .06em; }

/* barcode — plain divs, no image */
.pr-bcode { display: flex; align-items: stretch; }
.pr-bcode > span { display: block; flex: none; }
.pr-bcode-n {
  font: 9px ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: .26em; color: #4b5058; margin-top: 5px;
}

/* small caps label — shipping label, any docket */
.pr-lab {
  font-size: 8.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: #97928b; margin-bottom: 7px;
}

/* ── 11 shipping box + tape ───────────────────────────────────── */
.pr-box {
  position: relative; aspect-ratio: 4 / 3; overflow: hidden;
  background:
    linear-gradient(90deg, rgba(0,0,0,.14), rgba(0,0,0,0) 14%, rgba(255,255,255,.06) 46%,
                    rgba(0,0,0,0) 84%, rgba(0,0,0,.16)),
    repeating-linear-gradient(0deg, rgba(120,84,44,.05) 0 2px, transparent 2px 5px),
    #c39a68;
  box-shadow: 0 3px 6px rgba(0,0,0,.2), 0 24px 40px -20px rgba(0,0,0,.55);
}
.pr-box-flute {
  position: absolute; left: 0; right: 0; top: 0; height: 13px;
  background: repeating-linear-gradient(90deg, #b1875a 0 3px, #d3ae7f 3px 7px);
  box-shadow: inset 0 -2px 3px rgba(0,0,0,.25);
}
.pr-box-seam { position: absolute; left: 0; right: 0; top: 44%; height: 1px; background: rgba(80,52,22,.35); }
.pr-box-tape {
  position: absolute; left: -6px; right: -6px; top: 44%; transform: translateY(-50%) rotate(-.4deg);
  height: 78px; display: flex; align-items: center; gap: 26px; padding: 0 22px;
  background: rgba(226,196,150,.72);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(120,84,44,.25),
              0 2px 5px -2px rgba(80,52,22,.3);
}
.pr-tape-wm {
  flex: none; font: 700 15px "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: .2em; text-transform: uppercase; color: rgba(58,38,16,.72);
  white-space: nowrap;
}
.pr-box-print { position: absolute; left: 34px; top: 34px; display: flex; align-items: center; gap: 16px; }
.pr-box-print .pr-tape-wm { font-size: 24px; letter-spacing: .06em; text-transform: none; color: rgba(52,34,14,.8); }
.pr-label {
  position: absolute; right: 30px; bottom: 26px; width: 236px; background: #fff;
  padding: 11px 12px; border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 14px -8px rgba(0,0,0,.5);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.pr-label-top { display: flex; align-items: center; gap: 7px; padding-bottom: 8px; border-bottom: 1px solid #111; }
.pr-label-bd { font-size: 9.5px; font-weight: 700; letter-spacing: .04em; }
.pr-label-sv { margin-left: auto; font-size: 8px; font-weight: 700; letter-spacing: .1em; }
.pr-label-to { font-size: 9.5px; line-height: 1.5; padding: 8px 0 9px; }

/* ── 12 title slide ───────────────────────────────────────────── */
.pr-slide {
  position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #111419;
  padding: 62px 66px; display: flex; flex-direction: column;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #f2f4f7;
}
.pr-slide-glow { position: absolute; inset: 0; pointer-events: none; }
.pr-slide-t { font-size: 44px; font-weight: 600; letter-spacing: -.022em; line-height: 1.1; }
.pr-slide-sub { font-size: 20px; color: #99a1ad; margin-top: 14px; }
.pr-slide-rule { width: 64px; height: 3px; margin: 34px 0 16px; }
.pr-slide-by { font-size: 15px; color: #cdd3db; }
.pr-slide-foot { display: flex; margin-top: auto; font-size: 12.5px; color: #6e7681; letter-spacing: .02em; }
.pr-slide-foot span:last-child { margin-left: auto; }

/* ── 13 print size ruler ──────────────────────────────────────── */
.pr-sheet { background: #fbfaf8; padding: 26px 24px 22px; box-shadow: 0 1px 2px rgba(0,0,0,.1), 0 12px 24px -14px rgba(0,0,0,.4); }
.pr-rr { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.pr-rr-dim { position: relative; width: 11px; flex: none; }
.pr-rr-dim i { position: absolute; left: 5px; top: 0; bottom: 0; width: 1px; background: #c0392b; opacity: .8; }
.pr-rr-dim b { position: absolute; left: 0; width: 11px; height: 1px; background: #c0392b; opacity: .8; }
.pr-rr-cap { font: 600 12px "Helvetica Neue", Helvetica, Arial, sans-serif; color: #22252a; }
.pr-rr-sub { font: 9.5px ui-monospace, "SF Mono", Menlo, Consolas, monospace; color: #8a867f; margin-top: 3px; letter-spacing: .02em; }
.pr-scale { margin-top: 6px; border-top: 1px solid #e4e1db; padding-top: 14px; }
.pr-scale-b { position: relative; height: 15px; border-bottom: 1px solid #4a4f56; }
.pr-scale-b i { position: absolute; bottom: 0; width: 1px; background: #4a4f56; }
.pr-scale-n { position: relative; height: 13px; }
.pr-scale-n i {
  position: absolute; transform: translateX(-50%); top: 2px;
  font: 9px ui-monospace, "SF Mono", Menlo, Consolas, monospace; color: #6c7076; font-style: normal;
}

/* ── 14 envelope ──────────────────────────────────────────────── */
.pr-env {
  position: relative; aspect-ratio: 2 / 1; background: #fbfaf7; border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 16px 30px -14px rgba(0,0,0,.42);
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.pr-env::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 42%;
  background: linear-gradient(180deg, rgba(0,0,0,.028), rgba(0,0,0,0) 22%);
  border-top: 1px solid rgba(0,0,0,.045); border-radius: 0 0 3px 3px;
}
.pr-env-ret { position: absolute; left: 40px; top: 36px; display: flex; align-items: center; gap: 12px; }
.pr-env-bd { font-size: 14px; font-weight: 600; letter-spacing: -.005em; }
.pr-env-ad { font-size: 9.5px; line-height: 1.6; color: #8b8781; margin-top: 2px; }
/* DIN 680 window: 90 × 45 mm, 20 mm from the left, 15 mm up from the bottom */
.pr-env-win {
  position: absolute; left: 9%; top: 45%; width: 41%; height: 41%;
  background: rgba(214,224,232,.5); border: 1px solid rgba(0,0,0,.07);
  box-shadow: inset 0 1px 3px rgba(0,0,0,.07);
  padding: 14px 16px; z-index: 1;
}
.pr-env-to { font-size: 11px; font-weight: 600; margin-bottom: 8px; }
.pr-env-stamp {
  position: absolute; right: 40px; top: 32px; width: 66px; height: 80px;
  border: 1px dashed #bdb8b0; display: grid; place-items: center;
  font: 7.5px ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  letter-spacing: .14em; color: #a8a39b; text-align: center;
}

/* ── 15 takeaway cup ──────────────────────────────────────────── */
.pr-cupwrap { position: relative; width: 210px; margin: 22px auto 0; padding-top: 18px; }
.pr-cup {
  position: relative; height: 262px;
  background:
    linear-gradient(90deg, rgba(0,0,0,.15), rgba(0,0,0,0) 18%, rgba(255,255,255,.55) 40%,
                    rgba(0,0,0,0) 74%, rgba(0,0,0,.17)),
    #fbfaf8;
  clip-path: polygon(8% 0, 92% 0, 82% 100%, 18% 100%);
}
.pr-cup-sh {
  position: absolute; left: 14%; right: 14%; bottom: -12px; height: 22px; border-radius: 50%;
  background: rgba(0,0,0,.24); filter: blur(7px);
}
.pr-cup-lid {
  position: absolute; left: 2px; right: 2px; top: 0; height: 26px; border-radius: 7px 7px 2px 2px;
  background: linear-gradient(180deg, #3a3f46 0 40%, #22262b);
  box-shadow: 0 2px 3px rgba(0,0,0,.3);
}
.pr-cup-lid::after {
  content: ""; position: absolute; left: 50%; transform: translateX(-50%); top: -7px;
  width: 54px; height: 9px; border-radius: 5px 5px 0 0; background: #2d3238;
}
.pr-cup-art { position: absolute; left: 0; right: 0; top: 54px; display: grid; place-items: center; }
.pr-cup-skew { line-height: 0; transform: scaleX(.93); }
.pr-cup-band {
  position: absolute; left: 0; right: 0; bottom: 34px; height: 76px;
  background: linear-gradient(90deg, rgba(0,0,0,.16), rgba(0,0,0,0) 20%, rgba(255,255,255,.28) 42%,
                               rgba(0,0,0,0) 76%, rgba(0,0,0,.18)),
              #c69c6d;
  clip-path: polygon(3% 0, 97% 0, 95% 100%, 5% 100%);
  display: grid; place-items: center;
  font: 600 12px "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: .12em; color: rgba(56,36,14,.78);
}
`);

  /* ── small helpers ─────────────────────────────────────────────
     Nothing here touches the inside of ctx.logo(): filters and
     transforms are applied to wrappers only. */

  function hexRgb(hex) {
    var h = String(hex || '').trim().replace('#', '');
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    if (!/^[0-9a-f]{6}$/i.test(h)) return [43, 47, 54];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgba(hex, a) {
    var c = hexRgb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }
  function isLight(hex) {
    var c = hexRgb(hex);
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 > 0.6;
  }

  /* print never masks the artwork — the substrate is the shape */
  function mark(ctx, size, extra) {
    var o = { shape: 'sharp', bg: 'transparent' }, k;
    if (extra) for (k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return ctx.logo(size, o);
  }

  /* one-colour reproduction: the plate reduced to a single ink */
  function ink(ctx, size, light, cls) {
    var w = ctx.el('div', 'pr-ink' + (cls ? ' ' + cls : ''));
    w.style.filter = light ? 'brightness(0) invert(1)' : 'brightness(0)';
    w.appendChild(mark(ctx, size));
    return w;
  }

  function bars(ctx, widths, h, lead) {
    var box = ctx.el('div', 'pr-bars'), i, b;
    for (i = 0; i < widths.length; i++) {
      b = ctx.el('span', 'kit-ph');
      b.style.setProperty('--w', widths[i] + '%');
      b.style.setProperty('--h', (h || 7) + 'px');
      if (i) b.style.marginTop = (lead == null ? 7 : lead) + 'px';
      box.appendChild(b);
    }
    return box;
  }

  function emailOf(ctx) {
    var n = String(ctx.person || '').toLowerCase();
    if (n.normalize) n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    n = n.replace(/[^a-z0-9]+/g, '.').replace(/^\.+/, '').replace(/\.+$/, '');
    return (n || 'hello') + '@' + ctx.domain;
  }

  /* deterministic bar widths — reads as a scanned code, never changes */
  function barcode(ctx, width, height, cls) {
    var box = ctx.el('div', 'pr-bcode' + (cls ? ' ' + cls : ''));
    var seed = 12983, n = Math.max(18, Math.round(width / 2.4)), i, r, b;
    box.style.height = height + 'px';
    for (i = 0; i < n; i++) {
      seed = (seed * 75 + 74) % 65537;   /* Lehmer — stays exact in a double */
      r = seed / 65537;
      b = ctx.el('span');
      b.style.width = (1 + Math.floor(r * 3)) + 'px';
      b.style.background = i % 2 ? 'transparent' : '#111';
      box.appendChild(b);
    }
    return box;
  }

  function wordmark(ctx, cls, size, color) {
    var w = ctx.el('div', cls, ctx.brand);
    if (size) w.style.fontSize = size + 'px';
    if (color) w.style.color = color;
    return w;
  }

  /* ── 1–3 · business card ──────────────────────────────────────────
     Both sides are built from a colourway, so the surface, the ink the
     mark is knocked down to and the type all come from one decision made
     in the rail. k scales the whole card: 1 is the 970 px original, and
     the comparison tile draws the same artwork at half size. */

  function cardFront(ctx, w, k) {
    var card = ctx.el('div', 'pr-card pr-card-front');
    card.style.background = w.bg;
    card.appendChild(mark(ctx, Math.round(200 * k), { way: w.i, bg: 'transparent' }));
    return card;
  }

  function cardBack(ctx, w, k) {
    var px = function (v) { return (v * k).toFixed(1) + 'px'; };
    var card = ctx.el('div', 'pr-card pr-card-back');
    card.style.background = w.bg;
    card.style.padding = px(58) + ' ' + px(64);

    var name = ctx.el('div', 'pr-cb-name', ctx.person);
    name.style.fontSize = px(46);
    name.style.color = w.ink;

    var role = ctx.el('div', 'pr-cb-role', ctx.role);
    role.style.fontSize = px(30);
    role.style.marginTop = px(10);
    role.style.color = w.dim;

    /* the rule is the second ink — the mark's own on a knocked-down side,
       the brand colour when the mark keeps all of its colours */
    var rule = ctx.el('div', 'pr-cb-rule');
    rule.style.background = w.mark || ctx.way('brand').bg;
    rule.style.width = px(118);
    rule.style.height = Math.max(1, 2 * k).toFixed(1) + 'px';
    rule.style.margin = px(24) + ' 0 ' + px(20);

    var lines = ctx.el('div', 'pr-cb-lines', [
      ctx.el('div', null, emailOf(ctx)),
      ctx.el('div', null, PHONE),
      ctx.el('div', null, ctx.domain)
    ]);
    lines.style.fontSize = px(30);
    lines.style.color = w.soft;

    card.appendChild(mark(ctx, Math.round(110 * k), { way: w.i, bg: 'transparent' }));
    card.appendChild(ctx.el('div', null, [name, role, rule, lines]));
    return card;
  }

  L.register({
    id: 'print-card-front',
    group: 'print',
    title: 'Business card — front',
    spec: '3.5 × 2 IN · MARK 200 PX',
    note: 'square-cut stock, colourway set in the rail',
    width: 1050,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-w');
      root.appendChild(cardFront(ctx, ctx.cardWay('front'), 1));
      return root;
    }
  });

  L.register({
    id: 'print-card-back',
    group: 'print',
    title: 'Business card — back',
    spec: '3.5 × 2 IN · MARK 110 PX',
    note: 'mark at 10 mm beside 12 pt type, colourway set in the rail',
    width: 1050,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-w');
      root.appendChild(cardBack(ctx, ctx.cardWay('back'), 1));
      return root;
    }
  });

  L.register({
    id: 'print-card-ways',
    group: 'print',
    title: 'Business card — colourways',
    spec: '3 COLOURWAYS · FRONT + BACK',
    note: 'all three combinations, so a pair can be judged as a pair',
    width: 1180,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-cw');
      [0, 1, 2].forEach(function (i) {
        var w = ctx.way(i);
        root.appendChild(ctx.el('div', 'pr-cw-row', [
          ctx.el('div', 'pr-cw-l', [
            ctx.el('b', 'pr-cw-n', 'CW ' + (i + 1)),
            ctx.el('span', 'pr-cw-t', w.label)
          ]),
          ctx.el('div', 'pr-cw-pair', [
            cardFront(ctx, w, 0.5),
            cardBack(ctx, w, 0.5)
          ])
        ]));
      });
      return root;
    }
  });

  /* ── 3 · letterhead ───────────────────────────────────────────── */

  L.register({
    id: 'print-letterhead',
    group: 'print',
    title: 'Letterhead — A4',
    spec: 'A4 · MARK 33 PX (10 MM)',
    note: 'top-left lockup, 18 mm margins',
    width: 760,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio');
      var page = ctx.el('div', 'pr-a4 pr-paper');

      /* the page is 692 px across for 210 mm, so 10 mm of mark is 33 px */
      page.appendChild(ctx.el('div', 'pr-lh-head', [
        mark(ctx, 33),
        ctx.el('div', 'pr-lh-brand', ctx.brand),
        ctx.el('div', 'pr-lh-web', ctx.domain)
      ]));

      var hr = ctx.el('div', 'pr-hair');
      hr.style.marginTop = '20px';
      page.appendChild(hr);

      page.appendChild(ctx.el('div', 'pr-lh-date', TODAY));
      page.appendChild(ctx.el('div', 'pr-lh-to', bars(ctx, [64, 82, 54], 7, 9)));
      page.appendChild(ctx.el('div', 'pr-lh-sal', 'Dear Ms Whitfield,'));

      [[100, 97, 100, 93, 66], [100, 95, 99, 100, 88, 41], [98, 100, 74]].forEach(function (p) {
        page.appendChild(ctx.el('div', 'pr-lh-p', bars(ctx, p, 6.5, 9)));
      });

      page.appendChild(ctx.el('div', 'pr-lh-off', 'Kind regards,'));
      page.appendChild(ctx.el('div', 'pr-lh-nm', ctx.person));
      page.appendChild(ctx.el('div', 'pr-lh-rl', ctx.role + ', ' + ctx.brand));

      var spacer = ctx.el('div');
      spacer.style.flex = '1 1 auto';
      page.appendChild(spacer);

      page.appendChild(ctx.el('div', 'pr-hair'));
      page.appendChild(ctx.el('div', 'pr-lh-foot', [
        ctx.el('span', null, ctx.domain),
        ctx.el('span', null, STREET + ' · ' + CITY),
        ctx.el('span', null, PHONE)
      ]));

      root.appendChild(page);
      return root;
    }
  });

  /* ── 4 · email signature ──────────────────────────────────────── */

  L.register({
    id: 'print-email-sig',
    group: 'print',
    title: 'Email signature',
    spec: 'MARK 56 PX · 13 PX ARIAL',
    note: 'inside a reply, under the quoted thread',
    width: 640,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-mail');

      root.appendChild(ctx.el('div', 'pr-mail-q',
        'On ' + TODAY + ' at 09:41, Marta Sørensen <m.sorensen@northbay.io> wrote:'));
      root.appendChild(ctx.el('div', 'pr-mail-quote', bars(ctx, [96, 88, 62], 8, 9)));

      root.appendChild(ctx.el('div', 'pr-mail-body',
        'Thanks Marta — the revised estimate is attached. Happy to walk your team through it on Thursday if that is easier.'));

      var sig = ctx.el('div', 'pr-sig');
      sig.appendChild(mark(ctx, 56));
      sig.appendChild(ctx.el('div', 'pr-sig-rule'));

      var web = ctx.el('div', null, ctx.domain);
      web.style.color = ctx.accent;

      sig.appendChild(ctx.el('div', 'pr-sig-col', [
        ctx.el('div', 'pr-sig-name', ctx.person),
        ctx.el('div', null, ctx.role),
        ctx.el('div', 'pr-sig-brand', ctx.brand),
        web,
        ctx.el('div', 'pr-sig-tel', PHONE)
      ]));

      root.appendChild(sig);
      return root;
    }
  });

  /* ── 5 · die-cut sticker ──────────────────────────────────────── */

  L.register({
    id: 'print-sticker',
    group: 'print',
    title: 'Die-cut sticker',
    spec: 'MARK 156 PX · 12 PX CUT',
    note: 'white kiss-cut margin, laptop-lid scale',
    width: 340,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-desk pr-stick-wrap');
      var s = ctx.el('div', 'pr-stick');
      s.appendChild(mark(ctx, 156));
      root.appendChild(s);
      return root;
    }
  });

  /* ── 6 · t-shirt ──────────────────────────────────────────────── */

  function tee(ctx, tone, seam, art, cap) {
    var col = ctx.el('div');
    var t = ctx.el('div', 'pr-tee');
    var sl = ctx.el('div', 'pr-tee-sl l');
    var sr = ctx.el('div', 'pr-tee-sl r');
    var body = ctx.el('div', 'pr-tee-body');
    var neck = ctx.el('div', 'pr-tee-col');

    sl.style.background = seam;
    sr.style.background = seam;
    body.style.background = tone;
    neck.style.background = seam;

    t.appendChild(sl);
    t.appendChild(sr);
    t.appendChild(body);
    t.appendChild(neck);
    t.appendChild(ctx.el('div', 'pr-tee-sh'));
    t.appendChild(art);

    col.appendChild(t);
    col.appendChild(ctx.el('div', 'pr-tee-cap', cap));
    return col;
  }

  L.register({
    id: 'print-tee',
    group: 'print',
    title: 'T-shirt — chest prints',
    spec: 'CENTRE 180 PX · LEFT CHEST 60 PX',
    note: 'white on charcoal, full colour on natural',
    width: 840,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-c');
      var row = ctx.el('div', 'pr-tees');

      var big = ctx.el('div', 'pr-tee-art');
      big.style.left = '90px';
      big.style.top = '150px';
      big.appendChild(ink(ctx, 180, true));

      var chest = ctx.el('div', 'pr-tee-art');
      chest.style.right = '96px';   /* wearer's left = viewer's right */
      chest.style.top = '104px';
      chest.appendChild(mark(ctx, 60));

      row.appendChild(tee(ctx, '#26282c', '#2c2f34', big, 'charcoal · 1-colour white'));
      row.appendChild(tee(ctx, '#e7e1d3', '#ded7c6', chest, 'natural · full colour'));

      root.appendChild(row);
      return root;
    }
  });

  /* ── 7 · tote bag ─────────────────────────────────────────────── */

  L.register({
    id: 'print-tote',
    group: 'print',
    title: 'Tote bag — natural canvas',
    spec: 'MARK 150 PX',
    note: '10 oz canvas, centred print',
    width: 340,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-c');
      var tote = ctx.el('div', 'pr-tote');
      tote.appendChild(ctx.el('div', 'pr-tote-h b'));
      tote.appendChild(ctx.el('div', 'pr-tote-h'));

      var bag = ctx.el('div', 'pr-tote-bag');
      bag.appendChild(ctx.el('div', 'pr-tote-hem'));
      bag.appendChild(ctx.el('div', 'pr-tote-hem b'));
      bag.appendChild(mark(ctx, 150));

      tote.appendChild(bag);
      root.appendChild(tote);
      return root;
    }
  });

  /* ── 8 · embroidered patch ────────────────────────────────────── */

  L.register({
    id: 'print-patch',
    group: 'print',
    title: 'Embroidered patch',
    spec: '55 MM ROUND · MARK 120 PX',
    note: 'merrowed edge, thread softens fine detail',
    width: 300,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-denim');
      var patch = ctx.el('div', 'pr-patch');
      var c = hexRgb(ctx.accent);
      var dark = 'rgb(' + Math.round(c[0] * 0.72) + ',' + Math.round(c[1] * 0.72) + ',' + Math.round(c[2] * 0.72) + ')';
      patch.style.background = 'repeating-conic-gradient(from 0deg, ' + ctx.accent +
        ' 0deg 2.4deg, ' + dark + ' 2.4deg 4.8deg)';

      var field = ctx.el('div', 'pr-patch-field');
      var soft = ctx.el('div', 'pr-soft');
      soft.appendChild(mark(ctx, 120));
      field.appendChild(soft);

      patch.appendChild(field);
      root.appendChild(patch);
      return root;
    }
  });

  /* ── 9 · storefront sign at night ─────────────────────────────── */

  L.register({
    id: 'print-sign',
    group: 'print',
    title: 'Storefront sign — night',
    spec: 'FASCIA 348 PX · MARK 56 PX',
    note: 'illuminated face, accent spill on the wall',
    width: 420,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-night');
      var light = isLight(ctx.accentInk);

      var wall = ctx.el('div', 'pr-wall');
      wall.style.background = 'radial-gradient(62% 46% at 50% 30%, ' + rgba(ctx.accent, 0.34) +
        ' 0%, ' + rgba(ctx.accent, 0.12) + ' 42%, rgba(0,0,0,0) 72%)';
      root.appendChild(wall);

      var panel = ctx.el('div', 'pr-panel');
      panel.style.background = ctx.accent;
      panel.style.boxShadow = '0 0 30px 2px ' + rgba(ctx.accent, 0.55) +
        ', 0 0 90px 24px ' + rgba(ctx.accent, 0.3) +
        ', 0 10px 22px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.28)';
      panel.appendChild(ink(ctx, 56, light));
      panel.appendChild(wordmark(ctx, 'pr-panel-wm', 30, ctx.accentInk));

      var so1 = ctx.el('div', 'pr-standoff');
      so1.style.left = '48px';
      var so2 = ctx.el('div', 'pr-standoff');
      so2.style.right = '48px';
      panel.appendChild(so1);
      panel.appendChild(so2);
      root.appendChild(panel);

      var shop = ctx.el('div', 'pr-shop');
      var glass = ctx.el('div', 'pr-glass');
      var vinyl = ctx.el('div', 'pr-vinyl', ctx.domain);
      glass.appendChild(vinyl);
      shop.appendChild(glass);
      shop.appendChild(ctx.el('div', 'pr-door'));
      root.appendChild(shop);

      return root;
    }
  });

  /* ── 10 · conference lanyard badge ────────────────────────────── */

  L.register({
    id: 'print-badge',
    group: 'print',
    title: 'Conference badge',
    spec: 'BADGE 300 PX · MARK 40 PX',
    note: 'card in a clear sleeve, printed lanyard',
    width: 380,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio');
      var wrap = ctx.el('div', 'pr-lanyard');

      ['l', 'r'].forEach(function (side) {
        var s = ctx.el('div', 'pr-strap ' + side);
        s.style.background = ctx.accent;
        s.style.boxShadow = 'inset -4px 0 8px -4px rgba(0,0,0,.45), inset 4px 0 8px -4px rgba(255,255,255,.25)';
        var t = ctx.el('div', 'pr-strap-t', ctx.brand);
        t.style.color = ctx.accentInk;
        t.style.opacity = '.85';
        s.appendChild(t);
        wrap.appendChild(s);
      });
      wrap.appendChild(ctx.el('div', 'pr-clip'));

      var sleeve = ctx.el('div', 'pr-sleeve');
      sleeve.appendChild(ctx.el('div', 'pr-slot'));

      var card = ctx.el('div', 'pr-bcard');
      card.appendChild(ctx.el('div', 'pr-bc-top', [
        ctx.el('div', 'pr-bc-event', 'Frontier Summit 2026'),
        (function () {
          var m = ctx.el('div');
          m.style.marginLeft = 'auto';
          m.appendChild(mark(ctx, 40));
          return m;
        })()
      ]));

      var hr = ctx.el('div', 'pr-hair');
      hr.style.margin = '18px 0 22px';
      card.appendChild(hr);

      card.appendChild(ctx.el('div', 'pr-bc-name', ctx.person));
      card.appendChild(ctx.el('div', 'pr-bc-role', ctx.role + ', ' + ctx.brand));

      var gap = ctx.el('div');
      gap.style.flex = '1 1 auto';
      card.appendChild(gap);

      card.appendChild(barcode(ctx, 150, 34));
      card.appendChild(ctx.el('div', 'pr-bcode-n', 'FS26 04188'));

      var band = ctx.el('div', 'pr-bc-band', [
        ctx.el('span', null, 'Attendee'),
        ctx.el('span', null, ctx.domain)
      ]);
      band.style.background = ctx.accent;
      band.style.color = ctx.accentInk;
      band.style.marginTop = '16px';
      card.appendChild(band);

      sleeve.appendChild(card);
      wrap.appendChild(sleeve);
      root.appendChild(wrap);
      return root;
    }
  });

  /* An invoice tile used to sit here: the same off-white A4, the same
     top-left lockup, the mark at 32 px. It re-asked the letterhead's
     question and buried the mark under a table of invented line items,
     so it is gone. */

  /* ── 11 · shipping box, tape and label ────────────────────────── */

  L.register({
    id: 'print-box',
    group: 'print',
    title: 'Shipping box & tape',
    spec: 'BOX MARK 74 PX · LABEL 20 PX',
    note: 'one ink on kraft, thermal label at 203 dpi',
    width: 640,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-k');
      var box = ctx.el('div', 'pr-box');
      box.appendChild(ctx.el('div', 'pr-box-flute'));
      box.appendChild(ctx.el('div', 'pr-box-seam'));

      var print = ctx.el('div', 'pr-box-print');
      print.appendChild(ink(ctx, 74, false, 'pr-ink-k'));
      print.appendChild(wordmark(ctx, 'pr-tape-wm', 24));
      box.appendChild(print);

      var tape = ctx.el('div', 'pr-box-tape');
      for (var i = 0; i < 4; i++) {
        tape.appendChild(ink(ctx, 30, false, 'pr-ink-k'));
        tape.appendChild(wordmark(ctx, 'pr-tape-wm', 15));
      }
      box.appendChild(tape);

      var label = ctx.el('div', 'pr-label');
      label.appendChild(ctx.el('div', 'pr-label-top', [
        mark(ctx, 20),
        ctx.el('span', 'pr-label-bd', ctx.brand),
        ctx.el('span', 'pr-label-sv', 'GROUND · 1 OF 1')
      ]));
      label.appendChild(ctx.el('div', 'pr-label-to', [
        ctx.el('div', 'pr-lab', 'Ship to'),
        ctx.el('div', null, CLIENT),
        bars(ctx, [78, 58], 5.5, 6)
      ]));
      label.appendChild(barcode(ctx, 212, 42));
      label.appendChild(ctx.el('div', 'pr-bcode-n', '9401 2036 4471 0298'));
      box.appendChild(label);

      root.appendChild(box);
      return root;
    }
  });

  /* ── 12 · presentation title slide ────────────────────────────── */

  L.register({
    id: 'print-slide',
    group: 'print',
    title: 'Title slide — 16:9',
    spec: '1920 × 1080 · MARK 160 PX',
    note: 'projected dark field, drawn 1:2',
    width: 960,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-slide');

      var glow = ctx.el('div', 'pr-slide-glow');
      glow.style.background = 'radial-gradient(46% 62% at 88% 92%, ' + rgba(ctx.accent, 0.28) +
        ' 0%, rgba(0,0,0,0) 68%)';
      root.appendChild(glow);

      var head = ctx.el('div');
      head.style.marginBottom = '58px';
      head.appendChild(mark(ctx, 80));
      root.appendChild(head);

      root.appendChild(ctx.el('div', 'pr-slide-t', 'Product review — Q3 2026'));
      root.appendChild(ctx.el('div', 'pr-slide-sub', ctx.tagline || ctx.brand));

      var rule = ctx.el('div', 'pr-slide-rule');
      rule.style.background = ctx.accent;
      root.appendChild(rule);

      root.appendChild(ctx.el('div', 'pr-slide-by', ctx.person + ' · ' + ctx.role));
      root.appendChild(ctx.el('div', 'pr-slide-foot', [
        ctx.el('span', null, ctx.brand),
        ctx.el('span', null, TODAY)
      ]));
      return root;
    }
  });

  /* ── 13 · print size ruler ────────────────────────────────────── */

  L.register({
    id: 'print-ruler',
    group: 'print',
    title: 'Print size ruler',
    spec: '5 · 10 · 20 · 40 MM',
    note: 'where the mark stops being a mark',
    width: 640,
    wide: true,
    render: function (ctx) {
      /* the whole point of this tile is its captions, so it is drawn wide
         enough to render near 1:1 in the grid — 7 px to the millimetre */
      var PXMM = 7;
      var root = ctx.el('div', 'pr-studio');
      var sheet = ctx.el('div', 'pr-sheet');

      [40, 20, 10, 5].forEach(function (mm) {
        var size = mm * PXMM;
        var row = ctx.el('div', 'pr-rr');

        var dim = ctx.el('div', 'pr-rr-dim');
        dim.style.height = size + 'px';
        var top = ctx.el('b');
        top.style.top = '0';
        var bot = ctx.el('b');
        bot.style.bottom = '0';
        dim.appendChild(ctx.el('i'));
        dim.appendChild(top);
        dim.appendChild(bot);
        row.appendChild(dim);

        row.appendChild(mark(ctx, size, { pad: 0 }));

        row.appendChild(ctx.el('div', null, [
          ctx.el('div', 'pr-rr-cap', mm + ' mm'),
          ctx.el('div', 'pr-rr-sub', (mm / 25.4).toFixed(2) + ' in · ' +
            Math.round(mm / 25.4 * 300) + ' px @ 300 dpi')
        ]));

        sheet.appendChild(row);
      });

      var scale = ctx.el('div', 'pr-scale');
      var bar = ctx.el('div', 'pr-scale-b');
      var nums = ctx.el('div', 'pr-scale-n');
      var i, tick, n;
      for (i = 0; i <= 50; i++) {
        tick = ctx.el('i');
        tick.style.left = (i * PXMM) + 'px';
        tick.style.height = (i % 10 === 0 ? 13 : i % 5 === 0 ? 8 : 4) + 'px';
        bar.appendChild(tick);
      }
      for (i = 0; i <= 50; i += 10) {
        n = ctx.el('i', null, String(i));
        n.style.left = (i * PXMM) + 'px';
        nums.appendChild(n);
      }
      scale.appendChild(bar);
      scale.appendChild(nums);
      scale.appendChild(ctx.el('div', 'pr-rr-sub', 'millimetres — scale bar and marks share one scale'));
      sheet.appendChild(scale);

      root.appendChild(sheet);
      return root;
    }
  });

  /* ── 14 · envelope — one-ink return lockup ────────────────────── */

  L.register({
    id: 'print-envelope',
    group: 'print',
    title: 'Envelope — DL window',
    spec: '220 × 110 MM · MARK 30 PX',
    note: 'one ink at 10 mm, DIN window',
    width: 700,
    wide: true,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio');
      var env = ctx.el('div', 'pr-env');

      /* envelopes are run one-colour far more often than four — this is the
         smallest solid-ink reproduction in the group */
      env.appendChild(ctx.el('div', 'pr-env-ret', [
        ink(ctx, 30, false),
        ctx.el('div', null, [
          ctx.el('div', 'pr-env-bd', ctx.brand),
          ctx.el('div', 'pr-env-ad', STREET + ' · ' + CITY)
        ])
      ]));

      env.appendChild(ctx.el('div', 'pr-env-stamp', 'POSTAGE PAID'));

      var win = ctx.el('div', 'pr-env-win');
      win.appendChild(ctx.el('div', 'pr-env-to', CLIENT));
      win.appendChild(bars(ctx, [72, 84, 50], 6, 8));
      env.appendChild(win);

      root.appendChild(env);
      return root;
    }
  });

  /* ── 15 · takeaway cup (curved substrate) ─────────────────────── */

  L.register({
    id: 'print-cup',
    group: 'print',
    title: 'Takeaway cup',
    spec: '12 OZ · MARK 88 PX',
    note: 'wrapped on a cylinder, kraft sleeve',
    width: 320,
    render: function (ctx) {
      var root = ctx.el('div', 'pr-studio pr-studio-c');
      var wrap = ctx.el('div', 'pr-cupwrap');

      wrap.appendChild(ctx.el('div', 'pr-cup-sh'));

      var cup = ctx.el('div', 'pr-cup');
      var art = ctx.el('div', 'pr-cup-art');
      /* the cylinder eats a little width — squeeze my wrapper, not the mark */
      var skew = ctx.el('div', 'pr-cup-skew');
      skew.appendChild(mark(ctx, 88));
      art.appendChild(skew);
      cup.appendChild(art);
      cup.appendChild(ctx.el('div', 'pr-cup-band', ctx.domain));
      wrap.appendChild(cup);
      wrap.appendChild(ctx.el('div', 'pr-cup-lid'));

      root.appendChild(wrap);
      return root;
    }
  });
})();
