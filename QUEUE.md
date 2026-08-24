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

#### Worker running `/afk` and `/back`, serving each person's sign page [discord-bot]

captured by you, as the whole bot idea. Split at planning into this build plus
two `[user]` lines — [afk-accounts] for the accounts and credentials, and
[afk-wire-up] for the deploy-and-connect steps that only run once this ships.

Cloudflare Workers was chosen over an always-on server because one Worker covers
all three jobs — receiving Discord's requests, holding the state, and serving the
sign pages — on a free tier with nothing to install for anyone using it. Cites
research: `resources/research/discord-slash-commands-on-cloudflare-workers.md`,
which confirms Discord publishes its own tutorial for this and that the endpoint
must verify an Ed25519 signature.

The build does not wait on the Discord application existing. Signature
verification reads the application's public key from configuration, so the code
is written against a setting rather than against a value someone has to fetch
first. That is why this sits above the line alongside [afk-accounts] rather than
behind it.

Timezone was settled here: the sign page reports the timezone of the machine it
is open on, and `/afk 3pm` is read against that. It avoids a server-wide timezone
setting and avoids asking anyone to type an offset. SPEC carries the sentence.

Red flag · State: cleared

The risk was that a readable sign address (`/sign/alex`) lets anyone who guesses
it check whether a named person is at their desk, unannounced — presence data on
a semi-public server. Designed out rather than accepted: addresses are long
random strings, and the bot will tell you yours on request. Rejected: readable
addresses, which are easier to type and share but expose everyone's status to
everyone.

--- Build block ---
Changes:
- A new Cloudflare Worker project at the repo root (`src/`, `wrangler.toml`,
  `package.json`). One Worker, three responsibilities.
- Interactions endpoint: verifies Discord's Ed25519 signature on every request
  and returns 401 when it fails, answers Discord's PING, and handles three slash
  commands — `/afk <time>` (records the person as away until that time), `/back`
  (clears it), one that replies with the caller's own sign address, and one that
  throws that address away and issues a fresh one, for when it leaks. All replies
  carrying an address are private to the caller, so the bot never posts one into
  a channel.
- State: who is AFK and until when, plus each person's random sign id, in Workers
  KV. Check KV's free-tier limits while building and say in the LOG entry what
  they are.
- Sign page: `afk-sign_1.html` becomes the page the Worker serves at
  `/sign/<random-id>`. It keeps the existing cat photos, the crossfade and the
  photographer credit unchanged, and gains: the **AFK** heading, "back at" plus
  the time, a live counter, and a poll to the Worker for its own person's state.
  When the return time passes the counter flips to counting up and keeps
  climbing. When the person is not AFK the page shows photos only.
- The page sends its own browser timezone to the Worker, which is what `/afk 3pm`
  resolves against.
Acceptance: with the Worker deployed and a fake state row written by hand,
opening a sign address shows the AFK screen counting down; letting the time pass
turns the count upward rather than stopping; clearing the row returns the page to
photos only. The interactions endpoint rejects an unsigned request with a 401.
Red flag: cleared
Refused: an always-on server (Railway/Render) — same setup effort, ongoing cost,
and three moving parts instead of one.
Refused: readable sign addresses — see the red flag above.
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

