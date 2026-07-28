/* Export — re-draws the mark on canvas using exactly the registration shown
   on the sheet, then packs the results as a zip. Nothing leaves the machine. */
(function () {
  'use strict';

  var SQ = 'M50 0c33.6 0 43.4 3.1 46.9 6.6C100.4 10.1 100 16.4 100 50s.4 39.9-3.1 43.4C93.4 96.9 83.6 100 50 100s-43.4-3.1-46.9-6.6C-.4 89.9 0 83.6 0 50S-.4 10.1 3.1 6.6 16.4 0 50 0z';

  /* Export always works from the plate currently under registration. */
  function S() {
    var st = LogoLab.state;
    var p = LogoLab.plate();
    return {
      img: p ? { src: p.src, w: p.w, h: p.h, name: p.name, vector: p.vector } : null,
      el: p ? p.el : null,
      plateEl: p ? p.plateEl : null,
      info: p ? p.info : null,
      zoom: p ? p.zoom : 1,
      ox: p ? p.ox : 0,
      oy: p ? p.oy : 0,
      shape: st.shape,
      pad: st.pad,
      round: st.round,
      bg: st.bg
    };
  }

  function clipShape(x, size, shape, roundRatio) {
    if (shape === 'sharp') return;
    if (shape === 'circle') {
      x.beginPath();
      x.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      x.clip();
      return;
    }
    if (shape === 'rounded') {
      var r = Math.min(size / 2, size * roundRatio);
      x.beginPath();
      if (x.roundRect) x.roundRect(0, 0, size, size, r);
      else {
        x.moveTo(r, 0); x.lineTo(size - r, 0); x.quadraticCurveTo(size, 0, size, r);
        x.lineTo(size, size - r); x.quadraticCurveTo(size, size, size - r, size);
        x.lineTo(r, size); x.quadraticCurveTo(0, size, 0, size - r);
        x.lineTo(0, r); x.quadraticCurveTo(0, 0, r, 0);
      }
      x.clip();
      return;
    }
    /* squircle */
    x.save();
    x.scale(size / 100, size / 100);
    x.clip(new Path2D(SQ));
    x.restore();
  }

  /* size: px. opts: {shape, bg, pad, w, h, contain} */
  function draw(size, opts) {
    opts = opts || {};
    var st = S();
    var w = opts.w || size, h = opts.h || size;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    if (!st.img || !st.el) return c;

    var shape = opts.shape || st.shape;
    var pad = opts.pad != null ? opts.pad : st.pad;
    var bg = opts.bg !== undefined ? opts.bg : st.bg;
    bg = bg === 'accent' ? LogoLab.resolveBg('accent') : bg;

    if (w === h) clipShape(x, w, shape, st.round);

    if (bg && bg !== 'transparent') { x.fillStyle = bg; x.fillRect(0, 0, w, h); }

    var src = st.plateEl || st.el;
    var iw = src.naturalWidth || st.img.w, ih = src.naturalHeight || st.img.h;
    var pw = pad * Math.min(w, h);
    var inW = w - pw * 2, inH = h - pw * 2;
    var fit = Math.min(inW / iw, inH / ih);
    var fw = iw * fit, fh = ih * fit;
    var z = opts.flatten === false ? 1 : st.zoom;
    var dw = fw * z, dh = fh * z;
    var dx = pw + (inW - dw) / 2 + (st.ox / 100) * fw * z;
    var dy = pw + (inH - dh) / 2 + (st.oy / 100) * fh * z;

    x.imageSmoothingQuality = 'high';
    try { x.drawImage(src, dx, dy, dw, dh); } catch (e) { /* undecodable */ }
    return c;
  }

  function ogCanvas() {
    var st = S(), c = document.createElement('canvas');
    c.width = 1200; c.height = 630;
    var x = c.getContext('2d');
    var accent = (st.info && st.info.accent) || '#2b2f36';
    var t = LogoLab.ctx();
    x.fillStyle = '#0e1014';
    x.fillRect(0, 0, 1200, 630);
    var g = x.createLinearGradient(0, 0, 1200, 630);
    g.addColorStop(0, accent + '33');
    g.addColorStop(1, '#0e101400');
    x.fillStyle = g; x.fillRect(0, 0, 1200, 630);

    var mark = draw(220, { shape: 'sharp', bg: 'transparent', pad: 0 });
    x.drawImage(mark, 96, 150);

    x.fillStyle = '#fff';
    x.font = '600 62px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    x.fillText(t.brand, 96, 440);
    x.fillStyle = 'rgba(255,255,255,.66)';
    x.font = '400 30px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    x.fillText(t.tagline || t.domain, 96, 490);
    x.fillStyle = accent;
    x.fillRect(96, 528, 74, 4);
    return c;
  }

  function blobOf(canvas) {
    return new Promise(function (res) { canvas.toBlob(function (b) { res(b); }, 'image/png'); });
  }
  function bytesOf(blob) {
    return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }

  /* PNG-in-ICO: every browser since Vista reads this. */
  function makeIco(entries) {
    var count = entries.length;
    var header = new Uint8Array(6 + count * 16);
    var v = new DataView(header.buffer);
    v.setUint16(0, 0, true); v.setUint16(2, 1, true); v.setUint16(4, count, true);
    var offset = header.length;
    entries.forEach(function (e, i) {
      var o = 6 + i * 16;
      header[o] = e.size >= 256 ? 0 : e.size;
      header[o + 1] = e.size >= 256 ? 0 : e.size;
      header[o + 2] = 0; header[o + 3] = 0;
      v.setUint16(o + 4, 1, true);
      v.setUint16(o + 6, 32, true);
      v.setUint32(o + 8, e.data.length, true);
      v.setUint32(o + 12, offset, true);
      offset += e.data.length;
    });
    var total = offset;
    var out = new Uint8Array(total);
    out.set(header, 0);
    var p = header.length;
    entries.forEach(function (e) { out.set(e.data, p); p += e.data.length; });
    return out;
  }

  function slug(s) {
    return (s || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand';
  }

  function download(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  var PREVIEW = [
    { label: 'favicon 16', size: 16, shape: 'sharp' },
    { label: 'favicon 32', size: 32, shape: 'sharp' },
    { label: 'favicon 48', size: 48, shape: 'sharp' },
    { label: 'touch 180', size: 180, shape: 'sharp', bg: 'solid' },
    { label: 'pwa 192', size: 192, shape: 'sharp' },
    { label: 'maskable', size: 192, shape: 'sharp', pad: 0.18, bg: 'solid' },
    { label: 'avatar 400', size: 400, shape: null },
    { label: 'og 1200×630', og: true }
  ];

  function solidBg() {
    var st = S();
    if (st.bg && st.bg !== 'transparent') return LogoLab.resolveBg(st.bg);
    return (st.info && st.info.avgLum > 0.55) ? '#0e1014' : '#ffffff';
  }

  function open() {
    var dlg = document.getElementById('exportdlg');
    var grid = document.getElementById('dlg-grid');
    grid.textContent = '';
    PREVIEW.forEach(function (p) {
      var canvas = p.og ? ogCanvas()
        : draw(p.size, {
            shape: p.shape || undefined,
            pad: p.pad,
            bg: p.bg === 'solid' ? solidBg() : undefined
          });
      var item = document.createElement('div');
      item.className = 'dlg-item';
      canvas.title = 'Download ' + p.label;
      canvas.addEventListener('click', function () {
        blobOf(canvas).then(function (b) { download(b, slug(LogoLab.ctx().brand) + '-' + p.label.replace(/[ ×]/g, '-') + '.png'); });
      });
      item.appendChild(canvas);
      item.appendChild(Object.assign(document.createElement('span'), { textContent: p.label }));
      grid.appendChild(item);
    });
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }

  function pack() {
    var st = S(), t = LogoLab.ctx(), name = slug(t.brand);
    var note = document.getElementById('zip-note');
    note.textContent = 'rendering…';

    var jobs = [];
    function add(path, canvas) {
      jobs.push(blobOf(canvas).then(bytesOf).then(function (d) { return { name: path, data: d }; }));
    }

    [16, 32, 48, 64, 128, 256].forEach(function (s) {
      add('favicon/favicon-' + s + '.png', draw(s, { shape: 'sharp' }));
    });
    add('favicon/apple-touch-icon.png', draw(180, { shape: 'sharp', bg: solidBg() }));
    add('web/icon-192.png', draw(192, { shape: 'sharp' }));
    add('web/icon-512.png', draw(512, { shape: 'sharp' }));
    add('web/icon-maskable-512.png', draw(512, { shape: 'sharp', pad: 0.18, bg: solidBg() }));
    add('web/og-image.png', ogCanvas());

    [400, 512, 1000].forEach(function (s) {
      add('avatar/avatar-' + s + '.png', draw(s));
      add('avatar/avatar-' + s + '-square.png', draw(s, { shape: 'sharp' }));
    });
    add('app/ios-1024.png', draw(1024, { shape: 'sharp', bg: solidBg() }));
    add('app/macos-1024.png', draw(1024, { shape: 'squircle' }));
    add('app/android-432.png', draw(432, { shape: 'sharp', pad: 0.18, bg: solidBg() }));
    add('print/mark-2048.png', draw(2048, { shape: 'sharp', bg: 'transparent' }));

    var icoParts = Promise.all([16, 32, 48].map(function (s) {
      return blobOf(draw(s, { shape: 'sharp' })).then(bytesOf).then(function (d) { return { size: s, data: d }; });
    })).then(function (parts) { return { name: 'favicon/favicon.ico', data: makeIco(parts) }; });

    var accent = (st.info && st.info.accent) || '#2b2f36';

    var manifest = JSON.stringify({
      name: t.brand,
      short_name: t.brand,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ],
      theme_color: accent,
      background_color: solidBg(),
      display: 'standalone',
      start_url: '/'
    }, null, 2);

    var snippet =
      '<!-- head -->\n' +
      '<link rel="icon" href="/favicon.ico" sizes="32x32">\n' +
      (st.img && st.img.vector ? '<link rel="icon" href="/icon.svg" type="image/svg+xml">\n' : '') +
      '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n' +
      '<link rel="manifest" href="/site.webmanifest">\n' +
      '<meta name="theme-color" content="' + accent + '">\n\n' +
      '<meta property="og:title" content="' + t.brand + '">\n' +
      '<meta property="og:description" content="' + (t.tagline || '') + '">\n' +
      '<meta property="og:image" content="https://' + t.domain + '/og-image.png">\n' +
      '<meta property="og:url" content="https://' + t.domain + '/">\n' +
      '<meta name="twitter:card" content="summary_large_image">\n';

    var readme =
      t.brand + ' — icon pack\n' +
      'Generated locally by Proof.\n\n' +
      'favicon/   favicon.ico (16/32/48) + png ladder + apple-touch-icon\n' +
      'web/       pwa icons, maskable icon, 1200x630 og image, manifest, head snippet\n' +
      'avatar/    round and square avatars for social profiles\n' +
      'app/       ios 1024, macos squircle 1024, android adaptive 432 foreground\n' +
      'print/     2048 transparent master\n\n' +
      'Registration used: mask ' + st.shape + ', scale ' + Math.round(st.zoom * 100) + '%, ' +
      'padding ' + Math.round(st.pad * 100) + '%, nudge ' + st.ox + '/' + st.oy + ', backdrop ' + st.bg + '.\n' +
      'Ink: ' + ((st.info && st.info.colors) || []).map(function (c) { return c.hex; }).join(' ') + '\n';

    var extra = [
      { name: 'web/site.webmanifest', data: manifest },
      { name: 'web/head-snippet.html', data: snippet },
      { name: 'README.txt', data: readme }
    ];

    if (st.img && st.img.vector && /^data:image\/svg\+xml/.test(st.img.src)) {
      try {
        extra.push({ name: 'favicon/icon.svg', data: decodeURIComponent(st.img.src.split(',')[1]) });
      } catch (e) { /* skip */ }
    }

    Promise.all(jobs.concat([icoParts])).then(function (files) {
      var blob = Zip.make(files.concat(extra));
      download(blob, name + '-icon-pack.zip');
      note.textContent = files.length + extra.length + ' files · ' + Math.round(blob.size / 1024) + ' KB';
    }).catch(function (e) {
      note.textContent = 'Export failed: ' + e.message;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('btn-zip');
    if (b) b.addEventListener('click', pack);
  });

  window.ProofExport = { open: open, pack: pack, draw: draw, ogCanvas: ogCanvas };
})();
