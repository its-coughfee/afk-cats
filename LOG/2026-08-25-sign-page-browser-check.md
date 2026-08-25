# 1cd6a89 — Split the sign eyeball check after finding most of it was Claude's to run, and cleared a red flag about the address by designing the exposure out

[sign-page-eyeball] had been filed during the [discord-bot] build as user work,
on the reasoning that checking a page in a browser needs eyes. The capability
check at planning time found that wrong. What the Worker's automated testing could
not cover was the page in a real browser, not the page in the user's eyes
specifically, and this session had a browser tool that opens a URL, screenshots it
and reads what is on it. So the countdown behaviour became Claude's, and the item
split.

A red flag was surfaced and cleared in the same move. The sign's address is long
and random precisely so nobody can learn whether someone is at their desk by
guessing it, and handing that address to Claude puts it in a chat transcript for
anyone who later reads it. Rather than accept the exposure or abandon the check,
it was designed out: the run ends by walking the user through asking the bot for a
fresh address, which discards the exposed one. The check costs one address instead
of the sign's privacy. Doing the check without regenerating afterwards was
refused, and the refusal is written into the item.

One correction was made during the writing. The build block first read as though
Claude could type `/afk` in Discord, which it cannot — Discord is the user's. The
item now says the two are interleaved, the user typing and Claude watching, and
says why it therefore stays whole rather than splitting again into a Claude half
and a user half that would land in separate runs.

The item also absorbed the measurement [kv-read-staleness] waits on: it now
records how many seconds the page actually takes to flip after each command.

**Queue changes:** [sign-page-eyeball] split; [sign-page-browser-check] created
in Processed below the line, blocked by [afk-wire-up], carrying a cleared red
flag and a build block.
**Work processed:** kept — [sign-page-browser-check], and its sibling
[sign-crossfade-eyeball].
