# QUEUE

## Processed

> Vetted work, ready to build — worked top to bottom. Each piece of work is one
> item: a `#### ` heading naming it, a short name in square brackets at the end of
> that heading line, and a short rationale beneath. **That bracketed name is a
> handle, so you and Claude can refer to a piece of work without retyping its whole
> description — "let's do the login one" works too, and Claude never asks you to
> write one.** A leading flavor tag names how it runs — none for a
> build (Claude edits files), `[audit]` for a review pass, `[user]` for a step only
> you can do. A security or privacy risk Claude surfaces lives here too, as a work
> item carrying a `Red flag · State: cleared/uncleared` marker. The line below marks
> how far down is cleared to build; anything below it is decided but not ready yet.

#### Keep `node_modules` and `.wrangler` out of git [ignore-build-dirs]
The [discord-bot] build added a `package.json`, so the first `npm install` will
drop a large `node_modules` folder in the project root, and running the Cloudflare
tooling leaves a `.wrangler` cache beside it. Neither belongs in the repository
and `.gitignore` currently lists neither, so the first commit after the deploy
step would sweep thousands of files in. One line each in `.gitignore` settles it.
Noticed during the [discord-bot] build, which did not touch `.gitignore`, so it
is filed rather than folded in.

Checked at planning time rather than taken on trust: `.gitignore` currently holds
`.throughliner/` and `INBOX/` and nothing else, and neither `node_modules` nor
`.wrangler` exists on disk yet. So nothing has been swept in and neither folder
was ever committed — this is preventive, and no history needs rewriting. Kept and
cleared ahead of the account and deploy work, since the install that creates the
folder happens during that work.

--- Build block ---
Changes: `.gitignore` gains two lines, `node_modules/` and `.wrangler/`. No other
file changes and nothing is removed from git history.
Acceptance: after an `npm install` and a `wrangler` run, `git status` shows
neither folder as untracked.
--- End build block ---

#### Have the bot say "BST" rather than "GMT+1" when it confirms a time [timezone-abbreviation]
The bot's confirmation currently reads "AFK until 3:00 PM GMT+1". It is correct
and it is not how anyone writes it — "BST" is the name a British reader expects,
and the same goes for other zones with familiar abbreviations. It comes from
formatting the time for a US English reader, which is the default the Worker
falls back to; the fix is about which locale the time is formatted for, and needs
a moment's thought about what to do for a person whose zone has no well-known
abbreviation. Noticed while testing during the [discord-bot] build and left
alone, since it is presentation rather than behaviour.

Settled on 2026-08-25 by testing `Intl` directly rather than reasoning about it,
which is what the item was waiting on. No single locale knows every zone's
abbreviation — each knows its own region's. `en-GB` gives BST for London and CEST
for Paris; `en-US` gives EDT and PDT for New York and Los Angeles; `en-AU` gives
AEST for Sydney and NZST for Auckland. Those three cover the English-speaking
world. Kolkata and Tokyo return `GMT+5:30` and `GMT+9` in every locale, because
those abbreviations are not in the data at all — which answers the open question
about zones with no familiar short name: the fallback is exactly what the bot
prints today, so nobody's confirmation gets worse.

Ordering: build this BEFORE [worker-test-suite], which splits `src/index.js` in
two and would move `formatInZone` out from under the line reference below.

Refused: switching the whole formatter to `en-GB`. It fixes London and breaks New
York, which drops from `EDT` to `GMT-4`, and it changes the clock to 24-hour as a
side effect. The zone name has to be looked up separately from the time.

--- Build block ---
Changes: `formatInZone` in `src/index.js` (around line 327). The time keeps being
formatted for a US English reader, so `3:00 PM` is unchanged. The zone name is
looked up separately: try `en-US`, `en-GB` and `en-AU` in turn, take the first
whose `timeZoneName` is letters rather than a `GMT±` string, and fall back to the
current offset form when none is. No other file changes; the project has no test
file and this does not add one.
Acceptance: running the function gives "3:00 PM BST" for `Europe/London`, "EDT"
for `America/New_York`, "AEST" for `Australia/Sydney`, and an unchanged
"GMT+5:30" for `Asia/Kolkata`.
--- End build block ---

#### Add the script that registers the slash commands with Discord [register-slash-commands]

Found on 2026-08-25 while sharpening [afk-wire-up]'s walkthrough. The Worker
answers `/afk`, `/back`, `/mysign` and `/newsign` once Discord asks it, but
nothing in the project ever tells Discord that those commands exist — there is no
registration script in `src/` and no command for one in `package.json`. Without
it the deploy succeeds, the bot joins the server, and typing `/` offers nothing,
which reads as a broken deploy rather than a missing step.

