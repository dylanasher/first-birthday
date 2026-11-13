/* eslint-disable */
// DetailsMobile: phone & tablet-portrait layout, fills the screen. Ported from the handoff's "ch2-phone.dc.html".
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { css } from '../lib/css.js';
import './DetailsMobile.css';

export default class DetailsMobile extends React.Component {
  static defaultProps = {"startTab":"ceremony"};

  constructor(props) {
    super(props);
    this.state = { tab: null, dir: 1 };
    this.root = null;
    this.tweens = [];
    this.tries = 0;
    this.order = ['ceremony', 'reception', 'parking'];
  }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.indRO) this.indRO.disconnect(); if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); }
    if (this.io) this.io.disconnect();
    clearTimeout(this.retry);
    this.tweens.forEach(function (t) { t.kill(); });
  }
  current() { return this.state.tab || this.props.startTab || 'ceremony'; }
  reduced() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  afterTab() {
    if (!this.root || !gsap) return;
    this.moveIndicator(true);
    if (this.reduced()) return;
    var items = this.root.querySelectorAll('.panel .a');
    gsap.fromTo(items, { x: 22 * this.state.dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: 'expo.out', clearProps: 'transform' });
    var sc = this.root.querySelector('.scroll'); if (sc) sc.scrollTop = 0;
    this.shine();
  }
  moveIndicator(animate) {
    var btn = this.root.querySelector('.t-' + this.current());
    var ind = this.root.querySelector('.ind');
    if (!btn || !ind) return;
    /* wait until the tabs are really laid out (the board can mount while hidden), then keep the pill in sync if they resize */
    if (!btn.offsetWidth) { var me = this; if ((this.indTries = (this.indTries || 0) + 1) < 60) setTimeout(function () { me.moveIndicator(false); }, 150); return; }
    this.indTries = 0;
    if (btn.parentNode && btn.parentNode.classList) btn.parentNode.classList.add('ready');
    if (!this.indRO && window.ResizeObserver && btn.parentNode) { var me2 = this; this.indRO = new ResizeObserver(function () { me2.moveIndicator(false); }); this.indRO.observe(btn.parentNode); }
    var props = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (animate && !this.reduced()) gsap.to(ind, Object.assign(props, { duration: 0.55, ease: 'expo.out' }));
    else gsap.set(ind, props);
  }
  shine() {
    var s = this.root.querySelector('.panel .shine');
    if (s && !this.reduced()) gsap.fromTo(s, { left: '-40%' }, { left: '130%', duration: 1.4, ease: 'power2.inOut', delay: 0.5 });
  }
  boot() {
    var self = this;
    if (!this.root || !gsap) {
      if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120);
      else this.hideGust();
      return;
    }
    var g = gsap, r = this.root, t = this.tweens;
    this.moveIndicator(false);
    try { document.fonts.ready.then(function () { self.moveIndicator(false); }); } catch (e) {}
    if (this.reduced()) { this.hideGust(); return; }
    var q = function (s) { return r.querySelector(s); };
    var qa = function (s) { return r.querySelectorAll(s); };

    /* entrance: the scene settles, title floats in, schedule draws, the page rises */
    // 1. the leaves that carried us here blow away, then 2. the chapter makes its entrance
    var intro = g.timeline({ paused: true });
    intro.add(this.openGust(g), 0);
    // 3. then the details slowly appear (the whole entrance plays at a gentler pace)
    var tl = g.timeline();
    tl.timeScale(0.7);
    tl.from(q('.scene'), this.mode() === 'leaves' ? { scale: 1.1, y: 20, duration: 2.0, ease: 'power3.out' } : { duration: 0.01 }, 0)
      .from(qa('.ca'), { y: -16, opacity: 0, filter: 'blur(4px)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.3)
      .from(q('.tline'), { y: 14, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.7)
      .from(q('.trackfill'), { scaleX: 0, duration: 1.4, ease: 'power2.inOut' }, 1.0)
      .from(qa('.sdot'), { scale: 0, duration: 0.5, stagger: 0.45, ease: 'back.out(3)' }, 1.0)
      .from(q('.sheet'), { yPercent: 100, duration: 1.15, ease: 'expo.out' }, 0.55)
      .from(qa('.tab, .ind'), { y: 12, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 1.0)
      .from(qa('.panel .a, .foot'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 1.15)
      .from(qa('.panel .pin svg'), { y: -14, duration: 0.7, ease: 'bounce.out' }, 1.6);
    intro.add(tl, this.revealEnd || 4.0);
    // 4. once the page has settled, the countryside comes alive: wind, falling leaves, bell, birds
    intro.call(function () {
      if (self.alive) return;
      self.alive = true;
      self.shine();
      // every position below is measured on the painting, then scaled to however big the scene is on this phone
      var sf = r.querySelector('.scenefit'), f = sf && sf.offsetHeight ? sf.offsetHeight / 886 : 1;
      var bto = (r.offsetWidth - (sf ? sf.offsetLeft : 0)) + 40;
      self.ambient(g, q, qa, t, { k: 0.7, leafX: [10 * f, 250 * f], leafY: [30 * f, 200 * f], fall: [480 * f, 640 * f], drift: [60 * f, 160 * f], birdY: [222 * f, 244 * f], birdTo: bto, scale: 0.9 * f });
    }, null, 0.2);
    t.push(intro);
    this.intro = intro;
    // the intro waits until this chapter is actually on screen, and replays each time you arrive
    this.watchVisibility();
    t.push(g.to(qa('.sdot'), { boxShadow: '0 0 0 5px rgba(245,214,138,.15), 0 0 18px rgba(245,214,138,.9)', duration: 1.6, stagger: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3 }));
  }
  // the page turn now happens on Chapter 1 itself, so this chapter just continues from the revealed view
  mode() { return 'none'; }
  /* Option 1, stepping out of the woods: we start pressed up against the big tree's leaves,
     then the branches lift away as the camera steps back into the sunlit valley */
  openWoods(g) {
    var r = this.root, H = r.offsetHeight;
    var scene = r.querySelector('.scene'), lvs = r.querySelectorAll('.lva, .lvb');
    var tl = g.timeline();
    tl.set(r.querySelector('.gust'), { display: 'none' }, 0)
      .fromTo(scene, { scale: 2.5, transformOrigin: '16% 6%', filter: 'brightness(0.8)' }, { scale: 1, filter: 'brightness(1)', duration: 2.8, ease: 'power2.inOut' }, 0)
      .fromTo(lvs, { y: H * 0.3, scale: 1.45 }, { y: 0, scale: 1, duration: 2.6, ease: 'power2.inOut', stagger: 0.12 }, 0)
      .set(scene, { filter: 'none' }, 2.85);
    this.revealEnd = 2.3;
    return tl;
  }
  /* Option 4, storybook page turn: Chapter 1's page curls away from the bottom-right corner */
  openPage(g) {
    var r = this.root, W = r.offsetWidth, H = r.offsetHeight;
    var page = r.querySelector('.page'), front = r.querySelector('.pfront'), flap = r.querySelector('.pflap');
    function clip(poly, keepBelow, c) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        var fa = a[0] + a[1] - c, fb = b[0] + b[1] - c;
        var inA = keepBelow ? fa <= 0 : fa >= 0, inB = keepBelow ? fb <= 0 : fb >= 0;
        if (inA) out.push(a);
        if (inA !== inB) { var k = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
      }
      return out;
    }
    function css(pts) {
      if (pts.length < 3) return 'polygon(0px 0px, 0px 0px, 0px 0px)';
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(', ') + ')';
    }
    var rect = [[0, 0], [W, 0], [W, H], [0, H]];
    var st = { c: W + H };
    function draw() {
      var c = st.c;
      front.style.clipPath = css(clip(rect, true, c));
      // the folded-over part is mirrored across the fold line, showing the cream back of the page
      flap.style.clipPath = css(clip(rect, false, c).map(function (p) { return [c - p[1], c - p[0]]; }));
    }
    draw();
    var tl = g.timeline();
    tl.set(r.querySelector('.gust'), { display: 'none' }, 0)
      .set(page, { display: 'block' }, 0)
      .set(st, { c: W + H, onComplete: draw }, 0)
      .to(st, { c: -40, duration: 1.9, ease: 'power2.inOut', onUpdate: draw }, 0.35)
      .set(page, { display: 'none' }, 2.3);
    this.revealEnd = 1.8;
    return tl;
  }
  /* storybook page turn to Chapter 3: this page curls away from the bottom-right corner,
     revealing the seaside town, then Chapter 3 continues from that exact view */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under3'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
    function clip(poly, keepBelow, c) {
      var out = [];
      for (var i = 0; i < poly.length; i++) {
        var a = poly[i], b = poly[(i + 1) % poly.length];
        var fa = a[0] + a[1] - c, fb = b[0] + b[1] - c;
        var inA = keepBelow ? fa <= 0 : fa >= 0, inB = keepBelow ? fb <= 0 : fb >= 0;
        if (inA) out.push(a);
        if (inA !== inB) { var k = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
      }
      return out;
    }
    function css(pts) {
      if (pts.length < 3) return 'polygon(0px 0px, 0px 0px, 0px 0px)';
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px'; }).join(', ') + ')';
    }
    var rect = [[0, 0], [W, 0], [W, H], [0, H]];
    var st = { c: W + H };
    function draw() {
      var c = st.c, turned = clip(rect, false, c);
      under.style.clipPath = css(turned);
      flap.style.clipPath = css(turned.map(function (p) { return [c - p[1], c - p[0]]; }));
    }
    draw();
    under.style.display = 'block';
    wrap.style.display = 'block';
    g.set(r, { pointerEvents: 'none' });
    g.to(st, { c: -40, duration: 2.0, ease: 'power2.inOut', onUpdate: draw, onComplete: function () {
      if (link) link.click();
      setTimeout(function () { under.style.display = 'none'; wrap.style.display = 'none'; g.set(r, { pointerEvents: 'auto' }); self.turning = false; }, 800);
    } });
  }
  watchVisibility() {
    var self = this, r = this.root;
    if (!('IntersectionObserver' in window)) { this.intro.play(); return; }
    this.io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { if (!self.seen) { self.seen = true; self.intro.restart(); } }
        else self.seen = false;
      });
    }, { threshold: 0.15 });
    this.io.observe(r);
  }
  gustData(n, min, range) {
    var pal = ['#7FA552', '#A9C46A', '#5E8A45', '#C9C46A', '#94B85E', '#6F9A4C', '#B5C977', '#86AD58'];
    var out = [];
    for (var i = 0; i < n; i++) { var s = min + ((i * 37) % range); out.push({ color: pal[i % pal.length], style: 'width:' + s + 'px;height:' + s + 'px' }); }
    return out;
  }
  hideGust() {
    var gu = this.root && this.root.querySelector('.gust');
    if (gu) gu.style.display = 'none';
  }
  /* leafCurtainTransition (in): a gust of leaves crosses the faded countryside, then the scene comes up to full */
  openGust(g) {
    if (this.mode() === 'none') {
      var t0 = g.timeline();
      t0.set(this.root.querySelector('.gust'), { display: 'none' }, 0);
      this.revealEnd = 0.3;
      return t0;
    }
    if (this.mode() === 'woods') return this.openWoods(g);
    if (this.mode() === 'pageturn') return this.openPage(g);
    this.revealEnd = 4.0;
    var r = this.root, W = r.offsetWidth, H = r.offsetHeight;
    var leaves = r.querySelectorAll('.gleaf'), scene = r.querySelector('.scene');
    var each = W > 800 ? 0.011 : 0.02;
    var tl = g.timeline();
    tl.set(r.querySelector('.gust'), { display: 'block' }, 0).set(scene, { filter: 'blur(14px)' }, 0);
    // 1. leaves fall from above, tumbling and drifting with the breeze, over the faded countryside
    tl.fromTo(leaves, {
      // leaves let go from the big tree in the upper-left corner
      x: function () { return g.utils.random(-W * 0.25, W * 0.4); },
      y: function () { return g.utils.random(-H * 0.45, H * 0.1); },
      rotation: function () { return g.utils.random(0, 360); },
      scale: function () { return g.utils.random(0.8, 1.3); },
      opacity: 1
    }, {
      // ...and drift diagonally down and to the right with the breeze
      y: function () { return '+=' + g.utils.random(H * 0.9, H * 1.3); },
      x: function () { return '+=' + g.utils.random(W * 0.35, W * 0.85); },
      rotation: '+=300',
      duration: function () { return g.utils.random(2.2, 3.0); },
      ease: 'none',
      stagger: { each: each, from: 'random' }
    }, 0)
      .to(r.querySelectorAll('.gleaf svg'), { scaleX: -1, x: 'random(-12, 12)', duration: 0.34, ease: 'sine.inOut', yoyo: true, repeat: 11, stagger: { each: each, from: 'random' } }, 0)
      .to(leaves, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 3.6)
      // 2. after the leaves have fallen, the countryside slowly comes into focus
      .to(scene, { filter: 'blur(0px)', duration: 2.0, ease: 'power1.inOut' }, 2.8)
      .set(scene, { filter: 'none' }, 4.85)
      .set(r.querySelector('.gust'), { display: 'none' }, 4.3);
    return tl;
  }
  /* the countryside breathes: wind in the big tree, falling leaves, the chapel bell, a small flock */
  ambient(g, q, qa, t, o) {
    // wind: the trunk stays still; each leaf cluster sways on its own timing in uneven gusts
    var k = o.k;
    function gusts(el, amp, base, delay) {
      var w = g.timeline({ repeat: -1, delay: delay });
      // the canopy hangs from the top edge: skewing about the top keeps that edge fixed, so no gap opens
      w.to(el, { skewX: -amp * k, duration: base, ease: 'sine.inOut' })
        .to(el, { skewX: -amp * 0.3 * k, duration: base * 0.6, ease: 'sine.inOut' })
        .to(el, { skewX: -amp * 1.25 * k, duration: base * 0.7, ease: 'sine.inOut' })
        .to(el, { skewX: amp * 0.35 * k, duration: base * 1.2, ease: 'sine.inOut' })
        .to(el, { skewX: 0, duration: base * 0.9, ease: 'sine.inOut' });
      t.push(w);
    }
    gusts(q('.lva'), 0.7, 2.4, 0);
    gusts(q('.lvb'), 1.1, 2.1, 0.35);
    // the clouds drift slowly across the sky behind the church
    var cld = q('.cld');
    if (cld) t.push(g.to(cld, { x: -16, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    // grass and flowers ripple in the same wind, from the ground up
    var flw = q('.flw');
    var fw = g.timeline({ repeat: -1, delay: 0.5 });
    fw.to(flw, { skewX: -0.9 * k, duration: 2.3, ease: 'sine.inOut' })
      .to(flw, { skewX: 0.35 * k, duration: 2.6, ease: 'sine.inOut' })
      .to(flw, { skewX: -0.5 * k, duration: 1.8, ease: 'sine.inOut' })
      .to(flw, { skewX: 0, duration: 2.2, ease: 'sine.inOut' });
    t.push(fw);
    // a few leaves let go and drift down with the breeze
    Array.prototype.forEach.call(qa('.leaf'), function (leaf, i) {
      var lt = g.timeline({ repeat: -1, repeatRefresh: true, delay: 1.2 + i * 1.6, repeatDelay: 1.5 });
      lt.fromTo(leaf, { x: 'random(' + o.leafX[0] + ',' + o.leafX[1] + ')', y: 'random(' + o.leafY[0] + ',' + o.leafY[1] + ')', rotation: 'random(0,360)', opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none' })
        .to(leaf, { y: '+=random(' + o.fall[0] + ',' + o.fall[1] + ')', x: '+=random(' + o.drift[0] + ',' + o.drift[1] + ')', rotation: '+=random(240,560)', duration: 'random(7,10)', ease: 'none' }, 0)
        .to(leaf, { opacity: 0, duration: 1.2, ease: 'none' }, '>-1.2');
      t.push(lt);
      t.push(g.to(leaf.querySelector('svg'), { scaleX: -1, x: 'random(-10,10)', duration: 'random(0.6,1.1)', ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
    // the chapel bell swings and rings, then rests
    var bell = q('.bell');
    // a slow, steady, never-ending swing from side to side
    var ring = g.fromTo(bell, { rotation: -16 }, { rotation: 16, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    t.push(ring);
    // a small flock crosses the sky in loose formation
    var flock = [[q('.b1'), 0, 0, 1], [q('.b2'), -26, 12, 0.82], [q('.b3'), -46, -4, 0.7]];
    flock.forEach(function (b, i) {
      g.set(b[0], { scale: b[3] * o.scale });
      t.push(g.fromTo(b[0], { x: -60 + b[1], y: o.birdY[0] + b[2] }, { x: o.birdTo + b[1], y: o.birdY[1] + b[2] - 40, duration: 16, ease: 'none', repeat: -1, repeatDelay: 6, delay: 1 }));
      t.push(g.to(b[0], { yPercent: 'random(-40,40)', duration: 'random(1.2,2)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true }));
    });
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
      g.set(p, { x: x + 18 + Math.random() * 16, y: y + 52, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.6, opacity: 0.95 });
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
    var self = this;
    var tab = this.current();
    function set(t) {
      return function () {
        var from = self.order.indexOf(self.current()), to = self.order.indexOf(t);
        if (from === to) return;
        self.setState({ tab: t, dir: to > from ? 1 : -1 });
        setTimeout(function () { self.afterTab(); }, 30);
      };
    }
    return {
      setRoot: function (el) { self.root = el; },
      gustLeaves: self.gustData(70, 13, 9),
      leaves: [{ color: '#7FA552' }, { color: '#A9C46A' }, { color: '#5E8A45' }, { color: '#C9C46A' }, { color: '#94B85E' }, { color: '#6F9A4C' }, { color: '#B5C977' }, { color: '#86AD58' }],
      isCer: tab === 'ceremony', isRec: tab === 'reception', isPark: tab === 'parking',
      tabCer: tab === 'ceremony' ? 'on' : '', tabRec: tab === 'reception' ? 'on' : '', tabPark: tab === 'parking' ? 'on' : '',
      pressCer: tab === 'ceremony' ? 'true' : 'false', pressRec: tab === 'reception' ? 'true' : 'false', pressPark: tab === 'parking' ? 'true' : 'false',
      showCer: set('ceremony'), showRec: set('reception'), showPark: set('parking'),
      goNext: function () { self.goNext(); }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-DetailsMobile">
      <div className="stage" ref={v.setRoot}>
        <div className="scenefit">
          <div className="scene" aria-hidden="true">
            <div className="lyr far" />
            <div className="lyr cld" />
            <div className="lyr chu" />
            <span className="bell" />
            <span className="bird b1">
              <svg viewBox="0 0 20 11">
                <path className="wu" d="M0 3.5 C3 1 6.5 1.2 9.2 5.4 C9.6 3 10.4 3 10.8 5.4 C13.5 1.2 17 1 20 3.5 C16.5 3.4 13.5 4.8 11 7.6 C10.4 8.6 9.6 8.6 9 7.6 C6.5 4.8 3.5 3.4 0 3.5 Z" fill="#3E4A50" />
                <path className="wd" d="M0 8.8 C3.4 8 6.5 7 9 5.6 C9.6 4.2 10.4 4.2 11 5.6 C13.5 7 16.6 8 20 8.8 C16.4 9.8 13.4 9.4 11 8.2 C10.4 9.2 9.6 9.2 9 8.2 C6.6 9.4 3.6 9.8 0 8.8 Z" fill="#3E4A50" />
              </svg>
            </span>
            <span className="bird b2">
              <svg viewBox="0 0 20 11">
                <path className="wu" d="M0 3.5 C3 1 6.5 1.2 9.2 5.4 C9.6 3 10.4 3 10.8 5.4 C13.5 1.2 17 1 20 3.5 C16.5 3.4 13.5 4.8 11 7.6 C10.4 8.6 9.6 8.6 9 7.6 C6.5 4.8 3.5 3.4 0 3.5 Z" fill="#46525A" style={{"animationDelay":"-.12s"}} />
                <path className="wd" d="M0 8.8 C3.4 8 6.5 7 9 5.6 C9.6 4.2 10.4 4.2 11 5.6 C13.5 7 16.6 8 20 8.8 C16.4 9.8 13.4 9.4 11 8.2 C10.4 9.2 9.6 9.2 9 8.2 C6.6 9.4 3.6 9.8 0 8.8 Z" fill="#46525A" style={{"animationDelay":"-.12s"}} />
              </svg>
            </span>
            <span className="bird b3">
              <svg viewBox="0 0 20 11">
                <path className="wu" d="M0 3.5 C3 1 6.5 1.2 9.2 5.4 C9.6 3 10.4 3 10.8 5.4 C13.5 1.2 17 1 20 3.5 C16.5 3.4 13.5 4.8 11 7.6 C10.4 8.6 9.6 8.6 9 7.6 C6.5 4.8 3.5 3.4 0 3.5 Z" fill="#4C585E" style={{"animationDelay":"-.22s"}} />
                <path className="wd" d="M0 8.8 C3.4 8 6.5 7 9 5.6 C9.6 4.2 10.4 4.2 11 5.6 C13.5 7 16.6 8 20 8.8 C16.4 9.8 13.4 9.4 11 8.2 C10.4 9.2 9.6 9.2 9 8.2 C6.6 9.4 3.6 9.8 0 8.8 Z" fill="#4C585E" style={{"animationDelay":"-.22s"}} />
              </svg>
            </span>
            <div className="lyr pth" />
            <div className="lyr trunk" />
            <div className="lyr lvb" />
            <div className="lyr lva" />
            {(v.leaves || []).map((l, l$i) => (
              <React.Fragment key={l$i}>
                <span className="leaf">
                  <svg viewBox="0 0 12 12">
                    <path d="M1 11 C1 5 5 1 11 1 C11 7 7 11 1 11 Z" fill={l?.color} />
                    <path className="vein" d="M1.5 10.5 L9.5 2.5" />
                  </svg>
                </span>
              </React.Fragment>
            ))}
            <div className="lyr flw" />
          </div>
        </div>
        <div className="layer topshade" />
        <div className="chtitle">
          <p className="lift ca" style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".26em","textTransform":"uppercase"}}>
            Chapter II · The Journey
          </p>
          <h1 className="script lift ca" style={{"margin":"4px 0 0","fontSize":"46px","lineHeight":"1.1","color":"#F5D68A"}}>
            {"Where & When"}
          </h1>
          <p className="display lift ca" style={{"margin":"2px 0 0","fontSize":"18px","fontStyle":"italic"}}>
            Sunday, December 13, 2026
          </p>
        </div>
        <div className="tline" aria-label="Schedule: Godparents arrive 1:00 PM, Baptism 1:30 PM, Reception 2:00 PM">
          <div className="track" aria-hidden="true">
            <div className="trackfill" />
          </div>
          <div className="step">
            <span className="sdot" />
            <p className="stime">
              1:00 PM
            </p>
            <p className="slbl">
              Godparents
            </p>
          </div>
          <div className="step">
            <span className="sdot" />
            <p className="stime">
              1:30 PM
            </p>
            <p className="slbl">
              Baptism
            </p>
          </div>
          <div className="step">
            <span className="sdot" />
            <p className="stime">
              2:00 PM
            </p>
            <p className="slbl">
              Reception
            </p>
          </div>
        </div>
        <div className="sheet">
          <div className="tabs" role="group" aria-label="Event details sections">
            <span className="ind" aria-hidden="true" />
            <button className={`tab t-ceremony ${v.tabCer}`} type="button" aria-pressed={v.pressCer} onClick={v.showCer}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M12 2v5M9.5 4.5h5M5 21V11l7-4 7 4v10M9 21v-5a3 3 0 0 1 6 0v5M3 21h18" />
              </svg>
              {" Ceremony"}
            </button>
            <button className={`tab t-reception ${v.tabRec}`} type="button" aria-pressed={v.pressRec} onClick={v.showRec}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M4 21h16M5 21v-7h14v7M5 14c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M8 14V11M12 14v-4M16 14v-3M12 6c.8-.8.8-2 0-3-.8 1-.8 2.2 0 3z" />
              </svg>
              {" Reception"}
            </button>
            <button className={`tab t-parking ${v.tabPark}`} type="button" aria-pressed={v.pressPark} onClick={v.showPark}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M10 17V7h3.5a3 3 0 0 1 0 6H10" />
              </svg>
              {" Parking"}
            </button>
          </div>
          <div className="scroll">
            {v.isCer ? (
              <>
                <div className="panel">
                  <p className="eyebrow a">
                    Holy Baptism
                  </p>
                  <h2 className="venue a">
                    Santuario de San Antonio Parish
                  </h2>
                  <p className="sub a">
                    Archdiocese of Manila
                  </p>
                  <div style={{"marginTop":"8px"}}>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round"}}>
                          <rect x="3" y="5" width="18" height="16" rx="3" />
                          <path d="M3 10h18M8 3v4M16 3v4" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Date
                        </p>
                        <p className="val">
                          Sunday, December 13, 2026
                        </p>
                      </div>
                    </div>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round"}}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Ceremony begins
                        </p>
                        <p className="val">
                          1:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="row a" style={{"borderBottom":"0"}}>
                      <span className="ico pin">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                          <circle cx="12" cy="9.5" r="2.5" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Address
                        </p>
                        <p className="val">
                          3117 McKinley Road, Forbes Park, Makati City
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="maps a">
                    <a className="btn primary" href="https://maps.app.goo.gl/Tag57jheAtuJ8mD97" target="_blank" rel="noopener">
                      Google Maps
                    </a>
                    <a className="btn secondary" href="https://waze.com/ul?q=Santuario%20de%20San%20Antonio%20Parish%2C%20Forbes%20Park%2C%20Makati&navigate=yes" target="_blank" rel="noopener">
                      Waze
                    </a>
                  </div>
                  <div className="note a">
                    <span className="shine" aria-hidden="true" />
                    <p>
                      <span className="script" style={{"fontSize":"22px","color":"#5E4A36"}}>
                        To our dear Godparents,
                      </span>
                      <br />
                      {"Kindly arrive at the church by "}
                      <strong>
                        1:00 PM
                      </strong>
                      , at least 30 minutes before the ceremony, for the baptismal preparations and briefing.
                    </p>
                  </div>
                </div>
              </>
            ) : null}
            {v.isRec ? (
              <>
                <div className="panel">
                  <p className="eyebrow a">
                    First Birthday Celebration
                  </p>
                  <h2 className="venue a">
                    Santuario de San Antonio Social Hall
                  </h2>
                  <p className="sub a">
                    Same address as the church
                  </p>
                  <div style={{"marginTop":"8px"}}>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round"}}>
                          <rect x="3" y="5" width="18" height="16" rx="3" />
                          <path d="M3 10h18M8 3v4M16 3v4" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Date
                        </p>
                        <p className="val">
                          Sunday, December 13, 2026
                        </p>
                      </div>
                    </div>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round"}}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Reception begins
                        </p>
                        <p className="val">
                          2:00 PM, right after the baptism
                        </p>
                      </div>
                    </div>
                    <div className="row a" style={{"borderBottom":"0"}}>
                      <span className="ico pin">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                          <circle cx="12" cy="9.5" r="2.5" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Address
                        </p>
                        <p className="val">
                          3117 McKinley Road, Forbes Park, Makati City
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="maps a">
                    <a className="btn primary" href="https://maps.app.goo.gl/WQ3vXG6wVcAmGwUY6" target="_blank" rel="noopener">
                      Google Maps
                    </a>
                    <a className="btn secondary" href="https://waze.com/ul?q=Santuario%20de%20San%20Antonio%20Parish%2C%20Forbes%20Park%2C%20Makati&navigate=yes" target="_blank" rel="noopener">
                      Waze
                    </a>
                  </div>
                </div>
              </>
            ) : null}
            {v.isPark ? (
              <>
                <div className="panel">
                  <p className="eyebrow a">
                    {"Church & Reception"}
                  </p>
                  <h2 className="venue a">
                    {"Parking & Arrival"}
                  </h2>
                  <p className="sub a">
                    Both venues share the same premises
                  </p>
                  <div style={{"marginTop":"8px"}}>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <rect x="3" y="3" width="18" height="18" rx="4" />
                          <path d="M10 17V7h3.5a3 3 0 0 1 0 6H10" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Where to park
                        </p>
                        <p className="val">
                          Within the church premises
                        </p>
                      </div>
                    </div>
                    <div className="row a">
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <path d="M4 12h13M13 7l5 5-5 5M20 4v16" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          Vehicle entrance
                        </p>
                        <p className="val">
                          Via McKinley Road
                        </p>
                      </div>
                    </div>
                    <div className="row a" style={{"borderBottom":"0"}}>
                      <span className="ico">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#264D35" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <circle cx="12" cy="6" r="2.5" />
                          <path d="M12 9v6M8 21l4-6 4 6M7 12h10" />
                        </svg>
                      </span>
                      <div>
                        <p className="lbl">
                          {"Parking & drop-off"}
                        </p>
                        <p className="val">
                          Please follow the parking attendants' directions for parking and drop-off areas.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="note a">
                    <span className="shine" aria-hidden="true" />
                    <p>
                      <strong>
                        Tip:
                      </strong>
                      {" We recommend arriving early to secure a spot, especially our Godparents arriving by 1:00 PM."}
                    </p>
                  </div>
                  <div className="maps a">
                    <a className="btn primary" href="https://maps.app.goo.gl/Tag57jheAtuJ8mD97" target="_blank" rel="noopener">
                      Directions to the church
                    </a>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className="foot">
            <div style={{"display":"flex","flexDirection":"column","gap":"5px"}}>
              <div aria-hidden="true" style={{"display":"flex","gap":"6px","alignItems":"center"}}>
                <span className="dot" />
                <span className="dot on" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#2F4B2C"}}>
                Chapter 2 of 8
              </p>
            </div>
            <button className="next" type="button" onClick={v.goNext}>
              {"Milestones "}
              <img className="soot-icon soot-next" src="/art/soot-sprite.webp" width="28" height="28" alt="" aria-hidden="true" draggable="false" />
            </button>
            <Link to="/milestones" className="nextlink" tabIndex="-1" aria-hidden="true">
              Chapter 3
            </Link>
          </div>
        </div>
        <div className="page" aria-hidden="true">
          <div className="pfront" />
          <div className="pflapwrap">
            <div className="pflap" />
          </div>
        </div>
        <div className="gust" aria-hidden="true">
          {(v.gustLeaves || []).map((gl, gl$i) => (
            <React.Fragment key={gl$i}>
              <span className="gleaf" style={css(gl?.style)}>
                <svg viewBox="0 0 12 12">
                  <path d="M1 11 C1 5 5 1 11 1 C11 7 7 11 1 11 Z" fill={gl?.color} />
                  <path className="gvein" d="M1.5 10.5 L9.5 2.5" />
                </svg>
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="under3" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
