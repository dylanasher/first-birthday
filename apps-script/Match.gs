/**
 * Guest name matching for the RSVP search.
 *
 * Plain JavaScript with no imports, so the same file runs in Google Apps Script and in the
 * website's local dev mode. Matching is forgiving:
 *   - case, accents and punctuation are ignored ("José" = "jose")
 *   - nicknames match full names ("Pat Solon" finds "Patrick Solon"), from the built-in list
 *     below plus anything in the sheet's "Nicknames" column
 *   - a short form matches the start of a name ("Kat" finds "Katrina")
 *   - small typos are tolerated ("Patrik" finds "Patrick")
 *   - extra guests are searchable too, and lead back to the party they belong to
 */

// Common nicknames. Each line is one family: any of these names is treated as the same person.
var NICKNAME_GROUPS = [
  'patrick pat patty paddy patricio', 'patricia pat patty trish tricia',
  'michael mike mikey mickey miguel migs', 'john jon johnny jack juan', 'jonathan jon jonny nathan',
  'robert rob robbie bob bobby bert roberto berto', 'william will willy bill billy liam',
  'elizabeth liz lizzie beth betty eliza elisa bette', 'katherine catherine kathryn kate katie kat cathy kathy kaye',
  'christopher chris topher', 'christine kristine christina kristina chris tina', 'christian chris',
  'alexander alex xander alejandro', 'alexandra alex alexa sandra', 'anthony tony antonio anton',
  'james jim jimmy jaime', 'joseph joe joey jose pepe', 'daniel dan danny dani', 'david dave davey',
  'benjamin ben benji', 'samuel sam sammy', 'samantha sam sammie', 'nicholas nick nicky nico',
  'nicole nikki nicky', 'matthew matt matty mateo', 'andrew andy drew andres', 'andrea andi drea',
  'edward ed eddie ted eduardo edu', 'richard rich rick ricky dick ricardo', 'frederick fred freddie rick',
  'steven stephen steve stevie esteban', 'thomas tom tommy tomas', 'gregory greg gregorio',
  'jennifer jen jenny', 'jessica jess jessie', 'anna ann anne annie ana', 'margaret meg maggie margie peggy',
  'gabriel gabe gab gabby', 'gabrielle gabriela gabby gab', 'francisco frank kiko paco cisco',
  'francis frank franky', 'fernando nando ferdie', 'alberto albert bert berto', 'carlos carl carlo carlito lito',
  'maria ma mary marie mia', 'victoria vicky tori', 'veronica vero ronnie', 'rebecca becca becky',
  'josephine jo josie', 'teresa theresa tess tessa tere', 'emmanuel manny emman manuel', 'raymond ray mon',
  'ramon mon monching', 'leonardo leo leon', 'jeffrey jeff', 'kenneth ken kenny', 'lawrence larry lorenzo enzo',
  'timothy tim timmy', 'vincent vince vinny', 'zachary zach zack', 'joshua josh', 'jacob jake',
  'adrian adi', 'angelica angel angie gel', 'angela angie', 'cristina tina', 'katrina kat trina',
  'jacqueline jackie jacq', 'stephanie steph', 'kimberly kim', 'abigail abby gail', 'deborah debbie deb',
  'susan sue suzy', 'pamela pam', 'sophia sofia sophie', 'isabel isabella bella isa', 'gerald gerry',
  'ronald ron ronnie', 'donald don donnie', 'eugene gene', 'reginald reggie', 'rodolfo rudy dolfo',
  'jun junior', 'jesus jess chuy', 'patricio pat'
];

