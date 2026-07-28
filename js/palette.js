/* Reads the plate: ink colours, transparency, and where the mark actually
   sits inside its own canvas. All of it local, all of it on a 160px proxy. */
(function () {
  var PROXY = 160;

  function proxy(img) {
    var w = img.naturalWidth || img.width || 1;
    var h = img.naturalHeight || img.height || 1;
    var k = Math.min(1, PROXY / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k));
    c.height = Math.max(1, Math.round(h * k));
    var x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, c.width, c.height);
    return { canvas: c, ctx: x, w: c.width, h: c.height, sx: w / c.width, sy: h / c.height };
  }

  function hex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join('');
  }

  function lum(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function chroma(r, g, b) {
    return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
  }

  function readable(r, g, b) {
    return lum(r, g, b) > 0.42 ? '#111318' : '#ffffff';
  }

  function analyze(img) {
    var p;
    try { p = proxy(img); } catch (e) { return null; }
    var d;
    try { d = p.ctx.getImageData(0, 0, p.w, p.h).data; } catch (e) { return null; }

    var buckets = Object.create(null);
    var opaque = 0, transparent = 0, sumL = 0, n = 0;
    var minX = p.w, minY = p.h, maxX = -1, maxY = -1;
    var i, x, y, r, g, b, a, key;

    for (y = 0; y < p.h; y++) {
      for (x = 0; x < p.w; x++) {
        i = (y * p.w + x) * 4;
        a = d[i + 3];
        if (a < 10) { transparent++; continue; }
        opaque++;
        r = d[i]; g = d[i + 1]; b = d[i + 2];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        sumL += lum(r, g, b); n++;
        key = (r >> 4) * 256 + (g >> 4) * 16 + (b >> 4);
        var bk = buckets[key];
        if (bk) { bk.r += r; bk.g += g; bk.b += b; bk.n++; }
        else buckets[key] = { r: r, g: g, b: b, n: 1 };
      }
    }

    /* if the plate has no alpha at all, treat a uniform border colour as the
       background so trim + palette do not report the paper as ink */
    var flat = null;
    if (transparent < opaque * 0.01) {
      var c0 = [d[0], d[1], d[2]];
      var corners = [
        [d[0], d[1], d[2]],
        [d[(p.w - 1) * 4], d[(p.w - 1) * 4 + 1], d[(p.w - 1) * 4 + 2]],
        [d[(p.h - 1) * p.w * 4], d[(p.h - 1) * p.w * 4 + 1], d[(p.h - 1) * p.w * 4 + 2]],
        [d[((p.h - 1) * p.w + p.w - 1) * 4], d[((p.h - 1) * p.w + p.w - 1) * 4 + 1], d[((p.h - 1) * p.w + p.w - 1) * 4 + 2]]
      ];
      var same = corners.every(function (c) {
        return Math.abs(c[0] - c0[0]) < 10 && Math.abs(c[1] - c0[1]) < 10 && Math.abs(c[2] - c0[2]) < 10;
      });
      if (same) {
        flat = { r: c0[0], g: c0[1], b: c0[2] };
        minX = p.w; minY = p.h; maxX = -1; maxY = -1;
        for (y = 0; y < p.h; y++) {
          for (x = 0; x < p.w; x++) {
            i = (y * p.w + x) * 4;
            if (Math.abs(d[i] - flat.r) < 18 && Math.abs(d[i + 1] - flat.g) < 18 && Math.abs(d[i + 2] - flat.b) < 18) continue;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
        var fkey = (flat.r >> 4) * 256 + (flat.g >> 4) * 16 + (flat.b >> 4);
        delete buckets[fkey];
      }
    }

    var list = Object.keys(buckets).map(function (k2) {
      var v = buckets[k2];
      return { r: v.r / v.n, g: v.g / v.n, b: v.b / v.n, n: v.n };
    }).sort(function (a2, b2) { return b2.n - a2.n; });

    var picked = [];
    list.forEach(function (c) {
      if (picked.length >= 6) return;
      var far = picked.every(function (q) {
        var dr = q.r - c.r, dg = q.g - c.g, db = q.b - c.b;
        return Math.sqrt(dr * dr + dg * dg + db * db) > 56;
      });
      if (far) picked.push(c);
    });

    var colors = picked.map(function (c) {
      return {
        hex: hex(c.r, c.g, c.b),
        rgb: [Math.round(c.r), Math.round(c.g), Math.round(c.b)],
        share: c.n / Math.max(1, opaque),
        chroma: chroma(c.r, c.g, c.b),
        lum: lum(c.r, c.g, c.b)
      };
    });

    var accent = colors.slice().sort(function (a2, b2) {
      var sa = a2.chroma * 2.2 + a2.share - Math.abs(a2.lum - 0.45) * 1.1;
      var sb = b2.chroma * 2.2 + b2.share - Math.abs(b2.lum - 0.45) * 1.1;
      return sb - sa;
    })[0];

    if (maxX < minX) { minX = 0; minY = 0; maxX = p.w - 1; maxY = p.h - 1; }

    return {
      colors: colors,
      accent: accent ? accent.hex : '#2b2f36',
      accentInk: accent ? readable(accent.rgb[0], accent.rgb[1], accent.rgb[2]) : '#ffffff',
      hasAlpha: transparent > opaque * 0.01,
      flatBg: flat ? hex(flat.r, flat.g, flat.b) : null,
      avgLum: n ? sumL / n : 0.5,
      bbox: {
        x: minX * p.sx,
        y: minY * p.sy,
        w: (maxX - minX + 1) * p.sx,
        h: (maxY - minY + 1) * p.sy
      }
    };
  }

  /* Re-cut the plate to its bounding box, plus a hair of breathing room. */
  function trim(img, bbox) {
    var pad = Math.round(Math.max(bbox.w, bbox.h) * 0.01);
    var w = Math.max(1, Math.round(bbox.w + pad * 2));
    var h = Math.max(1, Math.round(bbox.h + pad * 2));
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    x.drawImage(img, Math.round(bbox.x) - pad, Math.round(bbox.y) - pad, w, h, 0, 0, w, h);
    return c.toDataURL('image/png');
  }

  window.Palette = { analyze: analyze, trim: trim, hex: hex, lum: lum, readable: readable };
})();
