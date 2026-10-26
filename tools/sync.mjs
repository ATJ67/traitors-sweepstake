#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  DAILY SYNC — keeps the scoreboard up to date.
//
//  1. Joe's board first: if it has the latest aired episode fully scored,
//     adopt its event log (data only — his code is never executed).
//  2. Otherwise: ask a headless Claude session to research the missing
//     episode(s) on the web (search/read only, no file or shell access).
//  3. Everything is validated against the game state before publishing;
//     anything that doesn't add up is rejected and you get a notification.
//
//  Runs from launchd every 30 minutes but only does the work once per day
//  (so it effectively runs when the laptop is opened). Run it by hand any
//  time with:   node ~/Traitors/tools/sync.mjs --force
// ─────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE_DIR = path.join(process.env.HOME, "Library/Application Support/traitors-sync");
const STATE_FILE = path.join(STATE_DIR, "state.json");
const JOE_RAW = "https://raw.githubusercontent.com/yosayssmoe/-F-F-Celeb-Traitors/main/";
const KNOWN_JOE_SCORING = path.join(REPO, "tools/joe-scoring.sha256");
const CLAUDE = "/opt/homebrew/bin/claude";
const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry-run");
const NO_WEB = process.argv.includes("--no-web");
// Test only: forget the latest aired episode and skip Joe, to exercise the web path.
const PRETEND_BEHIND = process.argv.includes("--pretend-behind");

const log = (...a) => console.log(new Date().toISOString(), ...a);
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });

function notify(title, message) {
  log("NOTIFY", title, "—", message);
  if (DRY) return;
  try {
    execFileSync("/usr/bin/osascript", ["-e", `display notification ${JSON.stringify(message)} with title ${JSON.stringify(title)}`]);
  } catch (e) { /* notifications are best-effort */ }
}
const readState = () => { try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch { return {}; } };
const writeState = (s) => { fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2)); };
const git = (...args) => execFileSync("/usr/bin/git", ["-C", REPO, ...args], { encoding: "utf8" }).trim();

// ── Our own files (trusted) ──────────────────────────────────
function loadOurs() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(REPO, "scoring.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(REPO, "data.js"), "utf8"), ctx);
  return { T: ctx.window.TraitorsScoring, D: JSON.parse(JSON.stringify(ctx.window.SWEEPSTAKE)) };
}

// Episodes that have finished airing, from the schedule in data.js
function latestAired(D) {
  const len = (D.episodeLengthMins || 60) * 60000;
  return D.episodes.filter((s) => new Date(s).getTime() + len <= Date.now()).length;
}

// ── Validation: replay events and reject anything impossible ──
function validate(T, D, events) {
  const names = new Set(D.celebs.map((c) => c.name));
  const errors = [];
  const sim = T.compute({ ...D, events });
  events.forEach((ev, i) => {
    const before = new Set(sim.steps[i].active);
    const where = `event ${i + 1} (ep ${ev.ep} ${ev.type})`;
    const known = (n) => names.has(n) || errors.push(`${where}: unknown name "${n}"`);
    if (!Number.isInteger(ev.ep) || ev.ep < 1 || ev.ep > 10) errors.push(`${where}: bad episode`);
    if (ev.type === "murder") {
      if (ev.victim) { known(ev.victim); if (!before.has(ev.victim)) errors.push(`${where}: victim ${ev.victim} not in the game`); }
      if (ev.shielded) known(ev.shielded);
    } else if (ev.type === "recruit") {
      known(ev.who);
      if (!before.has(ev.who)) errors.push(`${where}: ${ev.who} not in the game`);
      else if (sim.steps[i].roles[ev.who] !== "Faithful") errors.push(`${where}: ${ev.who} is not a Faithful`);
    } else if (ev.type === "roundtable") {
      const present = [...before].filter((n) => !(ev.absent || []).includes(n));
      const rounds = [ev.votes || {}].concat(ev.revotes || []);
      rounds.forEach((r, k) => Object.entries(r).forEach(([v, t]) => {
        known(v); known(t);
        if (!present.includes(v)) errors.push(`${where}: voter ${v} not at the table`);
        if (!present.includes(t)) errors.push(`${where}: vote for ${t}, who isn't at the table`);
      }));
      if (T.ballotView && (ev.ballotPowers !== undefined || ev.extraBallots !== undefined)) {
        const bv = T.ballotView(ev, present);
        bv.errors.forEach((e) => errors.push(`${where}: ${e}`));
      }
      if (ev.banished && ev.outcome && ev.outcome.status === "pending") errors.push(`${where}: banishment recorded but outcome still pending`);
      if (ev.banished) {
        known(ev.banished);
        if (!before.has(ev.banished)) errors.push(`${where}: ${ev.banished} not in the game`);
        if (ev.votingComplete) {
          const missing = present.filter((n) => !(ev.votes || {})[n]);
          if (missing.length) errors.push(`${where}: marked complete but missing votes from ${missing.join(", ")}`);
          const last = rounds[rounds.length - 1];
          const tally = {};
          Object.values(last).forEach((t) => (tally[t] = (tally[t] || 0) + 1));
          // double / extra votes (e.g. the Dagger) count towards the tally too
          (ev.extraBallots || []).filter((b) => b.round === rounds.length - 1).forEach((b) => (tally[b.target] = (tally[b.target] || 0) + 1));
          const top = Math.max(0, ...Object.values(tally));
          if ((tally[ev.banished] || 0) !== top) errors.push(`${where}: ${ev.banished} banished but didn't get the most votes`);
        }
      }
    } else if (ev.type === "exit") {
      known(ev.who);
      if (!before.has(ev.who)) errors.push(`${where}: ${ev.who} not in the game`);
    } else if (ev.type === "final") {
      (ev.winners || []).forEach((w) => { known(w); if (!before.has(w)) errors.push(`${where}: winner ${w} not in the game`); });
    } else errors.push(`${where}: unknown event type`);
  });
  return errors;
}

