# 1cd6a89 — Wrote the two sentences SPEC owed about throwing away a leaked sign address and the first `/afk`, then deleted the item that carried them

The [discord-bot] build had put two behaviours into the product that SPEC did not
describe, and filed them for planning rather than writing them itself. Both were
checked against the Worker's code before being written as product truth: the
command that issues a fresh address is `/newsign`, and the refusal of a first
`/afk` from someone who has never opened their sign page is real and carries a
nudge to open it. Writing product truth from a capture's account of the code,
without reading the code, is how a SPEC sentence becomes wrong quietly.

The address bullet gained the throw-it-away half and the timezone bullet gained
the first-`/afk` half, both in SPEC's "How it works" section. The item was then
deleted rather than kept, because its entire content was those two sentences —
once they are in SPEC there is nothing left to build.

Writing the second sentence exposed a defect in [afk-wire-up], recorded in that
item's own entry.

**Queue changes:** [spec-address-sentences] deleted from Unprocessed after its
content was relocated to SPEC.md.
**Work processed:** deleted — [spec-address-sentences].
