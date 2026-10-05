// ─────────────────────────────────────────────────────────────
//  SCORING ENGINE
//  Replays the event log in data.js and works out every contestant's
//  status, role and points. Nothing here is entered by hand.
//
//  Total = Placement + Winner bonus + Faithful bonus + Traitor bonus
// ─────────────────────────────────────────────────────────────
window.TraitorsScoring = (function () {
  "use strict";

  // Each scoring category, its points and which bucket it counts towards.
  const CATS = {
    placement:        { label: "Placement",                 group: "placement" },
    traitorVote:      { label: "Voted for a Traitor",       group: "faithful", pts: 2 },
    traitorBanished:  { label: "Traitor banished",          group: "faithful", pts: 1 },
    zeroVoteF:        { label: "Received zero votes",       group: "faithful", pts: 1 },
    recruited:        { label: "Accepted recruitment",      group: "faithful", pts: 2 },
    murder:           { label: "Successful murder",         group: "traitor",  pts: 1 },
    faithfulBanished: { label: "Faithful banished",         group: "traitor",  pts: 2 },
    zeroVoteT:        { label: "Received zero votes",       group: "traitor",  pts: 1 },
    winner:           { label: "Winner bonus",              group: "winner",   pts: 5 },
  };
  const GROUPS = ["placement", "faithful", "traitor", "winner"];
  const OUT = ["murdered", "banished", "left"];

  function compute(data) {
    const names = data.celebs.map((c) => c.name);
    const total = names.length;
    const originalTraitors = new Set(data.originalTraitors || []);
    const S = {};
    names.forEach((n) => {
      const role = originalTraitors.has(n) ? "Traitor" : "Faithful";
      S[n] = { name: n, originalRole: role, role, status: "active", exitEp: null, position: null,
               roleAtExit: null, recruitedEp: null, cats: {}, log: [] };
    });

    let position = 0;
    const steps = [];   // snapshot before each event, for the editor
    const active = () => names.filter((n) => S[n].status === "active");
    const add = (n, cat, ep, note) => {
      const pts = CATS[cat].pts;
      S[n].cats[cat] = (S[n].cats[cat] || 0) + pts;
      S[n].log.push({ ep, cat, pts, note });
    };
    const leave = (n, status, ep) => {
      const s = S[n];
      s.status = status; s.exitEp = ep; s.position = ++position; s.roleAtExit = s.role;
    };
    const isActive = (n) => S[n] && S[n].status === "active";

    (data.events || []).forEach((ev, i) => {
      steps[i] = { active: active(), roles: Object.fromEntries(names.map((n) => [n, S[n].role])) };
      const ep = ev.ep;

      if (ev.type === "murder") {
        // The whole Traitor team that night gets +1 for a completed murder.
        if (ev.victim && isActive(ev.victim)) {
          active().filter((n) => S[n].role === "Traitor")
            .forEach((t) => add(t, "murder", ep, ev.victim + " murdered"));
          leave(ev.victim, "murdered", ep);
        }
      }

      else if (ev.type === "recruit") {
        // Keeps Faithful points already earned; scores as a Traitor from here on.
        if (ev.accepted !== false && isActive(ev.who) && S[ev.who].role === "Faithful") {
          add(ev.who, "recruited", ep);
          S[ev.who].role = "Traitor";
          S[ev.who].recruitedEp = ep;
        }
      }

      else if (ev.type === "roundtable") {
        // One scoring event, however many re-votes there are.
        const absent = new Set(ev.absent || []);
        const voters = active().filter((n) => !absent.has(n));
        const rounds = [ev.votes || {}].concat(ev.revotes || []);
        const gotVotes = new Set();
        rounds.forEach((r) => voters.forEach((v) => { if (r[v]) gotVotes.add(r[v]); }));

        voters.forEach((p) => {
          const role = S[p].role;
          if (!gotVotes.has(p)) add(p, role === "Traitor" ? "zeroVoteT" : "zeroVoteF", ep);
          if (role === "Faithful") {
            const hit = rounds.map((r) => r[p]).find((t) => t && S[t] && S[t].role === "Traitor");
            if (hit) add(p, "traitorVote", ep, "voted for " + hit);
          }
        });

        const b = ev.banished;
        if (b && isActive(b)) {
          const bRole = S[b].role;
          active().filter((n) => n !== b).forEach((n) => {
            if (bRole === "Traitor" && S[n].role === "Faithful") add(n, "traitorBanished", ep, b + " banished");
            if (bRole === "Faithful" && S[n].role === "Traitor") add(n, "faithfulBanished", ep, b + " banished");
          });
          leave(b, "banished", ep);
        }
      }

      else if (ev.type === "exit") {
        if (isActive(ev.who)) leave(ev.who, "left", ep);
      }

      else if (ev.type === "final") {
        (ev.winners || []).filter(isActive).forEach((w) => {
          S[w].status = "winner"; S[w].exitEp = ep; S[w].roleAtExit = S[w].role;
          add(w, "winner", ep);
        });
      }
    });
    steps[(data.events || []).length] = { active: active(), roles: Object.fromEntries(names.map((n) => [n, S[n].role])) };

    // Placement: 1 point per position for leaving, 21 for winning. Anyone still
    // in is shown the minimum they're now guaranteed (provisional).
    const eliminated = names.filter((n) => OUT.includes(S[n].status)).length;
    names.forEach((n) => {
      const s = S[n];
      if (s.status === "winner") { s.placement = total; s.provisional = false; }
      else if (OUT.includes(s.status)) { s.placement = s.position; s.provisional = false; }
      else { s.placement = eliminated + 1; s.provisional = true; }
      if (!s.provisional) s.log.push({ ep: s.exitEp, cat: "placement", pts: s.placement,
        note: s.status === "winner" ? "Winner" : ordinal(s.position) + " to leave" });

      s.groups = { placement: s.placement, faithful: 0, traitor: 0, winner: 0 };
      Object.entries(s.cats).forEach(([cat, pts]) => { s.groups[CATS[cat].group] += pts; });
      s.bonus = s.groups.faithful + s.groups.traitor + s.groups.winner;
      s.total = s.placement + s.bonus;
    });

    return { contestants: S, names, steps, eliminated, total };
  }

  // Scoring history grouped by episode, for the contestant detail view.
  function history(s) {
    const byEp = new Map();
    s.log.slice().sort((a, b) => (a.ep || 0) - (b.ep || 0)).forEach((item) => {
      if (!byEp.has(item.ep)) byEp.set(item.ep, []);
      byEp.get(item.ep).push(item);
    });
    return [...byEp.entries()].map(([ep, items]) => ({
      ep, items, pts: items.reduce((t, x) => t + x.pts, 0),
    }));
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return { compute, history, CATS, GROUPS, ordinal };
})();
