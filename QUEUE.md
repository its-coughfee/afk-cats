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

#### Open the live sign in a browser and check the countdown behaves [sign-page-browser-check]

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

#### [user] Set the bot's avatar in the Discord developer portal [bot-icon-upload]

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

#### [user] Watch the sign's photo crossfade over a working day [sign-crossfade-eyeball]

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

--- Cleared to run above this line ---

## Unprocessed

> Captured ideas and tasks not yet fully processed. The next /plan run goes
> through these with you and decides each one's fate — keep it (move it up to
> Processed) or drop it. Each is filed as its own `#### ` heading, so the list shows
> up in an editor's outline.

#### Last session advises processing sign-cannot-show-over-focused-window next [forward-advisory]
Advice from the 2026-08-30 build session, which deployed the bot and watched you
use it for the first time. Read and cleared at the next planning run.

Process [sign-cannot-show-over-focused-window] before the cleared work runs.

The reason is an overlap rather than a preference. The top cleared item,
[sign-page-browser-check], opens the sign in a browser and measures how it behaves.
[sign-cannot-show-over-focused-window] asks whether a sign living in a browser tab
is the right shape at all, given that you stream a focused window and the tab is
therefore invisible while you work. Measuring the current sign in detail before
that question is settled risks spending a careful check on a shape that is about
to change — and the answer could reach SPEC's sharing sentence, which most of the
rest of the queue is built on.

Nothing else waiting overlaps with the cleared work.

Also worth knowing at that planning run: all three cleared items became ready at
this close, because the work holding them shipped and was verified. So a /next run
would now walk straight into them.

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

#### Terminal walkthroughs assume you already know how to open one [walkthrough-assumes-terminal-knowledge]
Filed on 2026-08-30 while driving [afk-wire-up]'s walkthrough. Raised by you: you
said you do not know the terminal, and that pasting step 2's command as written
would have run it in the wrong folder.

[afk-wire-up]'s preamble says "This step needs a terminal, opened separately from
any app, sitting in the project folder" and stops there. It never says how to open
one, how to get it into the project folder, or what tells you that worked. Every
command step after it silently depends on that having happened.

The run supplied the missing move live — open PowerShell from the Start menu, then
`cd` to the project folder, with the changed prompt as the thing to look for — so
this walkthrough is unblocked. What is not settled is whether that opening move
should be written into the item itself, and whether other terminal walkthroughs in
this project carry the same hole.

Worth weighing at planning: this may be a gap in the method's own guidance rather
than in this one item, since it requires every step to name the thing to click and
the thing to look for, and an unwritten prerequisite step is exactly what that
rule is for. If it is the method's, it routes as mail rather than as a change
here.

#### Every deploy warns that the HTML text rule has no fallthrough setting [wrangler-text-rule-fallthrough]
Filed on 2026-08-30 during [afk-wire-up]'s first real deploy. Noticed by Claude.

`wrangler.toml` declares a `[[rules]]` entry making `**/*.html` a text module, which
is what lets `afk-sign_1.html` be bundled as the one copy of the sign page. Because
that rule sets no `fallthrough`, it silently shadows Wrangler's built-in default
text rule, which covers `.txt`, `.html` and `.sql`. Wrangler prints a warning about
this on every deploy.

Nothing here needs the default rule, so the deploy is correct as it stands and the
sign page bundles properly — this is noise rather than a fault. The fix is one line:
`fallthrough = false` on the rule, which says the shadowing is deliberate and
silences the warning. `fallthrough = true` would be wrong, since it would re-admit
rules this project does not want.

Worth doing because a warning that appears on every deploy is a warning nobody
reads, and the next real problem will print in the same place.

#### The register script documents its own invocation in a syntax that fails on this machine [register-script-bash-syntax]
Filed on 2026-08-30 while driving [afk-wire-up] step 6. Noticed by Claude.

`scripts/register-commands.mjs` carries a comment showing how to run it:
`DISCORD_APPLICATION_ID=... DISCORD_TOKEN=... npm run register`. That is bash
syntax. This machine's terminal is PowerShell, where an inline environment prefix
like that is not valid and the command fails rather than running with the values
unset — so the printed instruction is wrong for the only person who runs it.

The walkthrough step was corrected live, handing over the PowerShell form
(`$env:NAME = "value"` on its own line, then `npm run register`), which is what
actually ran. The script's own comment is still wrong, and it is the thing anybody
reads first when they come back to this months later.

What a planning run has to settle is whether the comment should simply be rewritten
for PowerShell, or carry both forms, given the project's own instructions say
commands should work in PowerShell unless stated otherwise.

