import React, { useEffect, useState } from 'react';
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

export default function MusicButton({ variant, scene, opening }) {
  const [on, setOn] = useState(music.isOn);
  useEffect(() => music.subscribe(setOn), []);
  // Chapter 1 waits for "Open Invitation"; every other chapter may start the music straight away
  useEffect(() => { music.enter(!opening); }, [opening]);

  const desktop = variant === 'desktop';
  return (
    <div className={`mus-layer mus-layer--${variant}`}>
      <button
        className={`mus${desktop ? ' bl' : ''}${on ? ' on' : ''}`}
        style={desktop ? undefined : PHONE_SPOT[scene]}
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
