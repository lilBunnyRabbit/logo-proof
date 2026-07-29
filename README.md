# Proof

A local, zero-dependency webapp that renders a logo across 116 mockups — avatars, favicons, chat rows, link unfurls, app icons, print — so you can see where the mark breaks before you ship it. Load up to four marks and compare them in place. For anyone picking or refining a logo who needs more than a 512 px square on a white background.

**[lilbunnyrabbit.github.io/logo-proof](https://lilbunnyrabbit.github.io/logo-proof/)**

## Run it

Open `index.html` in a browser. That works — no build step, no install, no server.

If you would rather serve it (some browsers are stricter about `file://`):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Everything happens in the page. The mark is read with `FileReader`, drawn to canvas, and zipped in the browser. Nothing is uploaded, and no scene is allowed to make a network request.

## Load a mark

Four ways, all equivalent:

- **Click** the drop zone in the rail (or focus it and press Enter/Space) to pick a file.
- **Drag** a file anywhere onto the window — the whole window is a drop target.
- **Paste** with `Cmd+V`: an image on the clipboard, raw `<svg>…</svg>` source, or a `data:image/…` URL.
- **Load a sample mark** for a quick look. Adding `#sample` to the URL loads it on boot.

Formats: PNG, SVG, JPG, WebP, GIF. SVG gets a `width`/`height` backfilled from its `viewBox` if it has none.

Once a plate is loaded, the top bar shows filename, format, pixel size, weight and whether it has an alpha channel, plus the colours pulled out of the mark — click any swatch to copy the hex. Anything likely to cause trouble (under 512 px, far from square, no transparency, nearly white, nearly black) shows as a note under the drop zone.

## Comparing marks

Load up to four plates; each new file is added rather than replacing the last one. They are labelled A–D and listed under the drop zone. Click one to put it under registration — its scale, nudge, trim and ink become what the sliders edit, the report re-runs against it, and Export pack targets it. `←` / `→` cycle plates. `✕` removes one.

With two or more plates loaded, **Compare** appears:

- **One** — only the selected plate renders. Normal mode.
- **Split** — every slot on the sheet is divided vertically between the plates, so the same avatar shows A on the left and B on the right. The split lands at the same fraction of the slot regardless of each mark's own aspect ratio.
- **Blink** — the sheet cycles between the plates on a timer (0.3–2.5 s). This is the blink comparator astronomers use: differences that are invisible side by side jump out when the two states alternate in the same position.

Scale and nudge are stored per plate, since two marks rarely want the same optical size. Mask, padding, backdrop and corner are shared, because those are properties of the slot, not the mark.

## The legibility report

Above the sheet, Proof measures the mark against the surface it actually lands on. For every tile it walks up from the mark to the first flat background colour behind it, computes the WCAG contrast ratio of each meaningful ink in the mark (any colour covering at least 8 % of its opaque area), and keeps the best one.

- Under **1.6:1** the mark is reported as *vanishes*.
- Under **2.6:1** it is *thin*.

Findings are listed worst first, with the offending surface swatch and the ratio; click a row to jump to that tile and flash it. **Show only these** filters the whole sheet down to the failures. Tiles carry a red or amber dot in their caption.

Two things are deliberately left out. Tiles whose backdrop is a gradient or an image cannot be sampled, so they are excluded and the count says how many were measurable. Stress tests are excluded entirely — putting the mark on hostile surfaces is what those tiles are for, and auditing them would bury the findings that are actually news.

## Colourways

A logo is never just a logo — it is a mark on a surface, in an ink. **Colourways** in the rail hold three of those combinations, and every scene that paints a brand-coloured surface reads them, so one edit repaints the whole sheet.

| | Surface | Mark | Type |
| --- | --- | --- | --- |
| **CW 1 · Stock** | off-white paper | full colour | near-black |
| **CW 2 · Brand** | the accent pulled from the mark | knocked down to one readable ink | the same ink |
| **CW 3 · Reverse** | the darkest colour in the mark, or coal | white | white |

Those are the derived defaults — a fresh load proofs exactly as it always did, and each row says `derived` until you touch it. Pick any of the three swatches and that one is pinned; the row switches to `reset`, and pinned slots carry a red tick. **Full colour** is the mark's third state: reproduce the plate in all of its own colours instead of knocking it down to one ink. Clicking the Mark swatch turns it off, because picking an ink is how you say you want one.

Knocking a mark down is done to the source, not with a filter — the SVG's inks are rewritten, a raster is re-tinted through its own alpha — so scale, nudge, the split comparison and the true-pixel rasteriser all still apply, and the legibility report scores the ink that actually prints rather than the palette the file happens to contain.

**Card front** and **Card back** assign a colourway to each side of the business card, which is the case where the pairing is the whole decision. The **Business card — colourways** tile draws all three pairs at once so a front can be judged against its own back.

CW 2 is also what `Accent` means everywhere else: the backdrop chip, the sign, the splash screen, the conference badge, the CTA band. Recolour it and all of them follow.

## Recolouring an SVG

When the plate is vector, an **Ink** section lists every colour in the file — presentation attributes, inline styles, `<style>` blocks and gradient stops — sorted by how often each appears. Each row is the original colour, a picker and an editable hex field.

**All black**, **All white** and **All accent** set every ink at once; All black plus the Stress tests group is the one-ink print check in two clicks. **Reset** restores the file. An SVG that declares no colour at all (riding the default black fill) gets a single base-colour row that paints the root `fill`.

Edits always re-apply to the original source, so nothing accumulates drift, and the recoloured SVG is what Export pack rasterises. Raster plates have no separable inks and say so.

## The rail

Registration controls. Everything except Trim is pushed through CSS variables, so the sheet updates as you drag — no re-render, no flicker.

| Control | What it does |
| --- | --- |
| Mask | Circle, squircle, rounded (with a 0–50 % corner slider) or square. Scenes that ask for `shape: 'auto'` follow this; scenes for platforms that force a shape — Discord circles, iOS squircles, favicons — ignore it on purpose. |
| Scale | 40–260 %. Grows the mark inside its slot. Per plate. |
| Padding | 0–30 %. Inset from the slot edge, applied before scale. |
| Nudge X / Y | −50 to +50. Shifts the mark inside its slot when it optically sits off-centre. Per plate. |
| Backdrop | None (transparent), White, Black, Ink, Accent — sampled from the mark — or any colour, via the picker and hex field on the last chip. |
| Trim empty margins | Re-crops the plate to its alpha bounding box. This one re-decodes the image. Per plate. |
| Show safe zone | Overlays the keep-clear ring so you can see what a maskable/adaptive icon will cut. |
| True pixels under 34 px | Rasterises small marks at their real CSS pixel count and upscales nearest-neighbour. On a retina screen a 16 px favicon is otherwise drawn with 32 real pixels, which flatters it. Leave this on when judging small sizes. |
| Reset registration | Scale, padding, nudge and corner back to defaults. Mask and backdrop stay. |

Below that, **Colourways** holds the three ink combinations described above and assigns one to each side of the card, **Copy** sets the brand name, handle, domain, tagline, person and role that scenes print into their mocks, and **Sheet** toggles whole groups on and off, filters tiles by text, and sets tile size (260–520 px).

Colourways are the one part of the rail that cannot go through a CSS variable: knocking a mark down changes the image itself, so the sheet re-renders on a short debounce rather than updating mid-drag.

Settings are saved to `localStorage` under `logo-proof:v2`, so the registration survives a reload. The key is namespaced because GitHub Pages puts every tool on one origin and they all share the same storage. Plates are not saved — the images stay in memory only.

## The sheet

116 scenes in eight groups:

| Group | Scenes | What is in it |
| --- | --- | --- |
| Social avatars | 15 | profiles, feeds, comment rows |
| Chat & messaging | 17 | the 32 px world |
| Website & product | 15 | headers, footers, empty states |
| Favicons & tabs | 13 | where marks go to die |
| Link previews | 11 | unfurls and share cards |
| App & device icons | 13 | home screens, docks, stores |
| Print & physical | 16 | card, shirt, sign, sticker |
| Stress tests | 16 | the ones that fail it |

Each tile is a fixed-width design scaled to fit its column, captioned with the real pixel spec it is modelling.

## Export pack

**Export pack** opens a dialog with eight canvas previews — click any one to download that PNG on its own — and **Download .zip** writes the whole pack. Every file is re-rendered on canvas using the current registration: same mask, scale, padding, nudge, backdrop and ink as the sheet. With several plates loaded, the pack is built from the one currently selected.

```
<brand>-icon-pack.zip
├── favicon/
│   ├── favicon-16.png  favicon-32.png  favicon-48.png
│   ├── favicon-64.png  favicon-128.png  favicon-256.png
│   ├── favicon.ico
│   ├── apple-touch-icon.png        180 px, solid backdrop
│   └── icon.svg                    only when the plate is an SVG
├── web/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png       18 % padding, solid backdrop
│   ├── og-image.png                1200×630, brand + tagline composited
│   ├── site.webmanifest
│   └── head-snippet.html
├── avatar/
│   ├── avatar-400.png   avatar-400-square.png
│   ├── avatar-512.png   avatar-512-square.png
│   └── avatar-1000.png  avatar-1000-square.png
├── app/
│   ├── ios-1024.png                square, solid backdrop
│   ├── macos-1024.png              squircle
│   └── android-432.png             adaptive foreground, 18 % padding
├── print/
│   └── mark-2048.png               transparent master
└── README.txt
```

`favicon.ico` is a real multi-size ICO — a proper icon directory with 16, 32 and 48 px PNG entries packed inside, not a renamed PNG. Windows, Explorer and legacy browsers read it correctly.

`site.webmanifest` is filled in with the brand name, the icon entries and a `theme_color` sampled from the mark. `head-snippet.html` is the matching block of `<link>` and `<meta>` tags, ready to paste. `README.txt` records the exact registration used and the hex values pulled from the mark, so a pack can be reproduced later.

## Squint, Grey and Lights

Three checks in the top bar that apply to the whole sheet at once.

- **Squint** blurs the sheet from 0 to 6 px, the way a press operator squints at a proof. If the mark stops reading as a distinct shape before the blur is heavy, it is too detailed for small sizes.
- **Grey** drops all colour and keeps value. A logo that only works because of a colour contrast falls apart here — and that is what a fax, a laser print or a greyed-out disabled state does to it.
- **Lights** switches the app chrome between light and dark. Scenes keep their own platform colours; this changes the room, not the mocks.

## Adding a scene

Read `docs/SCENE-API.md`. The short version:

1. Scenes live in `js/scenes/*.js` as plain classic scripts and register themselves at load time with `LogoLab.register({ id, group, title, spec, width, render })`.
2. `render(ctx)` returns one element, synchronously; use `ctx.logo()`, `ctx.el()`, `ctx.icon()` and the brand text on `ctx`.
3. `group` must be one of `social messaging web favicon link app print stress`.
4. Prefix every class with your module's own prefix, put all CSS in one `LogoLab.css()` call, and never fetch or reference anything remote.
5. Add the file to the `<script>` list at the bottom of `index.html`.

Then run the smoke test, which loads every scene against a stub DOM and checks ids, groups, widths, class-prefix collisions and render errors:

```
node tools/smoke.mjs
```

Pass filenames to check just those: `node tools/smoke.mjs social.js print.js`.

## Deploy

`.github/workflows/deploy.yaml` publishes to GitHub Pages on every push to `main`, and can be run by hand from the Actions tab. Enable it once under **Settings → Pages → Source → GitHub Actions**.

There is nothing to build. The job runs `node tools/smoke.mjs`, copies `index.html`, `favicon.svg`, `og.png`, `css/` and `js/` into `_site`, drops a `.nojekyll` in beside them and uploads that. `docs/`, `tools/` and this README stay in the repo and are not served. A scene that fails the smoke test fails the deploy.

Every path in the page is relative, so the site works unchanged at a subpath (`/logo-proof/`), at a domain root, or straight off the filesystem. The only absolute URLs are `og:image` and `canonical`, which the spec requires to be absolute — change them if you host it somewhere else. The absolute `/favicon.ico` paths in `js/export.js` are different: those are inside the head snippet Proof writes *for your* site, where the root is correct.

## Known limits

- **No remote images.** There is no server component and scenes are forbidden from making requests, so you cannot point Proof at an image URL — CORS would block the canvas read anyway. Load a local file, or paste the image or its SVG source.
- **Scenes are approximations.** They are hand-built from real hex values, radii and pixel sizes, but they are not screenshots and they are not automatically checked against the products they model. Every one of these UIs is redesigned periodically, so expect the mocks to drift out of date.
- **The browser tab strip is Chrome on macOS.** Its tab width, corner geometry and 16 px favicon slot are Chrome's. Firefox, Safari and Chrome-on-Windows all place and size the favicon slightly differently.
