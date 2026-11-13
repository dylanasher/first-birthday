import React, { useEffect, useRef, useState } from 'react';
import { searchGuests, sendRsvp } from '../lib/rsvpApi.js';
import './RsvpFlow.css';

// Chapter 6's RSVP: find your invitation by name, confirm it's you, then reply for your party.
// Used by both the phone and desktop layouts, inside their glass card, so it borrows their form
// classes (.p .lbl .in .choices .send .err …). Elements marked "a" animate in with each step
// (`onStep` asks the scene to play that).
//
// Steps: find → (confirm | pick) → reply → done. Progress survives switching to the Wishes tab,
// and a finished reply is remembered on this device so a returning guest sees it.

const STORE_KEY = 'dylan-rsvp-v1';
let memory = null; // survives the tab switch (this component unmounts on the Wishes tab)

function loadSaved() {
  if (memory) return memory;
  try {
    const s = JSON.parse(window.localStorage.getItem(STORE_KEY) || 'null');
    if (s && s.guest && s.sent) return { step: 'done', query: s.query || '', results: [], guest: s.guest, attending: s.attending, count: s.count, note: s.note || '', sent: s.sent };
  } catch (e) { /* storage unavailable */ }
  return null;
}
function persist(state) {
  memory = state;
  try {
    if (state.step === 'done') window.localStorage.setItem(STORE_KEY, JSON.stringify({ guest: state.guest, attending: state.attending, count: state.count, note: state.note, query: state.query, sent: state.sent }));
  } catch (e) { /* storage unavailable */ }
}

// ---- RSVP deadline strip ("Moonlight path", HANDOFF-RSVP.md) -------------------------------------
// A glowing light travels along a night-sky track from "Invites sent" to "RSVP closes".
// Dates are whole days in Manila time (UTC+8); the deadline counts until the end of that day.
const RSVP_DEADLINE = '2026-11-30'; // YYYY-MM-DD
const INVITES_SENT = '2026-11-14';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parseDay = (v) => { const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(v || '').trim()); return m ? [+m[1], +m[2] - 1, +m[3]] : null; };

export function rsvpStrip(now = Date.now()) {
  const dl = parseDay(RSVP_DEADLINE), st = parseDay(INVITES_SENT) || [2026, 10, 14];
  if (!dl) return { label: '[RSVP deadline]', left: 'Date to come', pct: 0.06, placeholder: true, aria: 'RSVP deadline coming soon' };
  const end = Date.UTC(dl[0], dl[1], dl[2], 15, 59, 59); // 23:59:59 on the deadline day in Manila
  const start = Date.UTC(st[0], st[1], st[2], -8, 0, 0); // 00:00 on the invites-sent day in Manila
  const mn = new Date(now + 8 * 3600000); // "today" in Manila
  const days = Math.round((Date.UTC(dl[0], dl[1], dl[2]) - Date.UTC(mn.getUTCFullYear(), mn.getUTCMonth(), mn.getUTCDate())) / 86400000);
  const left = now > end ? 'RSVP closed' : days <= 0 ? 'Last day' : days === 1 ? '1 day left' : days + ' days left';
  const pct = Math.max(0, Math.min(1, (now - start) / Math.max(1, end - start)));
  const label = MON[dl[1]] + ' ' + dl[2];
  return { label, left, pct, placeholder: false, aria: 'Please reply by ' + label + ', ' + left };
}

function DeadlineStrip() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  const s = rsvpStrip(now);
  const pos = (4 + s.pct * 92).toFixed(1) + '%'; // keeps the light inside the track
  return (
    <div className="rb a" role="note" aria-label={s.aria}>
      <div className="rbtop">
        <p className={`rbt${s.placeholder ? ' ph2' : ''}`}>Reply by {s.label}</p>
        <p className="rbl">{s.left}</p>
      </div>
      <div className="rbtrack" aria-hidden="true">
        <span className="rbfill" style={{ width: pos }} />
        <span className="rbdot" style={{ left: pos }} />
      </div>
      <div className="rbends" aria-hidden="true"><span>Invites sent</span><span>RSVP closes</span></div>
    </div>
  );
}

const cleanName = (s) => s.replace(/[^\p{L} ]/gu, '').replace(/ {2,}/g, ' ').slice(0, 60);
const firstName = (n) => (n || '').trim().split(/\s+/)[0] || '';
const partyLine = (g) => {
  if (!g.extras.length) return g.seats > 1 ? `You and a guest · ${g.seats} seats` : 'Just you · 1 seat';
  return `With ${g.extras.join(', ')} · ${g.seats} seat${g.seats > 1 ? 's' : ''}`;
};

