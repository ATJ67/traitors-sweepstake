// Sweepstake data — kept up to date by tools/sync.mjs (Joe's board first, then the web).
// Points are calculated from `events` by scoring.js — never enter totals by hand.
// Event format: see README.md.

window.SWEEPSTAKE = {
  "title": "The Celebrity Traitors",
  "subtitle": "Office Sweepstake · Series 2",
  "episodeLengthMins": 60,
  "episodes": [
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
  "colleagues": [
    "Alex",
    "Ali",
    "Anu",
    "Claire",
    "Hattie",
    "Joe",
    "Kate",
    "Lauren",
    "Mario",
    "Mollie",
    "Reagan"
  ],
  "celebs": [
    {
      "name": "Amol Rajan",
      "role": "Broadcaster",
      "colleague": "Kate",
      "photo": ""
    },
    {
      "name": "Bella Ramsey",
      "role": "Actor",
      "colleague": "Ali",
      "photo": ""
    },
    {
      "name": "Hannah Fry",
      "role": "Mathematician & broadcaster",
      "colleague": "Claire",
      "photo": ""
    },
    {
      "name": "James Acaster",
      "role": "Comedian",
      "colleague": "Alex",
      "photo": ""
    },
    {
      "name": "James Blunt",
      "role": "Singer",
      "colleague": "Hattie",
      "photo": ""
    },
    {
      "name": "Jerry Hall",
      "role": "Model & actress",
      "colleague": "Claire",
      "photo": ""
    },
    {
      "name": "Joanne McNally",
      "role": "Comedian",
      "colleague": "Reagan",
      "photo": ""
    },
    {
      "name": "Joe Lycett",
      "role": "Comedian",
      "colleague": "Mario",
      "photo": ""
    },
    {
      "name": "Julie Hesmondhalgh",
      "role": "Actress",
      "colleague": "Joe",
      "photo": ""
    },
    {
      "name": "King Kenny",
      "role": "Content creator",
      "colleague": "Reagan",
      "photo": ""
    },
    {
      "name": "Leigh-Anne Pinnock",
      "role": "Singer",
      "colleague": "Kate",
      "photo": ""
    },
    {
      "name": "Maya Jama",
      "role": "Presenter",
      "colleague": "Anu",
      "photo": ""
    },
    {
      "name": "Michael Sheen",
      "role": "Actor",
      "colleague": "Hattie",
      "photo": ""
    },
    {
      "name": "Miranda Hart",
      "role": "Actress & comedian",
      "colleague": "Mario",
      "photo": ""
    },
    {
      "name": "Myha'la",
      "role": "Actress",
      "colleague": "Mollie",
      "photo": ""
    },
    {
      "name": "Richard E. Grant",
      "role": "Actor",
      "colleague": "Joe",
      "photo": ""
    },
    {
      "name": "Rob Beckett",
      "role": "Comedian",
      "colleague": "Ali",
      "photo": ""
    },
    {
      "name": "Romesh Ranganathan",
      "role": "Comedian",
      "colleague": "Mollie",
      "photo": ""
    },
    {
      "name": "Ross Kemp",
      "role": "Actor & broadcaster",
      "colleague": "Alex",
      "photo": ""
    },
    {
      "name": "Sebastian Croft",
      "role": "Actor",
      "colleague": "Lauren",
      "photo": "",
      "multiplier": 2
    },
    {
      "name": "Sharon Rooney",
      "role": "Actress",
      "colleague": "Anu",
      "photo": ""
    }
  ],
  "originalTraitors": [
    "Maya Jama",
    "Richard E. Grant"
  ],
  "events": [
    {
      "ep": 2,
      "type": "murder",
      "victim": "Amol Rajan"
    },
    {
      "ep": 2,
      "type": "recruit",
      "who": "James Acaster",
      "accepted": true
    },
    {
      "ep": 3,
      "type": "roundtable",
      "votes": {
        "Bella Ramsey": "Richard E. Grant",
        "Hannah Fry": "Richard E. Grant",
        "James Acaster": "Richard E. Grant",
        "James Blunt": "Hannah Fry",
        "Jerry Hall": "Leigh-Anne Pinnock",
        "Joanne McNally": "Leigh-Anne Pinnock",
        "Joe Lycett": "Richard E. Grant",
        "Julie Hesmondhalgh": "Richard E. Grant",
        "King Kenny": "Richard E. Grant",
        "Leigh-Anne Pinnock": "Richard E. Grant",
        "Maya Jama": "Richard E. Grant",
        "Michael Sheen": "Richard E. Grant",
        "Miranda Hart": "Richard E. Grant",
        "Rob Beckett": "Richard E. Grant",
        "Romesh Ranganathan": "Richard E. Grant",
        "Ross Kemp": "Richard E. Grant",
        "Sebastian Croft": "Richard E. Grant",
        "Sharon Rooney": "Richard E. Grant",
        "Myha'la": "Richard E. Grant",
        "Richard E. Grant": "Bella Ramsey"
      },
      "revotes": [],
      "absent": [],
      "banished": "Richard E. Grant",
      "votingComplete": true
    },
    {
      "ep": 3,
      "type": "recruit",
      "who": "Hannah Fry",
      "accepted": true
    },
    {
      "ep": 3,
      "type": "roundtable",
      "votes": {
        "Bella Ramsey": "Myha'la",
        "Hannah Fry": "Myha'la",
        "James Acaster": "Michael Sheen",
        "James Blunt": "Myha'la",
        "Jerry Hall": "Myha'la",
        "Joanne McNally": "Jerry Hall",
        "Joe Lycett": "Myha'la",
        "Julie Hesmondhalgh": "Myha'la",
        "King Kenny": "Jerry Hall",
        "Leigh-Anne Pinnock": "Jerry Hall",
        "Maya Jama": "Jerry Hall",
        "Michael Sheen": "Myha'la",
        "Miranda Hart": "Myha'la",
        "Rob Beckett": "Myha'la",
        "Romesh Ranganathan": "Myha'la",
        "Ross Kemp": "Myha'la",
        "Sebastian Croft": "Myha'la",
        "Sharon Rooney": "Myha'la",
        "Myha'la": "Julie Hesmondhalgh"
      },
      "revotes": [],
      "absent": [],
      "banished": "Myha'la",
      "votingComplete": true
    },
    {
      "ep": 4,
      "type": "murder",
      "victim": "Bella Ramsey"
    },
    {
      "ep": 4,
      "type": "roundtable",
      "votes": {
        "Hannah Fry": "Jerry Hall",
        "James Acaster": "Julie Hesmondhalgh",
        "James Blunt": "Julie Hesmondhalgh",
        "Jerry Hall": "Hannah Fry",
        "Joanne McNally": "Julie Hesmondhalgh",
        "Joe Lycett": "Hannah Fry",
        "King Kenny": "Hannah Fry",
        "Leigh-Anne Pinnock": "Hannah Fry",
        "Maya Jama": "Julie Hesmondhalgh",
        "Michael Sheen": "Julie Hesmondhalgh",
        "Miranda Hart": "Julie Hesmondhalgh",
        "Rob Beckett": "Julie Hesmondhalgh",
        "Romesh Ranganathan": "Hannah Fry",
        "Ross Kemp": "Julie Hesmondhalgh",
        "Sebastian Croft": "Hannah Fry",
        "Sharon Rooney": "Julie Hesmondhalgh",
        "Julie Hesmondhalgh": "James Blunt"
      },
      "revotes": [],
      "absent": [],
      "banished": "Julie Hesmondhalgh",
      "votingComplete": true
    },
    {
      "ep": 5,
      "type": "murder",
      "victim": "Rob Beckett"
    },
    {
      "ep": 5,
      "type": "roundtable",
      "votes": {
        "James Acaster": "Hannah Fry",
        "James Blunt": "Hannah Fry",
        "Jerry Hall": "Hannah Fry",
        "Joanne McNally": "Sebastian Croft",
        "Joe Lycett": "Hannah Fry",
        "King Kenny": "Hannah Fry",
        "Leigh-Anne Pinnock": "Hannah Fry",
        "Maya Jama": "Hannah Fry",
        "Michael Sheen": "Hannah Fry",
        "Miranda Hart": "Hannah Fry",
        "Romesh Ranganathan": "James Blunt",
        "Ross Kemp": "Hannah Fry",
        "Sebastian Croft": "Hannah Fry",
        "Sharon Rooney": "Hannah Fry",
        "Hannah Fry": "Jerry Hall"
      },
      "revotes": [],
      "absent": [],
      "banished": "Hannah Fry",
      "votingComplete": true
    },
    {
      "ep": 5,
      "type": "recruit",
      "who": "King Kenny",
      "accepted": true
    },
    {
      "ep": 6,
      "type": "roundtable",
      "votes": {
        "James Acaster": "Joanne McNally",
        "James Blunt": "Joe Lycett",
        "Jerry Hall": "Joe Lycett",
        "Joanne McNally": "Joe Lycett",
        "King Kenny": "Joe Lycett",
        "Leigh-Anne Pinnock": "Joe Lycett",
        "Maya Jama": "Joe Lycett",
        "Michael Sheen": "Joe Lycett",
        "Miranda Hart": "Ross Kemp",
        "Romesh Ranganathan": "Joe Lycett",
        "Ross Kemp": "Joe Lycett",
        "Sebastian Croft": "Joe Lycett",
        "Sharon Rooney": "Joe Lycett",
        "Joe Lycett": "James Blunt"
      },
      "revotes": [],
      "absent": [],
      "banished": "Joe Lycett",
      "votingComplete": true
    },
    {
      "ep": 7,
      "type": "murder",
      "victim": "Ross Kemp"
    },
    {
      "ep": 7,
      "type": "roundtable",
      "votes": {
        "James Acaster": "Jerry Hall",
        "James Blunt": "Jerry Hall",
        "Joanne McNally": "Jerry Hall",
        "King Kenny": "Sebastian Croft",
        "Leigh-Anne Pinnock": "Jerry Hall",
        "Maya Jama": "Jerry Hall",
        "Michael Sheen": "Jerry Hall",
        "Miranda Hart": "Jerry Hall",
        "Romesh Ranganathan": "Jerry Hall",
        "Sebastian Croft": "Jerry Hall",
        "Sharon Rooney": "Leigh-Anne Pinnock",
        "Jerry Hall": "Joanne McNally"
      },
      "revotes": [],
      "absent": [],
      "banished": "Jerry Hall",
      "votingComplete": true
    }
  ],
  "syncStatus": {
    "latestEpisodeComplete": 7,
    "source": "Joe's board",
    "at": "2026-10-23T16:36:02.592Z"
  }
};
