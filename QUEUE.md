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

#### Bot icon matching the house look of your other server bots [bot-icon]
Captured by you during the [afk-accounts] walk-through. You want every bot you
run on the server to read as one family, so this bot's Discord avatar is built to
the same recipe as your existing chat bot's icon rather than designed fresh.

The recipe, read off that existing icon: a circle filling the square, a thin dark
outline around it, and a background gradient running from deep red at the lower
left to steel blue at the upper right, darkest through the middle. The subject
sits on top in white, centred.

Both source files are copied into the project so a later session does not depend
on a folder outside it: `assets/cat-noun-project-source.svg` is the cat, and
`assets/reference-sibling-bot-icon.png` is the existing bot's icon to copy from.

Two open questions were settled on 2026-08-30, both by looking rather than by
reasoning.

The first was silhouette or line-work. The reference icon is white line-work with
no fill and the cat is a solid filled silhouette, so the two could not simply be
matched. Six treatments were rendered against the real gradient and you picked
the solid silhouette, scaled up so the drawing overflows the circle and the
circle's own edge crops it — which is what lets the cat sit large in frame. The
defeated option was converting the cat to line-work by tracing the edge of the
filled artwork: it loses at small sizes, and the face details come out as thin
doubled outlines rather than drawn strokes, so a genuine line-work version would
mean redrawing the cat rather than converting it. Your instruction was also to
leave the drawing's smaller pieces in place rather than removing any of them.

The second was attribution. A free Noun Project download is CC BY 3.0 and obliges
a credit wherever the artwork is used; cropping the baked-in credit text out of
the file does not discharge it. A one-off paid download removes the obligation
for about five dollars. You chose the free licence with the credit placed on the
sign page, which is the one surface other people see and which already credits
the photographers. The finding is in
`resources/research/noun-project-icon-licence.md`.

SPEC was amended in the same session: its "the photo is the point" principle now
says the sign page carries a standing credit to the cat drawing's artist.

Changes:
- `assets/bot-icon.svg`, new. The finished avatar: a 512-unit square holding a
  circle with the gradient above and a thin dark outline, and the white cat
  silhouette from the source file scaled about 1.55x and clipped by the circle so
  its lower body is cropped by the circle's edge. The source file's two `<text>`
  elements carrying the baked-in credit are dropped from the artwork.
- `assets/bot-icon.png`, new. A 512x512 export of that SVG, which is the file
  Discord takes. Inkscape 1.4.4 is installed at
  `C:\Program Files\Inkscape\bin\inkscape` and was confirmed working during
  planning; `--export-type=png --export-width=512` does it. There is no cairosvg
  and no ImageMagick on this machine.
- `assets/CREDITS.md`, new. Records the CC BY 3.0 obligation and the exact credit
  wording, citing the research file above.
- `afk-sign_1.html`. The credit bar is the single `.attribution` element declared
  on line 170, and line 255 rewrites its contents on every photo change, so the
  artist credit cannot live inside it. Add a second static element beneath it
  carrying "Cat drawing by inmyheart from Noun Project" with the artist's name
  linked to the drawing's page, styled with the existing `.attribution` rules so
  it matches.

Reads but does not change: `assets/cat-noun-project-source.svg`,
`assets/reference-sibling-bot-icon.png`,
`resources/research/noun-project-icon-licence.md`, and `test/worker.test.mjs`,
which is run rather than edited.

Observable: `assets/bot-icon.png` exists and measures 512 by 512; the sign page
opened in a browser shows the artist credit under the photo credit, in the same
type, without covering the cat; and the existing test suite still passes.

Refused: buying the royalty-free licence to avoid the credit line, which spends
money to avoid writing one sentence on a page that already carries credits.
Refused: converting the cat to line-work, for the reasons above.

Setting the avatar in the Discord developer portal is yours rather than this
build's, and is filed as [bot-icon-upload].

#### Report the circular-hold deadlock to the project the plugin is developed in [circular-hold-deadlock]
Filed on 2026-08-27 during a planning run, after processing
[wire-up-blocker-unresolvable]. Noticed by Claude, not directed by the user.

