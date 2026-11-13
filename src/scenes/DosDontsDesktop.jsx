/* eslint-disable */
// DosDontsDesktop: desktop layout, 1440×900. Ported from the "Ch5Desktop.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import './DosDontsDesktop.css';

export default class DosDontsDesktop extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = { tab: 'do', dir: 1 };
    this.root = null;
    this.tweens = [];
    this.tries = 0;
  }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.indRO) this.indRO.disconnect(); if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); } clearTimeout(this.retry); if (this.io) this.io.disconnect(); this.tweens.forEach(function (t) { t.kill(); }); }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  moveIndicator(animate) {
    var btn = this.root && this.root.querySelector('.t-' + this.state.tab), ind = this.root && this.root.querySelector('.ind');
    if (!btn || !ind || !gsap) return;
    /* wait until the tabs are really laid out (the board can mount while hidden), then keep the pill in sync if they resize */
    if (!btn.offsetWidth) { var me = this; if ((this.indTries = (this.indTries || 0) + 1) < 60) setTimeout(function () { me.moveIndicator(false); }, 150); return; }
    this.indTries = 0;
    if (btn.parentNode && btn.parentNode.classList) btn.parentNode.classList.add('ready');
    if (!this.indRO && window.ResizeObserver && btn.parentNode) { var me2 = this; this.indRO = new ResizeObserver(function () { me2.moveIndicator(false); }); this.indRO.observe(btn.parentNode); }
    var p = { x: btn.offsetLeft, width: btn.offsetWidth, backgroundColor: this.state.tab === 'do' ? '#6D8F62' : '#D97A5E' };
    if (animate && !this.reduced()) gsap.to(ind, Object.assign(p, { duration: 0.55, ease: 'expo.out' })); else gsap.set(ind, p);
  }
  afterTab() {
    if (!this.root || !gsap) return;
    this.moveIndicator(true);
    if (this.reduced()) return;
    gsap.fromTo(this.root.querySelectorAll('.panel .a'), { x: 24 * this.state.dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' });
    var sc = this.root.querySelector('.scroll'); if (sc) sc.scrollTop = 0;
  }
  boot() {
    var self = this;
    if (!this.root || !gsap) { if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120); return; }
    var g = gsap, r = this.root, t = this.tweens;
    this.moveIndicator(false);
    try { document.fonts.ready.then(function () { self.moveIndicator(false); }); } catch (e) {}
    if (this.reduced()) return;
    var q = function (s) { return r.querySelector(s); }, qa = function (s) { return r.querySelectorAll(s); };
    var intro = g.timeline({ paused: true });
    intro.from(q('.sheet'), { x: 90, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.3).from(qa('.ca'), { y: -12, opacity: 0, filter: 'blur(4px)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.6)
      .from(qa('.tab, .ind'), { y: 12, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.8)
      .from(qa('.panel .a, .foot'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' }, 0.95)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 0.2);
    t.push(intro);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* the village at dusk: lanterns sway and glow, the porch lantern swings, water flows, mist drifts, bamboo sways, fireflies and sky lanterns */
  ambient(g, q, qa, t) {
    Array.prototype.forEach.call(qa('.lt'), function (l, i) {
      var a = 3 + (i % 3);
      g.set(l, { rotation: -a });
      t.push(g.to(l, { rotation: a, duration: 2.2 + (i % 4) * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 5) * 0.27 }));
    });
    Array.prototype.forEach.call(qa('.glow'), function (l, i) {
      t.push(g.fromTo(l, { opacity: 0.6, scale: 0.9 }, { opacity: 1, scale: 1.12, duration: 1.6 + (i % 4) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 6) * 0.3 }));
    });
    g.set(q('.porch'), { rotation: -2.5 });
    t.push(g.to(q('.porch'), { rotation: 2.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(q('.mist'), { x: 0, opacity: 0.85 }, { x: 36, opacity: 1, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var pl = q('.plants');
    g.set(pl, { skewX: -0.9 });
    t.push(g.to(pl, { skewX: 0.9, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    Array.prototype.forEach.call(qa('.ff'), function (f) {
      (function fly() {
        var x = rnd(40, 760), y = rnd(520, 860);
        g.set(f, { x: x, y: y, opacity: 0, scale: rnd(0.6, 1.1) });
        var tl = g.timeline({ delay: rnd(0, 4), onComplete: fly });
        tl.to(f, { opacity: rnd(0.6, 1), duration: 0.8, ease: 'sine.inOut' })
          .to(f, { x: x + rnd(-60, 60), y: y + rnd(-50, 20), duration: rnd(3.5, 6), ease: 'sine.inOut' }, 0)
          .to(f, { opacity: 0.2, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0.9)
          .to(f, { opacity: 0, duration: 0.9, ease: 'sine.in' }, '>-0.2');
        t.push(tl);
      })();
    });
    Array.prototype.forEach.call(qa('.sky'), function (s, i) {
      (function rise(first) {
        var x = rnd(520, 760);
        g.set(s, { x: x, y: 560, opacity: 0, scale: rnd(0.7, 1.1), rotation: 0 });
        var tl = g.timeline({ delay: first ? i * 3.5 + 1 : rnd(1, 5), onComplete: function () { rise(false); } });
        tl.to(s, { opacity: 0.95, duration: 1.4, ease: 'sine.out' })
          .to(s, { y: -40, duration: rnd(13, 17), ease: 'none' }, 0)
          .to(s, { x: x + rnd(-40, 40), rotation: rnd(-8, 8), duration: rnd(13, 17), ease: 'sine.inOut' }, 0)
          .to(s, { opacity: 0, duration: 3, ease: 'sine.in' }, '>-3.5');
        t.push(tl);
      })(true);
    });
  }
  /* storybook page turn to Chapter 6: curls from the bottom-right corner, revealing the wishing shore */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under6'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
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
    var self = this, tab = this.state.tab;
    function set(tb) { return function () { if (self.state.tab === tb) return; self.setState({ tab: tb, dir: tb === 'dont' ? 1 : -1 }); setTimeout(function () { self.afterTab(); }, 30); }; }
    return {
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      isDo: tab === 'do', isDont: tab === 'dont',
      tabDo: tab === 'do' ? 'on' : '', tabDont: tab === 'dont' ? 'on' : '',
      pressDo: tab === 'do' ? 'true' : 'false', pressDont: tab === 'dont' ? 'true' : 'false',
      showDo: set('do'), showDont: set('dont')
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-DosDontsDesktop">
      <div className="stage" ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="cv">
            <div className="ly plate" />
            <div className="ly stream" />
            <div className="ly stream2" />
            <div className="ly mist" />
            <div className="ly ropes" />
            <span className="glow" style={{"left":"420.4px","top":"157.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"436.6px","top":"168.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"441.4px","top":"181.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"457.6px","top":"192.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"476.4px","top":"204.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"492.6px","top":"215.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"512.4px","top":"222.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"528.6px","top":"233.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"551.4px","top":"236.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"567.6px","top":"247.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"594.4px","top":"242.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"610.6px","top":"253.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"638.4px","top":"239.4px","width":"57.2px","height":"57.2px"}} />
            <i className="lt" style={{"left":"654.6px","top":"250.8px","width":"24.8px","height":"35.1px"}} />
            <span className="glow" style={{"left":"797.8px","top":"400.8px","width":"36.4px","height":"36.4px"}} />
            <i className="lt" style={{"left":"808.1px","top":"408.1px","width":"15.8px","height":"22.3px"}} />
            <span className="glow" style={{"left":"815.8px","top":"406.8px","width":"36.4px","height":"36.4px"}} />
            <i className="lt" style={{"left":"826.1px","top":"414.1px","width":"15.8px","height":"22.3px"}} />
            <span className="glow" style={{"left":"838.8px","top":"412.8px","width":"36.4px","height":"36.4px"}} />
            <i className="lt" style={{"left":"849.1px","top":"420.1px","width":"15.8px","height":"22.3px"}} />
            <span className="glow" style={{"left":"861.8px","top":"411.8px","width":"36.4px","height":"36.4px"}} />
            <i className="lt" style={{"left":"872.1px","top":"419.1px","width":"15.8px","height":"22.3px"}} />
            <span className="glow" style={{"left":"882.8px","top":"405.8px","width":"36.4px","height":"36.4px"}} />
            <i className="lt" style={{"left":"893.1px","top":"413.1px","width":"15.8px","height":"22.3px"}} />
            <span className="glow" style={{"left":"901.6px","top":"506.6px","width":"20.8px","height":"20.8px"}} />
            <i className="lt" style={{"left":"907.5px","top":"510.8px","width":"9.0px","height":"12.8px"}} />
            <span className="glow" style={{"left":"915.6px","top":"508.6px","width":"20.8px","height":"20.8px"}} />
            <i className="lt" style={{"left":"921.5px","top":"512.8px","width":"9.0px","height":"12.8px"}} />
            <span className="glow" style={{"left":"929.6px","top":"509.6px","width":"20.8px","height":"20.8px"}} />
            <i className="lt" style={{"left":"935.5px","top":"513.8px","width":"9.0px","height":"12.8px"}} />
            <span className="glow" style={{"left":"942.6px","top":"507.6px","width":"20.8px","height":"20.8px"}} />
            <i className="lt" style={{"left":"948.5px","top":"511.8px","width":"9.0px","height":"12.8px"}} />
            <span className="glow" style={{"left":"954.6px","top":"503.6px","width":"20.8px","height":"20.8px"}} />
            <i className="lt" style={{"left":"960.5px","top":"507.8px","width":"9.0px","height":"12.8px"}} />
            <span className="glow pglow" style={{"left":"131.0px","top":"223.0px","width":"150px","height":"150px"}} />
            <i className="porch" />
            <div className="ly plants" />
          </div>
          <span className="sky" />
          <span className="sky" />
          <span className="sky" />
          <span className="sky" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
          <span className="ff" />
        </div>
        <div className="layer rightshade" />
        <div className="sheet">
          <div className="head">
            <p className="eyebrow ca">
              Chapter V · The Lantern Village
            </p>
            <h1 className="script ca" style={{"margin":"2px 0 0","fontSize":"50px","lineHeight":"1.1","color":"#2F3A78"}}>
              {"Do's & Don'ts"}
            </h1>
            <p className="sub ca">
              A few gentle notes so the day stays sweet for everyone.
            </p>
          </div>
          <div className="tabs" role="group" aria-label="Do's or don'ts">
            <span className="ind" aria-hidden="true" />
            <button className={`tab t-do ${v.tabDo}`} type="button" aria-pressed={v.pressDo} onClick={v.showDo}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2.2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M5 12.5 L10 17 L19 7" />
              </svg>
              Please do
            </button>
            <button className={`tab t-dont ${v.tabDont}`} type="button" aria-pressed={v.pressDont} onClick={v.showDont}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2.2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
              Kindly don't
            </button>
          </div>
          <div className="scroll">
            {v.isDo ? (
              <>
                <ul className="list panel v-do" aria-label="Please do">
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#6D8F62" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M12 7 V12 L15 14 M12 3 A9 9 0 1 0 12.01 3" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M5 12.5 L10 17 L19 7" />
                          </svg>
                        </span>
                        Arrive by 1:15 PM
                      </h3>
                      <p>
                        The baptism begins promptly at 1:30 PM, so come a little early to find a seat.
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#6D8F62" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M7 3 H17 A1 1 0 0 1 18 4 V20 A1 1 0 0 1 17 21 H7 A1 1 0 0 1 6 20 V4 A1 1 0 0 1 7 3 Z M11 18 H13" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M5 12.5 L10 17 L19 7" />
                          </svg>
                        </span>
                        Silence your phone
                      </h3>
                      <p>
                        Let's keep the ceremony calm and sacred for Dylan.
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#6D8F62" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M4 8 H8 L10 5 H14 L16 8 H20 V19 H4 Z M12 16 A3 3 0 1 0 12.01 10" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M5 12.5 L10 17 L19 7" />
                          </svg>
                        </span>
                        Snap away at the reception
                      </h3>
                      <p>
                        Take lots of photos and share them with us afterwards.
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#6D8F62" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M12 20 C7 16 3 13 3 9 A4 4 0 0 1 12 7 A4 4 0 0 1 21 9 C21 13 17 16 12 20 Z" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M5 12.5 L10 17 L19 7" />
                          </svg>
                        </span>
                        Leave a wish for Dylan
                      </h3>
                      <p>
                        Write him a little note in the next chapter. He'll read them someday.
                      </p>
                    </div>
                  </li>
                </ul>
              </>
            ) : null}
            {v.isDont ? (
              <>
                <ul className="list panel v-dont" aria-label="Kindly don't">
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#B5583D" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M9 3 L12 6 L15 3 L19 6 L17 10 L16 9 V21 H8 V9 L7 10 L5 6 Z" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M6 6 L18 18 M18 6 L6 18" />
                          </svg>
                        </span>
                        Wear white
                      </h3>
                      <p>
                        White is reserved for Dylan's godparents.
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#B5583D" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M13 2 L5 13 H11 L10 22 L19 10 H13 Z" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M6 6 L18 18 M18 6 L6 18" />
                          </svg>
                        </span>
                        Use flash during the rite
                      </h3>
                      <p>
                        Our church photographer has the ceremony covered.
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#B5583D" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M4 12 C7 6 17 6 20 12 C17 18 7 18 4 12 Z M12 14.5 A2.5 2.5 0 1 0 12.01 9.5" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M6 6 L18 18 M18 6 L6 18" />
                          </svg>
                        </span>
                        Post Dylan's photos first
                      </h3>
                      <p>
                        We'd love to share the first look ourselves. Please wait for ours!
                      </p>
                    </div>
                  </li>
                  <li className="item a">
                    <span className="badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#B5583D" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                        <path d="M9 11 A3 3 0 1 0 9.01 5 M3 20 C3 16 6 14 9 14 C12 14 15 16 15 20 M17 8 V14 M14 11 H20" />
                      </svg>
                    </span>
                    <div>
                      <h3>
                        <span className="mark" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFF9F0" style={{"strokeWidth":"3.4","strokeLinecap":"round","strokeLinejoin":"round"}}>
                            <path d="M6 6 L18 18 M18 6 L6 18" />
                          </svg>
                        </span>
                        Bring extra guests
                      </h3>
                      <p>
                        Seats are limited to the names on your invitation.
                      </p>
                    </div>
                  </li>
                </ul>
              </>
            ) : null}
          </div>
          <div className="foot">
            <div style={{"display":"flex","alignItems":"center","gap":"14px"}}>
              <div aria-hidden="true" style={{"display":"flex","gap":"6px","alignItems":"center"}}>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot on" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p style={{"margin":"0","fontSize":"12px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#2F3360"}}>
                Chapter 5 of 8
              </p>
            </div>
            <button className="next" type="button" onClick={v.goNext}>
              {"Next: RSVP "}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="#F7D873" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
              </svg>
            </button>
            <Link to="/rsvp" className="nextlink" tabIndex="-1" aria-hidden="true">
              Chapter 6
            </Link>
          </div>
        </div>
        <div className="under6" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
