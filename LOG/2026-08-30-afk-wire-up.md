# 69e18ab — [afk-wire-up] done: the Worker deployed, the commands registered and Discord connected, with the bot answering `/afk` in the server — and six things filed that only running it for real could find

A `[user]` item, walked live. Written as it happened; the walkthrough's ten steps
are in QUEUE.md under the item's slug.

State before starting, read off the project rather than assumed: `node_modules`
was absent, so step 1 had never run, and no LOG record showed any later step
performed either. Started at step 1.

## Steps

**Step 1 — `npm install`. Done by Claude, not handed over.** The light capability
check at hand-off found this step needs nothing of the user's, so the run performed
it. It finished with no error. It did print a warning that two packages, `esbuild`
and `workerd`, have install scripts npm has not yet been allowed to run — a gate
newer npm applies by default. `npx wrangler --version` then answered 4.127.1, so
the tooling works as it stands and the warning was left alone rather than approved
pre-emptively.

**Walkthrough gap found at step 2, and corrected live.** The item's preamble says
only "This step needs a terminal, opened separately from any app, sitting in the
project folder" — it never says how to open one or how to get it into the folder.
The user said plainly that he does not know the terminal and that pasting the step
2 command as written would have run it in the wrong place. The run supplied the
missing move: open PowerShell from the Start menu, then
`cd "<the project folder>"`, with the changed prompt as the thing to look for. He
reported the prompt ending in `AFK-cats>`, so the terminal is in the right place.
This is worth carrying back into the item's own wording — see the capture filed
under [walkthrough-assumes-terminal-knowledge].

**Step 2 — `npx wrangler login`. Done, on the third attempt.** Three things the
walkthrough did not predict, all recoverable and all corrected live:

- The first paste ran from the home folder because the `cd` line arrived after the
  command, so npx offered to fetch wrangler afresh. Declined with `n`; the `cd`
  then took effect and the prompt read `AFK-cats>`.
- The consent screen's button says **Authorize**, not "Allow", and no GitHub
  screen appeared — the user was already signed in to Cloudflare, so their own
  consent screen came up directly. Step 2's note about expecting a GitHub screen
  is therefore right only for a session that is not already signed in.
- The second attempt timed out: Wrangler's local callback server gives you a short
  window, and the pause while the user checked back mid-step exceeded it. The
  browser showed `localhost refused to connect` and the terminal reported
  "Timed out waiting for authorization code". Re-running and authorising promptly
  succeeded — "Successfully logged in."

The timeout is worth writing into the step, since a walkthrough driven one step at
a time naturally pauses exactly where this step cannot afford one.

**Steps 3 and 4 — done by Claude with the user's approval, not handed over.** The
capability check found both within reach now that the login is stored on the
machine, and copying a 32-character random id between two windows by hand is
exactly the kind of task worth not handing over. `wrangler.toml` was outside the
run's allowed file list, so the scope addition was offered in the same message and
approved before anything was edited.

`npx wrangler kv namespace create AFK_KV` succeeded and returned a namespace id,
which went into `wrangler.toml` line 15. The Discord public key for line 20 was not
recorded anywhere in the project — the [afk-accounts] session kept the credentials
with the user by design — so the user supplied it. It is public by nature, which is
why it lives in the file rather than in a secret.

**Step 5 — `npx wrangler deploy`. Run by Claude with the user's approval; the
Worker is live.** The deploy is outward-facing, so it was put to the user before
being run rather than folded in with steps 3 and 4. The reason for running it here
rather than handing it over was the check the step itself names: this was the first
build of `src/index.js` since [worker-test-suite] split it into a thin entry file
plus `src/worker.js`, and the thing to watch for was a red error naming
`afk-sign_1.html` or the import.

**That check passes.** No error of any kind appeared, the upload came to 23.53 KiB,
and both bindings were reported present — the KV namespace and the public key. So
the bundled-page import survived the entry-file split.

The Worker is at `https://afk-cats.<your-account>.workers.dev`, and the deployment
reports version 418bedb5-ed80-4610-b012-bd10475ff79b.

Two further checks were run beyond what the step asks, because they are free once
the URL exists: the root path answers 404, which is right — sign pages live at
random addresses and nothing is published at the root — and a bare POST to
`/interactions` answers 401, which is also right, since an unsigned request must be
rejected. So the Worker is genuinely answering rather than merely deployed.

One warning did appear, unrelated to the split: the `[[rules]]` Text rule for
`**/*.html` has no `fallthrough` setting, so it silently shadows Wrangler's default
Text rule covering `.txt`, `.html` and `.sql`. Nothing here needs the default rule,
so the deploy is correct as it stands — but the warning will recur on every deploy
until the setting is written. Filed as [wrangler-text-rule-fallthrough].

**Step 6 — the slash commands are registered, and this settles the circular
blocker.** This was the first run of `scripts/register-commands.mjs` with real
credentials; every previous run had taken the early-exit path where the
credentials are missing. It printed all four commands back — `/afk`, `/back`,
`/mysign`, `/newsign` — which is exactly what the step names as success. So the
script that [afk-wire-up] was once held against is now confirmed working, by the
step that was the only thing capable of confirming it. The reasoning recorded in
the item for dropping that hold holds up.

Two things went wrong around the step, both worth carrying forward.

**The command as the project documents it does not work here.** The script's own
comment shows `DISCORD_APPLICATION_ID=... DISCORD_TOKEN=... npm run register`,
which is bash. This machine runs PowerShell, where that form is not valid. The
step was driven in the PowerShell form instead — each variable set on its own line
with `$env:NAME = "value"`, then `npm run register`. Filed as
[register-script-bash-syntax].

