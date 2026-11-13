// Talks to the RSVP backend (a Google Apps Script web app attached to the Google Sheet).
// Its URL comes from VITE_RSVP_ENDPOINT in .env. In local development without that URL,
// a mock with a few sample guests stands in, so the flow can be tried without the sheet.

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT || '';

export const rsvpConnected = Boolean(ENDPOINT);

export async function searchGuests(query) {
  if (!ENDPOINT) return mock.search(query);
  const res = await fetch(`${ENDPOINT}?action=search&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Search failed.');
  return data.results;
}

export async function sendRsvp(reply) {
  if (!ENDPOINT) return mock.send(reply);
  // text/plain keeps this a "simple" request, which Apps Script accepts from another site
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(reply) });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Could not save your RSVP.');
  return data;
}

// ---- local development stand-in -------------------------------------------------------------
// Reads guest-list.csv from the project folder, so the real list can be tried with `npm run dev`
// before the Google Sheet is connected. The `import.meta.env.DEV ?` guards mean these files are
// left out of the production build entirely: the guest list never ships with the public site.
const loadCsv = import.meta.env.DEV ? () => import('../../guest-list.csv?raw') : null;
const loadMatcher = import.meta.env.DEV ? () => import('../../apps-script/Match.gs?raw') : null;

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const split = (v) => String(v || '').split(/[,;\n]/).map((x) => x.trim()).filter(Boolean);

const mock = {
  guests: null,
  matcher: null,
  async load() {
    if (!import.meta.env.DEV) throw new Error('RSVP isn\'t connected yet. Please message Dave & Alyana.');
    if (!this.matcher) {
      const src = (await loadMatcher()).default;
      // eslint-disable-next-line no-new-func
      this.matcher = new Function(`${src}\nreturn { searchGuests: searchGuests };`)();
    }
    // after editing guest-list.csv, refresh the page to pick up the changes
    const rows = parseCsv((await loadCsv()).default.replace(/^\uFEFF/, ''));
    this.guests = rows.slice(1).map((r, i) => {
      const extras = split(r[2]);
      const seats = parseInt(r[3], 10);
      return { id: i + 2, name: (r[0] || '').trim(), nicknames: split(r[1]), extras, seats: seats > 0 ? seats : 1 + extras.length };
    }).filter((g) => g.name);
    return this.matcher;
  },
  async search(q) {
    const m = await this.load();
    await new Promise((r) => setTimeout(r, 300));
    return m.searchGuests(q, this.guests, 5);
  },
  async send(reply) {
    await this.load();
    await new Promise((r) => setTimeout(r, 400));
    console.info('[rsvp mock] would save to the sheet:', reply);
    return { ok: true };
  },
};
