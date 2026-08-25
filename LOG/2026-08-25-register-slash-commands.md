# 1cd6a89 — Found that nothing in the project registers the slash commands with Discord, and filed the script that does it as cleared work

This was found while sharpening [afk-wire-up]'s walkthrough, by checking what each
step would actually run rather than trusting the step's own description. The
Worker answers `/afk`, `/back`, `/mysign` and `/newsign` once Discord asks it, but
nothing ever tells Discord those commands exist — no registration script in `src/`
and no command for one in `package.json`. The failure mode is a bad one to meet
cold: the deploy succeeds, the bot joins the server, and typing `/` offers
nothing, which reads as a broken deploy rather than a missing step.

Registration is a one-off call carrying the bot token, which is this project's one
real secret. The script therefore reads the token from the environment at the
moment it runs and the user runs the script themselves; nothing about the token is
stored. Registering from inside the Worker on first request was refused — it would
mean keeping a standing copy of that secret in Cloudflare to save a step run once.

The command shapes were read off `src/index.js` rather than assumed: `afk` takes
one required string option named `time`, which is the name the handler reads, and
the other three take no options.

**Queue changes:** [register-slash-commands] filed and moved into Processed,
cleared to run, with a build block; [afk-wire-up] gained it as a blocker.
**Work processed:** kept — [register-slash-commands].
