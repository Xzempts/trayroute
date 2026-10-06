# Trayroute

Trayroute is a pharmacy technology company. Two products live here:

- The counting tray: a spatula slides tablets into an acrylic tube, the display keeps the number, and scrolling tips them into an orange bottle.
- Route: scan the address on each delivery bag, then build the efficient round.

## Run it

```bash
npm install
npm run dev
```

Open the URL Next prints. The red button on the tray resets the count. On Route, scan the bags.

## GitHub Pages

Pushing `main` to GitHub runs `.github/workflows/pages.yml` and publishes the static site. In the repository, set Settings → Pages → Source to GitHub Actions. `public/CNAME` is `trayroute.com`.

In Namecheap Advanced DNS, remove the parking records, then add:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `<github-username>.github.io` |

## Pitch deck

The pitch deck is at `/pitch`. Arrow keys move between slides. Download saves `Trayroute-pitch-deck.pdf`.
