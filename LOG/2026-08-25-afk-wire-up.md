# [HASH] — Sharpened the deploy walkthrough as the item itself asked, correcting two instructions that were wrong against the Worker's own configuration

The item carried an instruction to itself: the walkthrough is rough, sharpen it at
the planning run after [discord-bot] ships. That build has shipped, so this was
that run. Every step was checked against `wrangler.toml` and `src/index.js` rather
than rewritten from the rough version's own account of itself, which is what
turned up the errors.

Two instructions were wrong. The rough walkthrough said to store the Discord
public key and the bot token as Worker secrets; in fact the public key is an
ordinary variable in `wrangler.toml`, and the bot token is not needed by the
Worker at all. It also never mentioned the KV namespace, which does not exist
until someone creates it and which the Worker cannot start without. The
`wrangler kv namespace create` spelling was confirmed against Cloudflare's docs,
because the colon form is the pre-3.60 spelling and is what an older write-up
would suggest — a wrong command is exactly what strands a non-coder at a terminal.

A separate defect was found earlier in the session, while writing SPEC's sentence
about the first `/afk`. The walkthrough had the user type `/afk` and expect the
sign to appear, but that first `/afk` is refused until the sign page has been
opened once, because the page is what reports the timezone. Ordered that way round
the user reads a correct refusal as a broken deploy. Opening the sign page is now
its own step before it, with the reason written in so it is not reordered back.

The blocker line was also corrected: [discord-bot] was dropped from it, LOG
recording it built and its Worker being the thing this item deploys, and
[register-slash-commands] was added, since one of the steps cannot run until that
script exists.

**Queue changes:** [afk-wire-up] rewritten with a ten-step walkthrough, its
`Blocked by:` line corrected, and the reasons for both orderings written into it.
**Work processed:** amended — [afk-wire-up]; it stays held below the line.
