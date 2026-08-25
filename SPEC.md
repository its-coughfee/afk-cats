# SPEC — AFK-cats

## What this is

A Discord bot plus a full-screen AFK sign. You keep the sign open in a browser tab
and share that tab. Type `/afk 3pm` in Discord and the tab turns into an AFK
screen — a big **AFK**, the time you'll be back, and a live countdown over slowly
crossfading photos. `/back` takes it down.

The AFK screen already exists as a single self-contained page
(`afk-sign_1.html`): cat photos from Pexels, crossfading every 20 minutes, with
the text placed so it doesn't cover the cat's face, and a photographer credit
bar. The bot is what makes it one click away instead of something you open by
hand.

## Who it's for

Alex and anyone else on the Throughliner Discord server. Anyone on the server can
set their own AFK sign.

Nobody installs anything. The sign is a web page, and each person has their own
address for it. You open yours, full-screen it, and share that tab; the bot does
the rest.

## How it works

- **`/afk 3pm`** in Discord puts the sign up, counting down to that time.
- **`/back`** takes it down.
- **Late is visible.** When the return time passes, the countdown doesn't stop or
  say "I'm back!" — it flips to counting *up*, so the sign reads the time you said
  plus how long you're overdue, and keeps climbing until `/back`. Standard colours
  throughout; being late changes the numbers, not the look.
- **The sign itself** is one full-screen page: **AFK**, "back at" and the time, the
  counter, and a background photo that crossfades on a slow cycle with credit to
  the photographer.
- **One address per person.** Each person on the server has their own sign page.
  The bot records who is AFK and until when; each page shows only its own person's
  state, and shows the ordinary photo view when they aren't AFK.
- **The address is private.** A sign's address is long and random rather than
  readable, so nobody can find out whether you are at your desk by guessing it.
  Ask the bot and it tells you yours again. If it gets out, you can throw it away
  and be issued a fresh one — the old address stops working the moment you do.
- **Your time, not the server's.** `/afk 3pm` means three in the afternoon where
  you are. The sign knows the timezone of the machine it is open on, and the time
  you type is read against that. That is why the very first `/afk` from someone
  who has never opened their sign page is refused, with a nudge to open it once;
  after that the bot knows their timezone and it never comes up again.

## Principles

- **Nothing to install.** The sign is a page you open in a browser. Identity comes
  from Discord — there are no accounts and no sign-in on the sign itself. The only
  thing stored is who is AFK and until when.
- **The photo is the point.** Text is placed so it doesn't sit on top of the
  subject, and photographers are always credited.
