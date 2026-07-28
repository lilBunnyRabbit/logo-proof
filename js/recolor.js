/* Recolour — pulls every ink out of an SVG plate and lets you swap it.
   Works on presentation attributes, inline styles, <style> blocks and
   gradient stops. Raster plates have no separable inks, so this sits out. */
(function () {
  'use strict';

  var NAMED = {
    black: '#000000', silver: '#c0c0c0', gray: '#808080', grey: '#808080',
    white: '#ffffff', maroon: '#800000', red: '#ff0000', purple: '#800080',
    fuchsia: '#ff00ff', magenta: '#ff00ff', green: '#008000', lime: '#00ff00',
    olive: '#808000', yellow: '#ffff00', navy: '#000080', blue: '#0000ff',
    teal: '#008080', aqua: '#00ffff', cyan: '#00ffff', orange: '#ffa500',
    pink: '#ffc0cb', brown: '#a52a2a', gold: '#ffd700', indigo: '#4b0082',
    violet: '#ee82ee', crimson: '#dc143c', salmon: '#fa8072', coral: '#ff7f50',
    tomato: '#ff6347', khaki: '#f0e68c', beige: '#f5f5dc', ivory: '#fffff0',
    lavender: '#e6e6fa', plum: '#dda0dd', orchid: '#da70d6', turquoise: '#40e0d0',
    skyblue: '#87ceeb', steelblue: '#4682b4', slategray: '#708090',
    darkgray: '#a9a9a9', darkgrey: '#a9a9a9', lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3', dimgray: '#696969', whitesmoke: '#f5f5f5',
    gainsboro: '#dcdcdc', midnightblue: '#191970', forestgreen: '#228b22',
    seagreen: '#2e8b57', darkblue: '#00008b', darkred: '#8b0000',
    darkgreen: '#006400', transparent: null, none: null, currentcolor: null
  };

  var ATTRS = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color', 'solid-color'];
  var STYLE_PROPS = /(fill|stroke|stop-color|flood-color|lighting-color|solid-color|color|background|background-color)(\s*:\s*)([^;]+)/gi;
  var TOKEN = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[\d.%\s,\/]+\)|\bhsla?\(\s*[^)]+\)|\b[a-zA-Z]{3,20}\b/g;

  /* '#abc' | 'rgb(1,2,3)' | 'red' -> '#aabbcc', or null when it is not a colour */
  function norm(v) {
    if (v == null) return null;
    var s = String(v).trim().toLowerCase();
    if (!s || s === 'none' || s === 'transparent' || s === 'currentcolor' || s.indexOf('url(') === 0) return null;

    if (s[0] === '#') {
      var h = s.slice(1);
      if (h.length === 3 || h.length === 4) {
        return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      }
      if (h.length === 6 || h.length === 8) return '#' + h.slice(0, 6);
      return null;
    }

    var m = s.match(/^rgba?\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+%?)/);
    if (m) {
      var p = m.slice(1, 4).map(function (n) {
        return n.indexOf('%') > -1 ? Math.round(parseFloat(n) * 2.55) : Math.round(parseFloat(n));
      });
      return '#' + p.map(function (n) {
        return ('0' + Math.max(0, Math.min(255, n)).toString(16)).slice(-2);
      }).join('');
    }

    if (Object.prototype.hasOwnProperty.call(NAMED, s)) return NAMED[s];
    return null;
  }

  /* One traversal, two jobs: count inks and (when map is given) swap them. */
  function walk(text, map, seen) {
    var doc;
    try {
      doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    } catch (e) { return text; }
    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) return text;

    function note(hex) {
      if (!hex || !seen) return;
      seen[hex] = (seen[hex] || 0) + 1;
    }
    function swap(hex) {
      return (map && map[hex]) ? map[hex] : null;
    }

    function tokens(str) {
      return str.replace(TOKEN, function (tok) {
        var hex = norm(tok);
        if (!hex) return tok;
        note(hex);
        return swap(hex) || tok;
      });
    }

    var all = doc.documentElement.querySelectorAll('*');
    var nodes = [doc.documentElement].concat(Array.prototype.slice.call(all));

    nodes.forEach(function (node) {
      var tag = (node.nodeName || '').toLowerCase();

      if (tag === 'style') {
        var css = node.textContent || '';
        var next = css.replace(STYLE_PROPS, function (whole, prop, sep, val) {
          return prop + sep + tokens(val);
        });
        if (next !== css && map) node.textContent = next;
        return;
      }

      ATTRS.forEach(function (a) {
        var v = node.getAttribute && node.getAttribute(a);
        if (!v) return;
        var hex = norm(v);
        if (!hex) return;
        note(hex);
        var to = swap(hex);
        if (to) node.setAttribute(a, to);
      });

      var st = node.getAttribute && node.getAttribute('style');
      if (st) {
        var nextSt = st.replace(STYLE_PROPS, function (whole, prop, sep, val) {
          return prop + sep + tokens(val);
        });
        if (nextSt !== st && map) node.setAttribute('style', nextSt);
      }
    });

    return map ? new XMLSerializer().serializeToString(doc) : text;
  }

  /* -> [{hex, count}] most-used first */
  function scan(text) {
    var seen = {};
    walk(text, null, seen);
    return Object.keys(seen)
      .map(function (h) { return { hex: h, count: seen[h] }; })
      .sort(function (a, b) { return b.count - a.count; });
  }

  /* map: {'#ff0000': '#00ff00'} -> new svg source */
  function apply(text, map) {
    if (!map || !Object.keys(map).length) return text;
    return walk(text, map, null);
  }

  /* Some SVGs declare no colour at all and ride the default black fill.
     Setting fill on the root makes every uncoloured shape follow it. */
  function applyBase(text, color) {
    try {
      var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) return text;
      doc.documentElement.setAttribute('fill', color);
      return new XMLSerializer().serializeToString(doc);
    } catch (e) { return text; }
  }

  function dataUrl(text) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text);
  }

  function decode(url) {
    if (!/^data:image\/svg\+xml/i.test(url)) return null;
    var comma = url.indexOf(',');
    if (comma < 0) return null;
    var head = url.slice(0, comma), body = url.slice(comma + 1);
    try {
      return /;base64/i.test(head) ? decodeURIComponent(escape(atob(body))) : decodeURIComponent(body);
    } catch (e) {
      try { return unescape(body); } catch (e2) { return null; }
    }
  }

  window.Recolor = {
    scan: scan, apply: apply, applyBase: applyBase,
    norm: norm, dataUrl: dataUrl, decode: decode
  };
})();
