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
     A YouTube Music / YouTube / Spotify link.
     Empty = no Now Playing widget. */
  music: "",

  /* ── photos ───────────────────────────────
     Drop images in public/photos/ and list them
     here. Empty = the Photos app just shows the
     single avatar. */
  photos: [] as { src: string; caption: string }[],

  /* ── github ───────────────────────────────
     Public API, no key needed. */
  github: "Abhist17",

  /* ── weather ──────────────────────────────
     Open-Meteo, no key needed. Nagpur. */
  place: { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
};
