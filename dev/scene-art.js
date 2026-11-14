// Provides `virtual:scene-art`: for each scene in src/scenes, the artwork files it uses (found in its
// .jsx and .css). The app preloads a chapter's artwork before showing it, and the next chapter's in
// the background, so paintings never pop in piece by piece. Regenerated automatically on edit.
import fs from 'node:fs';
import path from 'node:path';

const ID = 'virtual:scene-art';
const RESOLVED = '\0' + ID;
const ART = /\/art\/[A-Za-z0-9_\-./]+?\.(?:webp|png|jpe?g|gif|svg)/g;

export default function sceneArt() {
  let root = process.cwd();
  let base = '/';
  return {
    name: 'scene-art',
    configResolved(config) { root = config.root; base = config.base; },
    resolveId(id) { return id === ID ? RESOLVED : null; },
    load(id) {
      if (id !== RESOLVED) return null;
      const dir = path.join(root, 'src/scenes');
      const map = {};
      for (const f of fs.readdirSync(dir)) {
        const m = /^(\w+)\.(jsx|css)$/.exec(f);
        if (!m) continue;
        const file = path.join(dir, f);
        this.addWatchFile(file);
        const urls = fs.readFileSync(file, 'utf8').match(ART) || [];
        const set = (map[m[1]] = map[m[1]] || new Set());
        urls.forEach((u) => set.add(base.replace(/\/$/, '') + u));
      }
      const out = Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v]]));
      return `export default ${JSON.stringify(out)};`;
    },
    handleHotUpdate({ file, server }) {
      if (/src[\\/]scenes[\\/]\w+\.(jsx|css)$/.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
      }
    },
  };
}
