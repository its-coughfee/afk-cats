# [HASH] — Registration script written for the four slash commands; only its failure path has been run

Nothing in the project told Discord that `/afk`, `/back`, `/mysign` and `/newsign`
exist, so a successful deploy would have produced a bot that offers nothing when
you type `/`. The script closes that gap: one PUT to Discord's global
application-commands endpoint carrying the four definitions, run by hand via
`npm run register`.

The token handling follows the reasoning already settled at planning: the bot
token is the one real secret here, so the script reads it from the environment at
the moment it runs and stores nothing. Registering from inside the Worker was
refused earlier for the same reason — it would park a standing copy of that token
in Cloudflare to save a step run once.

The tick is **done, UNCONFIRMED**. The failure path was run twice and behaves as
specified, naming whichever variable is missing and exiting rather than throwing a
stack trace. The success path needs a real Discord application id and token, which
do not exist until [afk-accounts] is done, so nobody has yet seen Discord accept
the commands. That check is filed as [first-deploy-checks] rather than left here.

**Files touched:** `scripts/register-commands.mjs` (created), `package.json` (a
`register` script).
**Routed to Captures:** [first-deploy-checks].
