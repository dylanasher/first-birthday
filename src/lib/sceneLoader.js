// Loads chapter scenes (their code and every painting they use) ahead of time, so a chapter can
// appear complete instead of its pieces arriving one by one.
import sceneArt from 'virtual:scene-art';

const importers = {
  OpeningMobile: () => import('../scenes/OpeningMobile.jsx'),
  OpeningDesktop: () => import('../scenes/OpeningDesktop.jsx'),
  DetailsMobile: () => import('../scenes/DetailsMobile.jsx'),
  DetailsDesktop: () => import('../scenes/DetailsDesktop.jsx'),
  MilestonesMobile: () => import('../scenes/MilestonesMobile.jsx'),
  MilestonesDesktop: () => import('../scenes/MilestonesDesktop.jsx'),
  DressCodeMobile: () => import('../scenes/DressCodeMobile.jsx'),
  DressCodeDesktop: () => import('../scenes/DressCodeDesktop.jsx'),
  DosDontsMobile: () => import('../scenes/DosDontsMobile.jsx'),
  DosDontsDesktop: () => import('../scenes/DosDontsDesktop.jsx'),
  RsvpMobile: () => import('../scenes/RsvpMobile.jsx'),
  RsvpDesktop: () => import('../scenes/RsvpDesktop.jsx'),
  WishesMobile: () => import('../scenes/WishesMobile.jsx'),
  WishesDesktop: () => import('../scenes/WishesDesktop.jsx'),
  ThankYouMobile: () => import('../scenes/ThankYouMobile.jsx'),
  ThankYouDesktop: () => import('../scenes/ThankYouDesktop.jsx'),
};

const modules = {}; // key -> { promise, comp }
const images = {}; // url -> { promise, done }

function loadImage(url) {
  if (images[url]) return images[url].promise;
  const entry = { done: false };
  entry.promise = new Promise((resolve) => {
    const img = new Image();
    const finish = () => { entry.done = true; resolve(); };
    img.onload = () => (img.decode ? img.decode().then(finish, finish) : finish());
    img.onerror = finish; // a missing image shouldn't hold the chapter back
    img.src = url;
  });
  images[url] = entry;
  return entry.promise;
}

function loadModule(key) {
  if (!modules[key]) {
    const entry = {};
    entry.promise = importers[key]().then((m) => { entry.comp = m.default; return m.default; });
    modules[key] = entry;
  }
  return modules[key].promise;
}

// The scene component if its code and all its paintings are already loaded, else null.
export function sceneIfReady(key, extra = []) {
  const m = modules[key];
  if (!m || !m.comp) return null;
  return (sceneArt[key] || []).concat(extra).every((u) => images[u] && images[u].done) ? m.comp : null;
}

// Load a scene's code and paintings; resolves with the component (after `timeout` ms at most).
// `extra` lists more images to wait for (e.g. the desktop backdrop).
export function loadScene(key, timeout = 8000, extra = []) {
  const all = Promise.all([loadModule(key), ...(sceneArt[key] || []).concat(extra).map(loadImage)]).then(() => modules[key].comp);
  const late = new Promise((resolve) => setTimeout(resolve, timeout)).then(() => loadModule(key));
  return Promise.race([all, late]);
}

// Warm up a scene in the background, when the browser is idle.
export function prefetchScene(key, extra = []) {
  if (!key || !importers[key]) return;
  const go = () => { loadScene(key, 60000, extra).catch(() => {}); };
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2500 });
  else setTimeout(go, 1200);
}
