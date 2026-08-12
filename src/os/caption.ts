/* ─────────────────────────────────────────────
   NAMING
   A file name is the only caption a dropped-in
   photo has, so it's worth reading properly.
   Pure string work, kept apart so it can be
   exercised without a bundler.
───────────────────────────────────────────── */

const fileName = (path: string) => path.split("/").pop()!.replace(/\.[^.]+$/, "");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Names a camera or a phone dump gives you, which say nothing:
   photo_12, IMG_20240103, DSC0194, PXL_20250712, Screenshot… */
const CAMERA = /^(photo|image|img|pic|picture|dsc|dscn|pxl|screenshot|snapchat|whatsapp[\s_-]*image|received)[\s_-]*\d*/i;

/* Punctuated (2026-08-13) and run-together (20260813) stamps. */
const DATE_RE = /(20\d{2})[-_.](\d{1,2})[-_.](\d{1,2})|(20\d{2})(\d{2})(\d{2})/;

/* A clock stamp, punctuated the several ways cameras punctuate it. */
const TIME_RE = /\b\d{1,2}[-_.:]\d{2}(?:[-_.:]\d{2})?\b/g;

/** The date a name carries, as something a person would read. */
function dateIn(name: string): { text: string; at: number; len: number } | null {
  const m = name.match(DATE_RE);
  if (!m) return null;
  const [y, mo, d] = m[1] ? [m[1], m[2], m[3]] : [m[4], m[5], m[6]];
  const mi = Number(mo) - 1;
  const day = Number(d);
  if (mi < 0 || mi > 11 || day < 1 || day > 31) return null;
  return { text: `${day} ${MONTHS[mi]} ${y}`, at: m.index ?? 0, len: m[0].length };
}

/** Whatever's left once the camera's own vocabulary is taken out. */
function words(s: string) {
  return s
    /* leading order prefix: 01-, 02_ … */
    .replace(/^\d+[\s._-]+/, "")
    /* the camera's own word for "photo" */
    .replace(CAMERA, "")
    .replace(TIME_RE, "")
    /* the join word left behind by "Screenshot <date> at <time>" */
    .replace(/^[\s._-]*\b(at|on)\b/i, "")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const hasLetters = (s: string) => /[a-z]/i.test(s);

/** "01-goa-sunset" → "Goa sunset". A camera dump falls back to its date,
    because "13 Aug 2026" reads like a caption and "photo_12_2026_08_13"
    reads like a file. Anything you wrote yourself wins over the stamp,
    whichever side of it you wrote it on. */
export function caption(path: string) {
  const raw = fileName(path);
  const date = dateIn(raw);

  /* split the name around the stamp so the camera's digits can't swallow it */
  const head = date ? raw.slice(0, date.at) : raw;
  const tail = date ? raw.slice(date.at + date.len) : "";

  const before = words(head);
  if (hasLetters(before)) return before.charAt(0).toUpperCase() + before.slice(1);

  const after = words(tail);
  if (hasLetters(after)) return after.charAt(0).toUpperCase() + after.slice(1);

  if (date) return date.text;
  /* nothing left to say — at least don't print an empty caption */
  return raw.replace(/[_-]+/g, " ").trim() || "Untitled";
}