The method holds back work whose foundation LOG records as built but not yet
verified. Applied literally to [afk-wire-up], that rule would have held it
forever: the registration script it waited on can only ever be verified by step
6 of that same walkthrough, so the blocker cannot resolve until the held item
runs and the held item cannot run until the blocker resolves. The queue would
have stayed permanently stuck with nothing cleared to build.

Nothing in the tooling caught it. The queue digest reported the blocker as
absent-and-built, which reads like a resolved reference rather than an
unresolvable one, and the planning doc's loop check only covers blockers that
are themselves queue items — this loop runs through a verification that is not
an item at all. It surfaced only because the LOG entry behind the slug was read
by hand.

Two things a report would carry: the shape of the case, which is a held item
that is itself the only possible verification of what holds it; and the fact
that the deadlock is invisible from the queue alone, so spotting it depends on
someone reading the record.

Settled on 2026-08-30: this is a real gap rather than a one-off, checked against
the version installed that day, 1.21.1-test2. The hold-back rule still reads
"built only, not enough — keep the dependent below" with no exception for the
case where the dependent item is itself the verification. The planning
procedure's loop check still only covers loops made of blockers that are
themselves queue items, and this loop runs through a verification that is not an
item at all, so it is invisible to that check by construction. And the shape
generalises: it is "the only thing that can exercise X is a step inside an item
held on X", which arises whenever a build produces a script, a deploy or a
migration whose first real run happens inside a walkthrough depending on it.

The route was settled the same day. The plugin's own development project lives on
this machine at `Prioritity projects/taskflow planning/no code method` under the
same Desktop folder as this project — confirmed present, and confirmed to be the
right one by the `plugin/` source folder inside it. That is where the
walkthrough-heading report went on 2026-08-26, though that session never recorded
the path, which is why this one had to ask for it again.

Changes:
- A new message file in that project's `INBOX/`, dated and named as coming from
  this project, following the naming of the 2026-08-26 message recorded in
  `INBOX/sent.md`. It carries three things: the shape of the case, which is a
  held item that is itself the only possible verification of what holds it; the
  fact that the deadlock cannot be seen from the queue alone, because the digest
  reports the blocker as absent-and-built and the loop check only reaches loops
  made of queue items; and the note that this was checked against 1.21.1-test2
  and is not already fixed.
- `INBOX/sent.md`, which gains its line for the send.
- `INBOX/.address-book.md`, new, recording that project as a correspondent at the
  path above so no later session has to ask for it.

Reads but does not change: `LOG/2026-08-27-wire-up-blocker-unresolvable.md`,
which is the record the case was found in, and [afk-wire-up]'s own entry.

The run will stop and show the exact wording before delivering anything, because
a message leaving this project needs the user's yes. That halt is expected rather
than a fault.

Observable: the message file exists in that project's `INBOX/`, `INBOX/sent.md`
names it, and `INBOX/.address-book.md` carries the correspondent.

Refused: a GitHub issue on the plugin's repository, which would publish this
under the user's own account when nothing here needs to be public. Refused: the
flintcraft.tech report form, which does not land in the queue that would fix it —
where mail does both jobs.

#### [user] Deploy the Worker and connect Discord to it [afk-wire-up]

Cleared on 2026-08-27, and the `Blocked by:` line dropped with both its slugs.
That line's history, kept so nobody rebuilds it: [discord-bot] was dropped from
it on 2026-08-25, LOG recording it built and its Worker being what this item
deploys; [register-slash-commands] was added the same day, on the reasoning that
step 6 could not run until that script existed.

[afk-accounts] resolved by being completed — walked through to its end on
2026-08-26 with every step reported done, so both accounts now exist. The
automated queue check reports that record as a planning session's rather than a
build's, because a walk-through's record does not carry a build's markers; the
record itself settles it, which is why it was read rather than trusted to the
flag.

[register-slash-commands] was dropped as a circular hold rather than a resolved
one, which is the part worth carrying. LOG records that script built but
UNCONFIRMED: only the path where the credentials are missing has ever run. The
only thing in existence that can confirm it is step 6 of this walkthrough, so
holding this item against it is a loop neither side can leave — the blocker
cannot resolve until the held item runs, and the held item cannot run until the
blocker resolves. Nothing in the queue would ever have broken that. Step 6
already carries the warning the hold was standing in for: it names this as the
script's first real run, says success is the four commands printing back, and
says anything else means the application id or the token did not take.

