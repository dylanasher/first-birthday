/* eslint-disable */
// OpeningDesktop: desktop layout, 1440×900. Ported from the "Desktop.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { css } from '../lib/css.js';
import './OpeningDesktop.css';

export default class OpeningDesktop extends React.Component {
  static defaultProps = {"accent":"#F5D68A","reducedMotion":false};

  constructor(props) {
    super(props);
    this.state = { phase: 'idle', hasGsap: true };
    this.root = null;
    this.idleTweens = [];
    this.tl = null;
    this.tries = 0;
    this.retry = null;
  }
  componentDidMount() { this.initTrailSoon(); this.boot(); }
  componentWillUnmount() { if (this.onMove && this.root) { this.root.removeEventListener('pointermove', this.onMove); this.root.removeEventListener('pointerleave', this.onLeave); this.root.removeEventListener('pointerdown', this.onDown); }
    clearTimeout(this.retry);
    this.idleTweens.forEach(function (t) { t.kill(); });
    if (this.tl) this.tl.kill();
  }
  reduced() {
    if (this.props.reducedMotion) return true;
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  boot() {
    var self = this;
    if (!this.root || !gsap) {
      if (this.tries++ < 25) { this.retry = setTimeout(function () { self.boot(); }, 120); }
      else { this.setState({ hasGsap: false }); }
      return;
    }
    this.startIdle();
    this.buildOpen();
  }
  q(sel) { return this.root.querySelector(sel); }
  qa(sel) { return Array.prototype.slice.call(this.root.querySelectorAll(sel)); }

  startIdle() {
    var g = gsap, t = this.idleTweens;
    if (this.reduced()) return;
    t.push(g.to(this.q('.far'), { scale: 1.025, duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(this.q('.foreL'), { rotation: 0.4, scale: 1.008, duration: 6.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(this.q('.foreR'), { rotation: -0.4, scale: 1.008, duration: 7.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -2 }));
    t.push(g.to(this.q('.canopy'), { y: 3, scale: 1.006, duration: 8.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.fromTo(this.q('.halo'), { opacity: 0.55, scale: 0.97 }, { opacity: 0.95, scale: 1.04, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(this.q('.mistA'), { x: 120, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(this.q('.mistB'), { x: -140, duration: 26, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    this.qa('.mote').forEach(function (m) {
      t.push(g.to(m, { x: 'random(-40, 40)', y: 'random(-50, 20)', opacity: 'random(0.2, 1)', duration: 'random(5, 11)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true }));
    });
    this.qa('.bin').forEach(function (b, i) {
      t.push(g.fromTo(b.querySelector('.ffh'), { opacity: 0.15, scale: 0.6 }, { opacity: 1, scale: 1.2, duration: 'random(0.7, 1.6)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true, delay: i * 0.37 }));
      t.push(g.fromTo(b.querySelector('.ffc'), { opacity: 0.35 }, { opacity: 1, duration: 'random(0.5, 1.2)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true, delay: i * 0.37 }));
      t.push(g.to(b, { x: 'random(-60, 60)', y: 'random(-50, 40)', duration: 'random(3.5, 6)', ease: 'sine.inOut', yoyo: true, repeat: -1, repeatRefresh: true }));
    });
    t.push(g.to(this.q('.openbtn'), { boxShadow: '0 0 44px rgba(245,214,138,.7), inset 0 0 16px rgba(245,214,138,.25)', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  }

  buildOpen() {
    var g = gsap, self = this;
    var items = this.qa('.wi');
    var flies = this.qa('.bfly');
    var targets = [[220, 100], [-230, 150], [-150, -40], [160, 0]];
    var tl = g.timeline({ paused: true,
      onComplete: function () { self.setState({ phase: 'welcome' }); },
      onReverseComplete: function () { self.setState({ phase: 'idle' }); } });
    if (this.reduced()) {
      tl.to([this.q('.intro'), this.q('.openwrap')], { autoAlpha: 0, duration: 0.35 })
        .to(this.q('.awake'), { opacity: 1, duration: 0.35 }, '<')
        .set(this.q('.welcome'), { visibility: 'visible' })
        .to(this.q('.shade2'), { opacity: 1, duration: 0.35 }, '<')
        .to(items, { opacity: 1, duration: 0.35 }, '<');
    } else {
      tl.set(this.root, { pointerEvents: 'none' })
        // 1. text steps aside, forest stirs, camera leans toward Dylan
        .to(this.q('.intro'), { y: -30, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0)
        .to(this.q('.openwrap'), { y: 30, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to(this.q('.topshade'), { opacity: 0.4, duration: 0.9 }, 0.1)
        .to(this.q('.foreLCam'), { xPercent: -3, rotation: -0.8, duration: 1.2, ease: 'sine.inOut' }, 0.1)
        .to(this.q('.foreRCam'), { xPercent: 3, rotation: 0.8, duration: 1.2, ease: 'sine.inOut' }, 0.1)
        .to(this.q('.farCam'), { scale: 1.1, transformOrigin: '742px 560px', duration: 2.2, ease: 'power2.inOut' }, 0.1)
        // 2. fireflies gather near Dylan
        .to(flies, { x: function (i) { var t = targets[i % targets.length]; return t[0] + (i >= targets.length ? (i * 53) % 90 - 45 : 0); }, y: function (i) { var t = targets[i % targets.length]; return t[1] + (i >= targets.length ? (i * 37) % 70 - 35 : 0); }, duration: 1.7, ease: 'sine.inOut', stagger: 0.1 }, 0.3)
        // 3. glow, then he wakes and smiles
        .to(this.q('.glow'), { opacity: 1, scale: 1.1, duration: 0.9, ease: 'sine.out' }, 0.9)
        .to(this.q('.awake'), { opacity: 1, duration: 0.7, ease: 'sine.inOut' }, 1.2)
        .to(this.q('.glow'), { opacity: 0.4, scale: 1.3, duration: 1.2, ease: 'sine.inOut' }, 1.9)
        // 4. hold, then the camera pushes in and slides Dylan to the right third; near foliage parts
        .to(this.q('.foreLCam'), { xPercent: -45, yPercent: 10, rotation: -3, scale: 1.45, duration: 1.9, ease: 'power3.inOut' }, 2.9)
        .to(this.q('.foreRCam'), { xPercent: 45, yPercent: 10, rotation: 3, scale: 1.45, duration: 1.9, ease: 'power3.inOut' }, 2.9)
        .to(this.q('.canopyCam'), { yPercent: -34, scale: 1.35, duration: 1.9, ease: 'power3.inOut' }, 2.95)
        .to(this.q('.farCam'), { scale: 1.35, x: 240, y: -40, duration: 2.1, ease: 'power3.inOut' }, 2.9)
        .to(this.q('.motes'), { scale: 1.2, duration: 2.0, ease: 'power2.inOut' }, 2.9)
        // 5. Welcome column fades in on the left
        .set(this.q('.welcome'), { visibility: 'visible' }, 3.9)
        .to(this.q('.shade2'), { opacity: 1, duration: 1.1, ease: 'power2.out' }, 3.7)
        .fromTo(items, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: 'expo.out' }, 4.0)
        .set(this.root, { pointerEvents: 'auto' });
    }
    this.tl = tl;
  }
  /* storybook page turn: the page you're looking at curls away from the bottom-right corner,
     revealing Chapter 2's countryside, then Chapter 2 continues from that exact view */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under'), wrap = r.querySelector('.pflapwrap'), flap = r.querySelector('.pflap');
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
      // the turned-over corner shows the cream back of the page, mirrored across the fold
      flap.style.clipPath = css(turned.map(function (p) { return [c - p[1], c - p[0]]; }));
    }
    draw();
    under.style.display = 'block';
    wrap.style.display = 'block';
    g.set(r, { pointerEvents: 'none' });
    g.to(st, { c: -40, duration: 2.2, ease: 'power2.inOut', onUpdate: draw, onComplete: function () {
      if (link) link.click();
      // tidy up so this page looks normal again if you come back to it
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
    var self = this;
    var spots = [
      [120,380,4],[220,520,3],[320,300,3],[420,620,5],[520,420,3],[600,700,4],[680,330,3],[880,380,4],
      [960,640,3],[1040,300,5],[1120,520,3],[1220,420,4],[1300,640,3],[1360,330,4],[180,700,4],[760,760,3],
      [1000,760,4],[300,780,3],[1180,760,3],[640,260,3],[840,260,3],[80,560,3],[1400,520,3],[460,780,4],
      [560,560,3],[1260,260,3]
    ];
    var motes = spots.map(function (s) {
      return { style: 'left:' + s[0] + 'px;top:' + s[1] + 'px;width:' + (s[2] * 2) + 'px;height:' + (s[2] * 2) + 'px;opacity:.65' };
    });
    return {
      phase: this.state.phase,
      engine: this.state.hasGsap ? 'gsap' : 'nogsap',
      welcomeVis: (this.state.phase === 'welcome' || this.state.phase === 'opening' || this.state.phase === 'rewinding') ? 'visible' : 'hidden',
      accent: this.props.accent ?? '#F5D68A',
      motes: motes,
      fireflies: [
        { color: '', style: 'left:300px;top:280px' },
        { color: '', style: 'left:1150px;top:250px;scale:.85' },
        { color: '', style: 'left:1080px;top:700px;scale:.8' },
        { color: '', style: 'left:380px;top:680px;scale:.9' },
        { color: '', style: 'left:560px;top:420px;scale:.7' },
        { color: '', style: 'left:880px;top:330px;scale:.75' },
        { color: '', style: 'left:1300px;top:520px;scale:.9' },
        { color: '', style: 'left:200px;top:520px;scale:.7' },
        { color: '', style: 'left:760px;top:640px;scale:.8' },
        { color: '', style: 'left:1000px;top:480px;scale:.65' }
      ],
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      open: function () {
        if (self.state.phase !== 'idle') return;
        if (!self.tl) { self.setState({ phase: 'welcome' }); return; }
        self.setState({ phase: 'opening' });
        self.tl.timeScale(1).play();
      },
      replay: function () {
        if (!self.tl) { self.setState({ phase: 'idle' }); return; }
        self.setState({ phase: 'rewinding' });
        self.tl.timeScale(2).reverse();
      }
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-OpeningDesktop">
      <div className={`stage ph-${v.phase} ${v.engine}`} ref={v.setRoot}>
        <div className="layer">
          <div className="cam farCam">
            <div className="idle far paint" />
            <div className="layer awake" />
            <div className="halo" />
            <div className="glow" />
            <div className="layer fireflies" aria-hidden="true">
              {(v.fireflies || []).map((b, b$i) => (
                <React.Fragment key={b$i}>
                  <span className="bfly" style={css(b?.style)}>
                    <span className="bin">
                      <span className="ffh" />
                      <span className="ffc" />
                    </span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="layer mist" aria-hidden="true">
          <div className="mistA" />
          <div className="mistB" />
        </div>
        <div className="layer motes" aria-hidden="true">
          {(v.motes || []).map((m, m$i) => (
            <React.Fragment key={m$i}>
              <span className="mote" style={css(m?.style)} />
            </React.Fragment>
          ))}
        </div>
        <div className="layer" aria-hidden="true">
          <div className="cam canopyCam">
            <div className="idle canopy paint" />
          </div>
        </div>
        <div className="layer" aria-hidden="true">
          <div className="cam foreLCam">
            <div className="idle foreL paint" />
          </div>
        </div>
        <div className="layer" aria-hidden="true">
          <div className="cam foreRCam">
            <div className="idle foreR paint" />
          </div>
        </div>
        <div className="layer topshade" />
        <div className="layer botshade" />
        <div className="layer shade2" />
        <div className="intro">
          <p className="script lift" style={css(`margin: 0; font-size: 54px; line-height: 1.15; color: ${v.accent}`)}>
            You're Invited
          </p>
          <h1 className="display lift" style={{"margin":"2px 0 0","fontSize":"92px","lineHeight":".95","color":"#F5EBD5","letterSpacing":".01em"}}>
            Dylan's
          </h1>
          <p className="display lift" style={{"margin":"8px 0 0","fontSize":"30px","fontStyle":"italic","color":"#F5EBD5"}}>
            {"Baptism & First Birthday"}
          </p>
          <div aria-hidden="true" style={{"display":"flex","alignItems":"center","gap":"12px","marginTop":"16px"}}>
            <span style={{"width":"64px","height":"1px","background":"rgba(245,214,138,.7)"}} />
            <p className="lift" style={{"margin":"0","fontSize":"13px","fontWeight":"700","letterSpacing":".26em","textTransform":"uppercase","color":"#F5D68A"}}>
              Sunday · December 13, 2026
            </p>
            <span style={{"width":"64px","height":"1px","background":"rgba(245,214,138,.7)"}} />
          </div>
        </div>
        <div className="openwrap">
          <button className="magic openbtn" type="button" onClick={v.open}>
            <img className="soot-icon soot-open" src="/art/soot-sprite.webp" width="36" height="36" alt="" aria-hidden="true" draggable="false" />
            {" Open Invitation"}
          </button>
        </div>
        <div className="wi" style={css(`position: absolute; top: 28px; left: 96px; right: 32px; display: flex; justify-content: space-between; align-items: center; visibility: ${v.welcomeVis}`)}>
          <div style={{"display":"flex","alignItems":"center","gap":"14px"}}>
            <div aria-hidden="true" style={{"display":"flex","gap":"6px","alignItems":"center"}}>
              <span className="dot on" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <p style={{"margin":"0","fontSize":"11px","fontWeight":"700","letterSpacing":".22em","textTransform":"uppercase","color":"#B0C87C"}}>
              Chapter 1 of 8 · Welcome
            </p>
          </div>
          <button className="ghost" type="button" onClick={v.replay}>
            Replay opening
          </button>
        </div>
        <div className="welcome">
          <p className="script wi" style={css(`margin: 0; font-size: 46px; line-height: 1.15; color: ${v.accent}`)}>
            Welcome, dear friends
          </p>
          <h2 className="display wi" style={{"margin":"2px 0 0","fontSize":"104px","lineHeight":".95","color":"#F5EBD5"}}>
            Dylan
          </h2>
          <p className="wi" style={{"margin":"10px 0 0","fontSize":"13px","fontWeight":"700","letterSpacing":".28em","textTransform":"uppercase","color":"#B0C87C"}}>
            {"Baptism & First Birthday"}
          </p>
          <p className="wi" style={{"margin":"22px 0 0","maxWidth":"440px","fontSize":"17px","lineHeight":"1.65","color":"#F5EBD5"}}>
            A year ago, a tiny explorer wandered into our lives and filled every day with wonder. Please join us as Dylan is welcomed into the faith and celebrates his very first birthday.
          </p>
          <p className="script wi" style={{"margin":"18px 0 0","fontSize":"30px","color":"#F5D68A"}}>
            With all our love,
          </p>
          <p className="display wi" style={{"margin":"0","fontSize":"23px","color":"#F5EBD5"}}>
            {"Dave & Alyana"}
          </p>
          <button className="magic wi" type="button" onClick={v.goNext} style={{"marginTop":"28px"}}>
            {"Continue the journey "}
            <img className="soot-icon soot-next" src="/art/soot-sprite.webp" width="30" height="30" alt="" aria-hidden="true" draggable="false" />
          </button>
          <Link to="/details" className="nextlink" tabIndex="-1" aria-hidden="true">
            Chapter 2
          </Link>
        </div>
        <div className="under" aria-hidden="true" />
        <div className="pflapwrap" aria-hidden="true">
          <div className="pflap" />
        </div>
      </div>
      </div>
    );
  }
}
