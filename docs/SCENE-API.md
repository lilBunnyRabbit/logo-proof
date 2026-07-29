# Scene API

A **scene** is one mockup tile on the proof sheet: a Discord member list, a browser
tab strip, a business card. Scenes live in `js/scenes/*.js`, are plain classic
scripts (no modules, no imports, no build step), and register themselves with the
core at load time.

The app frame is a prepress proof sheet. **Everything inside a scene belongs to the
platform being mocked** — its fonts, its greys, its spacing. Never inherit app chrome
type or colour into a scene.

## Module skeleton

```js
/* js/scenes/social.js */
(function () {
  var L = window.LogoLab;

  L.css(`
    .gh-page { background:#fff; font-family:-apple-system,"Segoe UI",Roboto,sans-serif; }
    .gh-name { font-size:26px; font-weight:600; color:#1f2328; }
  `);

  L.register({
    id: 'github-profile',
    group: 'social',
    title: 'GitHub — profile',
    spec: 'AVATAR 260 PX',       // right-aligned mono caption, uppercase, short
    note: 'circle, hard crop',   // optional one-liner under the title
    width: 340,                  // intrinsic design width in px — see Sizing
    wide: false,                 // true = tile spans two grid columns
    render: function (ctx) {
      var page = ctx.el('div', 'gh-page');
      page.appendChild(ctx.logo(260, { shape: 'circle', ring: '0 0 0 1px rgba(0,0,0,.1)' }));
      page.appendChild(ctx.el('div', 'gh-name', ctx.brand));
      return page;
    }
  });
})();
```

Register as many scenes per file as the group needs. One `L.css()` call per module
with all of that module's CSS in it.

## Rules

1. **Prefix every class** with a short module prefix (`.gh-`, `.dc-`, `.tw-`). Two
   modules must never define the same selector.
2. **No external anything** — no CDN, no web fonts, no remote images, no `fetch`.
   Inline SVG only. The whole app has to run from `file://`.
3. **No global state, no timers, no listeners on `window`/`document`.** A scene is a
   pure `ctx -> HTMLElement` function; it may attach listeners to its own nodes.
4. **Never restyle the inside of `ctx.logo()`.** Position it, give it a margin, wrap
   it — do not touch its children or override `--lg-*` variables.
5. Text in a mock comes from `ctx` (`ctx.brand`, `ctx.handle`, …) wherever the real
   UI would show the user's own name/handle. Everything else is filler copy you
   write — keep it plausible and boring, never lorem ipsum, never a joke.
6. **Render fast and synchronously.** No async, no promises, no image decoding.
7. Aim for real fidelity: real hex values, real corner radii, real font stacks, real
   pixel sizes for the platform. A GitHub avatar is 260 px on the profile and 20 px
   in a comment row — model both if both are interesting.

## Sizing

Design at a fixed pixel width and set `width` to it. The tile scales the whole scene
with a CSS transform to fit its column, so `width: 1200` for an OG card and
`width: 240` for a tab strip both work. Height is measured automatically.

Pick `width` close to the real thing: a phone mock is 320–390, a browser window
mock is 700–900 (`wide: true`), a business card is 1050 (3.5in at 300dpi ÷ 3).

Do not set a height on the root element unless the mock genuinely has one.

## `ctx`

| Member | What it gives you |
| --- | --- |
| `ctx.logo(size, opts)` | The mark, square, `size`×`size` px. Returns a `div`. |
| `ctx.logoWide(w, h, opts)` | The mark contained in a non-square box (headers, cards). |
| `ctx.el(tag, className, content)` | Element. `content` = string, Node, or array of either (falsy entries skipped). |
| `ctx.icon(name, size, solid)` | 24-viewBox inline SVG in `currentColor`. |
| `ctx.brand` | Brand name, e.g. `Astra AI`. |
| `ctx.handle` | Handle without `@`, e.g. `astra_ai`. |
| `ctx.domain` | Bare domain, e.g. `astra-ai.co`. |
| `ctx.tagline` | One-line description. |
| `ctx.person`, `ctx.role` | A human name and job title, for business cards and signatures. |
| `ctx.accent` | Brand surface colour. Shorthand for `ctx.way('brand').bg`. |
| `ctx.accentInk` | Readable on `ctx.accent`. Shorthand for `ctx.way('brand').ink`. |
| `ctx.way(n)` | A colourway — see below. `n` is `0`–`2` or `'stock'`/`'brand'`/`'reverse'`. |
| `ctx.cardWay(side)` | The colourway the user assigned to `'front'` or `'back'`. |
| `ctx.mix(a, b, t)` | Blend two hexes. `t` of `0` is `a`, `1` is `b`. |
| `ctx.palette` | `[{hex, rgb, share, chroma, lum}]`, most-used first, may be empty. |
| `ctx.img` | `{src, w, h}` of the current plate. Read-only; prefer `ctx.logo`. |

### Colourways

A colourway is one ink combination for a surface. Three of them are editable in
the rail — the paper side, the brand field, the dark side — and each resolves to:

| field | what it is |
| --- | --- |
| `bg` | the surface colour |
| `mark` | the single ink the mark is knocked down to, or `null` for full colour |
| `ink` | headline type and primary rules |
| `soft` | body copy |
| `dim` | secondary copy — roles, captions |
| `hair` | hairline rules |
| `light` | `true` when `bg` is light enough to want dark type |
| `i` | its index, for passing straight to `ctx.logo(size, { way: w.i })` |

Reach for a colourway whenever a scene invents a brand-coloured surface — a card,
a sign, a splash screen. Do not hardcode a second brand colour: a scene that needs
one is asking for a colourway. Never assume `mark` is set; `null` is the default on
the stock way and means "reproduce the plate as it is".

### `ctx.logo(size, opts)`

| opt | values | default |
| --- | --- | --- |
| `shape` | `'auto'` \| `'circle'` \| `'squircle'` \| `'rounded'` \| `'sharp'` | `'auto'` |
| `bg` | any CSS colour, `'accent'`, or omit | user's backdrop |
| `pad` | `0`–`0.4` fraction of size | user's padding |
| `radius` | px number or CSS string; overrides the shape's radius | — |
| `ring` | full `box-shadow` value, e.g. `'0 0 0 2px #fff'` | — |
| `pixel` | `true` forces nearest-neighbour scaling | auto under 20 px |
| `way` | a colourway index or id — takes its `bg` and knocks the mark down to its `mark` | — |
| `mono` | one ink to knock the mark down to, or `null` to keep its own colours | — |

`way` and `mono` are done at the source, not with a CSS filter, so the result is
still an ordinary image: scale, nudge, the split clip and the true-pixel
rasteriser all keep working on it. An explicit `bg` or `mono` overrides whatever
the colourway said, which is how a scene takes a colourway's ink onto a surface it
paints itself: `ctx.logo(200, { way: w.i, bg: 'transparent' })`.

The element it returns is opaque: with several plates loaded it holds one
absolutely-positioned layer per plate, and the compare mode decides whether they
are clipped into a split or alternated on a timer. Never reach inside it, never
assume it contains exactly one `<img>`, and never set a CSS filter on it — wrap it
in your own element and filter that.

`'auto'` follows whatever mask the user picked in the rail — use it when the platform
does not force a shape. Use an explicit shape when the platform does: Discord and X
are always circles, Slack and iOS are always rounded/squircle, a favicon is `'sharp'`.

Scale, nudge, padding and backdrop are driven by CSS variables, so the sheet responds
to those sliders without re-rendering. Changing brand text does re-render.

## Kit classes

Available everywhere, defined in `css/kit.css`. The scene root gets `.kit`
automatically (system font stack, `box-sizing: border-box`).

`kit-row` `kit-col` `kit-fill` `kit-ell` `kit-clamp2` `kit-frame` `kit-shadow`
`kit-hr` `kit-ph` `kit-mono` `kit-dim`

`kit-ph` is a grey placeholder bar for copy that is not the point of the mock:
`<span class="kit-ph" style="--w:70%;--h:9px"></span>`. Use it instead of inventing
fake sentences everywhere — but a mock with *no* real text reads as unfinished, so
keep the labels that matter (names, handles, page titles, tab titles).

## Icon names

`heart star comment share retweet fork verified dots search bell plus check lock
globe home user users send mic camera chevron-down chevron-right chevron-left x menu
reload arrow-left arrow-right external play folder code image eye pin shield download
link bookmark grid settings at hash smile paperclip`

Unknown names fall back to `image`. If you need a platform's own glyph (the GitHub
mark, the X bird), draw it inline in your module — do not add it to the core set.

## Groups

`social` `messaging` `web` `favicon` `link` `app` `print` `stress`

A scene's `group` must be one of these exactly, or it will never appear.
