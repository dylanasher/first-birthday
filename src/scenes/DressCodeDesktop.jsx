/* eslint-disable */
// DressCodeDesktop: desktop layout, 1440×900. Ported from the "Ch4Desktop.dc.html" design board.
import React from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { css } from '../lib/css.js';
import './DressCodeDesktop.css';

export default class DressCodeDesktop extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = { tab: 'dress', dir: 1 };
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
    var p = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (animate && !this.reduced()) gsap.to(ind, Object.assign(p, { duration: 0.55, ease: 'expo.out' })); else gsap.set(ind, p);
  }
  afterTab() {
    if (!this.root || !gsap) return;
    this.moveIndicator(true);
    if (this.reduced()) return;
    gsap.fromTo(this.root.querySelectorAll('.panel .a, .panel .sw'), { x: 26 * this.state.dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'expo.out', clearProps: 'transform' });
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
    intro.from(q('.sheet'), { x: 90, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.3)
      .from(qa('.ca'), { y: -12, opacity: 0, filter: 'blur(4px)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0.6)
      .from(qa('.tab, .ind'), { y: 12, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.8)
      .from(qa('.panel .a, .foot'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.95)
      .fromTo(qa('.chip'), { scale: 0 }, { scale: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(2.2)', clearProps: 'transform', immediateRender: false }, 1.1)
      .call(function () { if (!self.alive) { self.alive = true; self.ambient(g, q, qa, t); } }, null, 0.2);
    t.push(intro);
    if ('IntersectionObserver' in window) {
      this.io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { if (!self.seen) { self.seen = true; intro.restart(); } } else self.seen = false; }); }, { threshold: 0.15 });
      this.io.observe(r);
    } else intro.play();
  }
  /* the sky garden floats: island bobs, windmill turns, smoke drifts, pennant flutters, lanterns glow, gifts and ribbons float by */
  ambient(g, q, qa, t) {
    t.push(g.to(q('.house'), { y: -10, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    t.push(g.to(q('.wind'), { rotation: 360, duration: 16, ease: 'none', repeat: -1 }));
    t.push(g.fromTo(q('.smoke'), { opacity: 0.95, scale: 1, x: 0, y: 0 }, { opacity: 0.55, scale: 1.12, x: -12, y: -10, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    var flag = q('.flag');
    var fl = g.timeline({ repeat: -1 });
    fl.to(flag, { skewY: 6, scaleX: 0.94, duration: 0.7, ease: 'sine.inOut' }).to(flag, { skewY: -4, scaleX: 1.02, duration: 0.8, ease: 'sine.inOut' }).to(flag, { skewY: 3, scaleX: 0.97, duration: 0.6, ease: 'sine.inOut' }).to(flag, { skewY: 0, scaleX: 1, duration: 0.7, ease: 'sine.inOut' });
    t.push(fl);
    t.push(g.to(q('.clouds'), { x: 30, duration: 22, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    Array.prototype.forEach.call(qa('.lantern'), function (l, i) {
      t.push(g.fromTo(l, { opacity: 0.55, scale: 0.9 }, { opacity: 1, scale: 1.12, duration: 1.8 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
    [[q('.rb1'), 190, 28], [q('.rb2'), 330, 36]].forEach(function (rb, i) {
      t.push(g.fromTo(rb[0], { x: -120, y: rb[1], rotation: -10 }, { x: 820, y: rb[1] - 60, rotation: 20, duration: rb[2], ease: 'sine.inOut', repeat: -1, repeatDelay: 6, delay: i * 9 }));
      t.push(g.to(rb[0], { scaleY: -1, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
  }
  /* storybook page turn to Chapter 5: curls from the bottom-right corner, revealing the lantern village */
  goNext() {
    var self = this, r = this.root;
    if (!r) return;
    var link = r.querySelector('.nextlink'), g = gsap;
    if (!g || this.reduced()) { if (link) link.click(); return; }
    if (this.turning) return;
    this.turning = true;
    var W = r.offsetWidth, H = r.offsetHeight;
    var under = r.querySelector('.under5'), wrap = r.querySelector('.tflapwrap'), flap = r.querySelector('.tflap');
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
    var self = this, tab = this.state.tab;
    function set(tb) { return function () { if (self.state.tab === tb) return; self.setState({ tab: tb, dir: tb === 'gifts' ? 1 : -1 }); setTimeout(function () { self.afterTab(); }, 30); }; }
    /* palette: suggested pastels taken from the painting (replace with the confirmed colors) */
    var palette = [['Sage Green', '#A8B99A', '/art/flame-sage.webp'], ['Gray', '#9B9D9A', '/art/flame-gray.webp'], ['Cream', '#F5E8CF', '/art/flame-cream.webp'], ['Dusty Blue', '#A7C5D3', '/art/flame-blue.webp'], ['Peach', '#E9B7A5', '/art/flame-peach.webp']].map(function (c) { return { name: c[0], hex: c[1], style: '--c:' + c[1], img: 'background-image:url(' + c[2] + ')' }; });
    var gifts = [
      { title: "Children's books", text: 'Stories we can read together at bedtime.', icon: 'M4 5 C7 4 10 4 12 6 C14 4 17 4 20 5 V19 C17 18 14 18 12 20 C10 18 7 18 4 19 Z M12 6 V20' },
      { title: 'Educational toys', text: 'Toys that help him learn while he plays.', icon: 'M4 14 H10 V20 H4 Z M14 14 H20 V20 H14 Z M9 4 H15 V10 H9 Z' },
      { title: 'Baby essentials', text: 'Practical everyday things for a growing toddler.', icon: 'M9 3 H15 V6 L17 9 V20 A1 1 0 0 1 16 21 H8 A1 1 0 0 1 7 20 V9 L9 6 Z M7 13 H17' },
      { title: 'Toward his future', text: 'A small contribution to Dylan\'s savings.', icon: 'M12 21 V11 M12 11 C12 7 9 5 5 5 C5 9 8 11 12 11 Z M12 13 C12 9 15 7 19 7 C19 11 16 13 12 13 Z' }
    ];
    return {
      setRoot: function (el) { self.root = el; },
      goNext: function () { self.goNext(); },
      isDress: tab === 'dress', isGifts: tab === 'gifts',
      tabDress: tab === 'dress' ? 'on' : '', tabGifts: tab === 'gifts' ? 'on' : '',
      pressDress: tab === 'dress' ? 'true' : 'false', pressGifts: tab === 'gifts' ? 'true' : 'false',
      showDress: set('dress'), showGifts: set('gifts'),
      palette: palette, gifts: gifts
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="dc-DressCodeDesktop">
      <div className="stage" ref={v.setRoot}>
        <div className="scene layer" aria-hidden="true">
          <div className="lyr far" />
          <span className="ribbon rb1">
            <svg viewBox="0 0 90 40">
              <path d="M2 20 C14 2 26 38 40 20 S 66 2 88 22" fill="none" stroke="#EFA9B8" style={{"strokeWidth":"4","strokeLinecap":"round"}} />
            </svg>
          </span>
          <span className="ribbon rb2">
            <svg viewBox="0 0 90 40">
              <path d="M2 22 C16 6 28 36 44 18 S 70 4 88 18" fill="none" stroke="#B7CDA4" style={{"strokeWidth":"4","strokeLinecap":"round"}} />
            </svg>
          </span>
          <div className="house">
            <div className="lyr smoke" />
            <div className="lyr island" />
            <div className="lyr water" />
            <div className="lyr water2" />
            <div className="lyr wind" />
            <div className="lyr flag" />
            <span className="lantern" style={{"left":"54px","top":"402px"}} />
            <span className="lantern" style={{"left":"611px","top":"177px"}} />
            <span className="lantern" style={{"left":"688px","top":"392px"}} />
          </div>
          <div className="lyr clouds" />
        </div>
        <div className="layer rightshade" />
        <div className="sheet">
          <div className="head">
            <p className="eyebrow ca">
              Chapter IV · Up in the Clouds
            </p>
            <h1 className="script ca" style={{"margin":"2px 0 0","fontSize":"50px","lineHeight":"1.1","color":"#5B4A7A"}}>
              {"Dress Code & Gifts"}
            </h1>
          </div>
          <div className="tabs" role="group" aria-label="Dress code or gift guide">
            <span className="ind" aria-hidden="true" />
            <button className={`tab t-dress ${v.tabDress}`} type="button" aria-pressed={v.pressDress} onClick={v.showDress}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <path d="M9 3 L12 6 L15 3 L19 6 L17 10 L16 9 V21 H8 V9 L7 10 L5 6 Z" />
              </svg>
              {" Dress code"}
            </button>
            <button className={`tab t-gifts ${v.tabGifts}`} type="button" aria-pressed={v.pressGifts} onClick={v.showGifts}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <rect x="3" y="9" width="18" height="12" rx="2" />
                <path d="M2 9 H22 M12 9 V21 M12 9 C9 3 5 5 8 9 M12 9 C15 3 19 5 16 9" />
              </svg>
              {" Gift guide"}
            </button>
          </div>
          <div className="scroll">
            {v.isDress ? (
              <>
                <div className="panel">
                  <p className="lbl a">
                    The dress code
                  </p>
                  <h2 className="title a">
                    Smart Casual
                  </h2>
                  <p className="p a">
                    Come in smart casual, or whatever you feel most comfortable in. Light, soft colors from our palette are always lovely.
                  </p>
                  <p className="lbl a" style={{"marginTop":"22px"}}>
                    Our palette
                  </p>
                  <div className="swatches a" role="list" aria-label="Suggested colors">
                    {(v.palette || []).map((c, c$i) => (
                      <React.Fragment key={c$i}>
                        <div className="sw" role="listitem" tabIndex="0">
                          <span className="chip" style={css(c?.style)}>
                            <span className="fl" style={css(c?.img)} />
                          </span>
                          <p className="swname">
                            {c?.name}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="nowhite a">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#B5583D" style={{"strokeWidth":"1.8","strokeLinecap":"round","flex":"none"}}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M5.6 5.6 L18.4 18.4" />
                    </svg>
                    <p style={{"margin":"0","fontSize":"14.5px","lineHeight":"1.45","color":"#2A2238"}}>
                      {"Kindly "}
                      <strong>
                        avoid wearing white
                      </strong>
                      . It's reserved for Dylan's godparents.
                    </p>
                  </div>
                  <div className="cards">
                    <div className="card a">
                      <span className="ico">
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#5B4A7A" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <path d="M9 3 L12 6 L15 3 L19 6 L17 10 L16 9 V21 H8 V9 L7 10 L5 6 Z" />
                        </svg>
                      </span>
                      <h3>
                        Grown-ups
                      </h3>
                      <div className="outfit" role="img" aria-label="A woman in a cream blouse and dusty-blue skirt, and a man in a cream shirt and gray trousers" style={{"backgroundImage":"url(/art/outfit-grown-ups.webp)"}} />
                    </div>
                    <div className="card a">
                      <span className="ico">
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#5B4A7A" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                          <circle cx="12" cy="6" r="3" />
                          <path d="M7 21 V14 L5 12 L8 9 H16 L19 12 L17 14 V21" />
                        </svg>
                      </span>
                      <h3>
                        Little ones
                      </h3>
                      <div className="outfit" role="img" aria-label="A girl in a cream blouse and pink skirt, and a boy in a sage-green shirt and gray trousers" style={{"backgroundImage":"url(/art/outfit-little-ones.webp)","backgroundSize":"auto 72%"}} />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.isGifts ? (
              <>
                <div className="panel">
                  <p className="quote a">
                    Your presence, love, and prayers are the greatest gifts we could ask for.
                  </p>
                  <p className="p a" style={{"textAlign":"center","fontSize":"15px"}}>
                    Gifts are never expected. If you'd still like to bring something, here are a few ideas:
                  </p>
                  <div className="cards">
                    {(v.gifts || []).map((g, g$i) => (
                      <React.Fragment key={g$i}>
                        <div className="card a">
                          <span className="ico">
                            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#5B4A7A" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}}>
                              <path d={g?.icon} />
                            </svg>
                          </span>
                          <h3>
                            {g?.title}
                          </h3>
                          <p>
                            {g?.text}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
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
                <span className="dot on" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p style={{"margin":"0","fontSize":"12px","fontWeight":"700","letterSpacing":".14em","textTransform":"uppercase","color":"#4A3B66"}}>
                Chapter 4 of 8
              </p>
            </div>
            <button className="next" type="button" onClick={v.goNext}>
              {"Next: Do's & Don'ts "}
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8 H12 M8.5 4 L12.5 8 L8.5 12" fill="none" stroke="#F5D68A" style={{"strokeWidth":"1.8","strokeLinecap":"round","strokeLinejoin":"round"}} />
              </svg>
            </button>
            <Link to="/dos-and-donts" className="nextlink" tabIndex="-1" aria-hidden="true">
              Chapter 5
            </Link>
          </div>
        </div>
        <div className="under5" aria-hidden="true" />
        <div className="tflapwrap" aria-hidden="true">
          <div className="tflap" />
        </div>
      </div>
      </div>
    );
  }
}