function Icon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
      <path d={d} />
    </svg>
  );
}
const CHECK = 'M5 12.5 L10 17 L19 7';
const SEARCH = 'M10.5 17 A6.5 6.5 0 1 1 10.5 4 A6.5 6.5 0 0 1 10.5 17 Z M15.5 15.5 L20 20';
const SEND = 'M4 12 L20 4 L14 20 L11 13 Z';

export default function RsvpFlow({ onStep, onCelebrate }) {
  const [st, setSt] = useState(() => loadSaved() || { step: 'find', query: '', results: [], guest: null, attending: 'yes', count: 1, note: '', sent: null });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const firstRender = useRef(true);
  const inputRef = useRef(null);

  const update = (patch) => setSt((prev) => {
    const next = { ...prev, ...patch };
    persist(next);
    return next;
  });

  // animate each new step in (not on first paint: the chapter's own intro handles that)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (onStep) requestAnimationFrame(() => onStep());
  }, [st.step]); // eslint-disable-line react-hooks/exhaustive-deps

  async function doSearch(e) {
    if (e) e.preventDefault();
    const q = st.query.trim();
    if (q.replace(/ /g, '').length < 2) { setErr('Please type your name, as it appears on your invitation.'); inputRef.current?.focus({ preventScroll: true }); return; }
    setErr(''); setBusy(true);
    try {
      const results = await searchGuests(q);
      if (!results.length) { update({ results: [], step: 'pick' }); return; }
      const top = results[0], second = results[1];
      // one clear match: ask "is this you?"; a tie (same names) or a weak match: let them choose
      const clear = top.score >= 0.8 && (!second || top.score - second.score >= 0.08);
      update({ results, step: clear ? 'confirm' : 'pick' });
    } catch (ex) {
      setErr(ex.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function choose(guest) {
    setErr('');
    update({ guest, step: 'reply', attending: 'yes', count: guest.seats, note: '' });
  }

  async function send() {
    setErr(''); setBusy(true);
    const g = st.guest;
    try {
      await sendRsvp({ id: g.id, name: g.name, attending: st.attending, count: st.attending === 'yes' ? st.count : 0, note: st.note.trim(), searched: st.query.trim() });
      update({ step: 'done', sent: { attending: st.attending, count: st.count } });
      if (onCelebrate) onCelebrate();
    } catch (ex) {
      setErr(ex.message || 'We couldn\'t save your RSVP. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const restart = () => { setErr(''); update({ step: 'find', results: [], guest: null }); setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50); };

  // ---- find -------------------------------------------------------------------------------
  if (st.step === 'find') {
    return (
      <form className="panel rsvpflow" onSubmit={doSearch} noValidate>
        <DeadlineStrip />
        <p className="p rbafter a">We can't wait to celebrate with you! Find your invitation to begin.</p>
        <label className="lbl a" htmlFor="rs-find">Your name</label>
        <div className="rf-search a">
          <input
            ref={inputRef} className="in" id="rs-find" type="text" autoComplete="name" inputMode="text" enterKeyHint="search"
            placeholder="e.g. Dave Decena" value={st.query}
            onChange={(e) => { update({ query: cleanName(e.target.value) }); if (err) setErr(''); }}
            aria-describedby="rs-find-hint"
          />
          <button className="rf-go" type="submit" disabled={busy} aria-label="Search for my invitation">
            {busy ? <span className="rf-spin" aria-hidden="true" /> : <Icon d={SEARCH} size={18} />}
            <span>{busy ? 'Searching' : 'Search'}</span>
          </button>
        </div>
        <p className="rf-hint a" id="rs-find-hint">Letters and spaces only. A nickname works too.</p>
        <p className="err" role="alert">{err}</p>
      </form>
    );
  }

  // ---- confirm: one clear match --------------------------------------------------------------
  if (st.step === 'confirm') {
    const g = st.results[0];
    return (
      <div className="panel rsvpflow">
        <p className="lbl a">Is this you?</p>
        <div className="rf-card a">
          <p className="rf-name">{g.name}</p>
          {g.matchedOn !== g.name ? <p className="rf-sub">Found by {g.matchedOn}, who is in this party</p> : null}
          <p className="rf-sub">{partyLine(g)}</p>
        </div>
        <div className="choices a">
          <button className="choice yes on" type="button" onClick={() => choose(g)}><Icon d={CHECK} />Yes, that's me</button>
          <button className="choice" type="button" onClick={() => update({ step: 'pick', results: st.results.slice(1) })}>Not me</button>
        </div>
        <button className="ghost a" type="button" onClick={restart}>Search a different name</button>
      </div>
    );
  }

  // ---- pick: several possibilities, or none -------------------------------------------------
  if (st.step === 'pick') {
    const list = st.results;
    return (
      <div className="panel rsvpflow">
        {list.length ? (
          <>
            <p className="lbl a">Did you mean…</p>
            <ul className="rf-list" aria-label="Possible matches">
              {list.map((g) => (
                <li key={g.id} className="a">
                  <button className="rf-option" type="button" onClick={() => choose(g)}>
                    <span className="rf-name">{g.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="lbl a">We couldn't find "{st.query.trim()}"</p>
            <p className="p a">Try your full name as it appears on your invitation, or a different spelling. If you still can't find it, please message Dave &amp; Alyana.</p>
          </>
        )}
        <button className="ghost a" type="button" onClick={restart}>Search again</button>
      </div>
    );
  }

  // ---- done --------------------------------------------------------------------------------
  const g = st.guest;
  if (st.step === 'done') {
    const yes = st.sent?.attending === 'yes', n = st.sent?.count || 1;
    return (
      <div className="done panel rsvpflow">
        <span className="donebadge a">
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#1F2C6B" style={{ strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d={CHECK} /></svg>
        </span>
        <p className="donet a">{yes ? `See you there, ${firstName(g.name)}!` : `We'll miss you, ${firstName(g.name)}`}</p>
        <p className="p a" style={{ textAlign: 'center' }}>
          {yes
            ? (n > 1 ? `We've saved ${n} seats for your party. Dylan can't wait!` : 'We\'ve saved a seat for you. Dylan can\'t wait!')
            : 'Thank you for letting us know. Please leave Dylan a wish so you\'re still part of his day.'}
        </p>
        <button className="ghost a" type="button" onClick={() => update({ step: 'reply', attending: st.sent?.attending || 'yes', count: st.sent?.count || g.seats })}>Change my reply</button>
      </div>
    );
  }

  // ---- reply -------------------------------------------------------------------------------
  const max = g.seats;
  return (
    <div className="panel rsvpflow">
      <p className="p a"><strong className="rf-hi">Hi {firstName(g.name)}!</strong> {partyLine(g)}.</p>
      <p className="lbl a">Will you be there?</p>
      <div className="choices a" role="group" aria-label="Will you be there?">
        <button className={`choice yes ${st.attending === 'yes' ? 'on' : ''}`} type="button" aria-pressed={st.attending === 'yes'} onClick={() => update({ attending: 'yes' })}><Icon d={CHECK} />Joyfully yes</button>
        <button className={`choice no ${st.attending === 'no' ? 'on' : ''}`} type="button" aria-pressed={st.attending === 'no'} onClick={() => update({ attending: 'no' })}>Sadly can't</button>
      </div>
      {st.attending === 'yes' && max > 1 ? (
        <>
          <p className="lbl a">How many of you are coming?</p>
          <div className="rf-steprow a">
            <div className="stepper">
              <button className={`step ${st.count <= 1 ? 'off' : ''}`} type="button" aria-label="One fewer" onClick={() => st.count > 1 && update({ count: st.count - 1 })}>−</button>
              <p className="count" aria-live="polite">{st.count}</p>
              <button className={`step ${st.count >= max ? 'off' : ''}`} type="button" aria-label="One more" onClick={() => st.count < max && update({ count: st.count + 1 })}>+</button>
            </div>
            <span className="rf-of">of {max} seats</span>
          </div>
        </>
      ) : null}
      <label className="lbl a" htmlFor="rs-note">A note for us <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}>(optional)</span></label>
      <textarea className="in a in-note" id="rs-note" placeholder="Kids' names, or just hello" value={st.note} onChange={(e) => update({ note: e.target.value.slice(0, 500) })} />
      <button className="send a" type="button" onClick={send} disabled={busy}>
        {busy ? 'Sending…' : 'Send RSVP'} {busy ? null : <Icon d={SEND} size={17} />}
      </button>
      <p className="err" role="alert">{err}</p>
      <button className="ghost rf-notme" type="button" onClick={restart}>Not {firstName(g.name)}? Search again</button>
    </div>
  );
}
