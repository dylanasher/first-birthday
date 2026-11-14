# Background music + egg button — handoff

Adds background music (Ave Maria, from *Otello*, performed by Patrick Jordan-Patrikios, from the YouTube Audio Library) to all 8 chapters on phone and desktop, with a little egg-with-headphones button to turn it on and off.

## What's in this folder
- `assets/music/background.mp3`: the track, 128 kbps, about 4 MB, 4:18, with a soft fade-in and fade-out. `background.m4a` is the same audio as AAC, if you'd rather use that.
- `assets/ui/egg-music-on.png` (egg wearing headphones, music notes) and `egg-music-off.png` (sleepy egg, headphones down, "z"): transparent, 256×256.
- `reference/`: approved pages with the feature in place (Chapter 1 phone and desktop, Chapter 2 phone). In them the audio and egg images are referenced as `/_blob/…` ids: `28394516…` = the track, `ecba93dd…` = egg-music-on, `9aaf7913…` = egg-music-off.

**Licence:** before going live, open this track in YouTube Studio → Audio Library and check whether it says "Attribution required". If so, add a credit line, e.g. on the Thank You chapter: *Music: "Ave Maria (Otello)" by Patrick Jordan-Patrikios*.

## Prompt to give your codebase / coding assistant

```
Add background music with an on/off button to every chapter (1–8) of Dylan's invitation, on phone and desktop. Follow MUSIC-HANDOFF.md exactly.

1. Copy assets/music/background.mp3 to /assets/music/background.mp3 and the two egg PNGs to /assets/ui/.
2. Add the button markup from "Markup" once per chapter, as the first child of the chapter's root/stage element, and the CSS from "CSS".
3. Place it per chapter using the "Button position" table (phone) and the bottom-left corner on desktop. It must never cover the title, panels or buttons.
4. Add the player logic from "Logic". Call setupMusic() once the chapter has mounted and stopMusic() when it unmounts/leaves.
5. Behaviour:
   - Never play before the guest's first tap (browser autoplay rules).
   - Chapter 1: start only when the guest taps "Open Invitation" (or the egg button), then fade in to 35% volume.
   - Other chapters: start on load if allowed, otherwise on the first tap anywhere.
   - The egg button toggles with a ~0.9s fade. Remember the choice in localStorage 'dylanMusic' = 'on' | 'off'; if 'off', never auto-start.
   - Remember the song position in localStorage 'dylanMusicT' = '<seconds>|<timestamp>' and resume from it on the next chapter if it was saved less than 20 minutes ago.
   - Pause when the tab/app is hidden; resume when it comes back (only if it was playing).
   - Only one tab plays at a time (BroadcastChannel 'dylan-music').
   - prefers-reduced-motion: the egg stays still (music still works).
6. If the site is a single-page app (chapters change without a full page reload), create the audio element ONCE at app level and keep it alive across chapters instead. Then the position-resume step isn't needed, but keep the on/off memory.
7. Do not change anything else.
8. Test on iPhone Safari and Android Chrome: silent until the first tap, fades in, continues on the next chapter, stays off after muting, pauses when switching apps.
```

## Markup
```html
<button class="mus" type="button" data-mus aria-pressed="false" aria-label="Turn music on">
  <span class="egg" aria-hidden="true"></span>
</button>
```
The code switches the class `on`, `aria-pressed` and `aria-label` ("Turn music on" / "Turn music off").

## CSS
```css
/* background music: a little egg with headphones on every chapter. Music on: it bops along. Off: it dozes. */
.mus{position:absolute;z-index:90;width:46px;height:46px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent}
.mus::before{content:"";position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(closest-side,rgba(16,24,48,.42),rgba(16,24,48,.22) 62%,rgba(16,24,48,0));pointer-events:none}
.mus .egg{position:absolute;inset:0;background:url(/assets/ui/egg-music-off.png) center / contain no-repeat;filter:drop-shadow(0 2px 3px rgba(10,16,40,.45)) drop-shadow(0 0 6px rgba(255,240,200,.35));transform-origin:50% 92%;animation:eggdoze 3.6s ease-in-out infinite;transition:transform .2s}
.mus.on .egg{background-image:url(/assets/ui/egg-music-on.png);animation:eggbop .9s ease-in-out infinite}
.mus:hover .egg{transform:scale(1.08)}
.mus:active .egg{transform:scale(.94)}
.mus:focus-visible{outline:2px solid #F5D68A;outline-offset:3px}
@keyframes eggbop{0%,100%{transform:rotate(-6deg) translateY(0)}25%{transform:rotate(0) translateY(-3px)}50%{transform:rotate(6deg) translateY(0)}75%{transform:rotate(0) translateY(-3px)}}
@keyframes eggdoze{0%,100%{transform:scale(1,1)}50%{transform:scale(1.03,.97)}}
.mus.tr{top:8px;right:8px}
.mus.br{right:12px;bottom:14px}
.mus.bl{left:18px;bottom:18px;width:58px;height:58px}
@media (prefers-reduced-motion: reduce){.mus .egg,.mus.on .egg{animation:none}}
```
Desktop: use class `mus bl` (bottom-left, 58px). Chapter 1 phone: `mus br` (bottom-right). Other phone chapters: inline position from the table below.

