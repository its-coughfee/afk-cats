# Discord slash commands on Cloudflare Workers

Looked up 2026-08-24, to decide whether the AFK sign's service can run on
Cloudflare Workers rather than an always-on server.

## The finding

Yes, and it is an officially supported path rather than a community workaround.
Discord publishes its own tutorial for hosting an app on Cloudflare Workers, and
maintains a sample app repository (`discord/cloudflare-sample-app`) that the
tutorial walks through.

## How the mechanism works

Slash commands do not need a always-connected bot process. Discord supports
**HTTP interactions**: you set an "Interactions Endpoint URL" on the application
in Discord's developer portal, and Discord sends an HTTPS POST to that URL each
time someone runs one of your commands. A Worker is a valid endpoint.

Two consequences that shape the build:

- **The endpoint must verify a signature.** Discord signs every request with an
  Ed25519 signature, sent in `X-Signature-Ed25519` and `X-Signature-Timestamp`
  headers alongside the raw body. The endpoint verifies these against the
  application's public key and must return 401 when verification fails. This is
  not optional — Discord refuses to save an endpoint URL that doesn't do it.
- **Discord validates the URL when you save it**, by sending a PING interaction
  the endpoint has to answer correctly. So the Worker has to be deployed and
  working before the developer-portal side can be finished.

Local development is normally done behind an HTTP tunnel (ngrok or similar),
because Discord needs a public HTTPS URL to send to.

## What this does not cover

Nothing was checked here about Workers' storage options (KV, Durable Objects),
their free-tier limits, or how a Worker serves the sign page itself. Those are
separate questions.

## Sources

- https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers
- https://github.com/discord/cloudflare-sample-app
