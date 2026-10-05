// ─────────────────────────────────────────────────────────────
//  SWEEPSTAKE DATA — edit this file to update the live page.
//  (Or use the "Manage" panel on the page, then "Export data.js"
//   and replace this file with the download.)
//
//  Every point is calculated from `events` by scoring.js — never
//  enter totals by hand. Event types, in the order they happened:
//
//   { ep, type: "murder",     victim }                 victim: null = no murder
//   { ep, type: "recruit",    who, accepted }          accepted: false = declined
//   { ep, type: "roundtable", votes: { voter: target }, revotes: [{ voter: target }],
//                             absent: [names], banished }
//   { ep, type: "exit",       who }                    left the game any other way
//   { ep, type: "final",      winners: [names] }
// ─────────────────────────────────────────────────────────────

window.SWEEPSTAKE = {
  title: "The Celebrity Traitors",
  subtitle: "Office Sweepstake · Series 2",

  // Air times (UK). Thu & Fri 8pm on BBC One.
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

  // From "The Draw" slide (Syneos sweepstake deck)
  colleagues: ["Alex", "Ali", "Anu", "Claire", "Hattie", "Joe", "Kate", "Lauren", "Mario", "Mollie", "Reagan"],

  celebs: [
    { name: "Amol Rajan",          role: "Broadcaster",                 colleague: "Kate",   photo: "" },
    { name: "Bella Ramsey",        role: "Actor",                       colleague: "Ali",    photo: "" },
    { name: "Hannah Fry",          role: "Mathematician & broadcaster", colleague: "Claire", photo: "" },
    { name: "James Acaster",       role: "Comedian",                    colleague: "Alex",   photo: "" },
    { name: "James Blunt",         role: "Singer",                      colleague: "Hattie", photo: "" },
    { name: "Jerry Hall",          role: "Model & actress",             colleague: "Claire", photo: "" },
    { name: "Joanne McNally",      role: "Comedian",                    colleague: "Reagan", photo: "" },
    { name: "Joe Lycett",          role: "Comedian",                    colleague: "Mario",  photo: "" },
    { name: "Julie Hesmondhalgh",  role: "Actress",                     colleague: "Joe",    photo: "" },
    { name: "King Kenny",          role: "Content creator",             colleague: "Reagan", photo: "" },
    { name: "Leigh-Anne Pinnock",  role: "Singer",                      colleague: "Kate",   photo: "" },
    { name: "Maya Jama",           role: "Presenter",                   colleague: "Anu",    photo: "" },
    { name: "Michael Sheen",       role: "Actor",                       colleague: "Hattie", photo: "" },
    { name: "Miranda Hart",        role: "Actress & comedian",          colleague: "Mario",  photo: "" },
    { name: "Myha'la",             role: "Actress",                     colleague: "Mollie", photo: "" },
    { name: "Richard E. Grant",    role: "Actor",                       colleague: "Joe",    photo: "" },
    { name: "Rob Beckett",         role: "Comedian",                    colleague: "Ali",    photo: "" },
    { name: "Romesh Ranganathan",  role: "Comedian",                    colleague: "Mollie", photo: "" },
    { name: "Ross Kemp",           role: "Actor & broadcaster",         colleague: "Alex",   photo: "" },
    { name: "Sebastian Croft",     role: "Actor",                       colleague: "Lauren", photo: "" },
    { name: "Sharon Rooney",       role: "Actress",                     colleague: "Anu",    photo: "" }
  ],

  originalTraitors: ["Maya Jama", "Richard E. Grant"],

  events: [
    // Ep 1 ended on a cliffhanger: no murder or Round Table shown yet.
    // Ep 2: the Traitors murdered Amol Rajan and recruited James Acaster.
    { ep: 2, type: "murder", victim: "Amol Rajan" },
    { ep: 2, type: "recruit", who: "James Acaster", accepted: true }
  ]
};