Done knowingly against the rule that holds back work resting on a built but
unverified foundation. The reason it is set aside here: this item *is* that
verification, and it is a walk-through driven live with the user present rather
than an unattended build, so a failure at step 6 is seen as it happens and
becomes its own piece of work. The refused alternative was keeping the item held
and writing in prose that the blocker is a run nobody has performed — it lost
because it leaves the queue permanently stuck while describing the stuckness
accurately.

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
   Wrangler against your Cloudflare account; click **Allow**. Your Cloudflare
   sign-in is through GitHub, learned while walking [afk-accounts] through, so
   expect a GitHub authorisation screen here rather than an email and password
   box — that is the right screen, not a wrong one. It worked when the terminal
   says you are logged in.
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

--- Cleared to run above this line ---

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

#### [user] Set the bot's avatar in the Discord developer portal [bot-icon-upload]

Blocked by: [bot-icon]

Split out of [bot-icon] on 2026-08-30, because setting a bot's avatar happens in
Discord's developer portal and nothing in this session can reach it. The build
makes the image file; this is the one step that has to be yours.

Walkthrough:
1. Open discord.com/developers/applications and click the AFK-cats application —
   the same one you created while walking [afk-accounts] through.
2. In the left sidebar, click **Bot**. You are in the right place when the page
   shows a **Username** box and, above it, a square image with the default grey
   Discord mark in it.
3. Click that square image. A file picker opens. Choose
   `assets/bot-icon.png` from this project folder. It worked when the square
   stops showing the grey default and shows the cat on the red-to-blue circle
   instead.
4. Scroll to the bottom and click **Save Changes**. A green bar confirms it. If
   no Save Changes bar appeared, the image did not take — try step 3 again.
5. In any channel on the Throughliner server, look at the bot in the member list.
   It worked if its picture is the new icon rather than the grey default. Discord
   caches avatars, so if it still looks old, give it a few minutes or reload
   Discord before treating it as a failure.

Observable: the bot's picture in the server's member list is the new icon. That
is something you can see and nothing in this project's files records, so this
item waits until you say it is done.

## Unprocessed

> Captured ideas and tasks not yet fully processed. The next /plan run goes
> through these with you and decides each one's fate — keep it (move it up to
> Processed) or drop it. Each is filed as its own `#### ` heading, so the list shows
> up in an editor's outline.

#### Preview pane cannot show a local file outside the project folder [preview-pane-outside-project]
Filed at the 2026-08-30 close, after the session hit it repeatedly while
settling the bot icon's design.

A scratch preview page written to the session scratchpad — outside this project's
folder — came back from the preview pane as a static snapshot with images
blocked, and could not be screenshotted at all. So the session was building
previews it could not see, and the user had to open them by hand in Chrome from
a pasted file path. It cost several turns of the design discussion.

This is Claude Code's own preview pane rather than anything in this project or
in the method, so the route for it, if it is worth taking, is a GitHub issue on
the Claude Code repository — which is public under the user's own account and so
needs their explicit yes on the exact text.

What a planning run has to settle is whether it is worth reporting at all, or
whether the workaround — writing preview files somewhere the pane can reach — is
the whole answer.

#### Sends leave no correspondent recorded, so the next report has to ask again [send-does-not-record-correspondent]
Filed at the 2026-08-30 close. Noticed by Claude, not directed by the user.

A message went from this project to the project the plugin is developed in on
2026-08-26, and `INBOX/sent.md` records it. But nothing recorded that project as
a correspondent, so `INBOX/.address-book.md` does not exist here. When this
session came to send a second report it had no way to find the destination and
had to ask the user for the folder.

[circular-hold-deadlock]'s build creates the address book for this project, so
the immediate problem is already handled. What is not handled is the general
shape: a send that does not record where it sent to leaves the next send with
nothing to look up, and the cost lands on the user as a question they have
already answered once.

Whether that is a gap in the method's own procedure or simply a step the earlier
session skipped is the open question, and it is what a planning run has to settle
before anything is reported. Anything reported leaves this project and needs the
user's approval on the exact text.

