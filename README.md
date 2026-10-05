# Celebrity Traitors Sweepstake

Office sweepstake tracker for The Celebrity Traitors (Series 2): the round table with each celebrity and the colleague who drew them, a coffin of the fallen, a countdown to the next episode, and a points leaderboard.

Live at **https://atj67.github.io/traitors-sweepstake/** (GitHub Pages; updates about a minute after each push).

Plain static site — no build step.

## Views

- **Round Table** and **Leaderboard** — switch with the buttons top right, or press **L**.
- Click any contestant (on the table, the leaderboard or in the coffin) for their points history, episode by episode.
- URL options: `?projector` hides the Manage button · `?view=board` opens on the leaderboard · `?rotate=30` flips between the two views every 30 seconds.

## Scoring

Total = Placement + Winner bonus + Faithful bonus + Traitor bonus. Every point is calculated in `scoring.js` from the event log — totals are never typed in.

| | Points |
|---|---|
| Placement: *n*th to leave | *n* |
| Winner / joint winner | 21 + 5 winner bonus |
| **Faithful** — voted for any Traitor at a Round Table | +2 |
| **Faithful** — a Traitor is banished (all active Faithfuls) | +1 |
| **Faithful** — accepts recruitment | +2 |
| **Traitor** — successful murder (whole Traitor team that night) | +1 |
| **Traitor** — a Faithful is banished (all active Traitors) | +2 |
| Zero votes at a Round Table (either role, present only) | +1 |

Points are scored by role *at the time*; recruits keep their Faithful points. Ties and re-votes count as one Round Table. Anyone still in shows a provisional placement — the minimum they're guaranteed.

## Updating after each episode

1. Press **M** (or the faint **Manage** button, bottom right) → **Game log**.
2. Add what happened, in order: **Murder**, **Round Table** (who voted for whom, any re-votes, who was banished), **Recruitment**, **Left the game**, **The Final**.
3. **Save** to see it in that browser. To update the live site for everyone, click **Export data.js**, replace `data.js` in this repo with the download, and push.

## Files

- `data.js` — line-up, the draw, starting Traitors, episode air times and the event log (edit this)
- `scoring.js` — the scoring rules
- `app.js` — the page
- `images/table.webp` — the round-table artwork; the card positions in `app.js` (`CARDS`) are measured from this exact image
