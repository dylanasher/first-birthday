import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { music } from '../lib/music.js';
import './MusicButton.css';

// Where the button sits on each phone chapter: just above that chapter's panel, never over the
// title, panels or buttons (MUSIC-HANDOFF.md, "Button position"). Desktop: bottom-left corner.
const PHONE_SPOT = {
  OpeningMobile: { right: 12, bottom: 14 },
  DetailsMobile: { right: 12, bottom: 'calc(clamp(320px, 56.4cqh, 620px) + 14px)' },
  MilestonesMobile: { left: 12, bottom: 'calc(clamp(320px, 55.2cqh, 600px) + 14px)' },
  DressCodeMobile: { right: 12, bottom: 'calc(clamp(300px, 47.4cqh, 560px) + 14px)' },
  DosDontsMobile: { right: 12, bottom: 'calc(clamp(300px, 51cqh, 580px) + 14px)' },
  RsvpMobile: { right: 12, bottom: 'calc(clamp(330px, 61.6cqh, 640px) + 14px)' },
  WishesMobile: { right: 12, bottom: 88 },
  ThankYouMobile: { right: 12, top: '27cqh' },
};

// Each chapter mounts its own button, so remember where the last one stood: the new one starts
// there and glides to its own spot, as if the sprite walked over with the page turn.
const lastSpot = {};
export const hasMusicSpot = (variant) => Boolean(lastSpot[variant]);

export default function MusicButton({ variant, scene, opening }) {
  const [on, setOn] = useState(music.isOn);
  const btn = useRef(null);
  const spot = useRef(null);
  useEffect(() => music.subscribe(setOn), []);
  // Chapter 1 waits for "Open Invitation"; every other chapter may start the music straight away
  useEffect(() => { music.enter(!opening); }, [opening]);

  // the invisible spot element sits where the handoff puts the button; move the button there
  useLayoutEffect(() => {
    const b = btn.current, s = spot.current;
    if (!b || !s) return undefined;
    const place = (glide) => {
      const to = `translate(${s.offsetLeft}px, ${s.offsetTop}px)`;
      const from = lastSpot[variant];
      lastSpot[variant] = to;
      b.style.transition = 'none';
      if (glide && from && from !== to) {
        b.style.transform = from;
        void b.offsetWidth; // commit the start point so the change below animates
        b.style.transition = '';
      }
      b.style.transform = to;
    };
    place(true);
    // re-place without gliding when the screen size changes (not on the observer's first report)
    const layer = b.parentElement;
    let size = `${layer.clientWidth}x${layer.clientHeight}`;
    const ro = new ResizeObserver(() => {
      const now = `${layer.clientWidth}x${layer.clientHeight}`;
      if (now !== size) { size = now; place(false); }
    });
    ro.observe(layer);
    return () => ro.disconnect();
  }, [variant, scene]);

  const desktop = variant === 'desktop';
  return (
    <div className={`mus-layer mus-layer--${variant}`}>
      <span ref={spot} className={`mus-spot${desktop ? ' bl' : ''}`} style={desktop ? undefined : PHONE_SPOT[scene]} aria-hidden="true" />
      <button
        ref={btn}
        className={`mus${desktop ? ' bl' : ''}${on ? ' on' : ''}`}
        type="button"
        data-mus
        aria-pressed={on}
        aria-label={on ? 'Turn music off' : 'Turn music on'}
        onClick={() => music.toggle()}
      >
        <span className="egg" aria-hidden="true" />
      </button>
    </div>
  );
}
