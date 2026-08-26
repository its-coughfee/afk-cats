# ac4cbc2 — Worker split so Node can load it, 24 tests added, and a day-late `/afk` bug found and fixed

The project had tested the Worker end to end once, in a chat, and kept nothing:
no test file, no test command, and the fake storage built for that testing thrown
away. The one obstacle was named at planning and held: `src/index.js` imports the
sign page as a text module, which is a Cloudflare build feature that plain Node
cannot follow. So the logic moved to `src/worker.js`, which takes the page's text
as a parameter, and `src/index.js` shrank to the import plus the wiring and the
default export Cloudflare loads. Cloudflare's Vitest plugin was refused earlier on
dependency cost, with the revisit condition recorded there; nothing in the build
disturbed that.

The suite runs under Node's built-in runner against a Map wearing the same `get`,
`put` and `delete` the Worker calls, and covers everything the acceptance named:
time parsing including junk, the next-occurrence rule, the zone maths across a
DST boundary, the zone abbreviations, sign-id generation and validation, all four
commands driven through the handler, and the Ed25519 check proved by signing a
body with a generated key pair and corrupting one character to get a 401. Two
sign-page routes were covered as well, since the fake storage made them nearly
free.

The DST test failed, and it was the code that was wrong, not the test. When
today's time has already gone, `nextOccurrence` worked out "tomorrow" by adding
24 hours to the current instant and reading the date off the result. On the night
the clocks go forward, 24 hours later is already past midnight of the day after —
so `/afk 9am` typed late on the evening before a spring-forward set the sign for
the wrong day. Fixing it meant taking tomorrow from today's calendar date plus
one instead.

That fix was scope this item did not describe, so it went to the user, who left
the call to Claude. It was taken into this item rather than filed: one function in
a file already in scope, and the test proving it was being written in the same
breath. Filing it would have left a known wrong answer in shipped code with its
own test sitting next to it.

**Tick: done, confirmed** — `npm test` runs 24 tests, all passing. What is *not*
confirmed is the wrapper: nothing has built `src/index.js` since the split,
because that needs a real `wrangler` build, and that check is filed as
[first-deploy-checks].

**Files touched:** `src/worker.js` (created), `src/index.js` (reduced to the
wiring), `test/worker.test.mjs` (created), `package.json` (a `test` script).
**Routed to Captures:** [first-deploy-checks].
