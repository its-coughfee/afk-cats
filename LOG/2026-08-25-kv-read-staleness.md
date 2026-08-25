# 1cd6a89 — Deferred the storage-lag decision rather than keeping it, and wired the measurement that would settle it into the browser check

The item asks whether the sign's up-to-a-minute lag behind `/afk` matters. It
could not be kept, and the reason is worth stating precisely: what gets built
depends on an answer nobody has yet, so the build cannot be described. An item
whose build list is the output of a decision still to be made fails that test
however well written it is, and this one is well written — its reasoning about the
fixes is already sound, including that a shorter poll interval buys nothing
because the staleness is in the storage rather than the poll.

Deferring it alone would have returned it next session in the same state. So the
missing input was arranged for instead: [sign-page-browser-check] now records how
many seconds the page actually takes to flip after `/afk` and after `/back`. Sixty
seconds is a ceiling rather than the usual case, so two real numbers replace a
guess, and the judgement of whether the lag matters stays the user's.

**Queue changes:** [kv-read-staleness] skipped to the bottom of Unprocessed with
its design progress and what settles it written into its prose;
[sign-page-browser-check] amended to take the measurement.
**Work processed:** deferred — [kv-read-staleness].
