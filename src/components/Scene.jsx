import React, { Suspense, useEffect } from 'react';
import { useViewport } from '../lib/useViewport.js';

// Each chapter is painted on a fixed artboard: 390×844 for phones and 1440×900 for desktop.
// Scene picks the layout for the current viewport and scales the artboard to fit, letterboxed
// on a soft, blurred copy of the chapter's painting so the screen is always filled edge to edge.
const MOBILE = { w: 390, h: 844 };
const DESKTOP = { w: 1440, h: 900 };
const MOBILE_MIN_H = 640; // shorter than this and the cards would crowd the titles
const MOBILE_MAX_H = 1000;

export function pickVariant({ width, height }) {
  return width >= 900 && width / height >= 1.05 ? 'desktop' : 'mobile';
}

export default function Scene({ chapter }) {
  const vp = useViewport();
  const variant = pickVariant(vp);
  const Comp = variant === 'desktop' ? chapter.desktop : chapter.mobile;
  const { w } = variant === 'desktop' ? DESKTOP : MOBILE;
  let { h } = variant === 'desktop' ? DESKTOP : MOBILE;
  let scale = Math.min(vp.width / w, vp.height / h);
  if (variant === 'mobile') {
    // Phones: fill the full width, and let the artboard's height follow the screen so the chapter
    // runs edge to edge. Titles stay pinned to the top, cards and buttons to the bottom, and the
    // painted middle absorbs the difference. Outside a sensible range, fall back to fitting.
    const fitH = vp.height / (vp.width / w);
    if (fitH >= (chapter.mobileMinH || MOBILE_MIN_H) && fitH <= MOBILE_MAX_H) {
      scale = vp.width / w;
      h = fitH;
    }
  }

  useEffect(() => {
    document.title = chapter.title;
  }, [chapter.title]);

  return (
    <div
      className="scene-fit"
      style={{ '--scene-scale': scale, '--scene-w': `${w}px`, '--scene-h': `${Math.round(h)}px` }}
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
