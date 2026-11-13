# Dylan's invitation — mobile update (handoff)

## Prompt to give your codebase / coding assistant

```
Update the PHONE layout of Dylan's storybook invitation (chapters 1–8) so every chapter uses its new tall 9:16 painting and fits any phone or tablet in portrait. Do NOT change the desktop layout, the bunny cursor, or prefers-reduced-motion behaviour.

Inputs in this folder:
- assets/mobile/ — all cleaned, web-ready images (chNm-*.webp / .png). Copy them into the project's /assets/mobile/.
- reference/ — the finished, approved phone pages (one per chapter). They are the source of truth: copy their CSS values, layer order and animation code exactly. They reference images as /_blob/<id>; the table at the bottom of HANDOFF.md maps each id to its file in assets/mobile/.
- The "Measurements" section of HANDOFF.md lists every position, pivot, timing and sizing rule per chapter.

Apply this on phone/tablet portrait only (max-width: 1024px and portrait orientation, or however the project already switches to its phone layout):
1. Make the chapter screen fill the viewport: width 100vw; height 100dvh; container-type: size (so cqw/cqh units work).
2. Wrap every painted layer and moving part of the chapter in a "scene box" that keeps the painting's 941×1672 ratio and covers the screen, using that chapter's exact left/top formula from HANDOFF.md. Layers inside: inset 0, background-size 100% 100%.
3. Place each moving part (bell, boats, windmill blades, flag, smoke, lanterns, jars, balloons, glows) with the % left/top/width/height and transform-origin given, so it stays aligned at every size.
4. Keep the existing GSAP animations, but use the durations/amplitudes listed; any pixel distance marked "×f" is multiplied by f (scene height ÷ the base height noted for that chapter). Particles (leaves, birds, petals, fireflies, sky lanterns, wish-lights, seeds) use the spawn areas listed.
5. Bottom panels: use the clamp() heights listed and a wavy top edge made with a % polygon clip-path (copy from reference/). Add the "short screen" (container height ≤ 720px) and "narrow" (≤ 380px wide) adjustments listed.
6. Page-flip transitions: the reveal under each turning page uses the next chapter's chNm-full image with the same scene-box formula as that chapter (see reference/ for the exact CSS on each .underN rule).
7. Chapter 7 (Wishes): the flyer (girl + card) is scaled by code as described — put the scale on a wrapper, never on the element GSAP animates.
8. Test at 360×640, 375×667, 390×844, 412×915, 430×932 and 768×1024: layers line up, nothing important sits under the title or panel, moving parts never show gaps, text stays readable.
```

## Measurements

## Ch1 — Opening + Welcome (no new images; uses the existing sleeping/awake Dylan paintings, 1705×923)
- Paintings keep background-size: cover; position 52% 50%.
- Everything pinned to Dylan sits in a box with the painting's exact footprint:
  --aw:max(100cqw, 100cqh*1705/923); --ah:max(100cqh, 100cqw*923/1705); width:aw; height:ah; left:(100cqw − aw)*0.52; top:(100cqh − ah)*0.5
  Dylan = 51.83% across, 61.61% down this box.
