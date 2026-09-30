# Celebrity Traitors Sweepstake

Office sweepstake tracker for The Celebrity Traitors (Series 2): the round table with each celebrity and the colleague who drew them, a coffin of the fallen, and a countdown to the next episode.

Plain static site — no build step. Open `index.html` locally, or deploy the folder as-is (e.g. Vercel, "Other" framework preset).

## Updating after each episode

- Press **M** (or the faint **Manage** button, bottom right) to enter colleagues, run the random draw, and mark who's been banished or murdered.
- Changes made there are saved in that browser only. To update the hosted site for everyone, click **Export data.js**, replace `data.js` in this repo with the download, and push.
- Add `?projector` to the URL to hide the Manage button when projecting.

## Files

- `data.js` — the line-up, colleagues, statuses and episode air times (edit this)
- `images/table.webp` — the round-table artwork; the card positions in `app.js` (`CARDS`) are measured from this exact image
