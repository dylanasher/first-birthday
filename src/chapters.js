import { lazy } from 'react';

// Each chapter loads on demand, so the opening forest isn't waiting on later chapters' code.
const OpeningMobile = lazy(() => import('./scenes/OpeningMobile.jsx'));
const OpeningDesktop = lazy(() => import('./scenes/OpeningDesktop.jsx'));
const DetailsMobile = lazy(() => import('./scenes/DetailsMobile.jsx'));
const DetailsDesktop = lazy(() => import('./scenes/DetailsDesktop.jsx'));
const MilestonesMobile = lazy(() => import('./scenes/MilestonesMobile.jsx'));
const MilestonesDesktop = lazy(() => import('./scenes/MilestonesDesktop.jsx'));
const DressCodeMobile = lazy(() => import('./scenes/DressCodeMobile.jsx'));
const DressCodeDesktop = lazy(() => import('./scenes/DressCodeDesktop.jsx'));
const DosDontsMobile = lazy(() => import('./scenes/DosDontsMobile.jsx'));
const DosDontsDesktop = lazy(() => import('./scenes/DosDontsDesktop.jsx'));
const RsvpMobile = lazy(() => import('./scenes/RsvpMobile.jsx'));
const RsvpDesktop = lazy(() => import('./scenes/RsvpDesktop.jsx'));
const WishesMobile = lazy(() => import('./scenes/WishesMobile.jsx'));
const WishesDesktop = lazy(() => import('./scenes/WishesDesktop.jsx'));
const ThankYouMobile = lazy(() => import('./scenes/ThankYouMobile.jsx'));
const ThankYouDesktop = lazy(() => import('./scenes/ThankYouDesktop.jsx'));

// The storybook, in reading order. `backdrop` is the chapter's base painting, used to fill the screen
// around the artboard when the screen's shape differs from it. `mobileMinH` is the shortest artboard
// height (in design px) a chapter can stretch to on phones before it falls back to fitting. Each chapter's "continue" control turns the page to the next path.
export const chapters = [
  { path: '/', backdrop: '/art/forest-sleeping.webp', title: "Dylan's Storybook Invitation", mobile: OpeningMobile, desktop: OpeningDesktop },
  { path: '/details', backdrop: '/art/9ff413efc90b8d9aa2232fb97ef3b2fd.webp', title: 'Dylan — Event Details', mobile: DetailsMobile, desktop: DetailsDesktop },
  { path: '/milestones', mobileMinH: 825 /* the photo card needs room above the game panel */, backdrop: '/art/2bb637fac4c16bb39c3f3c009ad7d4ff.webp', title: 'Dylan — Milestones & Photoshoot', mobile: MilestonesMobile, desktop: MilestonesDesktop },
  { path: '/dress-code', backdrop: '/art/900fb868ae88739a3f0d328f2cec93f0.webp', title: 'Dylan — Dress Code & Gifts', mobile: DressCodeMobile, desktop: DressCodeDesktop },
  { path: '/dos-and-donts', backdrop: '/art/937e9ceabdf5dae8015bc472e750590f.webp', title: "Dylan — Do's & Don'ts", mobile: DosDontsMobile, desktop: DosDontsDesktop },
  { path: '/rsvp', backdrop: '/art/feb9ca705abb6f835c3eb0853d0163ab.webp', title: 'Dylan — RSVP', mobile: RsvpMobile, desktop: RsvpDesktop },
  { path: '/wishes', backdrop: '/art/sky-wishes.webp', title: 'Dylan — Wishes', mobile: WishesMobile, desktop: WishesDesktop },
  { path: '/thank-you', backdrop: '/art/picnic.webp', title: 'Dylan — Thank You', mobile: ThankYouMobile, desktop: ThankYouDesktop },
];
