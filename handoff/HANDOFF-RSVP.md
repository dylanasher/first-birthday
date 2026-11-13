# RSVP form: deadline strip ("Moonlight path") — handoff

Replaces the plain line "Kindly reply by [RSVP deadline]. We can't wait to celebrate with you!" at the top of the RSVP form (Chapter 6), on phone and desktop.

**Deadline: Monday, November 30, 2026** (counts as the end of that day, Philippine time). Invites-sent start date: November 14, 2026.

## Prompt to give your codebase / coding assistant

```
In Chapter 6 (RSVP + Countdown + Wishes), replace the RSVP deadline sentence at the top of the RSVP form with a "deadline strip", on both the phone and desktop layouts. Follow HANDOFF-RSVP.md exactly:
1. Replace the old paragraph with the markup in "Markup". Keep it inside the RSVP form panel, before the "Your name" field, and keep whatever entrance/stagger animation class the other form rows use.
2. Add the CSS from "CSS" (phone values for the phone layout, desktop values for desktop).
3. Add the logic in "Logic" so the label, the "days left" text, the fill width and the light's position are calculated from RSVP_DEADLINE = '2026-11-30' and INVITES_SENT = '2026-11-14' (end of the deadline day in Asia/Manila, UTC+8). Re-calculate when the page re-renders (the page already re-renders every second for the event countdown; once a minute is also fine).
4. States: before the deadline → "N days left" (or "1 day left"); on the deadline day → "Last day"; after → "RSVP closed" with the light at the end. If no deadline is set, show "Reply by [RSVP deadline]" in italic with "Date to come".
5. Keep the gold glow pulse on the light, but turn it off for prefers-reduced-motion.
6. Do not change the rest of the RSVP form, the wishes form or the countdown.
reference/ch6-phone.dc.html and reference/ch6-desktop.dc.html are the approved pages, if anything is unclear.
```

## Markup
```html
<div class="rb" role="note" aria-label="Please reply by Nov 30, 16 days left">
  <div class="rbtop">
    <p class="rbt">Reply by Nov 30</p>        <!-- add class "ph2" when no deadline is set -->
    <p class="rbl">16 days left</p>
  </div>
  <div class="rbtrack" aria-hidden="true">
    <span class="rbfill" style="width: 7.8%"></span>
    <span class="rbdot" style="left: 7.8%"></span>
  </div>
  <div class="rbends" aria-hidden="true"><span>Invites sent</span><span>RSVP closes</span></div>
</div>
<p class="p rbafter">We can't wait to celebrate with you!</p>
```
(The label, days-left text, aria-label, width and left values above are examples; they come from the logic below.)

## CSS — phone
```css
/* RSVP deadline: a night-sky strip where a glowing light travels from "invites sent" toward "RSVP closes" */
.rb{margin:2px 0 0;padding:12px 14px 13px;border-radius:16px;background:linear-gradient(160deg,rgba(31,44,107,.95),rgba(19,35,94,.92));color:#F5EBD5;box-shadow:inset 0 0 0 1px rgba(247,216,115,.35),0 6px 14px rgba(5,10,35,.2)}
.rbtop{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.rbt{margin:0;font-family:'IM Fell English',Georgia,serif;font-size:18.0px;line-height:1.2;color:#F7D873}
.rbt.ph2{font-style:italic;color:#E9E3F5;opacity:.85}
.rbl{margin:0;flex:none;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#E9E3F5;white-space:nowrap}
.rbtrack{position:relative;height:6px;border-radius:9px;background:rgba(233,227,245,.18);margin:14px 6px 7px}
.rbfill{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:linear-gradient(90deg,#B88A22,#F7D873)}
.rbdot{position:absolute;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:radial-gradient(circle,#FFF8D6,#F7D873 60%);box-shadow:0 0 14px 4px rgba(247,216,115,.7);animation:rbglow 2.4s ease-in-out infinite}
@keyframes rbglow{0%,100%{box-shadow:0 0 10px 3px rgba(247,216,115,.55)}50%{box-shadow:0 0 18px 6px rgba(247,216,115,.85)}}
.rbends{display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:#C9C3E3}
.rbafter{margin-top:10px !important;font-style:italic}
@media (prefers-reduced-motion: reduce){.rbdot{animation:none}}
```