function normalizeName(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokensOf(s) {
  var n = normalizeName(s);
  return n ? n.split(' ') : [];
}

// word -> list of family ids it belongs to
function buildNicknameIndex(extraGroups) {
  var index = {};
  var groups = NICKNAME_GROUPS.concat(extraGroups || []);
  for (var g = 0; g < groups.length; g++) {
    var words = tokensOf(groups[g]);
    for (var w = 0; w < words.length; w++) {
      (index[words[w]] = index[words[w]] || []).push(g);
    }
  }
  return index;
}

function sameFamily(a, b, index) {
  var fa = index[a], fb = index[b];
  if (!fa || !fb) return false;
  for (var i = 0; i < fa.length; i++) if (fb.indexOf(fa[i]) >= 0) return true;
  return false;
}

function editDistance(a, b) {
  if (a === b) return 0;
  var prev = [], cur = [], i, j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (i = 1; i <= a.length; i++) {
    cur = [i];
    for (j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

// How well one typed word matches one word of a name, 0..1
function wordScore(q, c, index) {
  if (q === c) return 1;
  if (sameFamily(q, c, index)) return 0.95;
  if (q.length >= 2 && c.indexOf(q) === 0) return 0.8 + 0.1 * (q.length / c.length); // "Kat" -> "Katrina"
  if (q.length >= 4) {
    var d = editDistance(q, c), sim = 1 - d / Math.max(q.length, c.length);
    if (d <= 2 && sim >= 0.7) return 0.85 * sim; // small typos
  }
  return 0;
}

// How well the typed words match one candidate name, 0..1
function nameScore(qTokens, cTokens, index) {
  if (!qTokens.length || !cTokens.length) return 0;
  var used = {}, total = 0;
  for (var i = 0; i < qTokens.length; i++) {
    var best = 0, bestJ = -1;
    for (var j = 0; j < cTokens.length; j++) {
      if (used[j]) continue;
      var s = wordScore(qTokens[i], cTokens[j], index);
      if (s > best) { best = s; bestJ = j; }
    }
    if (bestJ >= 0) used[bestJ] = true;
    total += best;
  }
  var score = total / qTokens.length;
  // a typed word that matched nothing is a strong signal it's someone else
  for (var k = 0; k < qTokens.length; k++) {
    var any = false;
    for (var m = 0; m < cTokens.length; m++) if (wordScore(qTokens[k], cTokens[m], index) > 0) { any = true; break; }
    if (!any) score *= 0.6;
  }
  // surnames matter most: reward a matching last word
  var lastQ = qTokens[qTokens.length - 1], lastC = cTokens[cTokens.length - 1];
  if (qTokens.length > 1 && wordScore(lastQ, lastC, index) >= 0.85) score = Math.min(1, score + 0.05);
  // a one-word search is weaker evidence than a full name
  if (qTokens.length === 1) score *= 0.9;
  return score;
}

/**
 * guests: [{ id, name, nicknames: [..], extras: [..], seats }]
 * Returns up to `limit` parties, best first: [{ id, name, extras, seats, matchedOn, score }]
 */
function searchGuests(query, guests, limit) {
  var qTokens = tokensOf(query);
  if (!qTokens.length) return [];
  var extraGroups = [];
  for (var g = 0; g < guests.length; g++) {
    var nn = guests[g].nicknames || [];
    if (nn.length) {
      // the guest's own nicknames form a family with their first name
      var first = tokensOf(guests[g].name)[0] || '';
      extraGroups.push(first + ' ' + nn.join(' '));
    }
  }
  var index = buildNicknameIndex(extraGroups);
  var results = [];
  for (var i = 0; i < guests.length; i++) {
    var guest = guests[i];
    var names = [guest.name].concat(guest.extras || []);
    var best = 0, matchedOn = guest.name;
    for (var n = 0; n < names.length; n++) {
      var s = nameScore(qTokens, tokensOf(names[n]), index);
      if (n > 0) s *= 0.97; // prefer the main invitee when equal
      if (s > best) { best = s; matchedOn = names[n]; }
    }
    if (best >= 0.55) {
      results.push({ id: guest.id, name: guest.name, extras: guest.extras || [], seats: guest.seats, matchedOn: matchedOn, score: Math.round(best * 1000) / 1000 });
    }
  }
  results.sort(function (a, b) { return b.score - a.score; });
  return results.slice(0, limit || 5);
}