- awake-frame mask: radial-gradient(10.26% 16.59% at 51.83% 61.61%, #000 55%, transparent 100%)
- halo: left 51.83%, top 61.61%, w 19.24%, h 28.44%, margin −7.70% 0 0 −9.62%
- glow: left 51.83%, top 59.24%, w 23.09%, aspect 1, margin −11.55% 0 0 −11.55%
- mist: left 31.30%, top 71.09%, w 33.35%, h 23.70%; drift x 70px × (H/844)
- motes / fireflies: each old (x, y) → left (x+608)/15.59 %, top y/8.44 % of the box
- welcome camera push: farCam y 147, fireflies y 190, glow y 200 — all × (H/844)
- Narrow (≤380px): welcome line 31px, top bar + Replay button nowrap. Short (≤720px tall): intro top 30px, title 52px, welcome padding-top 62px, "Dylan" 54px, body 14px/1.48, button bottom 26px.

## Responsive pattern (use for every phone chapter)
- Screen root: width:100vw; height:100dvh; container-type:size.
- Scene box (holds every painted layer, the bell, birds, leaves) keeps the painting's ratio and covers the screen:
  --sh:max(105cqh, 100cqw*1672/941); --sw:var(--sh)*941/1672
  left: clamp(100cqw - sw, 44cqw - sw*0.404, 0)   (church centre = 40.4% of painting → 44% of screen)
  top:  clamp(100cqh - sh, pillTop + pillHeight + 14px - sh*0.236, 0)   (church cross = 23.6% of painting → just under the schedule pill)
- Layers inside the box: inset:0; background-size:100% 100%.
- Small parts placed in % of the painting (bell: left 49.735%, top 26.675%, w 2.2317%, h 2.5718%, origin 52% 7%).
- Code particles: measured at scene height 886px; multiply by f = sceneHeight/886 at runtime. Bird end-x = screen width − scene left + 40.
- Panel: height clamp(320px, 56.4cqh, 620px); wavy top edge as a % polygon.
- Short screens (container height ≤ 720px): pill top 100px, pill height 48px, title 38px, date 16px.
- Tested: 360×640, 375×667, 390×844, 412×915, 430×932, 768×1024.

## Ch2 — Where & When
Assets: ch2m-plate, -clouds, -church (bell removed, arch repainted), -bell.png, -path, -trunk, -leavesA, -leavesB, -flowers, -full (page-flip preview).
Stack back→front: plate, clouds, church, bell, birds, path, trunk, leavesA, leavesB, falling leaves, flowers.
- clouds: x 0 → −16px, 22s sine yoyo
- leavesA (left of x 360 on painting) / leavesB (outer): skewX gusts, origin 50% 0
- flowers: skewX ripple, origin 50% 100%
- bell: rotate ±16°, 1.8s yoyo
- falling-leaf spawn x 10–250, y 30–200; fall 480–640; drift 60–160 (×f)
- birds y 222–244 (×f), rise 40px
- Ch1 page-flip preview: ch2m-full.webp, background-size cover, position 35% 12% (+ top shade gradient)

## Ch3 — Little Moments (seaside)
Built from the user's empty background + layers (their sea layer not used: it covered the town; sparkles taken from it, limited to open water).
Assets: ch3m-plate, -sparkA, -sparkB, -clouds, -boat1.png, -boat2.png, -laundry, -wall, -full (page-flip preview).
Stack back→front: plate, sparkA, sparkB, clouds, boat1, boat2, laundry, wall; then gulls + airmail envelopes in screen coords.
Scene box: --sh:max(111cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.605, 0); top: clamp(100cqh − sh, 40cqh − sh*0.446, 0)
- boat1: left 73.5388%, top 43.3014%, w 3.2944%, h 2.0933% (moved up off the pier, 85% size)
- boat2: left 85.8661%, top 43.3014%, w 6.6950%, h 4.4856% (moved up from behind the pots, 62% size)
- boats: rotate 0→3°, y −1.2px (×f) bob 2.6s/3.1s; x drift 7/10px (×f); origin 50% 92%
- sparkles: A and B layers alternate opacity 1 ↔ 0.25, 1.3s
- clouds: x 0 → −18px (×f), 24s
- laundry: skewX flutter (−3, −1, −4, 1, 0), origin 26% 33.5%
- f = sceneHeight / 936
- Panel: height clamp(320px, 55.2cqh, 600px)
- Short screens (≤720px tall): title 26px, postcard top 96px at scale .72, star burst top 186px
- Lightbox photo: width min(330px, 86cqw), ratio 3:4, max-height 68cqh
- Ch2 page-flip preview uses the same scene-box formula as background-size/position.

## Ch4 — Up in the Clouds (sky garden)
User layers matched the painting exactly, but each part was cut with a patch of sky around it. Base = all layers except cloud sea, with the blades, flag cloth and leftover scraps removed and filled from the surrounding sky. Moving parts re-cut cleanly.
Assets: ch4m-base, -cloudsea, -blades.png, -flag.png, -smoke.png, -full (page-flip preview + waterfall shimmer source).
Scene box: --sh:max(105cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.5, 0); top: clamp(100cqh − sh, 13cqh − sh*0.173, 0)
Stack: .back { base, smoke, waterfall shimmer, blades, flag, 3 lantern glows } bobs y 0 → −6px (×f), 4.2s; cloud sea in front (scale 1.05 from bottom, x drift 14px ×f, 22s).
- blades: left 13.0712%, top 25.7177%, w 12.9649%, h 7.8947%, origin 54.34% 50.15%, rotate 360° / 16s
- flag: left 62.4867%, top 17.8828%, w 17.9596%, h 3.3493%, origin 0% 25%, skewY/scaleX wave
- smoke: left 4.3571%, top 10.945%, w 32.1998%, h 9.5096%, origin 92.7% 92.5%, opacity 1 → .6, scale 1.1, drift (−6, −5)px ×f
- waterfall shimmer: full painting at brightness 1.35, opacity .6, clipped to polygon(70.563% 46.950%, 76.089% 46.770%, 76.939% 53.828%, 77.790% 59.809%, 77.683% 65.789%, 68.225% 65.789%, 68.438% 58.612%, 70.988% 51.435%), striped mask moving 32px / 0.9s
- lantern glows (7.4% wide): 15.62% 38.28% · 74.39% 25.12% · 83.63% 37.80%
- f = sceneHeight / 886
- Panel: height clamp(300px, 47.4cqh, 560px). Short screens: title 32px.
- Ch3 page-flip preview uses this scene-box formula.

## Ch5 — The Lantern Village
User layers matched exactly. Base = full painting with the 12 paper lanterns cut out and their spots filled. User mist/plants/stream layers came as large areas (mist includes far houses), so: mist is drawn in code, the stream shimmer uses a water-only cut, plants stay still.
Assets: ch5m-base, -water (shimmer source), -lanterns.png (sprite sheet 386×79, lanterns side by side with 2px gaps), -full (page-flip preview).
Scene box: --sh:max(111cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.56, 0); top: clamp(100cqh − sh, 45.5cqh − sh*0.496, 0)
Lanterns (x, y, w, h on the 941×1672 painting; sheet x-offset): sway ±3–5° from top centre, 2.2–3.25s
- 70,566 63×79 (sheet x 0)
- 214,458 31×36 (sheet x 65)
- 250,485 30×33 (sheet x 98)
- 287,507 29×37 (sheet x 130)
- 328,532 28×31 (sheet x 161)
- 367,533 34×43 (sheet x 191)
- 419,556 28×28 (sheet x 227)
- 467,555 28×37 (sheet x 257)
- 507,550 28×36 (sheet x 287)
- 607,699 25×22 (sheet x 317)
- 638,705 19×20 (sheet x 344)
- 688,698 19×25 (sheet x 365)
- glows: one per lantern, 2.3× lantern width, pulse opacity .6→1 / scale .9→1.12; stone-lantern glow at 12.75% 51.32%, 15% wide
- stream shimmer: water cut at brightness 1.45, opacity .5, striped mask moving 44px / 1.1s
- mist: 3 soft radial blobs (58% 37% 50×9%, 66% 46% 44×8%, 50% 52% 40×6%), drift x −20→+24..40px ×f, 12–18s
- fireflies: screen x 3–97%, y 28–50%; sky lanterns rise from y 36% at x 50–95% of screen
- f = sceneHeight / 936. Panel: height clamp(300px, 51cqh, 580px). Short screens: title 32px.
- Ch4 page-flip preview uses this scene-box formula.

## Ch6 — The Wishing Shore (moonlit beach)
User layers matched exactly and were cut tight. Their plate's sky was slightly redrawn, so the base = full painting, swapped to their plate only under clouds/sea/foam (feathered), with the 4 jars cut out and their spots filled. Ribbons stay painted on the tree.
Assets: ch6m-base, -clouds, -sea, -foam, -jar0..3.png, -full (page-flip preview).
Scene box: --sh:max(105cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.41, 0); top: clamp(100cqh − sh, 25cqh − sh*0.30, 0)
- jars (left, top, w, h in %): 21.785 25.419 4.676 4.904 · 0.744 31.938 4.888 4.785 · 30.393 29.665 6.270 5.084 · 19.979 33.373 5.313 5.383; swing ±2.5–3.5° from top centre, 2.6–3.95s
- jar glows 11% wide, at jar centre x, 62% down the jar; moon glow 38% wide at 71.73% 24.04%
- 10 star twinkles placed on painted stars (see Ch6 file)
- clouds x drift 24px ×f / 30s; sea bob y 1.2px ×f; foam (−3, 3)px ×f + opacity .8→1, 3.4s; sea shimmer stripes 18px / 2.6s
- wish-lights rise from the 4 jar positions (scene %), 75–125px ×f
- f = sceneHeight / 886. Panel: height clamp(330px, 61.6cqh, 640px). Short screens: title 32px.
- Ch5 page-flip preview uses this scene-box formula.

## Ch7 — Wishes in the Sky
User plate left out the soft cloud bank behind the town, so base = full painting, swapped to their plate only under the front cloud bank (feathered).
Assets: ch7m-base, -clouds (front bank), -full (page-flip preview). Girl image unchanged.
Scene box: --sh:max(105cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.42, 0); top: 100cqh − sh (bottom-anchored, town just above the footer)
- front clouds: scale 1.06 from bottom centre, drift x −10 → +10px ×f, 18s (f = sceneHeight / 886)
- flyer (girl + ribbon + card) authored at 390px wide inside a wrapper .flyfit: left calc(50% − 195px); top --ft; transform: scale(--fs) from top centre.
  Code sets --ft = H < 720 ? 104px : max(140px, 16.5% of H); --fs = min(1.35, (W − 8)/390, (H − ft − footerHeight − 12)/(cardTop + cardHeight + 14)), floor 0.6; re-run on resize and when the card's size changes.
  (Don't put the scale on the GSAP-animated element itself; GSAP folds it into its own transform.)
- sparkles start at the broom tip: flyer rect + (91, 153) × fs
- code cloud puffs: y 5–62% of screen, enter from screen width + 40
- Narrow (≤380px wide): footer compact, buttons nowrap. Short (≤720px tall): title 34px, head top 10px.
- Ch6 page-flip preview uses this scene-box formula.

## Ch8 — Thank You (picnic at sunrise)
User plate had a daytime blue sky, so base = full painting with balloons, clouds and front flowers removed; the gaps are filled from the user's plate, colour-matched to the sunset (sky behind the balloons filled from the neighbouring sunset colours). Moving parts are cut from the full painting using the user's layers as outlines.
Assets: ch8m-base, -clouds, -flowers, -balloons.png, -full (page-flip preview).
Scene box: --sh:max(105cqh, 100cqw*1672/941); left: clamp(100cqw − sw, 50cqw − sw*0.5, 0); top: clamp(100cqh − sh, 50cqh − sh*0.634, 0)
- balloons: left 6.695%, top 25.359%, w 24.548%, h 27.691%, origin 23.8% 68.7% (the bow); rotate ±1.6°, 3.2s; bob y −5px ×f, 2.3s
- sun glow: 34% wide circle at left 65.9%, top 28.73% (centre 82.9% 38.3%); opacity .85→1, scale .97→1.06, 4.5s
- candle flame glow: 9% wide at left 27.91%, top 50.40% (centre 32.41% 52.93%); random flicker
- clouds x 16px ×f / 26s; flowers skewX ±0.8°, origin bottom
- dandelion seeds start at painting (760,1440) and (692,1497) → screen = scene offset + point × (sceneWidth/941)
- petals y 7–48% of screen; confetti bursts from screen centre at 17% height
- f = sceneWidth / (941 × 0.53). Panel: height clamp(270px, 40cqh, 480px), message 14.5px / 1.55; content scrolls. Short screens: title 44px.
- Wishes (Ch7) page-flip preview uses this scene-box formula.

## Image id → file
| Reference id (/_blob/…) | File in assets/mobile |
|---|---|
| f56ae184439f25c623b15199243c4e7c | ch2m-bell.png |
| 78a05963408625e04f8a7707066f2cc3 | ch2m-church.webp |
| 9e52d324bad2e1607ee8916df64bc151 | ch2m-clouds.webp |
| 4283156db777ac5979dd91a8427e2c3f | ch2m-flowers.webp |
| 1ec6003f880faba7de29fbec7332a116 | ch2m-leavesA.webp |
| cfa48c44b21e3ef8f983e5fc852214f4 | ch2m-leavesB.webp |
| 06d11f418dd2e8e4c2f844c667c2f54d | ch2m-path.webp |
| 72c356d7d259618bde4193ecf6240365 | ch2m-plate.webp |
| 61604aff2feed06d2793a5e3c9b5f307 | ch2m-trunk.webp |
| 034201e2fe23b81bb204118308593e1f | ch3m-boat1.png |
| c16a27c04caafb0c8f8829700a2f2410 | ch3m-boat2.png |
| 726fd04b977a48628c1ea09c24862eb6 | ch3m-clouds.webp |
| 4cb5408397a369014048bcbdd00e2f3b | ch3m-full.webp |
| acb3c7551234cadf4a330013ad275fcb | ch3m-laundry.webp |
| ce538e121fc6040292595e145606773f | ch3m-plate.webp |
| ad6a6b9acc6fb37496ed585eddd75f83 | ch3m-sparkA.webp |
| 4bf65aee733749bac21047118a251af3 | ch3m-sparkB.webp |
| dc5099cf7876b76b6edc03e87a4d462f | ch3m-wall.webp |
| 935eb1bd4066cd965e742a3fe5763cfb | ch4m-base.webp |
| 46eb2cac96322850af50faf70aea0335 | ch4m-blades.png |
| c89540fc79fb7ca4586f18d4f2324f53 | ch4m-cloudsea.webp |
| 968d2082b5d6416347d324b6487e0a6d | ch4m-flag.png |
| 953bd7caa5e105b44d0f66810f86a79b | ch4m-full.webp |
| 9c8f310fa9c24a51a69b326be321109a | ch4m-smoke.png |
| 310c5f85a6dac067ba29e9effe7526a6 | ch5m-base.webp |
| c7ac9efed23dd7c78a0d0f53631d91d2 | ch5m-full.webp |
| 47dd2d17950fa51684531489712c1afc | ch5m-lanterns.png |
| ed4ba75b47a18170b128cbb14b9f6b7c | ch5m-water.webp |
| 2a706cdcc6d2a3e1c55d1977c41ab409 | ch6m-base.webp |
| 44b1e60a1146f9954362c02bd59e2e85 | ch6m-clouds.webp |
| eee8bf8f7224f00e9e4b24034187e5cd | ch6m-foam.webp |
| dcd013e7ac2c282504ebe250e62cbed9 | ch6m-full.webp |
| 670958ef80968cc79471874ea5dc47ff | ch6m-jar0.png |
| fdb226f5e82e3b31b32568527f21ffa1 | ch6m-jar1.png |
| 716505f31211fcffa7e4508cc547c444 | ch6m-jar2.png |
| ce1a5cb6d4c86fd4281809bfa079acdc | ch6m-jar3.png |
| 483794721c1718e408e1a85efc203449 | ch6m-sea.webp |
| f429be1cd055e6b6ec5b67924d8b0085 | ch7m-base.webp |
| 8de0413aa4e1f7fe5e8dbf302cff75c4 | ch7m-clouds.webp |
| e4065b54823638dce3d2b55f9461bb69 | ch7m-full.webp |
| 2b969a7142ee042a18c63474723b9bcc | ch8m-balloons.png |
| 74556d8f7db172e556722cad89049125 | ch8m-base.webp |
| 0ffe128ca41cfce563cddfac792c1c88 | ch8m-clouds.webp |
| 4da35732d8af64ee09c8e72804706b19 | ch8m-flowers.webp |
| a4592b3b2bc94169cdab0c8b8c21aef1 | ch8m-full.webp |
| cc1e599ddd429adffeca6f117b9235b6 | ch2m-full.webp |

Other /_blob ids in reference/ (desktop art, Ch1 paintings, girl, cursor, fonts) are assets your project already has — keep using its existing files for those.