#### Sign is a separate browser tab, so it cannot show while the stream is focused on another window [sign-cannot-show-over-focused-window]
Captured by you on 2026-08-30, at the end of [afk-wire-up]'s walkthrough, on first
real use of the sign.

Your words for it: the sign "just opens a page which isn't going to work when I
have the stream focused on Claude". You stream a specific window rather than the
whole screen, so a sign living in its own browser tab is invisible to anyone
watching for exactly as long as you are working — which is the entire time the sign
would be worth showing.

This is a hole in what SPEC assumes rather than a bug in what was built. SPEC says
"You keep the sign open in a browser tab and share that tab", and everything from
the private per-person address to the full-screen layout follows from that. What it
never asks is what happens when the stream is pointed at a different window, which
turns out to be the ordinary case for you.

Nothing here is decided. What a planning run has to settle is whether the tab model
is right and the sign is simply shared differently, or whether the sign needs a
second shape entirely — an always-on-top window, an overlay, something the
streaming software can take as its own source. Each of those is a different product,
so this is a SPEC conversation before it is a build.

Worth weighing early rather than filing under improvements: if the answer changes
SPEC's sharing sentence, it changes what the rest of the queue is building toward.

#### Bot says AEST but the sign says GMT+10 for the same moment [timezone-label-differs-between-bot-and-sign]
Filed on 2026-08-30 at the end of [afk-wire-up]'s walkthrough. Noticed by Claude.

Confirming `/afk 3pm`, the bot replied "AFK until 3:00 PM AEST. The sign is up."
The sign page, showing the same moment, reads "back at 03:00 PM GMT+10". Both are
correct and they name the same time; they just disagree about how to say it.

The cause is that the page asks the browser to format the zone with the short
style, and browsers render an Australian zone as a numeric offset rather than as
its abbreviation, while the bot composes its own wording. So this is a formatting
choice on the page rather than a bug in either.

Cosmetic, and small. It is worth deciding rather than leaving because the sign is
the surface other people read, and a numeric offset is the less human of the two —
"3:00 PM AEST" is what somebody watching the stream would recognise.

What a planning run has to settle is whether the sign should carry the
abbreviation, drop the zone entirely (it is the viewer's own clock that matters
least here — the sign is read by other people), or be left as it is.

#### Steps that keep a secret out of the transcript should warn against screenshotting [screenshot-defeats-secret-keeping]
Filed on 2026-08-30 by the re-scan, from two failures the same session. Noticed by
Claude.

Two steps in [afk-wire-up] were written so a secret never reached the chat. Step 6
has the user paste the bot token into their own terminal and report only that it
worked. Step 9 has them open their private sign address in a browser. Both
precautions were defeated the same way: the user reported the step by screenshotting
the window, and the window had the secret on it — the terminal echoes the pasted
line, and the browser shows the address bar.

Neither was a mistake anyone made. Screenshotting is the natural way to report what
a terminal or a browser is showing, and it is the reporting method this method's
walkthroughs implicitly invite by asking "what does it say?". So the design held and
the reporting channel leaked, which is a gap in how walkthroughs are written rather
than in this project.

Both leaks were repaired the same session — the token reset, the sign address
thrown away and confirmed dead — so nothing here is outstanding. What is
outstanding is the general fix: a step that deliberately keeps something out of the
transcript should say, in the step itself, not to screenshot the window while it is
on screen, and should say what to type instead.

This is a problem with the method rather than with this app, so the route is mail
to the project the plugin is developed in, which
`INBOX/.address-book.md` now records. Anything sent leaves this project and needs
your approval on the exact text first.

#### Two package install scripts are unapproved, which may block running the Worker locally [npm-install-scripts-unapproved]
Filed on 2026-08-30 by the re-scan, from what `npm install` printed during
[afk-wire-up] step 1. Noticed by Claude.

`npm install` finished cleanly but warned that two packages have install scripts it
has not been allowed to run: `esbuild` and `workerd`. Newer npm holds such scripts
back by default rather than running them, and reports what it held.

Nothing needed them today. `npx wrangler --version` answered, and the deploy built
and uploaded the Worker without complaint, because deploying builds in the cloud.

The reason to file it rather than forget it: `workerd` is the runtime that runs a
Worker on this machine, and its install script is what puts the binary in place. So
the first time anyone tries `wrangler dev` — running the bot locally to try a change
without deploying it — this is a plausible cause of it failing, and the failure will
look like something else entirely.

What a planning run has to settle is whether to approve the two scripts now
(`npm approve-scripts esbuild workerd`, which npm's own message suggests), or to
leave it until something actually needs local running and treat this entry as the
note that says where to look.

