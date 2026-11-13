/* eslint-disable */
// RsvpDesktop: desktop layout, 1440×900. Ported from the "Ch6Desktop.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import RsvpFlow from '../components/RsvpFlow.jsx';
import './RsvpDesktop.css';

export default class RsvpDesktop extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = { tab: 'rsvp', dir: 1, attend: 'yes', count: 1, sent: false, sentName: '', sentAttend: 'yes', sentCount: 1, err: '', werr: '', wishes: [] };
    this.root = null;
    this.tweens = [];
    this.tries = 0;
    /* the baptism: December 13, 2026, 1:30 PM Manila time (UTC+8) */
    this.target = Date.UTC(2026, 11, 13, 5, 30, 0);
  }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.indRO) this.indRO.disconnect(); if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); } clearTimeout(this.retry); clearInterval(this.tick); if (this.io) this.io.disconnect(); this.tweens.forEach(function (t) { t.kill(); }); }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  countdown() {
    var r = this.root; if (!r) return;
    var ms = Math.max(0, this.target - Date.now()), sec = Math.floor(ms / 1000);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var vals = { d: Math.floor(sec / 86400), h: pad(Math.floor(sec / 3600) % 24), m: pad(Math.floor(sec / 60) % 60), s: pad(sec % 60) };
    ['d', 'h', 'm', 's'].forEach(function (k) { var el = r.querySelector('.cd-' + k); if (el && el.textContent !== String(vals[k])) el.textContent = vals[k]; });
    if (ms === 0) { var c = r.querySelector('.cd-cap'); if (c) c.textContent = "It's Dylan's big day!"; }
  }
  moveIndicator(animate) {
    var btn = this.root && this.root.querySelector('.t-' + this.state.tab), ind = this.root && this.root.querySelector('.ind');
    if (!btn || !ind || !gsap) return;
    /* wait until the tabs are really laid out (the board can mount while hidden), then keep the pill in sync if they resize */
    if (!btn.offsetWidth) { var me = this; if ((this.indTries = (this.indTries || 0) + 1) < 60) setTimeout(function () { me.moveIndicator(false); }, 150); return; }
    this.indTries = 0;
    if (btn.parentNode && btn.parentNode.classList) btn.parentNode.classList.add('ready');
    if (!this.indRO && window.ResizeObserver && btn.parentNode) { var me2 = this; this.indRO = new ResizeObserver(function () { me2.moveIndicator(false); }); this.indRO.observe(btn.parentNode); }
    var p = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (animate && !this.reduced()) gsap.to(ind, Object.assign(p, { duration: 0.55, ease: 'expo.out' })); else gsap.set(ind, p);
  }
  afterTab() {
    if (!this.root || !gsap) return;
    this.moveIndicator(true);
    if (this.reduced()) return;
    gsap.fromTo(this.root.querySelectorAll('.panel .a'), { x: 22 * this.state.dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: 'expo.out', clearProps: 'transform' });
    var sc = this.root.querySelector('.scroll'); if (sc) sc.scrollTop = 0;
  }
  pop() {
    var self = this;
    setTimeout(function () {
      if (!self.root || !gsap || self.reduced()) return;
      gsap.fromTo(self.root.querySelectorAll('.panel .a'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' });
    }, 30);
  }
  /* a sent wish flies from the button up into the sky and stays there as a new star */
  flyWish(btn) {
    var r = this.root, g = gsap; if (!r || !btn) return;
    var rr = r.getBoundingClientRect(), b = btn.getBoundingClientRect(), sc = rr.width / r.offsetWidth || 1;
    var x0 = (b.left - rr.left) / sc + b.width / 2, y0 = (b.top - rr.top) / sc;
    var st = document.createElement('span'); st.className = 'wishstar'; st.setAttribute('aria-hidden', 'true');
    r.querySelector('.scene').appendChild(st);
    var tx = 420 + Math.random() * 420, ty = 24 + Math.random() * 150;
    if (!g || this.reduced()) { st.style.transform = 'translate(' + tx + 'px,' + ty + 'px)'; return; }
    g.set(st, { x: x0, y: y0, scale: 0.4 });
    var tl = g.timeline();
    tl.to(st, { x: tx, duration: 2.2, ease: 'sine.inOut' }, 0).to(st, { y: ty, duration: 2.2, ease: 'power2.out' }, 0).to(st, { scale: 1.6, duration: 0.5, ease: 'back.out(3)' }, 2.1).to(st, { scale: 0.9, duration: 0.6 }, 2.6);
    this.tweens.push(g.to(st, { opacity: 0.55, duration: 1.4 + Math.random(), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.2 }));
  }
  boot() {
    var self = this;
    if (!this.root || !gsap) { if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120); return; }
    var g = gsap, r = this.root, t = this.tweens;
    this.countdown(); this.tick = setInterval(function () { self.countdown(); }, 1000);
    this.moveIndicator(false);
    try { document.fonts.ready.then(function () { self.moveIndicator(false); }); } catch (e) {}
    if (this.reduced()) return;
    var q = function (s) { return r.querySelector(s); }, qa = function (s) { return r.querySelectorAll(s); };
    var intro = g.timeline({ paused: true });
    intro.from(q('.sheet'), { x: 90, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.3).from(qa('.ca'), { y: -12, opacity: 0, filter: 'blur(4px)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.6)
      .from(qa('.cdbox'), { y: 14, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.08, ease: 'back.out(1.8)' }, 0.75)
      .from(qa('.tab, .ind'), { y: 12, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.95)
      .from(qa('.panel .a, .foot'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, 1.05)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 0.2);
    t.push(intro);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* the shore at night: clouds drift, moonlight ripples, waves wash in, jars sway and glow, stars twinkle, wish-lights rise */
  ambient(g, q, qa, t) {
    t.push(g.to(q('.clouds'), { x: 46, duration: 30, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(q('.foam'), { x: 0, y: 0, opacity: 0.8 }, { x: -6, y: 6, opacity: 1, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(q('.sea'), { y: 0 }, { y: 2, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var jars = q('.jars');
    g.set(jars, { rotation: -0.7 });
    t.push(g.to(jars, { rotation: 0.7, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    Array.prototype.forEach.call(qa('.jglow'), function (l, i) {
      t.push(g.fromTo(l, { opacity: 0.55, scale: 0.88 }, { opacity: 1, scale: 1.15, duration: 1.7 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
    t.push(g.fromTo(q('.moonglow'), { opacity: 0.75, scale: 0.96 }, { opacity: 1, scale: 1.05, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    Array.prototype.forEach.call(qa('.star'), function (s) {
      t.push(g.fromTo(s, { opacity: 0.15, scale: 0.6 }, { opacity: 0.95, scale: 1.25, duration: 0.9 + Math.random() * 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: Math.random() * 3 }));
    });
    var jp = [(-22, 321), (192, 197), (273, 287), (167, 361)], rnd = function (a, b) { return a + Math.random() * (b - a); };
    Array.prototype.forEach.call(qa('.orb'), function (o, i) {
      (function rise(first) {
        var p = jp[Math.floor(Math.random() * jp.length)];
        g.set(o, { x: p[0], y: p[1], opacity: 0, scale: rnd(0.6, 1.1) });
        var tl = g.timeline({ delay: first ? i * 1.6 + 0.5 : rnd(0.5, 3), onComplete: function () { rise(false); } });
        tl.to(o, { opacity: rnd(0.7, 1), duration: 0.8 })
          .to(o, { y: p[1] - rnd(180, 300), duration: rnd(5, 8), ease: 'sine.out' }, 0)
          .to(o, { x: p[0] + rnd(-50, 90), duration: rnd(5, 8), ease: 'sine.inOut' }, 0)
          .to(o, { opacity: 0, duration: 1.6, ease: 'sine.in' }, '>-1.8');
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
    var under = r.querySelector('.under7'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
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

  val(sel) { var el = this.root && this.root.querySelector(sel); return el ? String(el.value || '').trim() : ''; }
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
    function set(tb) { return function () { if (self.state.tab === tb) return; self.setState({ tab: tb, dir: tb === 'wish' ? 1 : -1, err: '', werr: '' }); setTimeout(function () { self.afterTab(); }, 30); }; }
    var firstName = (s.sentName || '').split(' ')[0];
    return {
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      tabRsvp: s.tab === 'rsvp' ? 'on' : '', tabWish: s.tab === 'wish' ? 'on' : '',
      pressRsvp: s.tab === 'rsvp' ? 'true' : 'false', pressWish: s.tab === 'wish' ? 'true' : 'false',
      showRsvp: set('rsvp'), showWish: set('wish'),
      isRsvp: s.tab === 'rsvp',
      rsvpStep: function () { self.pop(); var sc = self.root && self.root.querySelector('.scroll'); if (sc) sc.scrollTop = 0; }, isWish: s.tab === 'wish',
      yesOn: s.attend === 'yes' ? 'on' : '', noOn: s.attend === 'no' ? 'on' : '',
      yesPressed: s.attend === 'yes' ? 'true' : 'false', noPressed: s.attend === 'no' ? 'true' : 'false',
      pickYes: function () { self.setState({ attend: 'yes' }); },
      pickNo: function () { self.setState({ attend: 'no' }); },
      showCount: s.attend === 'yes', count: s.count,
      minCls: s.count <= 1 ? 'off' : '', maxCls: s.count >= 6 ? 'off' : '',
      minus: function () { if (self.state.count > 1) self.setState({ count: self.state.count - 1 }); },
      plus: function () { if (self.state.count < 6) self.setState({ count: self.state.count + 1 }); },
      err: s.err, werr: s.werr,
      sendRsvp: function () {
        var name = self.val('.in-name');
        if (!name) { self.setState({ err: 'Please add your name so we know who is coming.' }); var el = self.root.querySelector('.in-name'); if (el) el.focus(); return; }
        /* unused: the RSVP form is now src/components/RsvpFlow.jsx, which saves to the Google Sheet */
        self.setState({ sent: true, err: '', sentName: name, sentAttend: self.state.attend, sentCount: self.state.count }); self.pop();
      },
      doneTitle: s.sentAttend === 'yes' ? 'See you there, ' + firstName + '!' : 'We\'ll miss you, ' + firstName,
      doneText: s.sentAttend === 'yes' ? (s.sentCount > 1 ? 'We\'ve saved ' + s.sentCount + ' seats for your party. Dylan can\'t wait!' : 'We\'ve saved a seat for you. Dylan can\'t wait!') : 'Thank you for letting us know. Please leave Dylan a wish so you\'re still part of his day.',
      editRsvp: function () { self.setState({ sent: false }); self.pop(); },
      noWishes: s.wishes.length === 0, wishes: s.wishes,
      sendWish: function (e) {
        var name = self.val('.in-wname'), text = self.val('.in-wtext');
        if (!text) { self.setState({ werr: 'Write a little wish first.' }); return; }
        var btn = (e && e.currentTarget && e.currentTarget.getBoundingClientRect) ? e.currentTarget : self.root.querySelector('.panel .send');
        self.flyWish(btn);
        /* TODO: save the wish once the destination is decided */
        self.setState({ werr: '', wishes: [{ name: name || 'A friend', text: text }].concat(self.state.wishes) });
        var t1 = self.root.querySelector('.in-wtext'); if (t1) t1.value = '';
      }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-RsvpDesktop">
      <div className="stage" ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="cv">
            <div className="ly plate" />
            <span className="moonglow" />
            <span className="star" style={{"left":"1345px","top":"55px"}} />
            <span className="star" style={{"left":"1484px","top":"79px"}} />
            <span className="star" style={{"left":"1170px","top":"21px"}} />
            <span className="star" style={{"left":"1063px","top":"40px"}} />
            <span className="star" style={{"left":"1123px","top":"135px"}} />
            <span className="star" style={{"left":"1551px","top":"8px"}} />
            <span className="star" style={{"left":"491px","top":"11px"}} />
            <span className="star" style={{"left":"653px","top":"11px"}} />
            <span className="star" style={{"left":"1591px","top":"37px"}} />
            <span className="star" style={{"left":"1426px","top":"11px"}} />
            <span className="star" style={{"left":"551px","top":"29px"}} />
            <span className="star" style={{"left":"1615px","top":"47px"}} />
            <span className="star" style={{"left":"674px","top":"59px"}} />
            <span className="star" style={{"left":"620px","top":"81px"}} />
            <span className="star" style={{"left":"1375px","top":"12px"}} />
            <span className="star" style={{"left":"663px","top":"136px"}} />
            <div className="ly clouds" />
            <div className="ly sea" />
            <div className="ly sea2" />
            <div className="ly foam" />
            <img className="kids" src="/art/kids-sitting.webp" alt="Two children sitting on the sand with a toy boat, watching the moonlit sea" draggable="false" />
            <div className="ly jars" />
            <span className="jglow" style={{"left":"-5px","top":"291px"}} />
            <span className="jglow" style={{"left":"219px","top":"161px"}} />
            <span className="jglow" style={{"left":"303px","top":"255px"}} />
            <span className="jglow" style={{"left":"192px","top":"332px"}} />
          </div>
          <span className="orb" />
          <span className="orb" />
          <span className="orb" />
          <span className="orb" />
          <span className="orb" />
          <span className="orb" />
          <span className="orb" />
        </div>
        <div className="layer rightshade" />
        <div className="sheet">
          <div className="head">
            <p className="eyebrow ca">
              Chapter VI · The Wishing Shore
            </p>
            <h1 className="script ca" style={{"margin":"2px 0 0","fontSize":"46px","lineHeight":"1.1","color":"#1F2C6B"}}>
              {"RSVP & Wishes"}
            </h1>
          </div>
          <div className="cd ca" role="timer" aria-label="Countdown to the baptism">
            <div className="cdrow">
              <div className="cdbox">
                <p className="cdnum cd-d">
                  --
                </p>
                <p className="cdlbl">
                  Days
                </p>
              </div>
              <div className="cdbox">
                <p className="cdnum cd-h">
                  --
                </p>
                <p className="cdlbl">
                  Hours
                </p>
              </div>
              <div className="cdbox">
                <p className="cdnum cd-m">
                  --
                </p>
                <p className="cdlbl">
                  Minutes
                </p>
              </div>
              <div className="cdbox">
                <p className="cdnum cd-s">
                  --
                </p>
                <p className="cdlbl">
                  Seconds
                </p>
              </div>
            </div>
            <p className="cdcap cd-cap">
              until Dylan's baptism · Dec 13, 1:30 PM
            </p>
          </div>
          <div className="tabs" role="group" aria-label="RSVP or wishes">
            <span className="ind" aria-hidden="true" />
            <button className={`tab t-rsvp ${v.tabRsvp}`} type="button" aria-pressed={v.pressRsvp} onClick={v.showRsvp}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M4 6 H20 V18 H4 Z M4 7 L12 13 L20 7" />
              </svg>
              RSVP
            </button>
            <button className={`tab t-wish ${v.tabWish}`} type="button" aria-pressed={v.pressWish} onClick={v.showWish}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M12 3 L14.2 9 L20.5 9.3 L15.5 13.2 L17.3 19.5 L12 15.8 L6.7 19.5 L8.5 13.2 L3.5 9.3 L9.8 9 Z" />
              </svg>
              Leave a wish
            </button>
          </div>
          <div className="scroll">
            {v.isRsvp ? <RsvpFlow onStep={v.rsvpStep} onCelebrate={v.rsvpStep} /> : null}
            {v.isWish ? (
              <>
                <div className="panel">
                  <p className="p a">
                    Leave a little wish for Dylan. Watch it float up to join the stars.
                  </p>
                  <label className="lbl a" htmlFor="ws-name">
                    From
                  </label>
                  <input className="in a in-wname" id="ws-name" type="text" autoComplete="name" placeholder="Your name" />
                  <label className="lbl a" htmlFor="ws-text">
                    Your wish
                  </label>
                  <textarea className="in a in-wtext" id="ws-text" placeholder="May you always…" />
                  <button className="send a" type="button" onClick={v.sendWish}>
                    {"Send my wish "}
                    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                      <path d="M12 3 L14.2 9 L20.5 9.3 L15.5 13.2 L17.3 19.5 L12 15.8 L6.7 19.5 L8.5 13.2 L3.5 9.3 L9.8 9 Z" />
                    </svg>
                  </button>
                  <p className="err" role="alert">
                    {v.werr}
                  </p>
                  {v.noWishes ? (
                    <>
                      <p className="empty a">
                        No wishes yet. Be the first to send one!
                      </p>
                    </>
                  ) : null}
                  <ul className="wishes" aria-label="Wishes for Dylan">
                    {(v.wishes || []).map((w, w$i) => (
                      <React.Fragment key={w$i}>
                        <li className="wish">
                          <p>
                            {w?.text}
                          </p>
                          <p className="by">
                            {"— "}{w?.name}
                          </p>
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
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
                <span className="dot" />
                <span className="dot on" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p style={{"margin":"0","fontSize":"12px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#1C2554"}}>
                Chapter 6 of 8
              </p>
            </div>
            <button className="next" type="button" onClick={v.goNext}>
              {"Next: Wishes "}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="#F7D873" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
              </svg>
            </button>
            <Link to="/wishes" className="nextlink" tabIndex="-1" aria-hidden="true">
              Next chapter
            </Link>
          </div>
        </div>
        <div className="under7" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
