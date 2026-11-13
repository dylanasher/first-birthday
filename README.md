# Dylan's Storybook Invitation

An animated storybook invitation for Dylan's Baptism & First Birthday (December 13, 2026).
It has eight illustrated chapters, each with a phone layout (390×844) and a desktop layout (1440×900).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## Live site (GitHub Pages)

https://dylanasher.github.io/first-birthday/

Every push to `main` rebuilds and publishes the site (`.github/workflows/deploy.yml`). To connect the
RSVP sheet on the live site, add its web-app link under the repository's **Settings → Secrets and
variables → Actions → Variables** as `VITE_RSVP_ENDPOINT`, then re-run the latest deploy.

## Stack

- **Vite + React 18**: one class component per chapter layout, in `src/scenes/`.
- **GSAP**: all scene choreography (camera moves, parallax, fireflies, page turns).
- **react-router**: one path per chapter. Each "continue" control turns the page to the next path.

| Path | Chapter |
| --- | --- |
| `/` | 1 · Opening + Welcome |
| `/details` | 2 · Event details + parking |
| `/milestones` | 3 · Milestones game + photoshoot |
| `/dress-code` | 4 · Dress code + gift guide |
| `/dos-and-donts` | 5 · Do's & Don'ts |
| `/rsvp` | 6 · RSVP + countdown + wishes |
| `/wishes` | 7 · Wishes for Dylan |
| `/thank-you` | 8 · Thank you |
| `/design-system` | The "Storybook Forest" reference sheet |

## How layout works

Each scene is painted on a fixed artboard. `src/components/Scene.jsx` picks the phone or desktop
layout for the viewport (desktop at ≥900px wide and landscape). It then scales the artboard to fit,
letterboxed on that chapter's background colour.

Each scene's CSS is scoped under a `.dc-<SceneName>` wrapper class, so chapters never clash.
Artwork is in `public/art/`.

## RSVP & guest list (Google Sheet)

Guests find their invitation by name on the RSVP page, confirm it's them, and reply for their party.
The guest list and the replies both live in one Google Sheet, so you can edit and check them anytime.

**Set up (once):**

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Replace the editor's contents with `apps-script/Code.gs`. Add a second script file named `Match`
   (the **+** next to Files → Script) and paste in `apps-script/Match.gs`. Save.
3. In the editor's function menu choose **setupSheet** and press **Run**, allowing access when asked.
   This creates the **Guests** and **RSVPs** tabs.
4. Fill in the **Guests** tab, one row per invitation. The easiest way is to edit `guest-list.csv`
   (in Excel, Numbers or Google Sheets), then in the Google Sheet open the **Guests** tab and use
   **File → Import → Upload**, choosing **Replace current sheet**. Delete the three example rows first.

   | Name | Nicknames | Extra guests | Total seats |
   | --- | --- | --- | --- |
   | Patrick Solon | Pat | Maria Solon | 2 |
   | Katrina Dela Cruz | Kat, Trina | | 2 |

   *Nicknames* and *Extra guests* are comma-separated and optional. Common nicknames (Pat, Mike,
   Bobby…) already work without listing them. *Total seats* includes the guest. If it's blank, it
   counts 1 plus the extra guests. Extra guests can search their own names too.
5. **Deploy → New deployment → Web app**. Set *Execute as* to **Me** and *Who has access* to
   **Anyone**, then deploy and copy the **/exec** URL.
6. Copy `.env.example` to `.env`, paste that URL after `VITE_RSVP_ENDPOINT=`, and rebuild
   (`npm run build`).

Replies appear in the **RSVPs** tab: one row per invitation, updated in place if they change their
answer. Edits to the **Guests** tab apply straight away. After changing the script itself, use
**Deploy → Manage deployments → Edit → New version** to publish it.

Without `VITE_RSVP_ENDPOINT`, `npm run dev` uses a handful of sample guests (try "Pat Solon" or
"Maria Santos") and logs replies to the browser console instead of saving them.

### Wishes

Wishes sent from Chapter 6's **Leave a wish** tab are saved to a **Wishes** tab in the same sheet
(Sent | Name | Wish | Show) and shown in Chapter 7, newest first. To hide a wish from the site, set
its **Show** cell to `FALSE`. Use **File → Download → CSV** on that tab for a copy.

If you set up the sheet before wishes existed, paste in the updated `apps-script/Code.gs`, run
**setupSheet** once (it only adds the missing tab), then **Deploy → Manage deployments → Edit →
New version**.

With `npm run dev` and no sheet connected, wishes are saved to `wishes.csv` in the project folder
instead, with the same columns.

## Still to fill in

