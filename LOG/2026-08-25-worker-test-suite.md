# [HASH] — Kept a test suite for the Worker, choosing Node's own runner over Cloudflare's Vitest plugin and accepting a file split as the price

Raised by the user asking for a re-scan of the chat to be processed rather than
filed. The [discord-bot] build had tested the Worker end to end against a stand-in
for Cloudflare's storage, but that happened in a chat and left nothing behind —
no test file, no test command — so the stand-in was thrown away and every later
change is verified by hand or not at all. It surfaced while writing
[timezone-abbreviation], whose build block had to say the project has no test file.

One obstacle was checked rather than assumed: `src/index.js` imports the sign page
as a text module, which is a Cloudflare build feature, so plain Node cannot load
the file. Node 24 is installed and ships a test runner, so nothing else was
missing.

Cloudflare's Vitest plugin was weighed and lost. It is the supported route, it
would honour that import, and it gives genuine storage rather than a fake — better
fidelity on every count. It lost on cost: a handful of dependencies added to a
project that currently has one, for logic that is almost all pure. It is worth
revisiting if the fake storage ever starts lying about something that matters.
The chosen route's own cost is named in the item rather than glossed: working code
gets restructured to make it loadable, which is a side effect of wanting tests
even though the resulting shape is better than one file doing the wiring and the
thinking together.

Ordering with [timezone-abbreviation] was written into both items, since the split
moves the function that item edits.

**Queue changes:** [worker-test-suite] filed and moved into Processed, cleared to
run, with a build block; [timezone-abbreviation] gained the reciprocal ordering
note.
**Work processed:** kept — [worker-test-suite].
