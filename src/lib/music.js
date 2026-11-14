// Background music for the whole invitation (see handoff/MUSIC-HANDOFF.md).
// The site is a single-page app, so there is ONE audio element for the whole visit: it keeps playing
// across page turns. The soot-sprite button on every chapter turns it on and off.
//
// - Music is on from the start: it plays as soon as the site opens if the browser allows it.
//   Most browsers (always on iPhone) hold sound back until the guest's first tap; until then the
//   sprite dozes, and the music starts on the first tap anywhere (or on the button).
// - The on/off choice is remembered (localStorage 'dylanMusic' = 'on' | 'off'); 'off' never auto-starts.
// - The song position is remembered across reloads for 20 minutes ('dylanMusicT' = '<seconds>|<time>').
// - Pauses while the tab or app is hidden; only one tab plays at a time.

const SRC = `${import.meta.env.BASE_URL}music/background.mp3`;
const KEY = 'dylanMusic';
const TKEY = 'dylanMusicT';
const VOL = 0.35;
const FADE_MS = 900;

const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } };

let audio = null;
let on = false; // what the button shows: on only while the music is actually playing
let playing = false;
let armed = false;
let wasPlaying = false;
let raf = 0;
let bc = null;
const me = Math.random();
const listeners = new Set();
function ui(next) {
  if (on === next) return;
  on = next;
  listeners.forEach((fn) => fn(on));
}

function ramp(to, done) {
  cancelAnimationFrame(raf);
  const from = audio.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / FADE_MS);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) raf = requestAnimationFrame(step);
    else if (done) done();
  };
  step(t0);
}

function save() {
  if (audio && audio.currentTime > 0) set(TKEY, `${audio.currentTime}|${Date.now()}`);
}

function init() {
  if (audio || typeof window === 'undefined') return;
  audio = new Audio(SRC);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  let last = 0;
  audio.addEventListener('timeupdate', () => {
    if (Math.abs(audio.currentTime - last) > 0.8) { last = audio.currentTime; save(); }
  });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) { save(); audio.pause(); wasPlaying = true; }
    } else if (wasPlaying) {
      wasPlaying = false;
      play();
    }
  });
  try {
    bc = new BroadcastChannel('dylan-music');
    bc.onmessage = (e) => { if (e.data !== me && !audio.paused) { playing = false; ui(false); audio.pause(); } };
  } catch (e) { /* older browsers: no cross-tab handoff */ }
}

// wait for the guest's first tap or key press, then start (unless they've turned music off)
function arm() {
  if (armed) return;
  armed = true;
  const h = (e) => {
    if (e.target && e.target.closest && e.target.closest('[data-mus]')) return; // the button handles itself
    document.removeEventListener('pointerdown', h, true);
    document.removeEventListener('keydown', h, true);
    armed = false;
    if (get(KEY) !== 'off') play();
  };
  document.addEventListener('pointerdown', h, true);
  document.addEventListener('keydown', h, true);
}

function play() {
  init();
  if (playing && !audio.paused) return;
  // pick up where the song was before a reload (if that was in the last 20 minutes)
  const [t, at] = String(get(TKEY) || '').split('|').map(Number);
  if (!Number.isNaN(t) && Date.now() - (at || 0) < 1200000 && audio.currentTime < 0.5) {
    try { audio.currentTime = t; } catch (e) { /* not seekable yet */ }
  }
  const ok = () => { playing = true; ui(true); ramp(VOL); if (bc) bc.postMessage(me); };
  const p = audio.play();
  // blocked until the guest taps: the sprite keeps dozing and the music starts on their first tap
  if (p && p.then) p.then(ok).catch(() => { playing = false; arm(); });
  else ok();
}

function stop() {
  playing = false;
  ui(false);
  if (audio) ramp(0, () => audio.pause());
}

export const music = {
  // a chapter mounted: start the music if it isn't playing yet (and the guest hasn't turned it off)
  enter() {
    init();
    if (get(KEY) !== 'off') play();
  },
  // the guest tapped "Open Invitation": a tap, so the browser lets the music start now if it hadn't
  unlock() {
    if (get(KEY) !== 'off') play();
  },
  toggle() {
    const next = !on;
    set(KEY, next ? 'on' : 'off');
    if (next) play();
    else stop();
  },
  isOn: () => on,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
