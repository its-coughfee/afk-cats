# 1cd6a89 — Settled the timezone-abbreviation item by testing `Intl` rather than reasoning about it, which answered the open question that had been holding it back

The item had been filed with a question left open: what to do for a person whose
zone has no well-known abbreviation. That question is about what a library
actually returns, not about what the product should do, so it was answered by
running the code rather than by discussion. No single locale knows every zone's
abbreviation — each knows its own region's. `en-GB` gives BST for London and CEST
for Paris, `en-US` gives EDT and PDT for New York and Los Angeles, and `en-AU`
gives AEST for Sydney and NZST for Auckland. Kolkata and Tokyo return their
offsets in every locale, because those abbreviations are not in the data at all.

That last result is what closed the open question: the fallback for a zone with
no familiar short name is exactly what the bot prints today, so the change cannot
make anyone's confirmation worse. The obvious fix — switching the whole formatter
to `en-GB` — was refused, because it fixes London while dropping New York from
`EDT` to `GMT-4` and changes the clock to 24-hour as a side effect. The zone name
has to be looked up separately from the time.

An ordering relationship with [worker-test-suite] was written into both items:
this one edits `formatInZone` where it sits today, and the test work splits the
file and would move it.

**Queue changes:** [timezone-abbreviation] moved from Unprocessed to Processed,
cleared to run, given a build block, and given a reciprocal ordering note.
**Work processed:** kept — [timezone-abbreviation].