Registration is a one-off call to Discord's API carrying the bot token. The token
is the one secret in this project that must never reach the repo or this chat, so
the script reads it from the environment at the moment it runs and the user runs
the script themselves. Nothing about the token is stored.

The four commands and their shapes come from `src/index.js`: `afk` takes one
required string option named `time` — the name the handler reads at line 72 —
and the other three take no options at all.

Refused: registering the commands from inside the Worker on first request. It
would need the bot token as a Worker secret, which is a standing copy of the
project's one real secret sitting in Cloudflare, to save a step run once.

--- Build block ---
Changes: a new `scripts/register-commands.mjs` that PUTs the four command
definitions to Discord's global application-commands endpoint, reading
`DISCORD_APPLICATION_ID` and `DISCORD_TOKEN` from the environment and exiting
with a clear message naming whichever is missing. `package.json` gains a
`register` entry under `scripts` that runs it. `src/index.js` is not touched.
Acceptance: run with both variables set and Discord returns success listing the
four commands; run with either unset and it stops with a message saying which one
is missing rather than a stack trace.
--- End build block ---

#### Give the Worker a test suite it keeps [worker-test-suite]

Raised on 2026-08-25 during a re-scan of the planning chat. The [discord-bot]
build tested the Worker end to end against a stand-in for Cloudflare's storage,
but that testing happened in the chat and left nothing behind: there is no test
file, and `package.json` has no test command. So every later change is verified by
hand or not at all, and the work of building that stand-in was thrown away. It
surfaced while writing [timezone-abbreviation], whose build block had to say the
project has no test file and this does not add one.

One thing stands in the way, checked rather than assumed: `src/index.js` imports
the sign page as a text module (`import SIGN_HTML from '../afk-sign_1.html'`),
which is a Cloudflare build feature. Plain Node cannot import HTML, so the file
cannot be loaded by a test as it stands. Node 24 is installed and ships a test
runner, so everything else is already available.

Refused: Cloudflare's Vitest plugin, which runs tests inside the real Workers
runtime and would honour the HTML import and give genuine storage rather than a
fake. It is the supported route and it is the better fidelity. It lost on cost:
it adds a handful of dependencies to a project that currently has one, for logic
that is almost all pure. Worth revisiting if the fake storage ever starts lying
about something that matters. Choosing it now would also have meant looking up
its current setup, which had not been done.

The split is a side effect of wanting tests, and that is named rather than
glossed: working code is being restructured to make it loadable. It earns its
place anyway, because the file currently does the wiring and the thinking in one
place.

Ordering: build this AFTER [timezone-abbreviation], which edits `formatInZone`
where it sits today. Doing the split first would move that function and leave the
other item pointing at a line that no longer holds it.

--- Build block ---
Changes: `src/index.js` splits in two. The logic moves to a new `src/worker.js`
with no HTML import, taking the page's text as a parameter; `src/index.js` shrinks
to the HTML import plus the wiring that hands it over, and keeps the default
export Cloudflare loads. A new `test/worker.test.mjs` runs under Node's built-in
runner against a fake storage object — a plain Map behind the same `get` and `put`
the Worker calls. `package.json` gains a `test` entry running `node --test`.
Acceptance: `npm test` passes, covering the time parsing (`3pm`, `15:00`, junk),
the next-occurrence rule that makes `/afk 9am` at 10am mean tomorrow, the zone
maths across a DST boundary, `formatInZone`'s abbreviations, sign-id generation
and validation, and the four commands driven through the handler against the fake
storage. The Ed25519 signature check is covered by signing a body with a
generated key pair and asserting a bad signature gives 401.
--- End build block ---

#### [user] Create the Discord application and the Cloudflare account [afk-accounts]

Split out of [discord-bot]. Both accounts are things only you can create — they
sit under your name and carry secrets Claude must not hold. Neither blocks the
build: the Worker reads its keys from configuration, so the code is written
against settings and the real values arrive at deploy time in [afk-wire-up].

Walkthrough — Discord side:
1. Go to discord.com/developers/applications and sign in with your Discord
   account. You should land on a page listing applications, probably empty.
2. Click **New Application**, top right. Name it something like `AFK sign`.
   Accept the terms box and click **Create**. You land on the app's General
   Information page.
3. On that page, find **Application ID** and **Public Key**. Copy both somewhere
   you can find again. These are not secret.
4. In the left sidebar click **Bot**. Click **Reset Token**, confirm, and copy
   the token that appears. This one IS secret — it is shown once and never
   again. Do not paste it into this chat.
5. Stop there. Do not set the Interactions Endpoint URL yet — there is nothing
   to point it at until the Worker is deployed. That step is in [afk-wire-up].

