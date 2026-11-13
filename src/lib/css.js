// Turns an inline CSS declaration string ("left:60px;top:300px;scale:.85") into a React style object.
// The scenes build some styles as strings (positions of motes, fireflies, leaves), so they go through here.
const cache = new Map();

function camel(prop) {
  if (prop.startsWith('--')) return prop;
  return prop
    .replace(/^-webkit-/, 'webkit-')
    .replace(/^-moz-/, 'moz-')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function splitDecls(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

export function css(str) {
  if (!str) return undefined;
  if (typeof str === 'object') return str;
  let obj = cache.get(str);
  if (obj) return obj;
  obj = {};
  for (const decl of splitDecls(str)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    obj[camel(decl.slice(0, i).trim())] = decl.slice(i + 1).trim();
  }
  if (cache.size > 2000) cache.clear();
  cache.set(str, obj);
  return obj;
}
