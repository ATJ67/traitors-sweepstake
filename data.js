// ─────────────────────────────────────────────────────────────
//  SWEEPSTAKE DATA — edit this file to update the live page.
//  (Or use the "Manage" panel on the page, then "Export data.js"
//   and replace this file with the download.)
// ─────────────────────────────────────────────────────────────
//
//  status:   "in" | "banished" | "murdered"
//  episode:  episode number they left in (null while still in)
//  traitor:  true once revealed as a Traitor
//  colleague: who drew them in the sweepstake
//  photo:    optional image path, e.g. "images/maya-jama.jpg"

window.SWEEPSTAKE = {
  title: "The Celebrity Traitors",
  subtitle: "Office Sweepstake · Series 2",

  // Air times (UK). Thu & Fri 8pm on BBC One.
  // Episodes 1–2 confirmed; 3–10 assumed to follow the Thu/Fri pattern.
  // Clocks go back 25 Oct, hence the +00:00 on the last two.
  episodeLengthMins: 60,
  episodes: [
    "2026-10-01T20:00:00+01:00",
    "2026-10-02T20:00:00+01:00",
    "2026-10-08T20:00:00+01:00",
    "2026-10-09T20:00:00+01:00",
    "2026-10-15T20:00:00+01:00",
    "2026-10-16T20:00:00+01:00",
    "2026-10-22T20:00:00+01:00",
    "2026-10-23T20:00:00+01:00",
    "2026-10-29T20:00:00+00:00",
    "2026-10-30T20:00:00+00:00"
  ],

  colleagues: [],

  celebs: [
    { name: "Amol Rajan",          role: "Broadcaster",          colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Bella Ramsey",        role: "Actor",                colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Hannah Fry",          role: "Mathematician & broadcaster", colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "James Acaster",       role: "Comedian",             colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "James Blunt",         role: "Singer",               colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Jerry Hall",          role: "Model & actress",      colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Joanne McNally",      role: "Comedian",             colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Joe Lycett",          role: "Comedian",             colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Julie Hesmondhalgh",  role: "Actress",              colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "King Kenny",          role: "Content creator",      colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Leigh-Anne Pinnock",  role: "Singer",               colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Maya Jama",           role: "Presenter",            colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Michael Sheen",       role: "Actor",                colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Miranda Hart",        role: "Actress & comedian",   colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Myha'la",             role: "Actress",              colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Richard E. Grant",    role: "Actor",                colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Rob Beckett",         role: "Comedian",             colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Romesh Ranganathan",  role: "Comedian",             colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Ross Kemp",           role: "Actor & broadcaster",  colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Sebastian Croft",     role: "Actor",                colleague: "", status: "in", episode: null, traitor: false, photo: "" },
    { name: "Sharon Rooney",       role: "Actress",              colleague: "", status: "in", episode: null, traitor: false, photo: "" }
  ]
};