Walkthrough — Cloudflare side:
6. Go to dash.cloudflare.com and sign up, or sign in if you already have an
   account. The free plan is enough.
7. You are done when the Cloudflare dashboard loads and shows a **Workers &
   Pages** entry in the left sidebar. Nothing needs creating there by hand.

Tell me when both are done and whether you have the Application ID and Public
Key to hand. Keep the bot token to yourself until [afk-wire-up] asks for it.

Observable: nothing here shows up in this project's files, so this item waits
until you say it is done.

--- Cleared to run above this line ---

#### [user] Deploy the Worker and connect Discord to it [afk-wire-up]

Blocked by: [afk-accounts], [register-slash-commands]

[discord-bot] was dropped from this line on 2026-08-25: LOG records it built and
its Worker is what this item deploys, so it no longer holds anything.
[register-slash-commands] was added the same day — step 6 cannot be run until
that script exists.

Split out of [discord-bot]. This is the step the research finding forces into
this order: Discord validates an Interactions Endpoint URL by sending a test
request to it at the moment you save it, so the Worker has to be live and
answering before the developer-portal field can be filled in. That is why this
cannot be folded into [afk-accounts].

Sharpened on 2026-08-25, which is what the item asked for once [discord-bot]
shipped. Two things the rough version had wrong, both read off `wrangler.toml`
rather than assumed: the Discord public key is an ordinary variable in that file,
not a secret, and the bot token is not needed by the Worker at all — it is only
used to register the commands. The rough version also never mentioned the KV
namespace, which does not exist until someone creates it and which the Worker
cannot start without. The `wrangler kv namespace create` spelling was confirmed
against Cloudflare's docs: the colon form (`kv:namespace`) is the pre-3.60
spelling and is what an older write-up would have suggested.

This step needs a terminal, opened separately from any app, sitting in the
project folder.

Walkthrough:
1. Run `npm install`. It downloads the Cloudflare tooling into `node_modules`.
   It worked if it ends without red error text.
2. Run `npx wrangler login`. A browser window opens asking you to authorise
   Wrangler against your Cloudflare account; click **Allow**. It worked when the
   terminal says you are logged in.
3. Run `npx wrangler kv namespace create AFK_KV`. It prints a block of
   configuration containing an `id` — a long string of letters and numbers. Copy
   that id, open `wrangler.toml`, and replace `REPLACE_WITH_KV_NAMESPACE_ID` on
   line 15 with it, keeping the quotes.
4. In the same file, replace `REPLACE_WITH_DISCORD_PUBLIC_KEY` on line 20 with
   the Public Key you copied from the Discord developer portal in
   [afk-accounts]. This one is public by nature, so it belongs in the file. The
   bot token does not go in here — or anywhere in this repo.
5. Run `npx wrangler deploy`. It worked if the terminal prints a URL ending
   `.workers.dev`. Note that URL down; every step below uses it.
6. Register the slash commands — see [register-slash-commands], which is the
   piece of work that makes this step runnable.
7. Back in discord.com/developers/applications, open the app, and paste
   `<your-worker-url>/interactions` into **Interactions Endpoint URL** on the
   General Information page. Click **Save Changes**. It works if the page saves
   without an error; a red error means the Worker is not answering correctly.
8. In the same portal, open the **OAuth2** section, generate an invite link, and
   use it to add the bot to the Throughliner server. It worked if the bot shows
   up in the server's member list.
9. Type `/mysign` in any channel. The bot replies privately with your sign
   address. Open it in a browser tab and leave it open — you should see cat
   photos. This step comes before `/afk` on purpose: the sign page is what tells
   the bot your timezone, so a first `/afk` from someone who has never opened
   their page is refused with a nudge to do exactly this. Ordering it the other
   way round would have you read a correct refusal as a broken deploy.
10. Now type `/afk 3pm`. It worked if the bot confirms the time and the tab you
   left open turns into the AFK screen, counting down.

Observable: the bot appears in the server's member list, and `/afk` returns a
reply rather than "application did not respond".

#### Open the live sign in a browser and check the countdown behaves [sign-page-browser-check]

Blocked by: [afk-wire-up]
Red flag · State: cleared

Split out of [sign-page-eyeball], which was filed during the [discord-bot] build
as a single user-only check. The capability check at planning time found that
wrong: this session has a browser tool that opens a URL, screenshots it and reads
the page, so the countdown behaviour is Claude's to check rather than the user's.
What the Worker's own tests could not cover was the page in a real browser, not
the page in the user's eyes specifically.

