# [HASH] — The bot and the sign pages built as one Cloudflare Worker, with the sign page converted from a manual form to a bot-driven display

The whole point of this item was to make the AFK sign one click away instead of
something opened and filled in by hand, and that is what the Worker does. It
carries three jobs in one deployable thing: it answers Discord's interaction
webhook, it holds who is away and until when, and it serves each person their own
sign page. Cloudflare Workers was chosen at planning over an always-on server
because one Worker covers all three on a free tier with nothing for anyone to
install, and that held up in the building — there was never a second moving part
to wire together.

Two decisions inside the build are worth carrying, because both are the kind that
look arbitrary from the outside and would be undone by a later session that
didn't know why.

The first is where the per-person state lives. The obvious shape hangs the state
off the Discord user id and makes the sign id a pointer to it. That was rejected:
the hot path here is not the bot, it is every open sign page asking every few
seconds whether its person is away, and the obvious shape makes that two reads
instead of one. The state was hung off the sign id instead, with the user key
holding only a pointer. Against the free tier's 100,000 reads a day that is
roughly four open signs versus roughly eight — which is the whole server either
way, so the cost of the choice is nil and the headroom is doubled. The same
reasoning shaped the timezone write: the page reports its timezone on every poll,
and the Worker writes it back only when it has actually changed, because writes
are capped at 1,000 a day and a page polling every fifteen seconds would otherwise
spend 5,760 of them rewriting a value that never moves.

The KV free-tier limits, which the item asked be recorded: 100,000 reads a day,
1,000 writes, 1,000 deletes, 1,000 list operations, and 1 GB stored. They reset at
00:00 UTC, and exceeding one makes further operations of that kind fail rather
than bill. One property found while reading them is worth having on the record:
KV reads are eventually consistent with a 60-second cache, so `/afk` can take up
to a minute to reach a sign page that is already open. Nobody has watched that
happen yet, and it may well be invisible in practice, but it is the first place to
look if the sign ever feels sluggish to respond.

The second decision is what happened to the sign page. It arrived as a page you
used yourself — a time input, a "Go AFK" button, a "change time" reset — and it
leaves as a page that decides nothing. It asks the Worker whether its own person
is away and draws what it is told; `/afk` and `/back` in Discord are now the only
things that change it. The green "I'm back!" state went with the form, because
SPEC is explicit that being late changes the numbers and not the look: past the
return time the counter simply turns around and climbs, in the same colours. The
photos, the twenty-minute crossfade and the photographer credit were not touched.

Signature verification is done with the standard `Ed25519` name in the Workers
Web Crypto API rather than the legacy `NODE-ED25519` variant or an npm package —
checked against Cloudflare's own documentation, which lists both and marks the
latter as legacy. That keeps the Worker dependency-free at runtime.

This item carried a red flag, cleared at the planning session that designed it:
a readable sign address would let anyone who guessed it check whether a named
person was at their desk. The build honours the design that cleared it — addresses
are 32 random hex characters, an unknown address is a plain 404 with no hint, the
page is served with caching and referrers suppressed so the address does not leak
through the Pexels image requests, and every reply carrying an address is private
to the person who asked. The command that throws an address away and issues a
fresh one is there for when one leaks anyway.

**Tick:** done, UNCONFIRMED: the item's acceptance is written against a deployed
Worker and a sign page open in a browser. The bot half was confirmed against a
stand-in for Cloudflare's storage, including the unsigned-request 401. What
nobody has watched is the page itself: the AFK screen over the photos, the
count-up flip, and the return to photos only. Filed as [sign-page-eyeball], which
runs after [afk-wire-up].

**What was actually run:** two suites, 43 checks, both passing. The clock parsing
was exercised on `3pm`, `3:30 pm`, `15:00`, bare hours, `noon`, `midnight`, the
12-hour edges, rubbish input, a roll-forward to tomorrow when the time has already
passed, a UK daylight-saving boundary, and Asia/Tokyo. The Worker's request
handler was driven end to end against a stub for Cloudflare's storage and a real
Ed25519 keypair: unsigned request 401, tampered signature 401, signed PING
answered, the address command private and carrying a 32-hex address, `/afk`
refused before a timezone is known and accepted after, the page served with its
own id injected and not cached, a guessed address 404, `/back` clearing the state,
and the rotate command killing the old address while carrying the timezone over.
The test scripts live in the session's scratchpad, outside the project, and were
not kept.

**Files touched:**
- package.json: created — Worker manifest, wrangler the only dependency
- wrangler.toml: created — Worker config, HTML text-module rule so the sign page
  stays one file, KV binding, Discord public key; two placeholders to fill at
  deploy
- src/index.js: created — the whole Worker, about 330 lines
- afk-sign_1.html: rewritten from a manual time form into a bot-driven sign;
  photos, crossfade and credit bar untouched

**Routed to Captures:** [sign-page-eyeball], [spec-address-sentences],
[ignore-build-dirs], [kv-read-staleness], [timezone-abbreviation]

**Advisory:** filed — forward-advisory

**Also in this chat:** two boundary calls came up after the build. Asked to skip
the account-creation item and carry on, the answer was that there was nothing to
carry on to — that item and the built one were the entire cleared region — and
that moving an item between sections is planning work rather than build work,
which is the one thing a build session deliberately does not do. The item was left
where it stands. Separately, this build found that SPEC now owes two sentences
(the address-rotation command, and the first `/afk` being refused until the sign
page has reported a timezone); per the rule that a build never writes product
truth, the sentences were filed as [spec-address-sentences] rather than written,
so SPEC lags by exactly those two until the next planning pass.

This entry and its index line were checked against the scrub checklist and the
credential scan, and against nothing more.
