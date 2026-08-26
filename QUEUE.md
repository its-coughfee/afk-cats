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

#### [user] Create the Discord application and the Cloudflare account [afk-accounts]

Split out of [discord-bot]. Both accounts are things only you can create — they
sit under your name and carry secrets Claude must not hold. Neither blocks the
build: the Worker reads its keys from configuration, so the code is written
against settings and the real values arrive at deploy time in [afk-wire-up].

Walkthrough:
Steps 1 to 5 are the Discord side; steps 6 and 7 are the Cloudflare side. The
two halves were separate `Walkthrough — ... side:` headings until 2026-08-26,
which is why no steps ever reached a build run: the generated view a run reads
matches a heading reading exactly `Walkthrough:`, so both blocks were dropped
and the run halted reporting no walkthrough. One heading, same seven steps,
nothing reworded.

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

Amended on 2026-08-26 with the two checks [first-deploy-checks] carried, which
was then retired into this item: steps 5 and 6 now name what to look for, since
the first deploy is the only thing that exercises either. The claims were read
off `src/index.js`, `wrangler.toml` and `scripts/register-commands.mjs` rather
than taken from the capture — the entry file does import the page as a bundled
module, the configuration does declare the rule that makes that work, and the
register script does read both credentials from the environment.

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
   `.workers.dev`. Note that URL down; every step below uses it. This is also
   the first time anything has built `src/index.js` since [worker-test-suite]
   split it into a thin entry file plus `src/worker.js`. That entry file pulls
   the sign page in as a bundled module, which only a real build exercises, so
   watch for a red error naming `afk-sign_1.html` or the import — that would
   mean the wiring did not survive the split, and it is a defect to report
   rather than anything you did wrong.
6. Register the slash commands — see [register-slash-commands], which is the
   piece of work that makes this step runnable. This is also the first time that
   script has run with real credentials; it had only ever been run with them
   missing, which is the path that stops early with a message. It worked if it
   prints the four commands back. Anything else means the application id or the
   token did not take.
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

Why the two flip timings are measured here, folded in from [kv-read-staleness] on
2026-08-26, which was retired into this item. Cloudflare's key-value storage
serves reads that can be up to sixty seconds stale, so a sign page already open
may keep showing photos for as much as a minute after `/afk` is typed, and keep
counting for as much as a minute after `/back`. Found while reading the free-tier
limits during the [discord-bot] build. Sixty seconds is a ceiling rather than the
usual case, which is why this is a judgement to make from two real numbers rather
than a fix to design in advance — and the judgement is the user's, made when this
run reports its timings. The dead end to record so nobody walks back into it: a
shorter poll interval buys nothing, because the staleness is in the storage and
not in the polling, so a real fix would mean different storage or a push channel,
and each costs something.

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
after each of `/afk` and `/back`, which are the two numbers the staleness
judgement above rests on and are reported back to the user for it; the photo view
before `/afk`; the AFK
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

#### Settle what [afk-wire-up] is really waiting on [wire-up-blocker-unresolvable]
[afk-wire-up] carries `Blocked by: [afk-accounts], [register-slash-commands]`.
The second slug no longer resolves: that work was built on 2026-08-25 and left
the queue, so the queue check has been flagging the reference at every session
opening. Dropping it as resolved is the obvious move and it is not obviously
right. LOG records that build as UNCONFIRMED — only the path where the
credentials are missing was ever run, and the path that actually registers the
commands has never run at all, because it needs a real Discord application that
does not exist yet. So the honest reading is that step 6 of the deploy
walkthrough is still waiting on something, and what it is waiting on is the
first successful run rather than a queue item.

Two dispositions, and the choice is a fate decision rather than a tidy-up:
drop the slug and let the deploy walkthrough's own step 6 carry the warning it
now has, or keep the item held and write in prose that the blocker is a run
nobody has performed rather than work nobody has done. Noticed at the close of
2026-08-26 during the wind-down re-scan, not directed by the user.

