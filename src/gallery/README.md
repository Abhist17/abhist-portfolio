# Gallery — drop your pictures here

Anything you put in this folder shows up in the **Photos** app on the desktop.
No config to edit, no list to keep in sync. Add a file, it appears. Delete it,
it's gone.

**Formats:** `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif`

**The caption** is the file name, tidied up:

| file name                     | caption shown   |
| ----------------------------- | --------------- |
| `goa-sunset.jpg`              | Goa sunset      |
| `01-hackathon-night.jpg`      | Hackathon night |
| `eth_india_2025.png`          | Eth india 2025  |

**The order** is the file name too, sorted A→Z. So if you want a specific
order, number them: `01-…`, `02-…`, `03-…`. The first picture is the one the
desktop icon shows.

**Size:** these get bundled into the build, so keep them web-sized — 2000px on
the long edge and under ~500 KB each is plenty. Huge originals just make the
site slow to load.

Photos that live in `public/photos/` still work too: list them in
`src/os/config.ts` under `photos` and they get added after these.
