/**
 * RSVP backend for Dylan's invitation, attached to a Google Sheet.
 *
 * The sheet has two tabs (run `setupSheet` once to create them):
 *   Guests  — the guest list you maintain:
 *             Name | Nicknames | Extra guests | Total seats
 *             e.g. Patrick Solon | Pat | Maria Solon | 2
 *             "Nicknames" and "Extra guests" are comma-separated and optional.
 *             "Total seats" includes the guest themself. Leave it blank to count 1 + extra guests.
 *   RSVPs   — filled in by the website, one row per invitation (a changed reply updates the same row).
 *   Wishes  — filled in by the website, one row per wish sent from Chapter 6. Chapter 7 shows them.
 *             Set a row's "Show" cell to FALSE to hide that wish from the site.
 *
 * Deploy: Extensions → Apps Script → paste Code.gs + Match.gs → Deploy → New deployment →
 * Web app, Execute as: Me, Who has access: Anyone. Put the /exec URL in the site's .env file.
 */

var GUESTS_TAB = 'Guests';
var RSVPS_TAB = 'RSVPs';
var WISHES_TAB = 'Wishes';
var WISH_HEADERS = ['Sent', 'Name', 'Wish', 'Show'];
var RSVP_HEADERS = ['First replied', 'Last updated', 'Guest', 'Invited party', 'Seats invited',
  'Attending', 'Seats confirmed', 'Searched as', 'Note'];

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var g = ss.getSheetByName(GUESTS_TAB) || ss.insertSheet(GUESTS_TAB);
  if (g.getLastRow() === 0) {
    g.appendRow(['Name', 'Nicknames', 'Extra guests', 'Total seats']);
    g.getRange(1, 1, 1, 4).setFontWeight('bold');
    g.setFrozenRows(1);
  }
  var r = ss.getSheetByName(RSVPS_TAB) || ss.insertSheet(RSVPS_TAB);
  if (r.getLastRow() === 0) {
    r.appendRow(RSVP_HEADERS);
    r.getRange(1, 1, 1, RSVP_HEADERS.length).setFontWeight('bold');
    r.setFrozenRows(1);
  }  var w = ss.getSheetByName(WISHES_TAB) || ss.insertSheet(WISHES_TAB);
  if (w.getLastRow() === 0) {
    w.appendRow(WISH_HEADERS);
    w.getRange(1, 1, 1, WISH_HEADERS.length).setFontWeight('bold');
    w.setFrozenRows(1);
  }
}

function cleanText(v, max) {
  return String(v || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// The wishes to show on the site, oldest first; rows with Show = FALSE are hidden.
function readWishes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WISHES_TAB);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues(), out = [];
  for (var i = 0; i < rows.length; i++) {
    var text = cleanText(rows[i][2], 400);
    var show = rows[i][3];
    if (!text || show === false || String(show).toUpperCase() === 'FALSE') continue;
    out.push({ name: cleanText(rows[i][1], 40) || 'A friend', text: text });
  }
  return out;
}

// { action: 'wish', name, text }
function saveWish(body) {
  var text = cleanText(body.text, 400), name = cleanText(body.name, 40) || 'A friend';
  if (!text) return json({ ok: false, error: 'Write a little wish first.' });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(WISHES_TAB);
    if (!sheet) { setupSheet(); sheet = ss.getSheetByName(WISHES_TAB); }
    sheet.appendRow([new Date(), name, text, true]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true, name: name, text: text });
}

function splitList(v) {
  return String(v || '').split(/[,;\n]/).map(function (s) { return s.trim(); }).filter(Boolean);
}

// The guest list, read fresh each time so edits to the sheet apply immediately. id = row number.
function readGuests() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTS_TAB);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  var guests = [];
  for (var i = 0; i < rows.length; i++) {
    var name = String(rows[i][0] || '').trim();
    if (!name) continue;
    var extras = splitList(rows[i][2]);
    var seats = parseInt(rows[i][3], 10);
    if (!(seats > 0)) seats = 1 + extras.length;
    guests.push({ id: i + 2, name: name, nicknames: splitList(rows[i][1]), extras: extras, seats: seats });
  }
  return guests;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// GET ?action=search&q=Pat%20Solon  ->  { ok, results: [...] }
// GET ?action=wishes                ->  { ok, wishes: [{ name, text }, ...] }
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'wishes') return json({ ok: true, wishes: readWishes() });
  if (p.action !== 'search') return json({ ok: true, service: 'rsvp' });
  var q = String(p.q || '').replace(/[^\p{L} ]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (q.replace(/ /g, '').length < 2) return json({ ok: false, error: 'Please type at least 2 letters.' });
  var results = searchGuests(q, readGuests(), 5).map(function (r) {
    return { id: r.id, name: r.name, extras: r.extras, seats: r.seats, matchedOn: r.matchedOn, score: r.score };
  });
  return json({ ok: true, results: results });
}

// POST (text/plain JSON) { id, name, attending: 'yes'|'no', count, note, searched }  ->  { ok }
//      or { action: 'wish', name, text }  ->  { ok }
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'Bad request.' }); }
  if (body.action === 'wish') return saveWish(body);
  var guests = readGuests(), guest = null;
  for (var i = 0; i < guests.length; i++) if (guests[i].id === Number(body.id)) { guest = guests[i]; break; }
  // the row must still hold the same guest (the list may have been edited since they searched)
  if (!guest || normalizeName(guest.name) !== normalizeName(body.name)) {
    return json({ ok: false, error: 'We couldn\'t find your invitation. Please search for your name again.' });
  }
  var attending = body.attending === 'no' ? 'No' : 'Yes';
  var count = attending === 'Yes' ? Math.max(1, Math.min(guest.seats, parseInt(body.count, 10) || 1)) : 0;
  var note = String(body.note || '').slice(0, 500);
  var searched = String(body.searched || '').slice(0, 60);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVPS_TAB);
    if (!sheet) { setupSheet(); sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVPS_TAB); }
    var now = new Date();
    var party = [guest.name].concat(guest.extras).join(', ');
    var row = [now, now, guest.name, party, guest.seats, attending, count, searched, note];
    // one row per invitation: update it if they've replied before
    var last = sheet.getLastRow(), existing = -1;
    if (last >= 2) {
      var keys = sheet.getRange(2, 3, last - 1, 2).getValues();
      for (var r = 0; r < keys.length; r++) {
        if (keys[r][0] === guest.name && keys[r][1] === party) { existing = r + 2; break; }
      }
    }
    if (existing > 0) {
      row[0] = sheet.getRange(existing, 1).getValue(); // keep the first reply time
      sheet.getRange(existing, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true, name: guest.name, attending: attending, count: count, seats: guest.seats });
}
