// ─────────────────────────────────────────────────────────────
//  SWEEPSTAKE DATA — edit this file to update the live page.
//  (Or use the "Manage" panel on the page, then "Export data.js"
//   and replace this file with the download.)
//
//  Every point is calculated from `events` by scoring.js — never
//  enter totals by hand. Event types, in the order they happened:
//
//   { ep, type: "murder",     victim, shielded }       victim: null = no murder;
//                                                      shielded: Faithful whose Shield stopped it
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

  // From "The Draw" slide (Syneos sweepstake deck). Lauren has one chip
  // worth ×2, so Sebastian Croft's score counts double for her.
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
    { name: "Sebastian Croft",     role: "Actor",                       colleague: "Lauren", photo: "", multiplier: 2 },
    { name: "Sharon Rooney",       role: "Actress",                     colleague: "Anu",    photo: "" }
  ],

  originalTraitors: ["Maya Jama", "Richard E. Grant"],

  events: [
    // Ep 1 ended on a cliffhanger: no murder or Round Table shown yet.
    // Ep 2: the Traitors murdered Amol Rajan and recruited James Acaster.
    { ep: 2, type: "murder", victim: "Amol Rajan" },
    { ep: 2, type: "recruit", who: "James Acaster", accepted: true },

    // Round Table held at the end of Ep 2; result shown in Ep 3.
    // Richard banished 16–2–1–1 (votes from live blogs; Joe Lycett and Julie
    // unreported but implied by the 16-vote total).
    { ep: 3, type: "roundtable", absent: [], revotes: [], banished: "Richard E. Grant", votes: {
      "Bella Ramsey": "Richard E. Grant", "Hannah Fry": "Richard E. Grant", "James Acaster": "Richard E. Grant",
      "James Blunt": "Hannah Fry", "Jerry Hall": "Leigh-Anne Pinnock", "Joanne McNally": "Leigh-Anne Pinnock",
      "Joe Lycett": "Richard E. Grant", "Julie Hesmondhalgh": "Richard E. Grant", "King Kenny": "Richard E. Grant",
      "Leigh-Anne Pinnock": "Richard E. Grant", "Maya Jama": "Richard E. Grant", "Michael Sheen": "Richard E. Grant",
      "Miranda Hart": "Richard E. Grant", "Myha'la": "Richard E. Grant", "Richard E. Grant": "Bella Ramsey",
      "Rob Beckett": "Richard E. Grant", "Romesh Ranganathan": "Richard E. Grant", "Ross Kemp": "Richard E. Grant",
      "Sebastian Croft": "Richard E. Grant", "Sharon Rooney": "Richard E. Grant"
    } },

    // Ep 3: instead of murdering, the Traitors recruited Hannah Fry.
    { ep: 3, type: "murder", victim: null },
    { ep: 3, type: "recruit", who: "Hannah Fry", accepted: true },

    // Myha'la banished 13–4–1–1. One "James" voted Michael (unclear which) —
    // doesn't affect scoring either way; Julie and the other James implied
    // by the 13-vote total.
    { ep: 3, type: "roundtable", absent: [], revotes: [], banished: "Myha'la", votes: {
      "Bella Ramsey": "Myha'la", "Hannah Fry": "Myha'la", "James Acaster": "Myha'la",
      "James Blunt": "Michael Sheen", "Jerry Hall": "Myha'la", "Joanne McNally": "Jerry Hall",
      "Joe Lycett": "Myha'la", "Julie Hesmondhalgh": "Myha'la", "King Kenny": "Jerry Hall",
      "Leigh-Anne Pinnock": "Jerry Hall", "Maya Jama": "Jerry Hall", "Michael Sheen": "Myha'la",
      "Miranda Hart": "Myha'la", "Myha'la": "Julie Hesmondhalgh", "Rob Beckett": "Myha'la",
      "Romesh Ranganathan": "Myha'la", "Ross Kemp": "Myha'la", "Sebastian Croft": "Myha'la",
      "Sharon Rooney": "Myha'la"
    } }
    // Ep 3 ended with the Traitors choosing between James Blunt, Bella and
    // Sebastian to murder — result in Ep 4.
  ]
};