const clean = (e) => {
  const x = {};
  for (const k of ["ep", "type", "victim", "shielded", "who", "accepted", "tableId", "votes", "revotes", "absent", "banished",
                   "votingComplete", "ballotPowers", "extraBallots", "outcome", "winners"]) {
    if (e[k] !== undefined) x[k] = e[k];
  }
  return x;
};
const sameEvents = (a, b) => JSON.stringify(a.map(clean)) === JSON.stringify(b.map(clean));

// ── Step 1: Joe's board ──────────────────────────────────────
async function fetchJoe() {
  const get = async (f) => {
    const r = await fetch(JOE_RAW + f + "?t=" + Date.now(), { headers: { "cache-control": "no-cache" } });
    if (!r.ok) throw new Error(`Joe's ${f}: HTTP ${r.status}`);
    return r.text();
  };
  const [dataSrc, scoringSrc] = await Promise.all([get("data.js"), get("scoring.js")]);
  // Parse as JSON — never execute someone else's code.
  const start = dataSrc.indexOf("=", dataSrc.indexOf("window.SWEEPSTAKE")) + 1;
  const data = JSON.parse(dataSrc.slice(start, dataSrc.lastIndexOf(";")));
  // Fingerprint his scoring rules, ignoring comments and whitespace.
  const norm = scoringSrc.replace(/\/\/[^\n]*/g, "").replace(/\s+/g, "");
  const hash = crypto.createHash("sha256").update(norm).digest("hex");
  return { data, hash };
}