**The bot token reached the transcript, and the step was written to prevent
exactly that.** The design has the user paste the token into their own terminal
and report only that it worked. The user reported by screenshotting the terminal,
which echoes the whole line, so most of the token is now in the chat as an image.
It was surfaced immediately, in plain terms — a bot token is the bot's password,
it does not expire on its own, and anyone holding it can drive the bot in the
server. Filed as [bot-token-exposed-in-screenshot], carrying an uncleared red
flag and a walkthrough to reset the token once this item is finished; the reset
was deliberately not done mid-walkthrough because step 6 needed the live token.
The user was also asked to type terminal output rather than screenshot it for the
rest of the drive.

The general lesson, which is the method's rather than this project's: a step that
tells the user to keep something out of the transcript should also say not to
screenshot the terminal while it is on screen, because screenshotting is the
natural way to report a terminal step and it defeats the precaution silently.

Two further points of friction, neither a defect: the user did not know what the
token was or where it had been saved, so a fresh one was issued through the
portal's Reset Token button — safe here because nothing had ever used the old one.
And the step as written asked him to substitute values into a command, which did
not land; it was re-driven by taking the public Application ID into the chat,
composing the line for him with the number already in it, and having him build only
the secret line himself.

**Step 7 — the Interactions Endpoint URL saved without error.** That save is a real
check rather than a form submission: Discord sends a test request to the URL at the
moment you save it and verifies the signature. So the public key written at step 4
is correct and the Worker is answering Discord properly.

**Step 8 — the bot is in the server, established by a different check than the one
the step names.** The step says to look for the bot in the member list; the user
could not find it there, but did find it by search. A member list is not a reliable
observable — it can be long and bots sit in their own section — so the drive
switched to a decisive one: typing `/` in a channel and seeing whether the commands
appear. All four did. Worth writing into the step, since the member list will fail
the same way for anyone else.

**Steps 9 and 10 — the sign works end to end.** `/mysign` returned a private
address, the page opened showing cat photos, and `/afk` was accepted with "AFK
until 3:00 PM AEST. The sign is up."

The page appeared not to change, which looked like a fault and was not one. The
Worker's own state endpoint was queried directly and reported `afk:true` with the
right return time, so the bot and the storage were both correct; the page polls
every 15 seconds and the user had looked inside that window. On looking again the
sign showed **AFK**, "back at 03:00 PM GMT+10", and a countdown running at 2h 02m
54s. The item's observable — the bot present and `/afk` returning a reply rather
than "application did not respond" — is met.

One cosmetic mismatch was noticed and filed rather than fixed: the bot says AEST
and the sign says GMT+10, for the same moment. Filed as
[timezone-label-differs-between-bot-and-sign].

**The item is complete.** Ten of ten steps done this session, every one witnessed.

## What this run turned up

Beyond the item itself, five things were filed, and one of them matters more than
the rest.

- [sign-cannot-show-over-focused-window] — the user streams a focused window rather
  than the whole screen, so a sign living in its own browser tab is invisible for
  exactly as long as it would be worth showing. SPEC's sharing sentence assumes the
  tab is shared; that assumption does not hold for the person it was built for. A
  SPEC conversation before it is a build.
- [bot-token-exposed-in-screenshot] and [sign-address-exposed-in-screenshot] — two
  red flags of the same shape. Both steps were designed to keep a secret out of the
  transcript, and both were defeated by the user reporting the step with a
  screenshot of the window that had the secret on it. Neither is a mistake anyone
  made; screenshotting is the natural way to report a terminal or browser step.
- [register-script-bash-syntax] and [wrangler-text-rule-fallthrough] — small,
  real, and found only by running the thing for the first time.
- [walkthrough-assumes-terminal-knowledge] — filed at step 2, when the user said
  plainly that he does not know the terminal.

## The two red flags, walked the same session they were filed

Both were filed as `[user]` items in Unprocessed carrying an uncleared red flag,
and both were then walked immediately with the user present rather than left for a
later session — which is what the method allows when walking an item now is what
clears the flag. Neither item's queue entry was edited here; the close settles
those.

**[bot-token-exposed-in-screenshot] — done.** The user reset the token through the
developer portal and reported it complete. The exposed token is dead from that
moment; Discord invalidates the old one on reset. The risk is therefore addressed
rather than accepted: nothing in this project stored the token, the Worker never
sees it, and the slash commands were already registered, so the reset broke
nothing.

**[sign-address-exposed-in-screenshot] — done, and confirmed by observation rather
than by report.** The user ran `/newsign` and reported the new address differs. The
exposed address was still known to this session from the screenshot, so it could be
tested directly: both the page and the state endpoint at the old address now answer
404. It is genuinely dead, not merely superseded.

That is also the first real exercise of SPEC's promise that a leaked sign address
can be thrown away and the old one stops working the moment it is. It holds.

Worth noting for the method rather than for this project: the check was only
possible because the leak itself put the old address in reach. A discard whose
"before" value nobody recorded would have had to be taken on trust.

## Outcome

**Outcome: done** — walked to its end this session, every step witnessed, and the
item's own observable met: the bot is in the server and `/afk` returns a reply
rather than "application did not respond".

The two red-flagged items filed and walked alongside it are both **done** as well,
and each has its own record citing this one:
[bot-token-exposed-in-screenshot] and [sign-address-exposed-in-screenshot]. Both
flags are cleared by having been fixed rather than accepted — the token reset, the
address thrown away and confirmed dead by observation.

**Routed to Captures:** [walkthrough-assumes-terminal-knowledge],
[wrangler-text-rule-fallthrough], [register-script-bash-syntax],
[bot-token-exposed-in-screenshot], [sign-address-exposed-in-screenshot],
[sign-cannot-show-over-focused-window],
[timezone-label-differs-between-bot-and-sign].

