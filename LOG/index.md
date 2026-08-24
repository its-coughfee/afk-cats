# LOG Index

One-line summaries of each session. Newest first. Each line names the session's
full entry file in this folder.

- [HASH] — Built the Cloudflare Worker carrying the Discord interactions endpoint (Ed25519 verification, 401 on failure), `/afk` `/back` and the two address commands with address-bearing replies kept private, and KV-backed per-person state keyed on the sign id to halve the poll cost; `afk-sign_1.html` converted from a manual time form into a bot-driven page that polls its own state, reports its browser timezone and counts up past the return time, losing the green "I'm back!" state; tick is UNCONFIRMED pending a browser look after deploy; KV free-tier limits and its 60-second read staleness recorded → 2026-08-24-discord-bot.md
- 4f5c86b — Planning: sign moved from each person's machine to a hosted page with one private random address each, on Cloudflare Workers (research filed on Discord's signed HTTP interactions); SPEC lost its "no database" principle and gained private-address and own-timezone sentences; [discord-bot] rewritten with a build block and split into [afk-accounts] and [afk-wire-up]; [multi-user] and [themes] deleted; red flag on address guessability cleared by design → 2026-08-24-plan.md
- 4f5c86b — Setup adopted the AFK-cats folder: SPEC.md written describing a Discord bot (`/afk 3pm`, `/back`) that flips a local full-screen AFK sign on and off, with the countdown counting up once late; three captures filed and the existing afk-sign_1.html left untouched → 2026-08-24-setup.md
