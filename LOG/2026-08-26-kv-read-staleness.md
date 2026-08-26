# [HASH] — [kv-read-staleness] merged into [sign-page-browser-check]: one item now carries both the measurement and the judgement it feeds

The item asked whether the sign's up-to-a-minute lag behind `/afk` matters. It
had already been deferred once, on 2026-08-25, for the right reason: what gets
built depends on two numbers nobody has, so no build can be described and the
keep-check cannot pass. Nothing had changed since, so setting it aside a second
time would have repeated a move that already failed to move anything.

What had changed is that [sign-page-browser-check] was amended in that same
session to record the two timings — how long the page takes to flip after `/afk`
and after `/back`. That made the two items two accounts of one thing, which is a
merge rather than a supersession: the host item was rewritten to carry the facts
in its own words rather than pointing at a file. Carried across were the cause
(Cloudflare's key-value storage serves reads up to sixty seconds stale), that
sixty seconds is a ceiling rather than the usual case, that the judgement is the
user's once the numbers exist, and the defeated alternative with its reason — a
shorter poll interval buys nothing, because the staleness is in the storage and
not in the polling, so a real fix means different storage or a push channel.

The cost was stated to the user before agreeing it: the question stops being its
own visible line and now lives or dies on the host item carrying it. That is why
it was written in rather than cited.

**Queue changes:** [sign-page-browser-check] gained a paragraph carrying the
staleness question and its dead end, and its Acceptance line reworded to stop
citing a retired slug; [kv-read-staleness] removed from Unprocessed.
**Work processed:** deleted after merge — [kv-read-staleness].
Advisory: not needed — see this session's chat entry.
