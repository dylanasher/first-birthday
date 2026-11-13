import React, { Suspense, useEffect } from 'react';
import { useViewport } from '../lib/useViewport.js';

// Desktop chapters are painted on a fixed 1440×900 artboard, scaled to fit the window. Any space
// around it shows a soft, blurred copy of the chapter's painting so the screen is always filled.
// Phone and tablet-portrait chapters size themselves to the screen (100vw × 100dvh, using container
// units inside), so they're shown as-is, filling the screen.
const DESKTOP = { w: 1440, h: 900 };

export function pickVariant({ width, height }) {
  return width >= 900 && width / height >= 1.05 ? 'desktop' : 'mobile';
}

export default function Scene({ chapter }) {
  const vp = useViewport();
  const variant = pickVariant(vp);
  const Comp = variant === 'desktop' ? chapter.desktop : chapter.mobile;

  useEffect(() => {
    document.title = chapter.title;
  }, [chapter.title]);

  if (variant === 'mobile') {
    return (
      <div className="scene-fit scene-fit--fluid">
        <Suspense fallback={null}>
          <Comp />
        </Suspense>
      </div>
    );
  }

  const scale = Math.min(vp.width / DESKTOP.w, vp.height / DESKTOP.h);
  return (
    <div
      className="scene-fit scene-fit--fixed"
      style={{ '--scene-scale': scale, '--scene-w': `${DESKTOP.w}px`, '--scene-h': `${DESKTOP.h}px` }}
    >
      {chapter.backdrop ? (
        <div className="scene-backdrop" aria-hidden="true" style={{ backgroundImage: `url(${chapter.backdrop})` }} />
      ) : null}
      <Suspense fallback={null}>
        <Comp />
      </Suspense>
    </div>
  );
}

// A tall reference page (the design system sheet) scales to the viewport width and scrolls.
export function Sheet({ component: Comp, width, title }) {
  const vp = useViewport();
  const scale = Math.min(1, vp.width / width);
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div className="sheet-fit" style={{ '--sheet-scale': scale, '--sheet-w': `${width}px` }}>
      <Comp />
    </div>
  );
}
