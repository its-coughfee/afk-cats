# ad30b96 — [bot-token-exposed-in-screenshot] done: the exposed bot token reset the same session it leaked, closing the red flag by fixing it rather than accepting it

Filed and walked in the same session, which the method allows when walking an item
now is what clears its red flag.

The leak: [afk-wire-up]'s step 6 was written so the bot token never reached the
transcript — you paste it into your own terminal and report only that it worked.
You reported by screenshotting the terminal, which echoes the pasted line, so most
of the token landed in the chat as an image. Nobody made a mistake; screenshotting
is the natural way to report what a terminal shows.

Why it mattered enough to interrupt the walkthrough and say so: a bot token is the
bot's password. Anyone holding it can make the bot say and do anything it has
permission to do in the server, without touching your Discord account, and it does
not expire on its own.

The fix was deliberately not done mid-walkthrough, because step 6 needed the live
token to run. Once the walkthrough finished you reset the token through the
developer portal and reported it done. Discord invalidates the old token at the
moment of reset, so the exposed one is dead.

The reset cost nothing, which is why it was the obvious call rather than a
judgement: nothing in this project stores the token, the Worker never sees it, and
the slash commands were already registered by the time it happened.

**Red flag: cleared** — designed out by fixing it, not consciously accepted.

**Outcome: done** — the user said they did it, and the reasoning for trusting that
here is that a reset has no partial state: either the portal issued a new token or
it did not.

The general lesson, which belongs to the method rather than to this project, is
filed as [screenshot-defeats-secret-keeping]. The full walkthrough record is in
this session's [afk-wire-up] entry.
