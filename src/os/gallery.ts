/* ─────────────────────────────────────────────
   THE GALLERY
   Whatever sits in src/gallery/ is the library —
   Vite finds the files at build time, so adding a
   picture is just dropping a file in a folder.

   File name does two jobs: it sorts the album and
   it becomes the caption. Number the files to
   force an order (01-…, 02-…).
───────────────────────────────────────────── */
import { CONFIG } from "./config";
import { ME } from "./data";

export type Shot = { src: string; caption: string; key: string };

const found = import.meta.glob(
  "../gallery/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,avif,AVIF,gif,GIF}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const fileName = (path: string) => path.split("/").pop()!.replace(/\.[^.]+$/, "");

/** "01-goa-sunset" → "Goa sunset". Ordering prefixes are for me, not the visitor. */
function caption(path: string) {
  const words = fileName(path)
    .replace(/^[\d\s._-]+/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return fileName(path);
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const dropped: Shot[] = Object.keys(found)
  .sort((a, b) => fileName(a).localeCompare(fileName(b), undefined, { numeric: true }))
  .map(path => ({ src: found[path], caption: caption(path), key: path }));

/* anything hand-listed in config.ts trails the folder */
const listed: Shot[] = CONFIG.photos.map(p => ({ ...p, key: p.src }));

/** Never empty — an unpopulated gallery still has one picture of me. */
export const SHOTS: Shot[] =
  dropped.length || listed.length
    ? [...dropped, ...listed]
    : [{ src: ME.avatar, caption: "Me", key: "avatar" }];

/** What the desktop icon shows through its little frame. */
export const COVER = SHOTS[0].src;
