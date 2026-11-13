/* eslint-disable */
// WishesMobile: phone & tablet-portrait layout, fills the screen. Ported from the handoff's "ch7-wishes-phone.dc.html".
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { css } from '../lib/css.js';
import './WishesMobile.css';

export default class WishesMobile extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    /* wishes sent from Chapter 6 will appear here; these two are samples for now */
    this.wishes = [{name: 'Tita Maria', text: 'May you grow up kind, brave and always curious. We love you so much, Dylan!'}, {name: 'Ninong Paolo', text: 'Happy 1st birthday, little one! May God guide and bless you every step of the way.'}];
    this.state = { i: 0 };
    this.root = null; this.tweens = []; this.tries = 0;
  }
  componentDidMount() { this.initTrailSoon(); this.fit(); this.boot(); }
  /* scale the girl and her wish card to the screen: fit the width, and leave room for the title above and the footer below */
  fit() {
    var self = this, r = this.root;
    if (!r) { if ((this.fitTries = (this.fitTries || 0) + 1) < 25) setTimeout(function () { self.fit(); }, 120); return; }
    var go = function () {
      var W = r.offsetWidth, H = r.offsetHeight; if (!W || !H) return;
      var card = r.querySelector('.wcard'), foot = r.querySelector('.foot');
      var content = card ? card.offsetTop + card.offsetHeight + 14 : 480, fh = foot ? foot.offsetHeight + 12 : 84;
      var top = H < 720 ? 104 : Math.max(140, H * 0.165);
      var fs = Math.min(1.35, (W - 8) / 390, (H - top - fh) / content);
      r.style.setProperty('--fs', Math.max(0.6, fs).toFixed(3));
      r.style.setProperty('--ft', top.toFixed(0) + 'px');
    };
    go();
    if ('ResizeObserver' in window) { this.ro = new ResizeObserver(go); this.ro.observe(r); var c = r.querySelector('.wcard'); if (c) this.ro.observe(c); }
  }
  componentWillUnmount() { if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); } clearTimeout(this.retry); clearInterval(this.auto); if (this.io) this.io.disconnect(); if (this.ro) this.ro.disconnect(); this.tweens.forEach(function (t) { t.kill(); }); }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  /* the card flutters over like a page in the wind as it shows the next wish */
  show(i, dir) {
    var self = this, n = this.wishes.length; if (n < 2) return;
    var to = (i + n) % n, card = this.root && this.root.querySelector('.wcard'), g = gsap;
    if (!card || !g || this.reduced()) { this.setState({ i: to }); return; }
    if (this.flipping) return; this.flipping = true;
    g.to(card, { rotationY: 90 * dir, duration: 0.35, ease: 'power2.in', onComplete: function () {
      self.setState({ i: to });
      g.fromTo(card, { rotationY: -90 * dir }, { rotationY: 0, duration: 0.55, ease: 'back.out(1.6)', onComplete: function () { self.flipping = false; } });
    } });
  }
  restartAuto() { var self = this; clearInterval(this.auto); this.auto = setInterval(function () { self.show(self.state.i + 1, 1); }, 8000); }
  boot() {
    var self = this;
    if (!this.root || !gsap) { if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120); return; }
    var g = gsap, r = this.root, t = this.tweens;
    this.restartAuto();
    if (this.reduced()) return;
    var q = function (s) { return r.querySelector(s); }, qa = function (s) { return r.querySelectorAll(s); };
    g.set(q('.wcard'), { transformPerspective: 900 });
    var intro = g.timeline({ paused: true });
    intro.from(qa('.ca'), { y: -14, opacity: 0, filter: 'blur(5px)', duration: 1, stagger: 0.14, ease: 'expo.out' }, 0.2).from(q('.flyer'), { x: -420, y: 80, rotation: -6, duration: 2, ease: 'power3.out' }, 0.3).from(q('.foot'), { yPercent: 100, duration: 0.9, ease: 'expo.out' }, 1.4)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 0.2);
    t.push(intro);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* flying through the clouds: sky drifts past, the flyer bobs, scarf flutters, card sways on its ribbon, sparkles trail behind */
  ambient(g, q, qa, t) {
    var r = this.root, W = r.offsetWidth, H = r.offsetHeight, sf = q('.scenefit'), f = sf && sf.offsetHeight ? sf.offsetHeight / 886 : 1;
    // the front cloud bank drifts slowly back and forth
    t.push(g.fromTo(q('.near'), { x: -10 * f }, { x: 10 * f, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var fl = q('.flyer');
    t.push(g.to(fl, { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(fl, { rotation: -0.8 }, { rotation: 0.8, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(q('.wcard'), { rotation: -2 }, { rotation: 2, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(q('.girl'), { rotation: -1.5, y: 0 }, { rotation: 1.5, y: -4, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var rib = q('.rib'), base = rib.getAttribute('d'), wob = { v: 0 };
    t.push(g.to(wob, { v: 1, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, onUpdate: function () {
      var d = (wob.v - 0.5) * 18;
      rib.setAttribute('d', base.replace(/C(\S+) (\S+) (\S+) (\S+)/, function (m, a, b, c, e) { return 'C' + a + ' ' + (parseFloat(b) + d) + ' ' + c + ' ' + (parseFloat(e) - d); }));
    } }));
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    Array.prototype.forEach.call(qa('.puff'), function (p, i) {
      (function drift(first) {
        var w = rnd(110, 200), y = rnd(H * 0.05, H * 0.62);
        g.set(p, { width: w, height: w * 0.45, x: first ? rnd(0, W) : W + 40, y: y, opacity: rnd(0.18, 0.38) });
        var d = rnd(9, 16);
        t.push(g.to(p, { x: -w - 40, duration: first ? d * 0.6 : d, ease: 'none', delay: first ? 0 : rnd(0, 2), onComplete: function () { drift(false); } }));
      })(true);
    });
    Array.prototype.forEach.call(qa('.spark'), function (s, i) {
      (function fly(first) {
        var fb = fl.getBoundingClientRect(), rr = q('.flyer').parentNode.getBoundingClientRect(), scl = rr.width / q('.flyer').parentNode.offsetWidth || 1;
        var fs = parseFloat(getComputedStyle(r).getPropertyValue('--fs')) || 1;
        var x0 = (fb.left - rr.left) / scl + 91 * fs + rnd(-6, 6), y0 = (fb.top - rr.top) / scl + 153 * fs + rnd(-6, 6);
        g.set(s, { x: x0, y: y0, opacity: 0, scale: rnd(0.5, 1.1) });
        var tl = g.timeline({ delay: first ? i * 0.5 : rnd(0.1, 1.2), onComplete: function () { fly(false); } });
        tl.to(s, { opacity: 1, duration: 0.25 }).to(s, { x: x0 - rnd(80, 180), y: y0 + rnd(-20, 40), duration: rnd(1.4, 2.2), ease: 'sine.out' }, 0).to(s, { opacity: 0, duration: 0.6 }, '>-0.6');
        t.push(tl);
      })(true);
    });
  }
  /* storybook page turn to the next chapter: curls from the bottom-right corner, revealing its scene */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under8'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
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
    g.to(st, { c: -40, duration: 2.0, ease: 'power2.inOut', onUpdate: draw, onComplete: function () {
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
    var self = this, n = this.wishes.length, w = this.wishes[this.state.i] || { text: 'No wishes yet. Be the first to leave one!', name: 'Dylan' };
    return {
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      cardStyle: (function () {
        /* each wish gets its own pastel card from the invitation palette */
        var tints = [['rgba(249,226,226,.72)','rgba(239,198,200,.62)','#D98C8C'], ['rgba(221,236,248,.74)','rgba(186,215,240,.62)','#5E9BD0'], ['rgba(252,240,200,.74)','rgba(247,222,140,.6)','#C9A24E'], ['rgba(226,238,218,.74)','rgba(192,214,180,.62)','#6D8F62'], ['rgba(252,228,214,.74)','rgba(240,196,172,.62)','#D97A5E'], ['rgba(234,226,246,.74)','rgba(206,192,234,.62)','#8A72B8']];
        var c = tints[self.state.i % tints.length];
        return '--c1:' + c[0] + ';--c2:' + c[1] + ';--pin:' + c[2];
      })(),
      wishText: w.text, wishName: w.name, wishNum: Math.min(this.state.i + 1, n || 1), wishTotal: n || 1,
      prevWish: function () { self.show(self.state.i - 1, -1); self.restartAuto(); },
      nextWish: function () { self.show(self.state.i + 1, 1); self.restartAuto(); }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-WishesMobile">
      <div className="stage" ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="scenefit">
            <div className="bg far" />
            <span className="puff" />
            <span className="puff" />
            <span className="puff" />
            <span className="puff" />
            <span className="puff" />
            <div className="bg near" />
          </div>
        </div>
        <div className="layer topshade" />
        <div className="head">
          <p className="lift ca" style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".26em","textTransform":"uppercase"}}>
            Chapter VII · Wishes in the Sky
          </p>
          <h1 className="script lift ca" style={{"margin":"0","fontSize":"40px","lineHeight":"1.1","color":"#F5D68A"}}>
            Wishes for Dylan
          </h1>
          <p className="lift ca" style={{"margin":"2px 0 0","fontSize":"13px","fontWeight":"600"}}>
            Carried across the clouds, one wish at a time
          </p>
        </div>
        <div className="flyfit">
          <div className="flyer">
            <svg className="ribbon" aria-hidden="true" overflow="visible">
              <path className="rib" d="M91 153 C112 205 236 172 303 215" fill="none" stroke="#E9A7A7" style={{"strokeWidth":"2.4","strokeLinecap":"round"}} />
            </svg>
            <div className="girl" role="img" aria-label="A girl flying on a broomstick" />
            <div className="wcard" style={css(v.cardStyle)} role="region" aria-label="Wishes for Dylan" aria-live="polite">
              <span className="wq" aria-hidden="true">
                “
              </span>
              <p className="wtext">
                {v.wishText}
              </p>
              <p className="wname">
                {"— "}{v.wishName}
              </p>
              <div className="wnav">
                <button className="warrow" type="button" onClick={v.prevWish} aria-label="Previous wish">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 L5 8 L10 13" fill="none" stroke="#5B4A7A" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}} />
                  </svg>
                </button>
                <p className="wcount">
                  {"Wish "}{v.wishNum}{" of "}{v.wishTotal}
                </p>
                <button className="warrow" type="button" onClick={v.nextWish} aria-label="Next wish">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3 L11 8 L6 13" fill="none" stroke="#5B4A7A" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <span className="spark" />
        <span className="spark" />
        <span className="spark" />
        <span className="spark" />
        <span className="spark" />
        <div className="foot">
          <div style={{"display":"flex","flexDirection":"column","gap":"5px"}}>
            <div className="dots" aria-hidden="true">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot on" />
              <span className="dot" />
            </div>
            <p className="chap">
              Chapter 7 of 8
            </p>
          </div>
          <Link to="/rsvp" className="leave">
            Add yours
          </Link>
          <button className="next" type="button" onClick={v.goNext}>
            {"Thank you "}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="#F7D873" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
            </svg>
          </button>
          <Link to="/thank-you" className="nextlink" tabIndex="-1" aria-hidden="true">
            Next chapter
          </Link>
        </div>
        <div className="under8" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
