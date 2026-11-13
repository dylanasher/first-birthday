import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './Catbus.css';

gsap.registerPlugin(MotionPathPlugin);

// The catbus trots down the country lane in Chapter 2, from the chapel towards the viewer.
// `path` holds points on the lane in artboard px, far end (by the chapel) first. Each point
// marks where the catbus's feet land. `width` is how wide it looks at that point, so it grows
// as it comes closer. It faces the way it's moving, then waits a moment before the next lap.
export default function Catbus({ path, walk = 10, rest = 4, delay = 2.5 }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const body = el.querySelector('.catbus-body');
    const img = el.querySelector('.catbus-img');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BASE = 300; // the element's own width; size per point is done with scale
    const pts = path.map((p) => ({ x: p.x, y: p.y }));
    const scales = path.map((p) => p.width / BASE);

    // scale tracks the lane position: same keyframe spacing as the motion path, by distance
    const dist = [0];
    for (let i = 1; i < pts.length; i++) {
      dist.push(dist[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    }
    const total = dist[dist.length - 1];
    const scaleAt = (t) => {
      const d = t * total;
      let i = 1;
      while (i < dist.length - 1 && dist[i] < d) i++;
      const k = (d - dist[i - 1]) / (dist[i] - dist[i - 1] || 1);
      return scales[i - 1] + (scales[i] - scales[i - 1]) * k;
    };

    if (reduced) {
      // no walking: rest midway down the lane, facing the viewer
      const mid = Math.floor(pts.length * 0.6);
      gsap.set(el, { x: pts[mid].x, y: pts[mid].y, scale: scales[mid], opacity: 1 });
      return undefined;
    }

    const state = { t: 0 };
    let lastX = pts[0].x;
    let facing = 0; // -1 left, 1 right
    const face = (dir) => {
      if (dir === facing) return;
      const first = facing === 0; // the first heading of a lap snaps, later turns are animated
      facing = dir;
      gsap.to(img, { scaleX: dir, duration: first ? 0 : 0.35, ease: 'power2.inOut', overwrite: true });
    };

    const place = () => {
      const p = MotionPathPlugin.getPositionOnPath(rawPath, state.t);
      gsap.set(el, { x: p.x, y: p.y, scale: scaleAt(state.t) });
      const dx = p.x - lastX;
      if (Math.abs(dx) > 0.15) face(dx < 0 ? -1 : 1);
      lastX = p.x;
    };

    const rawPath = MotionPathPlugin.cacheRawPathMeasurements(
      MotionPathPlugin.arrayToRawPath(pts, { curviness: 1.2 })
    );

    // little trotting bounce on the body, while walking
    const gait = gsap.to(body, { y: -5, rotation: 0.8, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: rest, delay });
    tl.set(state, { t: 0 })
      .call(() => { facing = 0; lastX = pts[0].x; place(); gait.play(); })
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'sine.out' }, '<')
      .to(state, { t: 1, duration: walk, ease: 'none', onUpdate: place }, '<')
      // it reaches the tall flowers in the foreground and fades into the meadow
      .to(el, { opacity: 0, duration: 1.4, ease: 'sine.in' }, '>-1.4')
      .call(() => gait.pause());

    gsap.set(el, { opacity: 0 });
    return () => { tl.kill(); gait.kill(); gsap.killTweensOf([el, img, body]); };
  }, [path, walk, rest, delay]);

  return (
    <div className="catbus" ref={root} aria-hidden="true">
      <div className="catbus-body">
        <img className="catbus-img" src="/art/catbus.webp" alt="" draggable="false" />
      </div>
    </div>
  );
}
