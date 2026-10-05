# Celebrity Traitors Sweepstake

Office sweepstake tracker for The Celebrity Traitors (Series 2): the round table with each celebrity and the colleague who drew them, a coffin of the fallen, a countdown to the next episode, and a points scoreboard.

Live at **https://atj67.github.io/traitors-sweepstake/** (GitHub Pages; updates about a minute after each push).

Plain static site — no build step.

## Views

- **Round Table** and **Scoreboard** — switch with the buttons top right, or press **L**.
- Click any celebrity (on the table, the scoreboard or in the coffin) for their points history, episode by episode.
- URL options: `?projector` hides the Manage button · `?view=board` opens on the scoreboard · `?rotate=30` flips between the two views every 30 seconds.

## Scoring

Rules from the games team's deck (Syneos sweepstake, scoreboard slide). Every point is calculated in `scoring.js` from the event log — totals are never typed in.

**Celeb score = Survival + Murder + Recruitment + Other.** Points contributed to a participant = celeb score × their multiplier (Lauren ×2). Participant total = the sum of their celebrities' points.

| | Points | Column |
|---|---|---|
| Survival: start on 1, +1 each time someone else is eliminated while you're still in; winners reach 21 | 1–21 | Survival |
| **Traitor** — successful murder (whole Traitor team that night) | +1 | Murder |
| **Faithful** — recruited as a Traitor | +2 | Recruitment |
| **Faithful** — voted for any Traitor at a Round Table | +2 | Other |
| **Faithful** — a Traitor is banished (all active Faithfuls) | +2 | Other |
| **Faithful** — survived an attempted murder with a Shield | +2 | Other |
| **Traitor** — a Faithful is banished (all active Traitors) | +2 | Other |
| Everyone — zero votes at a Round Table (present only) | +1 | Other |
| Winner | +5 | Other |

Points are scored by role *at the time*; recruits keep their Faithful points. Ties and re-votes count as one Round Table. Rank uses standard competition ranking (1, 2, 2, 4 …), with medals for the top three.

## Updating after each episode

1. Press **M** (or the faint **Manage** button, bottom right) → **Game log**.
2. Add what happened, in order: **Murder / attempt** (pick the victim, or who a Shield saved), **Round Table** (who voted for whom, any re-votes, who was banished), **Recruitment**, **Left the game**, **The Final**.
3. **Save** to see it in that browser. To update the live site for everyone, click **Export data.js**, replace `data.js` in this repo with the download, and push.

## Files

- `data.js` — line-up, the draw (and multipliers), starting Traitors, episode air times and the event log (edit this)
- `scoring.js` — the scoring rules
- `app.js` — the page
- `images/table.webp` — the round-table artwork; the card positions in `app.js` (`CARDS`) are measured from this exact image