## Button position (phone, 46px button)
These are written for each chapter's panel height so the egg sits just above the panel:

| Chapter | style |
|---|---|
| Ch.1 Welcome | class `br` (right 12px, bottom 14px) |
| Ch.2 | `right: 12px; bottom: calc(clamp(320px, 56.4cqh, 620px) + 14px)` |
| Ch.3 | `left: 12px; bottom: calc(clamp(320px, 55.2cqh, 600px) + 14px)` |
| Ch.4 | `right: 12px; bottom: calc(clamp(300px, 47.4cqh, 560px) + 14px)` |
| Ch.5 | `right: 12px; bottom: calc(clamp(300px, 51cqh, 580px) + 14px)` |
| Ch.6 | `right: 12px; bottom: calc(clamp(330px, 61.6cqh, 640px) + 14px)` |
| Ch.7 Wishes | `right: 12px; bottom: 88px` |
| Ch.8 Thank You | `right: 12px; top: 27cqh` |

## Logic
```js
const MUSIC_SRC = '/assets/music/background.mp3';

// For Chapter 1 only, allow playback once the guest has opened the invitation:
//   musAllowed() { return !!this.musOk || this.state.phase !== 'idle'; }
//   and in the "Open Invitation" handler: this.musOk = true; if (this.mus && localStorage.getItem('dylanMusic') !== 'off') this.mus.play();
// Other chapters: musAllowed() { return true; }

  setupMusic() {
    if (this.mus) return;
    var self = this, r = this.root, btn = r.querySelector('[data-mus]');
    if (!btn) return;
    var KEY = 'dylanMusic', TKEY = 'dylanMusicT', VOL = 0.35;
    var store = function (st, k, v) { try { var s = window[st]; if (v === undefined) return s.getItem(k); s.setItem(k, v); } catch (e) { return null; } };
    var a = new Audio(MUSIC_SRC); a.loop = true; a.preload = 'auto'; a.volume = 0;
    var bc = null, me = Math.random(), raf = 0, armed = false;
    try { bc = new BroadcastChannel('dylan-music'); } catch (e) {}
    var ui = function (on) { btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on'); };
    var ramp = function (to, done) {
      cancelAnimationFrame(raf); var from = a.volume, t0 = performance.now();
      (function step(t) { var k = Math.min(1, (t - t0) / 900); a.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k < 1) raf = requestAnimationFrame(step); else if (done) done(); })(t0);
    };
    var arm = function () {
      if (armed) return; armed = true;
      var h = function (e) {
        if (e.target && e.target.closest && e.target.closest('[data-mus]')) return;
        r.removeEventListener('pointerdown', h, true); r.removeEventListener('keydown', h, true); armed = false;
        if (store('localStorage', KEY) !== 'off' && self.musAllowed()) play();
      };
      r.addEventListener('pointerdown', h, true); r.addEventListener('keydown', h, true);
    };
    var play = function () {
      // pick up where the song was on the previous chapter (if that was in the last 20 minutes)
      var sv = String(store('localStorage', TKEY) || '').split('|'), t = parseFloat(sv[0]), at = +sv[1] || 0;
      if (!isNaN(t) && Date.now() - at < 1200000 && a.currentTime < 0.5) { try { a.currentTime = t; } catch (e) {} }
      var p = a.play();
      var ok = function () { ui(true); ramp(VOL); if (bc) bc.postMessage(me); };
      if (p && p.then) p.then(ok).catch(function () { ui(false); arm(); }); else ok();
    };
    var stop = function () { ui(false); ramp(0, function () { a.pause(); }); };
    btn.addEventListener('click', function () {
      var on = !btn.classList.contains('on');
      store('localStorage', KEY, on ? 'on' : 'off');
      if (on) play(); else stop();
    });
    var last = 0;
    a.addEventListener('timeupdate', function () { if (Math.abs(a.currentTime - last) > 0.8) { last = a.currentTime; store('localStorage', TKEY, a.currentTime + '|' + Date.now()); } });
    var save = function () { if (a.currentTime > 0) store('localStorage', TKEY, a.currentTime + '|' + Date.now()); };
    window.addEventListener('pagehide', save);
    if (bc) bc.onmessage = function (e) { if (e.data !== me && !a.paused) { ui(false); a.pause(); } };
    var vis = function () { if (document.hidden) { if (!a.paused) { save(); a.pause(); self.musWas = true; } } else if (self.musWas) { self.musWas = false; play(); } };
    document.addEventListener('visibilitychange', vis);
    this.mus = { a: a, play: play, vis: vis, save: save, bc: bc };
    ui(false);
    if (store('localStorage', KEY) !== 'off' && this.musAllowed()) play();
  }

  stopMusic() {
    clearTimeout(this.musRetry);
    if (!this.mus) return;
    this.mus.save(); this.mus.a.pause();
    document.removeEventListener('visibilitychange', this.mus.vis); window.removeEventListener('pagehide', this.mus.save);
    if (this.mus.bc) this.mus.bc.close();
    this.mus = null;
  }
```
(`this.root` is the chapter's root element. Adapt `this.` to your framework: a React ref, a Vue component, or plain module variables.)