## CSS — desktop (same, about 12% larger)
```css
/* RSVP deadline: a night-sky strip where a glowing light travels from "invites sent" toward "RSVP closes" */
.rb{margin:2px 0 0;padding:13px 16px 15px;border-radius:16px;background:linear-gradient(160deg,rgba(31,44,107,.95),rgba(19,35,94,.92));color:#F5EBD5;box-shadow:inset 0 0 0 1px rgba(247,216,115,.35),0 6px 14px rgba(5,10,35,.2)}
.rbtop{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.rbt{margin:0;font-family:'IM Fell English',Georgia,serif;font-size:20.2px;line-height:1.2;color:#F7D873}
.rbt.ph2{font-style:italic;color:#E9E3F5;opacity:.85}
.rbl{margin:0;flex:none;font-size:11.8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#E9E3F5;white-space:nowrap}
.rbtrack{position:relative;height:6px;border-radius:9px;background:rgba(233,227,245,.18);margin:16px 6px 7px}
.rbfill{position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:linear-gradient(90deg,#B88A22,#F7D873)}
.rbdot{position:absolute;top:50%;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:radial-gradient(circle,#FFF8D6,#F7D873 60%);box-shadow:0 0 14px 4px rgba(247,216,115,.7);animation:rbglow 2.4s ease-in-out infinite}
@keyframes rbglow{0%,100%{box-shadow:0 0 10px 3px rgba(247,216,115,.55)}50%{box-shadow:0 0 18px 6px rgba(247,216,115,.85)}}
.rbends{display:flex;justify-content:space-between;font-size:11.8px;font-weight:700;color:#C9C3E3}
.rbafter{margin-top:10px !important;font-style:italic}
@media (prefers-reduced-motion: reduce){.rbdot{animation:none}}
```
`.p` is the form's existing body-text style (phone 13.5px, desktop 15px, colour #2B3260).

## Logic
```js
const RSVP_DEADLINE = '2026-11-30';   // YYYY-MM-DD
const INVITES_SENT  = '2026-11-14';
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const parse = v => { const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(v || '').trim()); return m ? [+m[1], +m[2] - 1, +m[3]] : null; };

function rsvpStrip(now = Date.now()) {
  const dl = parse(RSVP_DEADLINE), st = parse(INVITES_SENT) || [2026, 10, 14];
  if (!dl) return { label: '[RSVP deadline]', left: 'Date to come', pct: 0.06, placeholder: true, aria: 'RSVP deadline coming soon' };
  const end   = Date.UTC(dl[0], dl[1], dl[2], 15, 59, 59);      // 23:59:59 on the deadline day in Manila (UTC+8)
  const start = Date.UTC(st[0], st[1], st[2], -8, 0, 0);        // 00:00 on the invites-sent day in Manila
  const mn = new Date(now + 8 * 3600000);                       // "today" in Manila
  const days = Math.round((Date.UTC(dl[0], dl[1], dl[2]) - Date.UTC(mn.getUTCFullYear(), mn.getUTCMonth(), mn.getUTCDate())) / 86400000);
  const left = now > end ? 'RSVP closed' : days <= 0 ? 'Last day' : days === 1 ? '1 day left' : days + ' days left';
  const pct = Math.max(0, Math.min(1, (now - start) / Math.max(1, end - start)));
  const label = MON[dl[1]] + ' ' + dl[2];
  return { label, left, pct, placeholder: false, aria: 'Please reply by ' + label + ', ' + left };
}

// apply: position = 4% + pct × 92% (keeps the light inside the track)
// .rbt text = 'Reply by ' + label  (+ class 'ph2' if placeholder)
// .rbl text = left;  .rbfill width = position;  .rbdot left = position;  .rb aria-label = aria
```
