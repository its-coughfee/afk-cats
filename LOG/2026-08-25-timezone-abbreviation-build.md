# [HASH] — The bot now says "3:00 PM BST", with the zone name looked up separately from the clock

The confirmation was correct and unidiomatic: "AFK until 3:00 PM GMT+1" is not how
a British reader writes it. The planning session had already established why a
single locale can't fix that — each locale knows its own region's abbreviations
and nobody's covers every zone — and had refused switching the whole formatter to
`en-GB`, which fixes London while dropping New York to "GMT-4" and turning the
clock 24-hour as a side effect.

So the build separated the two questions. The time is still formatted for a US
English reader, unchanged. The zone name is a second lookup that tries `en-US`,
`en-GB` and `en-AU` in turn and takes the first that gives letters rather than a
`GMT±` string. Where none does — Kolkata, Tokyo — the offset form is returned,
which is exactly what the bot printed before, so no confirmation gets worse.

Checked against a July instant across the four zones the acceptance named: London
BST, New York EDT, Sydney AEST, Kolkata GMT+5:30. All four as specified.

The function moved later in the same run, when [worker-test-suite] split the file
— which is why the planning session ordered this item first.

**Files touched:** `src/index.js` (`formatInZone` rewritten, `zoneName` added).
**Routed to Captures:** none.
