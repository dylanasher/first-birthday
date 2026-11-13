/* eslint-disable */
// ThankYouMobile: phone & tablet-portrait layout, fills the screen. Ported from the handoff's "ch8-thankyou-phone.dc.html".
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import './ThankYouMobile.css';

export default class ThankYouMobile extends React.Component {
  static defaultProps = {};

  constructor(props) { super(props); this.state = {}; this.root = null; this.tweens = []; this.tries = 0; }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); } clearTimeout(this.retry); if (this.io) this.io.disconnect(); this.tweens.forEach(function (t) { t.kill(); }); }
  reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  /* a soft burst of confetti in the palette colours, every time the chapter opens */
  confetti(g, qa) {
    var c = this.root.offsetWidth / 2, d = this.root.offsetHeight * 0.17;
    Array.prototype.forEach.call(qa('.conf'), function (el, i) {
      var a = (Math.PI * 2 * i) / qa('.conf').length + Math.random() * 0.4, sp = 130 + Math.random() * 140;
      g.killTweensOf(el);
      g.set(el, { x: c, y: d, opacity: 1, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.6 });
      g.to(el, { x: c + Math.cos(a) * sp, y: d + Math.sin(a) * sp * 0.6 - 60, rotation: '+=' + (180 + Math.random() * 360), duration: 1.3, ease: 'expo.out' });
      g.to(el, { y: '+=' + (300 + Math.random() * 200), x: '+=' + (Math.random() * 80 - 40), rotation: '+=' + (Math.random() * 540), duration: 3.2 + Math.random() * 1.6, ease: 'sine.in', delay: 1.2 });
      g.to(el, { opacity: 0, duration: 0.8, delay: 3.6 + Math.random() * 1.2 });
    });
  }
  boot() {
    var self = this;
    if (!this.root || !gsap) { if (this.tries++ < 25) this.retry = setTimeout(function () { self.boot(); }, 120); return; }
    var g = gsap, r = this.root, t = this.tweens;
    if (this.reduced()) return;
    var q = function (s) { return r.querySelector(s); }, qa = function (s) { return r.querySelectorAll(s); };
    var intro = g.timeline({ paused: true });
    intro.from(qa('.ca'), { y: -12, opacity: 0, filter: 'blur(5px)', duration: 1, stagger: 0.15, ease: 'expo.out' }, 0.3).from(q('.sheet'), { yPercent: 100, duration: 1.1, ease: 'expo.out' }, 0.45)
      .from(qa('.a'), { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 1.0)
      .call(function () { self.confetti(g, qa); }, null, 1.0)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 0.2);
    t.push(intro);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* the morning after: sun breathes, clouds drift, balloons bob, candle flickers, flowers sway, petals and dandelion seeds float */
  ambient(g, q, qa, t) {
    t.push(g.fromTo(q('.sun'), { opacity: 0.85, scale: 0.97 }, { opacity: 1, scale: 1.06, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var r = this.root, W = r.offsetWidth, H = r.offsetHeight, sf = q('.scenefit'), k = sf && sf.offsetWidth ? sf.offsetWidth / 941 : 0.53, f = k / 0.53;
    var sx = sf ? sf.offsetLeft : 0, sy = sf ? sf.offsetTop : 0;
    t.push(g.to(q('.clouds'), { x: 16 * f, duration: 26, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var b = q('.balloons');
    g.set(b, { rotation: -1.6, y: 0 });
    t.push(g.to(b, { rotation: 1.6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(b, { y: -5 * f, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var fl = q('.flame'), flick = function () { t.push(g.to(fl, { opacity: 0.55 + Math.random() * 0.45, scale: 0.85 + Math.random() * 0.3, duration: 0.12 + Math.random() * 0.2, ease: 'sine.inOut', onComplete: flick })); }; flick();
    var f = q('.flowers'); g.set(f, { skewX: -0.8 });
    t.push(g.to(f, { skewX: 0.8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    Array.prototype.forEach.call(qa('.petal'), function (p, i) {
      (function drift(first) {
        var y = rnd(H * 0.07, H * 0.48);
        g.set(p, { x: -20, y: y, opacity: 0, rotation: rnd(0, 360) });
        var tl = g.timeline({ delay: first ? i * 1.3 : rnd(0.5, 4), onComplete: function () { drift(false); } });
        var d = rnd(9, 14);
        tl.to(p, { opacity: 0.9, duration: 0.8 }, 0)
          .to(p, { x: W + 20, duration: d, ease: 'none' }, 0)
          .to(p, { y: y + rnd(60, 180), duration: d, ease: 'sine.inOut' }, 0)
          .to(p, { rotation: '+=' + rnd(240, 540), duration: d, ease: 'none' }, 0);
        t.push(tl);
      })(true);
    });
    // dandelion seeds lift off the painted dandelions and float up
    var dd = [[760, 1440], [692, 1497], [760, 1440]].map(function (p) { return [sx + p[0] * k, sy + p[1] * k]; });
    Array.prototype.forEach.call(qa('.seed'), function (s, i) {
      (function fly(first) {
        var p = dd[Math.floor(Math.random() * dd.length)];
        g.set(s, { x: p[0], y: p[1], opacity: 0, scale: rnd(0.6, 1.1) });
        var tl = g.timeline({ delay: first ? i * 1.1 + 1 : rnd(1, 5), onComplete: function () { fly(false); } });
        var d = rnd(6, 10);
        tl.to(s, { opacity: 0.95, duration: 0.6 }, 0)
          .to(s, { x: p[0] - rnd(40, 200), duration: d, ease: 'sine.out' }, 0)
          .to(s, { y: p[1] - rnd(H * 0.35, H * 0.6), duration: d, ease: 'sine.inOut' }, 0)
          .to(s, { opacity: 0, duration: 1.5 }, d - 1.5);
        t.push(tl);
      })(true);
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

  renderVals() { var self = this; return { setRoot: function (el) { self.root = el; } }; }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-ThankYouMobile">
      <div className="stage" ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="scenefit">
            <div className="ly plate" />
            <span className="sun" />
            <div className="ly clouds" />
            <span className="balloons" />
            <span className="flame" />
            <img className="totoro" src="/art/totoro-leaf.webp" alt="" draggable="false" />
            <div className="ly flowers" />
          </div>
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="petal" />
          <span className="seed" />
          <span className="seed" />
          <span className="seed" />
          <span className="seed" />
          <span className="seed" />
          <span className="seed" />
        </div>
        <div className="layer confl" aria-hidden="true" style={{"zIndex":"40"}}>
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
          <span className="conf" style={{"background":"#74B7E5"}} />
          <span className="conf" style={{"background":"#FFF3DD"}} />
          <span className="conf" style={{"background":"#6D8F62"}} />
          <span className="conf" style={{"background":"#D97A5E"}} />
          <span className="conf" style={{"background":"#F7D873"}} />
          <span className="conf" style={{"background":"#E9A7A7"}} />
        </div>
        <div className="layer topshade" />
        <div className="chtitle">
          <p className="lift ca" style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".26em","textTransform":"uppercase"}}>
            Chapter VIII · The Morning After
          </p>
          <h1 className="script lift ca" style={{"margin":"4px 0 0","fontSize":"56px","lineHeight":"1.05","color":"#FFF0C8"}}>
            Thank you
          </h1>
        </div>
        <div className="sheet">
          <div className="scroll">
            <p className="msg a">
              From the bottom of our hearts, thank you for being part of Dylan's very first chapter: his baptism and his first birthday.
            </p>
            <p className="msg a" style={{"marginTop":"10px"}}>
              Your love, prayers and presence are the most beautiful gifts he could ever receive. We can't wait to celebrate with you on December 13!
            </p>
            <p className="sig a">
              {"With love, Dave, Alyana & Dylan"}
            </p>
            <div className="acts a">
              <a className="act primary" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dylan%27s%20Baptism%20%26%20First%20Birthday&dates=20261213T053000Z/20261213T090000Z&location=Santuario%20de%20San%20Antonio%20Parish%2C%203117%20McKinley%20Rd%2C%20Forbes%20Park%2C%20Makati%20City&details=Baptism%201%3A30%20PM%20at%20Santuario%20de%20San%20Antonio%20Parish%2C%20then%20the%20celebration%20at%20the%20Santuario%20de%20San%20Antonio%20Social%20Hall." target="_blank" rel="noopener">
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                  <path d="M5 5 H19 V20 H5 Z M5 9 H19 M9 3 V7 M15 3 V7 M12 12 V17 M9.5 14.5 H14.5" />
                </svg>
                Add to calendar
              </a>
              <a className="act" href="https://maps.app.goo.gl/Tag57jheAtuJ8mD97" target="_blank" rel="noopener">
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                  <path d="M12 21 C8 16 5 12.5 5 9 A7 7 0 0 1 19 9 C19 12.5 16 16 12 21 Z M12 11.5 A2.5 2.5 0 1 0 12.01 6.5" />
                </svg>
                Get directions
              </a>
              <Link to="/" className="act">
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                  <path d="M4 5 C7 4 10 4 12 6 C14 4 17 4 20 5 V19 C17 18 14 18 12 20 C10 18 7 18 4 19 Z M12 6 V20" />
                </svg>
                Read the story again
              </Link>
            </div>
          </div>
          <div className="foot">
            <div aria-hidden="true" style={{"display":"flex","gap":"6px","alignItems":"center"}}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot on" />
            </div>
            <p style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#2E3A6B"}}>
              The end · 8 of 8
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
