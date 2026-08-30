# Research index

One line per finding. Newest first. Each line ends with the file that holds it.

- Discord gives a bot no way to draw over a Go Live stream — no API, asked for
  repeatedly and never built — and every surface a bot can change (message,
  channel name, voice channel status, nickname) sits beside the video where a
  full-screen viewer never sees it; also records that a bot can never rename the
  server owner, that voice channel status is settable at
  `PUT /channels/{id}/voice-status`, and that channel renames are capped at 2 per
  10 minutes → discord-cannot-overlay-a-stream.md
- A free Noun Project download is CC BY 3.0 and obliges a credit line wherever
  the artwork is used — cropping the baked-in credit out does not remove it —
  while a one-off paid download (US$4.99 at lookup) is royalty-free and needs no
  attribution; which licence this project's cat file came under is not
  established → noun-project-icon-licence.md
- Discord slash commands can run on Cloudflare Workers over HTTP interactions —
  officially supported, with a Discord-published tutorial and sample app; the
  endpoint must verify an Ed25519 signature and answer Discord's PING before the
  developer portal will accept the URL → discord-slash-commands-on-cloudflare-workers.md
