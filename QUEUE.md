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

Blocked by: [discord-bot], [afk-accounts]

Split out of [discord-bot]. This is the step the research finding forces into
this order: Discord validates an Interactions Endpoint URL by sending a test
request to it at the moment you save it, so the Worker has to be live and
answering before the developer-portal field can be filled in. That is why this
cannot be folded into [afk-accounts].

The walkthrough is deliberately rough — the exact commands depend on what the
build produces. Sharpen it at the planning run after [discord-bot] ships.

Rough walkthrough:
1. Deploy the Worker to your Cloudflare account, and note the URL it reports
   (something ending `.workers.dev`).
2. Put the Discord public key and bot token into the Worker's configuration as
   secrets, so they live in Cloudflare rather than in the repo.
3. Back in discord.com/developers/applications, open the app, and paste
   `<your-worker-url>/interactions` into **Interactions Endpoint URL** on the
   General Information page. Click **Save Changes**. It works if the page saves
   without an error; a red error means the Worker is not answering correctly.
4. Register the slash commands with Discord, then use the **OAuth2** section to
   generate an invite link and add the bot to the Throughliner server.
5. Type `/afk 3pm` in any channel. It worked if the bot replies with your sign
   address, and opening that address shows the AFK screen counting down.

Observable: the bot appears in the server's member list, and `/afk` returns a
reply rather than "application did not respond".

## Unprocessed

> Captured ideas and tasks not yet fully processed. The next /plan run goes
> through these with you and decides each one's fate — keep it (move it up to
> Processed) or drop it. Each is filed as its own `#### ` heading, so the list shows
> up in an editor's outline.

#### Last session advises processing [afk-accounts] next [forward-advisory]
The Worker shipped, so the project's next move is entirely about getting it
online, and two things stand in the way of that happening by itself. First,
[afk-accounts] sits at the top of the cleared work with no walkthrough written
into it, so a build run reaches it and halts rather than walking anyone through
anything — writing its steps is the unblocking move. Second, [afk-wire-up] is
held below the line naming [discord-bot] as its blocker, and that blocker has now
shipped, so it is ready to be lifted; nothing else was holding it.

Checked for overlap: three captures are waiting to be sorted —
[sign-page-eyeball], [spec-address-sentences] and [ignore-build-dirs]. None of
them contradicts or complicates the account work. [ignore-build-dirs] is worth
taking early anyway, since the deploy step runs an install that would otherwise
sweep a large folder into the next commit, and [sign-page-eyeball] belongs
immediately after the deploy rather than before it.

#### [user] Look at a live sign page and check the countdown behaves [sign-page-eyeball]
The Worker build was tested end-to-end against a stand-in for Cloudflare's
storage, which covers the bot, the private addresses and the state the page is
served. What that cannot cover is the page itself in a real browser: that the
AFK screen appears over the photos, that the counter turns around and climbs
once the return time passes rather than stopping, and that clearing it puts the
page back to photos only. Those are eyes-on-a-screen checks, so they are the
user's. Filed during the [discord-bot] build; it can only run once the sign is
live, so it comes after [afk-wire-up].

#### Two sentences SPEC owes about the sign address and the first `/afk` [spec-address-sentences]
The [discord-bot] build put two things into the product that SPEC does not yet
say. First, a person can throw their sign address away and be issued a fresh
one, for when it leaks — SPEC currently says only that the bot will tell you
yours again. Second, the timezone reaches the bot from the sign page, so a
person's very first `/afk` is refused with a nudge to open their sign page once;
after that it never comes up again. Both are ordinary product truth rather than
build detail, and a build does not write SPEC, so they are filed here for the
next planning pass. SPEC lags by these two sentences until then.

#### Keep `node_modules` and `.wrangler` out of git [ignore-build-dirs]
The [discord-bot] build added a `package.json`, so the first `npm install` will
drop a large `node_modules` folder in the project root, and running the Cloudflare
tooling leaves a `.wrangler` cache beside it. Neither belongs in the repository
and `.gitignore` currently lists neither, so the first commit after the deploy
step would sweep thousands of files in. One line each in `.gitignore` settles it.
Noticed during the [discord-bot] build, which did not touch `.gitignore`, so it
is filed rather than folded in.

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

#### Have the bot say "BST" rather than "GMT+1" when it confirms a time [timezone-abbreviation]
The bot's confirmation currently reads "AFK until 3:00 PM GMT+1". It is correct
and it is not how anyone writes it — "BST" is the name a British reader expects,
and the same goes for other zones with familiar abbreviations. It comes from
formatting the time for a US English reader, which is the default the Worker
falls back to; the fix is about which locale the time is formatted for, and needs
a moment's thought about what to do for a person whose zone has no well-known
abbreviation. Noticed while testing during the [discord-bot] build and left
alone, since it is presentation rather than behaviour.

