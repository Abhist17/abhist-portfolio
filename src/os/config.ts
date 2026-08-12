/* ═════════════════════════════════════════════
   EDIT THIS FILE.

   Everything here is stuff only Abhist can supply.
   Leave a value empty and the OS just hides that
   piece — nothing breaks, nothing shows blank.
═════════════════════════════════════════════ */

export const CONFIG = {
  /* ── competitive programming ──────────────
     Codeforces works straight from the browser.
     LeetCode and CodeChef have no public CORS
     API, so those two show as links until we
     add a tiny proxy — paste the handles anyway. */
  codeforces: "",          // e.g. "abhist17"
  leetcode:   "",          // e.g. "abhist17"
  codechef:   "",          // e.g. "abhist17"

  /* ── résumé ───────────────────────────────
     Drop the file at public/resume.pdf and put
     "/resume.pdf" here. Empty = no Résumé app. */
  resume: "",

  /* ── music ────────────────────────────────
     Paste a YouTube / YouTube Music link:

       a playlist  →  the widget plays it and gets
                      prev / next buttons
       one video   →  that track, on its own
       a Spotify link still works, but Spotify
       only allows their own embedded player.

     The playlist must be Public or Unlisted —
     YouTube refuses to play a Private one for
     anyone but you.

     Empty = the widget just says nothing queued. */
  music: "",

  /* ── photos ───────────────────────────────
     Drop images in public/photos/ and list them
     here. Empty = the Photos app just shows the
     single avatar. */
  photos: [] as { src: string; caption: string }[],

  /* ── github ───────────────────────────────
     Public API, no key needed.

     Projects only lists repos with at least this many stars, so
     starring your own repo on GitHub is what puts it on the site.
     Set to 0 to list everything. */
  github: "Abhist17",
  minStars: 1,

  /* ── weather ──────────────────────────────
     Open-Meteo, no key needed. Nagpur. */
  place: { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
};
