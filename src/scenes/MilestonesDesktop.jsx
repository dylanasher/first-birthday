/* eslint-disable */
// MilestonesDesktop: desktop layout, 1440×900. Ported from the "Ch3Desktop.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { css } from '../lib/css.js';
import './MilestonesDesktop.css';

export default class MilestonesDesktop extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    /* ---- configuration: Dylan's photos go here ----
       milestones: one entry per month; src = photo URL (leave '' for a placeholder).
       The month is only ever read here, never shown in file names or labels. */
    this.milestones = [
      { month: 1, src: '/art/3e6ad7deac198dc7f38926d4475ca167.webp' },
      { month: 2, src: '/art/ebeac125673e2785a9b2d0277f5f7a2d.webp' },
      { month: 3, src: '/art/18b2d4effa1f29553e18e8102b00c0d4.webp' },
      { month: 4, src: '/art/03ec9255faa2454ca76f8d88fb4025d9.webp' },
      { month: 5, src: '/art/7deaec151f466773c37a71fa21f9f922.webp' },
      { month: 6, src: '/art/607f4fc287f66fc87e179705b3da9d1b.webp' },
      { month: 7, src: '/art/1d77c1275d8796f32aa10535f3e9fab3.webp' },
      { month: 8, src: '/art/a08581802e960add7958fee1ff91ec6a.webp' },
      { month: 9, src: '/art/97eeccc20ce320136540afe19782045a.webp' },
      { month: 10, src: '/art/5da28a7eb117b12fbc4bbf87d17294f8.webp' },
      { month: 11, src: '' },   // photo to follow
      { month: 12, src: '' }    // photo to follow
    ];
    /* months that haven't happened yet: shown greyed out with a "soon" tag and left out of the game */
    this.soonMonths = [12];
    var soon = this.soonMonths;
    /* only months that have a photo (and aren't "soon") become postcards in the game */
    this.playable = [];
    for (var mi = 0; mi < this.milestones.length; mi++) { if (this.milestones[mi].src && soon.indexOf(this.milestones[mi].month) < 0) this.playable.push(mi); }
    /* photoshoot: any number of photos, optional captions */
    this.photoshoot = [];
    for (var p = 1; p <= 10; p++) this.photoshoot.push({ src: '', caption: '' });
    this.state = { view: 'game', order: this.shuffle(), qi: 0, picked: null, score: 0, lb: null, results: [] };
    this.root = null;
    this.strip = null;
    this.tweens = [];
    this.tries = 0;
  }
  shuffle() {
    var a = (this.playable || []).slice();
    for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); }
    clearTimeout(this.retry);
    if (this.io) this.io.disconnect();
    this.tweens.forEach(function (t) { t.kill(); });
  }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  g() { return gsap; }
  boot() {
    var self = this;
    if (!this.root || !gsap) { if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120); return; }
    if (this.reduced()) return;
    var g = gsap, r = this.root, t = this.tweens;
    var q = function (s) { return r.querySelector(s); }, qa = function (s) { return r.querySelectorAll(s); };
    var intro = g.timeline({ paused: true });
    intro.from(qa('.ca'), { y: -14, opacity: 0, filter: 'blur(4px)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.2)
      .from(q('.card'), { x: 340, y: 50, rotation: 16, opacity: 0, duration: 1.1, ease: 'back.out(1.3)' }, 0.5)
      .from(q('.sheet'), { x: 90, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.4)
      .from(qa('.body > *, .foot'), { y: 14, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.9)
      .from(qa('.mbtn'), { y: 10, opacity: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(2)' }, 1.0)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 1.6);
    t.push(intro);
    this.intro = intro;
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* the seaside breathes: laundry flutters, boats bob, gulls glide, airmail drifts, potted flowers sway */
  ambient(g, q, qa, t) {
    var laundry = q('.laundry');
    var lw = g.timeline({ repeat: -1 });
    lw.to(laundry, { skewX: -3, duration: 1.6, ease: 'sine.inOut' })
      .to(laundry, { skewX: -1, duration: 0.9, ease: 'sine.inOut' })
      .to(laundry, { skewX: -4, duration: 1.1, ease: 'sine.inOut' })
      .to(laundry, { skewX: 1, duration: 1.8, ease: 'sine.inOut' })
      .to(laundry, { skewX: 0, duration: 1.2, ease: 'sine.inOut' });
    t.push(lw);
    t.push(g.to(q('.boat1'), { rotation: 2.5, y: -2, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(q('.boat1'), { x: 14, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(q('.boat2'), { rotation: -3, y: 2.5, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -1 }));
    t.push(g.to(q('.boat2'), { x: -22, duration: 24, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(q('.wall'), { skewX: -0.4, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    [[q('.g1'), 150, 30, 0, 1], [q('.g2'), 200, 36, 9, 0.8], [q('.g3'), 125, 42, 18, 0.65]].forEach(function (b) {
      g.set(b[0], { scale: b[4] });
      t.push(g.fromTo(b[0], { x: 1480, y: b[1] }, { x: -60, y: b[1] - 50, duration: b[2], ease: 'none', repeat: -1, repeatDelay: 4, delay: b[3] }));
      t.push(g.to(b[0], { yPercent: 'random(-60,60)', duration: 'random(1.4,2.2)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true }));
    });
    [[q('.e1'), 110, 30, 2], [q('.e2'), 80, 40, 16]].forEach(function (e) {
      t.push(g.fromTo(e[0], { x: -50, y: e[1], rotation: -12 }, { x: 1000, y: e[1] + 40, rotation: 14, duration: e[2], ease: 'sine.inOut', repeat: -1, repeatDelay: 8, delay: e[3] }));
    });
  }
  swapCard(apply) {
    var self = this, g = this.g(), card = this.root && this.root.querySelector('.card');
    if (!g || !card || this.reduced()) { apply(); return; }
    g.to(card, { x: -360, y: -180, rotation: -24, opacity: 0, duration: 0.55, ease: 'power2.in', onComplete: function () {
      apply();
      setTimeout(function () {
        var c2 = self.root.querySelector('.card');
        if (c2) g.fromTo(c2, { x: 380, y: 50, rotation: 16, opacity: 0 }, { x: 0, y: 0, rotation: -3, opacity: 1, duration: 0.85, ease: 'back.out(1.3)' });
      }, 30);
    } });
  }
  celebrate() {
    var g = this.g(); if (!g || this.reduced()) return;
    var stars = this.root.querySelectorAll('.star');
    g.fromTo(stars, { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: 0 }, {
      x: function (i) { return Math.cos(i / stars.length * Math.PI * 2) * g.utils.random(140, 210); },
      y: function (i) { return Math.sin(i / stars.length * Math.PI * 2) * g.utils.random(120, 190); },
      scale: 1.3, rotation: 180, opacity: 0, duration: 1.2, ease: 'power2.out' });
    var card = this.root.querySelector('.card');
    if (card) g.fromTo(card, { scale: 1 }, { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  }
  wobble() {
    var g = this.g(), card = this.root && this.root.querySelector('.card'); if (!g || !card || this.reduced()) return;
    g.fromTo(card, { x: -12 }, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  }
  /* storybook page turn to Chapter 4: curls from the bottom-right corner, revealing the sky garden */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under4'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
    function clip(poly, c) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        var fa = a[0] + a[1] - c, fb = b[0] + b[1] - c, inA = fa >= 0, inB = fb >= 0;
        if (inA) out.push(a);
        if (inA !== inB) { var k = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
      }
      return out;
    }
    function css(pts) {
      if (pts.length < 3) return 'polygon(0px 0px, 0px 0px, 0px 0px)';
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(', ') + ')';
    }
    var rect = [[0, 0], [W, 0], [W, H], [0, H]], st = { c: W + H };
    function draw() {
      var c = st.c, turned = clip(rect, c);
      under.style.clipPath = css(turned);
      flap.style.clipPath = css(turned.map(function (p) { return [c - p[1], c - p[0]]; }));
    }
    draw();
    under.style.display = 'block';
    wrap.style.display = 'block';
    g.set(r, { pointerEvents: 'none' });
    g.to(st, { c: -40, duration: 2.2, ease: 'power2.inOut', onUpdate: draw, onComplete: function () {
      if (link) link.click();
      setTimeout(function () { under.style.display = 'none'; wrap.style.display = 'none'; g.set(r, { pointerEvents: 'auto' }); self.turning = false; }, 800);
    } });
  }
  /* bunny pointer trail: tiny leaves and golden sparkles drift down from the pointer */
  initTrail() {
    var self = this;
    try { if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || this.reduced()) return; } catch (e) { return; }
    var r = this.root; if (!r || this.trailOn) return; this.trailOn = true;
    var cols = ['#A8CF7E', '#6D8F62', '#94B85E', '#E9A7A7', '#C9C46A'], last = 0, n = 0, live = 0;
    this.onTrail = function (ev) {
      var g = gsap; if (!g) return;
      var now = Date.now(); if (now - last < 28 || live > 46) return; last = now;
      var rr = r.getBoundingClientRect(), sc = rr.width / r.offsetWidth || 1;
      var x = (ev.clientX - rr.left) / sc, y = (ev.clientY - rr.top) / sc;
      var leaf = (n++ % 3) !== 2, p = document.createElement('span');
      p.className = 'trailp ' + (leaf ? 'tl' : 'ts');
      if (leaf) p.style.background = cols[n % cols.length];
      r.appendChild(p); live++;
      g.set(p, { x: x + 16 + Math.random() * 18, y: y + 58, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.6, opacity: 0.95 });
      g.to(p, { x: '+=' + (Math.random() * 40 - 20), y: '+=' + (leaf ? 30 + Math.random() * 40 : 10 + Math.random() * 20), rotation: '+=' + (Math.random() * 220 - 110), scale: leaf ? 0.4 : 0.2, opacity: 0, duration: leaf ? 1.1 + Math.random() * 0.6 : 0.7 + Math.random() * 0.4, ease: 'sine.out', onComplete: function () { if (p.parentNode) p.parentNode.removeChild(p); live--; } });
    };
    /* the bunny follows the pointer, leaning into the direction it moves */
    var bun = document.createElement('span'); bun.className = 'bunnycur'; bun.setAttribute('aria-hidden', 'true'); r.appendChild(bun); this.bun = bun;
    var g0 = gsap, mx = g0.quickTo(bun, 'x', { duration: 0.18, ease: 'power3.out' }), my = g0.quickTo(bun, 'y', { duration: 0.18, ease: 'power3.out' }), rot = g0.quickTo(bun, 'rotation', { duration: 0.5, ease: 'power2.out' }), px = null;
    this.onMove = function (ev) {
      var rr = r.getBoundingClientRect(), sc = rr.width / r.offsetWidth || 1;
      var x = (ev.clientX - rr.left) / sc, y = (ev.clientY - rr.top) / sc;
      if (px === null) { g0.set(bun, { x: x, y: y }); }
      mx(x); my(y); rot(px === null ? 0 : Math.max(-14, Math.min(14, (x - px) * 1.2))); px = x;
      g0.to(bun, { opacity: 1, duration: 0.2, overwrite: 'auto' });
      clearTimeout(self.rotT); self.rotT = setTimeout(function () { rot(0); }, 120);
      self.onTrail(ev);
    };
    this.onLeave = function () { px = null; g0.to(bun, { opacity: 0, duration: 0.2, overwrite: 'auto' }); };
    this.onDown = function () { g0.fromTo(bun, { scaleX: 1.12, scaleY: 0.86 }, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }); };
    r.addEventListener('pointermove', this.onMove);
    r.addEventListener('pointerleave', this.onLeave);
    r.addEventListener('pointerdown', this.onDown);
  }
  initTrailSoon() { var self = this, tries = 0; (function go() { if (self.root && gsap) self.initTrail(); else if (tries++ < 30) setTimeout(go, 150); })(); }

  renderVals() {
    var self = this, s = this.state;
    var total = this.playable.length || 1;
    var curItem = this.milestones[s.order[s.qi]] || this.milestones[0];
    var picked = s.picked, answered = picked !== null;
    var months = [];
    for (var n = 1; n <= 12; n++) {
      (function (n) {
        var isSoon = self.soonMonths.indexOf(n) >= 0;
        var cls = isSoon ? 'soon' : '';
        if (answered && !isSoon) cls = n === curItem.month ? 'right' : (n === picked ? 'wrong' : 'dim');
        months.push({ n: n, label: 'Month ' + n, cls: cls, pick: function () {
          if (isSoon || self.state.picked !== null) return;
          var ok = n === curItem.month;
          self.setState({ picked: n, score: self.state.score + (ok ? 1 : 0), results: (self.state.results || []).concat([ok ? 'right' : 'wrong']) });
          if (ok) self.celebrate(); else self.wobble();
        } });
      })(n);
    }
    var ok = answered && picked === curItem.month;
    var score = s.score;
    var doneMsg = score === total ? 'Perfect! You know Dylan by heart.' : score >= Math.round(total * 0.75) ? "Wonderful! You've watched him grow." : score >= Math.round(total * 0.4) ? 'Lovely guesses! Every month was a new adventure.' : 'Every month brought a new surprise!';
    var photos = this.photoshoot.map(function (p, i) {
      return { num: i + 1, src: p.src, hasSrc: !!p.src, noSrc: !p.src, caption: p.caption || '', alt: p.caption || ('Pre-birthday photo ' + (i + 1)),
        open: function () { self.setState({ lb: i }); } };
    });
    var hasPhotos = this.photoshoot.some(function (p) { return !!p.src; });
    if (!hasPhotos) photos = [];
    var lbi = s.lb === null ? 0 : s.lb;
    var stars = ['#F5D68A', '#E5A85A', '#FFFCF4', '#A9C46A', '#F5D68A', '#EFC3B4', '#FFFCF4', '#F5D68A', '#A9D6DF', '#E5A85A', '#FFFCF4', '#A9C46A'].map(function (c) { return { color: c }; });
    function scrollStrip(dir) { if (self.strip) self.strip.scrollBy({ left: dir * 418, behavior: 'smooth' }); }
    return {
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      setStrip: function (el) { self.strip = el; },
      view: s.view,
      inGame: s.view === 'game', inDone: s.view === 'done', inGallery: s.view === 'gallery',
      notGallery: s.view !== 'gallery', notInGame: s.view !== 'game',
      cur: { num: s.qi + 1, src: curItem.src, hasSrc: !!curItem.src, noSrc: !curItem.src },
      score: score,
      barStyle: 'width:' + Math.round(((s.qi + (answered ? 1 : 0)) / total) * 100) + '%',
      months: months,
      answered: answered, notAnswered: !answered,
      feedback: !answered ? '' : (ok ? 'Yes! Month ' + curItem.month + '. Well spotted!' : 'So close! This was month ' + curItem.month + '.'),
      fbStyle: ok ? 'color:#2F6B3E' : 'color:#8A3B26',
      nextLabel: s.qi === total - 1 ? 'See my score' : 'Next postcard',
      nextPhoto: function () {
        if (self.state.qi >= total - 1) { self.swapCard(function () { self.setState({ view: 'done' }); }); return; }
        self.swapCard(function () { self.setState({ qi: self.state.qi + 1, picked: null }); });
      },
      doneMsg: doneMsg,
      replay: function () { self.setState({ view: 'game', order: self.shuffle(), qi: 0, picked: null, score: 0, results: [] }); },
      toGallery: function () { self.setState({ view: 'gallery' }); },
      backToGame: function () { self.setState({ view: s.qi === total - 1 && s.picked !== null ? 'done' : 'game' }); },
      trail: (function () {
        var res = s.results || [], out = [];
        for (var ti = 0; ti < total; ti++) {
          var st = res[ti] || (ti === s.qi ? 'cur' : '');
          out.push({ cls: st, label: 'Postcard ' + (ti + 1) + (st === 'right' ? ': guessed right' : st === 'wrong' ? ': missed' : st === 'cur' ? ': now playing' : ': coming up'),
            icon: st === 'right' ? 'M6 12.5 L10.5 17 L18 8' : st === 'wrong' ? 'M8 8 L16 16 M16 8 L8 16' : '' });
        }
        return out;
      })(),
      trailNote: (s.results || []).length ? (s.results || []).filter(function (x) { return x === 'right'; }).length + ' of ' + (s.results || []).length + ' right' : 'Let\'s begin!',
      photos: photos, photoCount: photos.length, total: total,
      hasPhotos: hasPhotos, noPhotos: !hasPhotos, galleryStrip: s.view === 'gallery' && hasPhotos, gallerySoon: s.view === 'gallery' && !hasPhotos,
      photoLabel: hasPhotos ? photos.length + ' photos' : 'Coming soon',
      stripPrev: function () { scrollStrip(-1); },
      stripNext: function () { scrollStrip(1); },
      lbOpen: s.lb !== null,
      lbPhoto: photos[lbi],
      lbPrev: function () { self.setState({ lb: (lbi - 1 + photos.length) % photos.length }); },
      lbNext: function () { self.setState({ lb: (lbi + 1) % photos.length }); },
      lbClose: function () { self.setState({ lb: null }); },
      stars: stars
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-MilestonesDesktop">
      <div className={`stage v-${v.view}`} ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="lyr far" />
          <span className="gull g1">
            <svg viewBox="0 0 24 12">
              <path className="wu" d="M0 5 C4 1 8 1 11.4 5.6 C14 1 19 1 24 5 C19 4 15 5.2 12.4 8 L11.4 8 C8.6 5.4 4.6 4.2 0 5 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6"}} />
              <path className="wd" d="M0 9 C4 8.4 8 7.6 11 6 L13 6 C16 7.6 20 8.4 24 9 C20 9.8 16 9.4 12.6 8.4 L11.4 8.4 C8 9.4 4 9.8 0 9 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6"}} />
            </svg>
          </span>
          <span className="gull g2">
            <svg viewBox="0 0 24 12">
              <path className="wu" d="M0 5 C4 1 8 1 11.4 5.6 C14 1 19 1 24 5 C19 4 15 5.2 12.4 8 L11.4 8 C8.6 5.4 4.6 4.2 0 5 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6","animationDelay":"-.2s"}} />
              <path className="wd" d="M0 9 C4 8.4 8 7.6 11 6 L13 6 C16 7.6 20 8.4 24 9 C20 9.8 16 9.4 12.6 8.4 L11.4 8.4 C8 9.4 4 9.8 0 9 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6","animationDelay":"-.2s"}} />
            </svg>
          </span>
          <span className="gull g3">
            <svg viewBox="0 0 24 12">
              <path className="wu" d="M0 5 C4 1 8 1 11.4 5.6 C14 1 19 1 24 5 C19 4 15 5.2 12.4 8 L11.4 8 C8.6 5.4 4.6 4.2 0 5 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6","animationDelay":"-.35s"}} />
              <path className="wd" d="M0 9 C4 8.4 8 7.6 11 6 L13 6 C16 7.6 20 8.4 24 9 C20 9.8 16 9.4 12.6 8.4 L11.4 8.4 C8 9.4 4 9.8 0 9 Z" fill="#FBF8F0" stroke="#8A9096" style={{"strokeWidth":".6","animationDelay":"-.35s"}} />
            </svg>
          </span>
          <div className="lyr boat1" />
          <div className="lyr boat2" />
          <div className="lyr laundry" />
          <span className="env e1">
            <svg viewBox="0 0 28 19">
              <rect x="1" y="1" width="26" height="17" rx="1.5" fill="#FFF8E8" stroke="#D9C8A4" style={{"strokeWidth":".8"}} />
              <path d="M1 1 L14 11 L27 1" fill="none" stroke="#D9C8A4" style={{"strokeWidth":".8"}} />
              <rect x="2.5" y="2.5" width="23" height="14" fill="none" stroke="#C0504D" style={{"strokeWidth":"1.4","strokeDasharray":"3 3"}} />
            </svg>
          </span>
          <span className="env e2">
            <svg viewBox="0 0 28 19">
              <rect x="1" y="1" width="26" height="17" rx="1.5" fill="#FFF8E8" stroke="#D9C8A4" style={{"strokeWidth":".8"}} />
              <path d="M1 1 L14 11 L27 1" fill="none" stroke="#D9C8A4" style={{"strokeWidth":".8"}} />
              <rect x="2.5" y="2.5" width="23" height="14" fill="none" stroke="#3E6EA8" style={{"strokeWidth":"1.4","strokeDasharray":"3 3"}} />
            </svg>
          </span>
          <div className="lyr wall" />
        </div>
        <div className="layer topshade" />
        <div className="layer rightshade" />
        <div className="chtitle">
          <p className="lift ca" style={{"margin":"0","fontSize":"12px","fontWeight":"700","letterSpacing":".28em","textTransform":"uppercase"}}>
            Chapter III · Little Moments
          </p>
          {v.inGallery ? (
            <>
              <h1 className="script lift ca" style={{"margin":"4px 0 0","fontSize":"52px","lineHeight":"1.1","color":"#F5D68A"}}>
                Pre-Birthday Photoshoot
              </h1>
            </>
          ) : null}
          {v.notGallery ? (
            <>
              <h1 className="script lift ca" style={{"margin":"4px 0 0","fontSize":"52px","lineHeight":"1.1","color":"#F5D68A"}}>
                Can You Guess Dylan's Month?
              </h1>
            </>
          ) : null}
        </div>
        {v.inGame ? (
          <>
            <div className="card">
              <span className="stamp" aria-hidden="true">
                <svg width="24" height="28" viewBox="0 0 20 22">
                  <path d="M10 3 C6 6 4 10 6 15 C8 19 13 19 15 15 C17 10 14 6 10 3 Z" fill="#7FA552" />
                  <path d="M10 5 L10 18" stroke="#3E6E3A" style={{"strokeWidth":"1"}} />
                </svg>
              </span>
              {v.cur?.hasSrc ? (
                <>
                  <img src={v.cur?.src} alt="Mystery milestone photo of Dylan" />
                </>
              ) : null}
              {v.cur?.noSrc ? (
                <>
                  <div className="ph" role="img" aria-label="Placeholder for a milestone photo">
                    <svg width="44" height="36" viewBox="0 0 34 28" aria-hidden="true" fill="none" stroke="#7A5E42" style={{"strokeWidth":"1.8","strokeLinejoin":"round"}}>
                      <rect x="2" y="6" width="30" height="20" rx="4" />
                      <path d="M11 6 L13.5 2 H20.5 L23 6" />
                      <circle cx="17" cy="16" r="5.5" />
                    </svg>
                    <p>
                      Milestone photo
                    </p>
                    <p style={{"fontWeight":"600","letterSpacing":"0","textTransform":"none"}}>
                      mystery #{v.cur?.num}
                    </p>
                  </div>
                </>
              ) : null}
              <div className="cardcap">
                <span className="script" style={{"fontSize":"26px","color":"#5E4A36"}}>
                  Which month is this?
                </span>
                <span style={{"fontSize":"12px","color":"#8A6D4F"}}>
                  #{v.cur?.num}
                </span>
              </div>
            </div>
          </>
        ) : null}
        {(v.stars || []).map((s, s$i) => (
          <React.Fragment key={s$i}>
            <span className="star">
              <svg viewBox="0 0 14 14">
                <path d="M7 0 L8.6 5.4 L14 7 L8.6 8.6 L7 14 L5.4 8.6 L0 7 L5.4 5.4 Z" fill={s?.color} />
              </svg>
            </span>
          </React.Fragment>
        ))}
        {v.gallerySoon ? (
          <>
            <div className="soonwrap">
              <div className="soonbox" role="status">
                <span className="sooncam">
                  <svg width="40" height="33" viewBox="0 0 34 28" aria-hidden="true" fill="none" stroke="#7A5E42" style={{"strokeWidth":"1.8","strokeLinejoin":"round"}}>
                    <rect x="2" y="6" width="30" height="20" rx="4" />
                    <path d="M11 6 L13.5 2 H20.5 L23 6" />
                    <circle cx="17" cy="16" r="5.5" />
                  </svg>
                </span>
                <p className="soont">
                  Coming soon
                </p>
                <p className="soonp">
                  Dylan's pre-birthday photoshoot is on its way. Check back soon for a peek at his big-day portraits!
                </p>
              </div>
            </div>
          </>
        ) : null}
        {v.galleryStrip ? (
          <>
            <div className="stripwrap">
              <div className="strip" role="list" aria-label="Pre-birthday photos" ref={v.setStrip}>
                {(v.photos || []).map((p, p$i) => (
                  <React.Fragment key={p$i}>
                    <button className="thumb" type="button" role="listitem" onClick={p?.open} aria-label={`Enlarge photo ${p?.num}`}>
                      {p?.hasSrc ? (
                        <>
                          <img src={p?.src} alt={p?.alt} loading="lazy" />
                        </>
                      ) : null}
                      {p?.noSrc ? (
                        <>
                          <span className="ph">
                            <svg width="40" height="33" viewBox="0 0 34 28" aria-hidden="true" fill="none" stroke="#7A5E42" style={{"strokeWidth":"1.8","strokeLinejoin":"round"}}>
                              <rect x="2" y="6" width="30" height="20" rx="4" />
                              <path d="M11 6 L13.5 2 H20.5 L23 6" />
                              <circle cx="17" cy="16" r="5.5" />
                            </svg>
                            <p>
                              {"Photoshoot photo "}{p?.num}
                            </p>
                          </span>
                        </>
                      ) : null}
                      <p>
                        {p?.caption}
                      </p>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <button className="arrow" type="button" style={{"left":"-10px"}} onClick={v.stripPrev} aria-label="Previous photos">
                <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M10 3 L5 8 L10 13" fill="none" stroke="#F5EBD5" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
                </svg>
              </button>
              <button className="arrow" type="button" style={{"right":"-10px"}} onClick={v.stripNext} aria-label="Next photos">
                <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M6 3 L11 8 L6 13" fill="none" stroke="#F5EBD5" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
                </svg>
              </button>
            </div>
          </>
        ) : null}
        <div className="sheet">
          <div className="body">
            {v.inGame ? (
              <>
                <div className="gamebox">
                  <p className="script" style={{"margin":"0 0 12px","fontSize":"30px","lineHeight":"1.1","color":"#5E4A36"}}>
                    A year of little postcards
                  </p>
                  <div className="row">
                    <p className="lbl">
                      {"Photo "}{v.cur?.num}{" of "}{v.total}
                    </p>
                    <p className="lbl" style={{"color":"#264D35"}}>
                      {"Score "}{v.score}
                    </p>
                  </div>
                  <div className="bar" aria-hidden="true">
                    <div className="barfill" style={css(v.barStyle)} />
                  </div>
                  <p className="feedback" role="status" style={css(v.fbStyle)}>
                    {v.feedback}
                  </p>
                  <div className="months" role="group" aria-label="Choose the month">
                    {(v.months || []).map((m, m$i) => (
                      <React.Fragment key={m$i}>
                        <button className={`mbtn ${m?.cls}`} type="button" onClick={m?.pick} aria-label={`Month ${m?.n}`}>
                          {m?.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{"display":"flex","justifyContent":"center","alignItems":"center","marginTop":"18px","minHeight":"52px"}}>
                    {v.answered ? (
                      <>
                        <button className="primary" type="button" onClick={v.nextPhoto}>
                          {v.nextLabel}
                        </button>
                      </>
                    ) : null}
                    {v.notAnswered ? (
                      <>
                        <p style={{"margin":"0","fontSize":"14px","color":"#5E4A36"}}>
                          Pick the month you think the postcard shows
                        </p>
                      </>
                    ) : null}
                  </div>
                  <div className="trailbox">
                    <svg className="vine" viewBox="0 0 320 22" aria-hidden="true" preserveAspectRatio="none">
                      <path d="M2 12 C40 2 70 20 110 11 S 180 3 210 12 S 280 20 318 10" fill="none" stroke="#7FA552" style={{"strokeWidth":"1.6","strokeLinecap":"round"}} />
                      <path d="M60 11 C56 4 48 4 46 8 C50 12 56 13 60 11 Z M160 9 C164 2 172 2 174 6 C170 10 164 11 160 9 Z M250 14 C246 7 238 7 236 11 C240 15 246 16 250 14 Z" fill="#A9C46A" />
                      <circle cx="110" cy="11" r="3" fill="#E9A7A7" />
                      <circle cx="210" cy="12" r="3" fill="#F7D873" />
                    </svg>
                    <div className="row" style={{"marginTop":"10px"}}>
                      <p className="lbl">
                        Your postcard trail
                      </p>
                      <p className="lbl" style={{"color":"#8A6D4F"}}>
                        {v.trailNote}
                      </p>
                    </div>
                    <div className="stamps" role="list" aria-label="Your guesses so far">
                      {(v.trail || []).map((t, t$i) => (
                        <React.Fragment key={t$i}>
                          <span className={`stp ${t?.cls}`} role="listitem" aria-label={t?.label}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d={t?.icon} fill="none" stroke="currentColor" style={{"strokeWidth":"2.6","strokeLinecap":"round","strokeLinejoin":"round"}} />
                            </svg>
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="trailtip">
                      Every postcard is a little piece of Dylan's first year.
                    </p>
                  </div>
                </div>
              </>
            ) : null}
            {v.inDone ? (
              <>
                <div className="donebox" style={{"textAlign":"center","paddingTop":"40px"}}>
                  <p className="lbl">
                    {"All "}{v.total}{" photos guessed"}
                  </p>
                  <p className="display" style={{"margin":"10px 0 0","fontSize":"92px","lineHeight":"1","color":"#264D35"}}>
                    {v.score}
                    <span style={{"fontSize":"40px","color":"#8A6D4F"}}>
                      {" / "}{v.total}
                    </span>
                  </p>
                  <p className="script" style={{"margin":"10px 0 0","fontSize":"32px","color":"#5E4A36"}}>
                    {v.doneMsg}
                  </p>
                  <div style={{"display":"flex","flexDirection":"column","alignItems":"center","gap":"10px","marginTop":"28px"}}>
                    <button className="primary" type="button" onClick={v.toGallery}>
                      See the pre-birthday photoshoot
                    </button>
                    <button className="ghost" type="button" onClick={v.replay}>
                      Play again
                    </button>
                  </div>
                </div>
              </>
            ) : null}
            {v.inGallery ? (
              <>
                <div className="gallerybox" style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"24px"}}>
                  <div>
                    <p className="script" style={{"margin":"0","fontSize":"30px","lineHeight":"1.1","color":"#5E4A36"}}>
                      A little photoshoot before the big day
                    </p>
                    <p style={{"margin":"4px 0 0","fontSize":"14px","lineHeight":"1.5","color":"#2F4B2C"}}>
                      {v.hasPhotos ? (
                        <>
                          Use the arrows or swipe; tap a photo to see it larger.
                        </>
                      ) : null}
                      {v.noPhotos ? (
                        <>
                          The photos are on their way. Stay tuned!
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","alignItems":"flex-end","gap":"2px","flex":"none"}}>
                    <p className="lbl">
                      {v.photoLabel}
                    </p>
                    <button className="ghost" type="button" onClick={v.backToGame} style={{"padding":"0","minHeight":"36px"}}>
                      Back to the game
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="foot">
            <div style={{"display":"flex","flexDirection":"column","gap":"6px"}}>
              <div aria-hidden="true" style={{"display":"flex","gap":"6px","alignItems":"center"}}>
                <span className="dot" />
                <span className="dot" />
                <span className="dot on" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              {v.inGame ? (
                <>
                  <button className="ghost" type="button" onClick={v.toGallery} style={{"padding":"0","minHeight":"28px","textAlign":"left"}}>
                    Skip to the photoshoot
                  </button>
                </>
              ) : null}
              {v.notInGame ? (
                <>
                  <p style={{"margin":"0","fontSize":"12px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#2F4B2C"}}>
                    Chapter 3 of 8
                  </p>
                </>
              ) : null}
            </div>
            <button className="next" type="button" onClick={v.goNext}>
              {"Next: Dress code "}
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="#F5D68A" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
              </svg>
            </button>
            <Link to="/dress-code" className="nextlink" tabIndex="-1" aria-hidden="true">
              Chapter 4
            </Link>
          </div>
        </div>
        {v.lbOpen ? (
          <>
            <div className="lb" role="dialog" aria-modal="true" aria-label="Enlarged photo">
              {v.lbPhoto?.hasSrc ? (
                <>
                  <img src={v.lbPhoto?.src} alt={v.lbPhoto?.alt} />
                </>
              ) : null}
              {v.lbPhoto?.noSrc ? (
                <>
                  <div className="ph" role="img" aria-label="Placeholder photo">
                    <p>
                      {"Photoshoot photo "}{v.lbPhoto?.num}
                    </p>
                  </div>
                </>
              ) : null}
              <p style={{"margin":"0","minHeight":"20px","fontSize":"16px","color":"#F5EBD5"}}>
                {v.lbPhoto?.caption}
              </p>
              <div style={{"display":"flex","gap":"16px","alignItems":"center"}}>
                <button className="lbtn" type="button" onClick={v.lbPrev} aria-label="Previous photo">
                  <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 L5 8 L10 13" fill="none" stroke="#F5EBD5" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
                  </svg>
                </button>
                <p style={{"margin":"0","fontSize":"14px","fontWeight":"700","color":"#F5EBD5"}}>
                  {v.lbPhoto?.num}{" / "}{v.photoCount}
                </p>
                <button className="lbtn" type="button" onClick={v.lbNext} aria-label="Next photo">
                  <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3 L11 8 L6 13" fill="none" stroke="#F5EBD5" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
                  </svg>
                </button>
                <button className="lbtn" type="button" onClick={v.lbClose} aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 3 L13 13 M13 3 L3 13" fill="none" stroke="#F5EBD5" style={{"strokeWidth":"1.8","strokeLinecap":"round"}} />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : null}
        <div className="under4" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
