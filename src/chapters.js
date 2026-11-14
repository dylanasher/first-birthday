// The storybook, in reading order. Each chapter's "continue" control turns the page to the next path.
// `mobile` / `desktop` name each layout's scene (src/scenes). `color` is the chapter's ground colour,
// shown for a moment while its paintings load. `backdrop` is the base painting that fills the screen
// around the desktop artboard when the window's shape differs from it.
export const chapters = [
  { path: '/', color: '#102A20', backdrop: '/art/forest-sleeping.webp', title: "Dylan's Storybook Invitation", mobile: 'OpeningMobile', desktop: 'OpeningDesktop' },
  { path: '/details', color: '#A9D6DF', backdrop: '/art/9ff413efc90b8d9aa2232fb97ef3b2fd.webp', title: 'Dylan — Event Details', mobile: 'DetailsMobile', desktop: 'DetailsDesktop' },
  { path: '/milestones', color: '#8EC6E6', backdrop: '/art/2bb637fac4c16bb39c3f3c009ad7d4ff.webp', title: 'Dylan — Milestones & Photoshoot', mobile: 'MilestonesMobile', desktop: 'MilestonesDesktop' },
  { path: '/dress-code', color: '#C9B8E6', backdrop: '/art/900fb868ae88739a3f0d328f2cec93f0.webp', title: 'Dylan — Dress Code & Gifts', mobile: 'DressCodeMobile', desktop: 'DressCodeDesktop' },
  { path: '/dos-and-donts', color: '#3D4A8C', backdrop: '/art/ch5d-full.webp', title: "Dylan — Do's & Don'ts", mobile: 'DosDontsMobile', desktop: 'DosDontsDesktop' },
  { path: '/rsvp', color: '#13235E', backdrop: '/art/feb9ca705abb6f835c3eb0853d0163ab.webp', title: 'Dylan — RSVP', mobile: 'RsvpMobile', desktop: 'RsvpDesktop' },
  { path: '/wishes', color: '#B9B6E6', backdrop: '/art/sky-wishes.webp', title: 'Dylan — Wishes', mobile: 'WishesMobile', desktop: 'WishesDesktop' },
  { path: '/thank-you', color: '#8FB6E0', backdrop: '/art/picnic.webp', title: 'Dylan — Thank You', mobile: 'ThankYouMobile', desktop: 'ThankYouDesktop' },
];
