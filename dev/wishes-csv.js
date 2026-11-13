// Dev-only stand-in for the Google Sheet's "Wishes" tab: `npm run dev` saves wishes to wishes.csv
// in the project folder (same columns as the sheet) and serves them back to Chapter 7.
import fs from 'node:fs';
import path from 'node:path';

const HEADER = 'Sent,Name,Wish,Show\n';
const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const csvCell = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export default function wishesCsv() {
  let file;
  return {
    name: 'wishes-csv',
    apply: 'serve',
    configResolved(config) { file = path.join(config.root, 'wishes.csv'); },
    configureServer(server) {
      server.middlewares.use('/__dev/wishes', (req, res) => {
        const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
        if (!fs.existsSync(file)) fs.writeFileSync(file, HEADER);
        if (req.method === 'GET') {
          const wishes = parseCsv(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')).slice(1)
            .filter((r) => clean(r[2], 400) && String(r[3] || '').toUpperCase() !== 'FALSE')
            .map((r) => ({ name: clean(r[1], 40) || 'A friend', text: clean(r[2], 400) }));
          return send(200, { ok: true, wishes });
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (c) => { body += c; if (body.length > 10000) req.destroy(); });
          req.on('end', () => {
            let b; try { b = JSON.parse(body); } catch { return send(400, { ok: false, error: 'Bad request.' }); }
            const text = clean(b.text, 400), name = clean(b.name, 40) || 'A friend';
            if (!text) return send(200, { ok: false, error: 'Write a little wish first.' });
            const existing = fs.readFileSync(file, 'utf8');
            fs.appendFileSync(file, (existing.endsWith('\n') ? '' : '\n') + [new Date().toISOString(), name, text, 'TRUE'].map(csvCell).join(',') + '\n');
            send(200, { ok: true, name, text });
          });
          return;
        }
        send(405, { ok: false });
      });
    },
  };
}