// ── Step 2: web research via headless Claude ─────────────────
function researchOnWeb(T, D, fromEp, toEp) {
  const sim = T.compute(D);
  const active = sim.steps[D.events.length].active;
  const roles = sim.steps[D.events.length].roles;
  const prompt = `You are updating a sweepstake scoreboard for The Celebrity Traitors UK, Series 2 (BBC One, autumn 2026).
Research what happened in episode(s) ${fromEp}${toEp > fromEp ? "–" + toEp : ""} using web search. Prefer the Wikipedia article "The Celebrity Traitors series 2" (its voting history table) and the Traitors UK fandom wiki, cross-checked with major outlets (BBC, Radio Times, Guardian, Independent, LADbible live blogs).

Players still in the game before episode ${fromEp}, with current roles: ${active.map((n) => n + " (" + roles[n] + ")").join(", ")}.
Use these exact name spellings: ${D.celebs.map((c) => c.name).join(", ")}.

Report, in the order they happened: murders (or a night with no murder, and anyone whose Shield blocked an attempt), recruitments (accepted or declined), Round Tables (each player's vote, re-votes, anyone absent, who was banished), anyone leaving the game, and the final (winners) if aired.

Rules:
- Only report facts you found stated by a reliable source. Never guess.
- For a Round Table, set "votingComplete": true ONLY if you have every present player's individual vote and it matches the published vote tally; otherwise include the votes you do have and set it false.
- If an episode's results aren't published yet, return no events for it.

Reply with ONLY this JSON between <json> and </json> tags:
<json>{"episodes":[{"ep":8,"complete":true,"events":[
 {"ep":8,"type":"murder","victim":"Name or null","shielded":"Name if a Shield blocked it, else omit"},
 {"ep":8,"type":"recruit","who":"Name","accepted":true},
 {"ep":8,"type":"roundtable","votes":{"Voter":"Target"},"revotes":[],"absent":[],"banished":"Name","votingComplete":true},
 {"ep":8,"type":"exit","who":"Name"},
 {"ep":10,"type":"final","winners":["Name"]}
],"sources":["https://..."],"notes":"anything uncertain"}]}</json>`;

  log(`asking Claude to research episodes ${fromEp}-${toEp}`);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const r = spawnSync(CLAUDE, ["-p", prompt, "--allowedTools", "WebSearch,WebFetch", "--output-format", "text"], {
    encoding: "utf8", timeout: 15 * 60 * 1000, cwd: STATE_DIR,
    env: { ...process.env, PATH: "/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" },
  });
  if (r.error || r.status !== 0) {
    const why = r.error?.message || (r.stderr || "").trim() || (r.stdout || "").trim();
    throw new Error("Claude research failed: " + (/authenticat|401|login/i.test(why) ? "Claude CLI needs logging in again (run `claude`, then /login)" : why.slice(0, 200)));
  }
  const m = r.stdout.match(/<json>([\s\S]*?)<\/json>/);
  if (!m) throw new Error("Claude returned no JSON: " + r.stdout.slice(0, 300));
  return JSON.parse(m[1]);
}

// ── Publishing ──────────────────────────────────────────────
function writeData(D) {
  const header =
    "// Sweepstake data — kept up to date by tools/sync.mjs (Joe's board first, then the web).\n" +
    "// Points are calculated from `events` by scoring.js — never enter totals by hand.\n" +
    "// Event format: see README.md.\n\n";
  fs.writeFileSync(path.join(REPO, "data.js"), header + "window.SWEEPSTAKE = " + JSON.stringify(D, null, 2) + ";\n");
  const idx = path.join(REPO, "index.html");
  const v = Date.now().toString(36);
  fs.writeFileSync(idx, fs.readFileSync(idx, "utf8").replace(/\?v=[0-9a-z]+/g, "?v=" + v));
}

function standings(T, D) {
  const S = T.compute(D).contestants, P = {};
  D.celebs.forEach((c) => { P[c.colleague] = (P[c.colleague] || 0) + S[c.name].contributed; });
  return Object.entries(P).sort((a, b) => b[1] - a[1]);
}

