import React, { useEffect, useState } from 'react';
import { useViewport } from '../lib/useViewport.js';
import { loadScene, prefetchScene, sceneIfReady } from '../lib/sceneLoader.js';
import { chapters } from '../chapters.js';

// Desktop chapters are painted on a fixed 1440×900 artboard, scaled to fit the window. Any space
// around it shows a soft, blurred copy of the chapter's painting so the screen is always filled.
// Phone and tablet-portrait chapters size themselves to the screen (100vw × 100dvh).
//
// A chapter is only shown once its code and every painting it uses have loaded, so nothing pops in
// piece by piece. While a guest reads a chapter, the next one loads in the background, so after a
// page turn it appears at once. If it isn't ready yet (a direct link, a slow connection), the
// chapter's ground colour shows briefly and the whole scene fades in.
const DESKTOP = { w: 1440, h: 900 };

export function pickVariant({ width, height }) {
  return width >= 900 && width / height >= 1.05 ? 'desktop' : 'mobile';
}

export default function Scene({ chapter }) {
  const vp = useViewport();
  const variant = pickVariant(vp);
  const key = chapter[variant];
  // on desktop the blurred backdrop is part of the scene too, so it appears together with it
  const extra = variant === 'desktop' && chapter.backdrop ? [chapter.backdrop] : [];
  const readyNow = sceneIfReady(key, extra);
  const [loaded, setLoaded] = useState(() => (readyNow ? { key, comp: readyNow, fade: false } : null));
  const shown = loaded && loaded.key === key ? loaded : readyNow ? { key, comp: readyNow, fade: false } : null;

  useEffect(() => {
    document.title = chapter.title;
  }, [chapter.title]);

  // load this chapter (if needed), then warm up the next one
  useEffect(() => {
    let alive = true;
    const next = chapters[chapters.indexOf(chapter) + 1];
    const warmNext = () => { if (next) prefetchScene(next[variant], variant === 'desktop' && next.backdrop ? [next.backdrop] : []); };
    if (sceneIfReady(key, extra)) { warmNext(); return undefined; }
    loadScene(key, 8000, extra).then((comp) => {
      if (!alive) return;
      setLoaded({ key, comp, fade: true });
      warmNext();
    });
    return () => { alive = false; };
  }, [key, chapter, variant]); // eslint-disable-line react-hooks/exhaustive-deps

  const body = shown ? (
    <div className={shown.fade ? 'scene-in scene-in--fade' : 'scene-in'}>
      <shown.comp />
    </div>
  ) : null;

  if (variant === 'mobile') {
    return (
      <div className="scene-fit scene-fit--fluid" style={{ background: chapter.color }}>
        {body}
      </div>
    );
  }

  const scale = Math.min(vp.width / DESKTOP.w, vp.height / DESKTOP.h);
  return (
    <div
      className="scene-fit scene-fit--fixed"
      style={{ background: chapter.color, '--scene-scale': scale, '--scene-w': `${DESKTOP.w}px`, '--scene-h': `${DESKTOP.h}px` }}
    >
      {chapter.backdrop && shown ? (
        <div className={shown.fade ? 'scene-backdrop scene-in--fade' : 'scene-backdrop'} aria-hidden="true" style={{ backgroundImage: `url(${chapter.backdrop})` }} />
      ) : null}
      {body}
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
