# Discord gives a bot no way to draw over a stream

Looked up 2026-08-30, while processing [sign-cannot-show-over-focused-window].
The question was whether a bot could place the AFK sign over a Go Live stream
from inside Discord, which would have kept the sign exactly as built.

## The answer is no, and it is not a permissions problem

Bots cannot Go Live, cannot stream video, and cannot draw anything over another
user's stream. There is no API for it. Developers have asked for one repeatedly
since Go Live shipped — discord/discord-api-docs issues #1603 and #1146, and
discussion #3234 — and none of them has been implemented. The only projects that
stream video as a bot are unofficial self-bot experiments, which violate
Discord's terms.

Nothing Discord renders over the video belongs to a bot either. Everything a bot
can change sits **beside** the video, in the parts of the client a viewer can
collapse or hide:

- a message in the text channel;
- the channel's name (a rename);
- the voice channel's status line;
- a member's nickname, and the member list.

A viewer watching a stream full-screen sees none of those. That is the load-bearing
consequence: any "signal inside Discord" route is visible only to someone whose
sidebar is on screen.

## Three specific limits found along the way

**A bot can never change the server owner's nickname.** Changing a nickname needs
the MANAGE_NICKNAMES permission *and* the bot's highest role sitting above the
target's in the hierarchy. The owner is above everyone by construction, so the
call returns Missing Permissions (50013). Filed as discord-api-docs #2139 and
closed as intended behaviour. So a nickname-based sign works only for members the
bot outranks, never for the owner.

**Voice channel status is bot-settable.** `PUT /channels/{channel_id}/voice-status`
with `{"status": "..."}` sets the line that appears under a voice channel's name.
It was documented late (discord-api-docs PR #6400) and is reachable on API v9.
It is the one Discord surface that sits next to a stream in the same visual group.

**Two rate limits decide whether a live countdown is possible.** Message edits are
capped at 5 per 5 seconds per channel, which is enough to tick but wasteful.
Channel name and topic changes are capped at **2 per 10 minutes** per channel —
an undocumented limit, raised as discord-api-docs #1900 — which rules a rename out
as anything but a set-once signal.

## Why compositing works when overlaying does not

Discord's application share captures one application's own window surface, so a
window laid on top of it is not in the capture. Software that composites *before*
Discord sees it — OBS drawing a browser source over a window capture and offering
the result as its own window — is unaffected, because Discord is then sharing the
already-combined picture.

## Sources

- https://github.com/discord/discord-api-docs/issues/1603
- https://github.com/discord/discord-api-docs/issues/1146
- https://github.com/discord/discord-api-docs/discussions/3234
- https://github.com/discord/discord-api-docs/issues/2139
- https://github.com/discord/discord-api-docs/pull/6400
- https://github.com/discord/discord-api-docs/issues/1900
- https://docs.discord.com/developers/topics/rate-limits