function publish(message) {
  if (DRY) { log("dry run — not committing"); return; }
  git("add", "data.js", "index.html");
  if (!git("status", "--porcelain", "data.js", "index.html")) { log("nothing to commit"); return; }
  git("-c", "user.name=ATJ67", "-c", "user.email=alex.jacobs@ntlworld.com", "commit", "-q", "-m", message);
  git("push", "-q");
  log("pushed:", message.split("\n")[0]);
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const state = readState();
  if (!FORCE && state.lastRun === today()) { log("already ran today — skipping"); return; }

  if (!DRY) git("pull", "-q", "--ff-only");
  const { T, D } = loadOurs();
  D.syncStatus = D.syncStatus || { latestEpisodeComplete: Math.max(0, ...D.events.map((e) => e.ep)), source: "manual" };
  const aired = latestAired(D);
  const before = standings(T, D);
  const changes = [];
  const warnings = [];

  if (PRETEND_BEHIND) {
    D.events = D.events.filter((e) => e.ep < aired);
    D.syncStatus.latestEpisodeComplete = aired - 1;
    log("TEST: pretending episode", aired, "is missing");
  }

  // 1. Joe's board
  let joeLatest = 0;
  let joeMaxEp = 0;   // last episode Joe has any verified events for
  if (!PRETEND_BEHIND) try {
    const joe = await fetchJoe();
    const known = fs.existsSync(KNOWN_JOE_SCORING) ? fs.readFileSync(KNOWN_JOE_SCORING, "utf8").trim() : null;
    if (known && joe.hash !== known) warnings.push("Joe has changed his scoring rules — ask Claude to review before relying on them");
    joeLatest = joe.data.automation?.latestEpisodeFullyScored || 0;
    const joeEvents = joe.data.events.map(clean);
    joeMaxEp = Math.max(0, ...joeEvents.map((e) => e.ep));
    log(`Joe: fully scored to ep ${joeLatest}; ours: ep ${D.syncStatus.latestEpisodeComplete}; aired: ep ${aired}`);
    if (joeLatest >= D.syncStatus.latestEpisodeComplete && !sameEvents(joeEvents, D.events)) {
      const errors = validate(T, D, joeEvents);
      if (errors.length) warnings.push("Joe's data failed checks, not used: " + errors.slice(0, 3).join("; "));
      else {
        D.events = joeEvents;
        D.syncStatus = { latestEpisodeComplete: joeLatest, source: "Joe's board", at: new Date().toISOString() };
        changes.push(`episodes up to ${joeLatest} from Joe's board`);
      }
    } else if (joeLatest >= D.syncStatus.latestEpisodeComplete) {
      D.syncStatus.latestEpisodeComplete = joeLatest;
    }
  } catch (e) {
    warnings.push("Couldn't read Joe's board: " + e.message);
  }

  // 2. The web, only for episodes Joe has nothing on yet. If Joe has a
  //    partial episode (e.g. a tie still to be resolved), his verified data
  //    wins and we wait for him rather than overwrite it with thinner web data.
  const webFrom = Math.max(D.syncStatus.latestEpisodeComplete, joeMaxEp) + 1;
  if (webFrom <= aired && !NO_WEB) {
    const from = webFrom;
    try {
      const res = researchOnWeb(T, D, from, aired);
      // keep everything before the episodes being researched, then add the web's
      const kept = D.events.filter((e) => e.ep < from);
      const webEps = (res.episodes || []).filter((x) => x.ep >= from && x.ep <= aired).sort((a, b) => a.ep - b.ep);
      const webEvents = webEps.flatMap((x) => (x.events || []).map(clean));
      if (webEvents.length) {
        const candidate = kept.concat(webEvents);
        const errors = validate(T, D, candidate);
        if (errors.length) warnings.push("Web results failed checks, not used: " + errors.slice(0, 3).join("; "));
        else if (!sameEvents(candidate, D.events)) {
          D.events = candidate;
          let done = Math.min(D.syncStatus.latestEpisodeComplete, from - 1);
          for (const x of webEps) {
            const rts = (x.events || []).filter((e) => e.type === "roundtable");
            if (x.complete && rts.every((e) => e.votingComplete) && x.ep === done + 1) done = x.ep; else break;
          }
          D.syncStatus = { latestEpisodeComplete: done, source: "web research", at: new Date().toISOString(),
                           sources: webEps.flatMap((x) => x.sources || []).slice(0, 8) };
          changes.push(`episode ${from}${aired > from ? "–" + aired : ""} from the web` + (done < aired ? " (votes incomplete — will re-check)" : ""));
          const notes = webEps.map((x) => x.notes).filter(Boolean).join(" ");
          if (notes) log("web notes:", notes);
          if (PRETEND_BEHIND) log("TEST web events:", JSON.stringify(webEvents));
        }
      } else log("web: no results published yet for ep", from);
    } catch (e) {
      warnings.push("Web research failed: " + e.message);
    }
  }

  if (changes.length) {
    if (!DRY) writeData(D);
    const after = standings(T, D);
    const top = after.slice(0, 3).map(([n, p]) => `${n} ${p}`).join(", ");
    publish(`Sync: ${changes.join("; ")}\n\nAutomated by tools/sync.mjs. Leaders: ${top}.`);
    notify("Traitors sweepstake updated", `${changes.join("; ")}. Top: ${top}`);
  } else {
    log("no changes", JSON.stringify(before.slice(0, 3)));
  }
  warnings.forEach((w) => notify("Traitors sweepstake — check needed", w));

  if (webFrom > aired && D.syncStatus.latestEpisodeComplete < aired) log(`waiting on Joe to finish episode ${D.syncStatus.latestEpisodeComplete + 1} (he has partial data)`);

  // Only mark the day done once we've got everything that has aired, or
  // we've genuinely tried both sources (so a network blip retries later).
  const upToDate = D.syncStatus.latestEpisodeComplete >= aired;
  const triedEverything = !warnings.some((w) => w.startsWith("Couldn't read") || w.startsWith("Web research failed"));
  if (!DRY && (upToDate || triedEverything)) writeState({ ...state, lastRun: today(), lastResult: changes.join("; ") || "no changes" });
}

main().catch((e) => {
  log("FAILED", e.stack || e);
  notify("Traitors sweepstake — sync failed", String(e.message || e).slice(0, 200));
  process.exitCode = 1;
});