The red flag and how it was designed out: the sign's address is long and random
so that nobody can learn whether you are at your desk by guessing it, and pasting
it into a chat transcript hands that away to anyone who later reads the
transcript. Rather than accept the exposure, the run ends by having the user ask
the bot for a fresh address, which discards the one that was exposed. The check
therefore costs one address rather than the privacy of the sign.

The crossfade is not here: it runs on a twenty-minute cycle, so it is noticed
over a working day rather than watched, and it stays with the user in
[sign-crossfade-eyeball].

--- Build block ---
Changes: no project files change. The run asks the user for their sign address
and opens it in the browser tool. Typing in Discord is the user's — Claude has no
Discord access — so the run asks them to type `/afk` set about a minute ahead,
watches the page, waits for the return time to pass, then asks them to type
`/back` and watches again, screenshotting at each stage. The item stays whole
rather than splitting into a Claude half and a user half, because the two are
interleaved and a split would put them in separate runs. Findings are filed as
captures like any audit's; a defect found here becomes its own item.
Acceptance: five observations recorded — how many seconds the page took to flip
after each of `/afk` and `/back`, which is the measurement [kv-read-staleness]
waits on; the photo view before `/afk`; the AFK
screen over the photos showing the right return time; the counter having turned
around and climbing after the return time passes; the photo view again after
`/back`. Then the user is walked through asking the bot for a fresh address, and
the run confirms the old address no longer serves their state.
Red flag: cleared
Refused: doing the check without regenerating the address afterwards — it leaves
a working address to the user's presence sitting in a transcript.
--- End build block ---

#### [user] Watch the sign's photo crossfade over a working day [sign-crossfade-eyeball]

Blocked by: [afk-wire-up]

Split out of [sign-page-eyeball]. This is the half of that check that genuinely
cannot be handed to a tool: the photos cross-fade on a twenty-minute cycle, so
nobody sits and watches it — it is noticed over a normal day with the sign open
in a tab. The countdown behaviour went to [sign-page-browser-check].

Walkthrough:
1. Open your sign address in a browser tab and leave it open while you work.
   You should see a cat photo filling the screen with a photographer's name in a
   bar at the bottom.
2. Some time later — twenty minutes or more — glance at it. It worked if the
   photo is a different one and the credit bar names a different photographer.
3. Watch one changeover if you happen to catch it. It should fade from one photo
   to the next rather than cutting, and the text should not sit on top of the
   cat's face in either photo.
4. Tell me what you saw. Anything wrong becomes its own piece of work.

Observable: nothing here shows up in this project's files, so this item waits
until you say it is done.

## Unprocessed

> Captured ideas and tasks not yet fully processed. The next /plan run goes
> through these with you and decides each one's fate — keep it (move it up to
> Processed) or drop it. Each is filed as its own `#### ` heading, so the list shows
> up in an editor's outline.

#### Last session advises processing [ignore-build-dirs] next [forward-advisory]
The cleared region holds four builds and then a step only you can run, in that
order, and they are meant to be taken top to bottom. [ignore-build-dirs] is first
because the deploy work runs an install that creates the folder it excludes.

Two things a fresh session would not see from a quick read. A build run will halt
at [afk-accounts] and build nothing past it, because that item is yours to run —
that is the run ending as designed, not a failure. And [timezone-abbreviation]
must be built before [worker-test-suite]: the test work splits `src/index.js` and
would move the function the other item edits. That ordering is written into both
items, so following the queue's own order is enough.

Checked for overlap: one capture is waiting to be sorted, [kv-read-staleness]. It
does not touch any of the cleared work — it waits on a measurement that
[sign-page-browser-check] will take once the sign is live, so nothing about it
blocks a build now.

#### Decide whether the sign's up-to-a-minute lag behind `/afk` matters [kv-read-staleness]
Cloudflare's key-value storage serves reads that can be up to sixty seconds
stale, so a sign page that is already open may keep showing photos for as much as
a minute after `/afk` is typed, and may keep counting for as much as a minute
after `/back`. Found while reading the free-tier limits during the [discord-bot]
build, and recorded there. It may be invisible in practice — the delay is a
ceiling rather than the usual case — so this is a judgement to make once someone
has watched a real sign respond, not a fix to design in advance. If it does
matter, the fixes are real but each costs something: a shorter poll interval buys
nothing because the staleness is in the storage rather than the poll, so the
answer would be a different storage or a push channel.

Looked at on 2026-08-25 and deferred rather than kept: the build cannot be
described, because what gets built depends on an answer nobody has yet. What
settles it is a measurement, and [sign-page-browser-check] was amended to take
it — that run now records how many seconds the page actually took to flip after
`/afk` and after `/back`. Sixty seconds is a ceiling rather than the usual case,
so two real numbers replace the guess. Whether the lag matters is then yours to
judge, and this item comes back with the numbers in hand.

