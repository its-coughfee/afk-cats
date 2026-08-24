// AFK-cats — one Cloudflare Worker with three jobs:
//   1. answer Discord's interaction webhook  (POST /interactions)
//   2. serve each person's private sign page (GET  /sign/<id>)
//   3. tell that page its own state          (GET  /api/sign/<id>?tz=...)
//
// KV shape (binding AFK_KV):
//   user:<discordUserId>  -> signId                        (string)
//   sign:<signId>         -> { userId, tz, until }         (JSON)
// The sign page is the hot path, so its state hangs off the sign key and a poll
// costs exactly one read.

import SIGN_HTML from '../afk-sign_1.html';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/interactions' && request.method === 'POST') {
      return handleInteractions(request, env);
    }
    if (request.method === 'GET' && url.pathname.startsWith('/sign/')) {
      return handleSignPage(url.pathname.slice('/sign/'.length), env);
    }
    if (request.method === 'GET' && url.pathname.startsWith('/api/sign/')) {
      return handleSignState(url, env);
    }
    return new Response('Not found', { status: 404 });
  },
};

// ── Discord interactions ────────────────────────────────────────────────────

const PING = 1;
const APPLICATION_COMMAND = 2;
const PONG = 1;
const CHANNEL_MESSAGE_WITH_SOURCE = 4;
const EPHEMERAL = 64;

async function handleInteractions(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();

  if (!(await verifyDiscordSignature(body, signature, timestamp, env.DISCORD_PUBLIC_KEY))) {
    return new Response('Bad request signature', { status: 401 });
  }

  const interaction = JSON.parse(body);

  if (interaction.type === PING) return json({ type: PONG });
  if (interaction.type !== APPLICATION_COMMAND) {
    return new Response('Unsupported interaction type', { status: 400 });
  }

  // A command can arrive from a guild (member.user) or a DM (user).
  const user = interaction.member?.user ?? interaction.user;
  if (!user?.id) return reply('I could not tell who sent that.', { ephemeral: true });

  const name = interaction.data?.name;
  const origin = env.SIGN_BASE_URL || new URL(request.url).origin;

  switch (name) {
    case 'afk':      return commandAfk(interaction, user, env, origin);
    case 'back':     return commandBack(user, env);
    case 'mysign':   return commandMySign(user, env, origin);
    case 'newsign':  return commandNewSign(user, env, origin);
    default:         return reply(`I don't know the command \`${name}\`.`, { ephemeral: true });
  }
}

async function commandAfk(interaction, user, env, origin) {
  const raw = optionValue(interaction, 'time');
  const clock = parseClockTime(raw);
  if (!clock) {
    return reply(
      `I couldn't read "${raw}" as a time. Try something like \`3pm\`, \`3:30pm\`, \`15:00\`, \`noon\`.`,
      { ephemeral: true },
    );
  }

  const { signId, record } = await loadOrCreateSign(user.id, env);
  if (!record.tz) {
    return reply(
      `Open your sign page once first so it can tell me your timezone, then try again:\n${signUrl(origin, signId)}`,
      { ephemeral: true },
    );
  }

  const until = nextOccurrence(record.tz, clock.h, clock.m, Date.now());
  await putSign(env, signId, { ...record, until });

  return reply(`AFK until ${formatInZone(until, record.tz)}. The sign is up.`);
}

async function commandBack(user, env) {
  const signId = await env.AFK_KV.get(`user:${user.id}`);
  if (!signId) return reply(`You weren't marked AFK.`, { ephemeral: true });

  const record = await getSign(env, signId);
  if (!record || record.until === null) return reply(`You weren't marked AFK.`, { ephemeral: true });

  await putSign(env, signId, { ...record, until: null });
  return reply(`Welcome back. The sign is down.`);
}

async function commandMySign(user, env, origin) {
  const { signId } = await loadOrCreateSign(user.id, env);
  return reply(
    `Your sign is at:\n${signUrl(origin, signId)}\n\nOpen it, full-screen it, and share that tab. Keep the address to yourself — anyone with it can see whether you're at your desk. If it gets out, run \`/newsign\`.`,
    { ephemeral: true },
  );
}

async function commandNewSign(user, env, origin) {
  const oldSignId = await env.AFK_KV.get(`user:${user.id}`);
  const oldRecord = oldSignId ? await getSign(env, oldSignId) : null;

  const signId = newSignId();
  await putSign(env, signId, {
    userId: user.id,
    tz: oldRecord?.tz ?? null,
    until: oldRecord?.until ?? null,
  });
  await env.AFK_KV.put(`user:${user.id}`, signId);
  if (oldSignId) await env.AFK_KV.delete(`sign:${oldSignId}`);

  return reply(
    `Done — the old address is dead. Your sign is now at:\n${signUrl(origin, signId)}\n\nOpen the new one and share that tab instead.`,
    { ephemeral: true },
  );
}

function optionValue(interaction, name) {
  const opt = (interaction.data?.options ?? []).find((o) => o.name === name);
  return opt?.value ?? '';
}

function reply(content, { ephemeral = false } = {}) {
  return json({
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: ephemeral ? EPHEMERAL : 0 },
  });
}

// ── The sign page and its state ─────────────────────────────────────────────

async function handleSignPage(signId, env) {
  if (!isSignId(signId)) return new Response('Not found', { status: 404 });
  const record = await getSign(env, signId);
  if (!record) return new Response('Not found', { status: 404 });

  const page = SIGN_HTML.replace(
    '</head>',
    `<script>window.__SIGN_ID__ = ${JSON.stringify(signId)};</script>\n</head>`,
  );
  return new Response(page, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // The address is the secret, so keep it out of shared caches and out of
      // the referrer of every Pexels image the page loads.
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

async function handleSignState(url, env) {
  const signId = url.pathname.slice('/api/sign/'.length);
  if (!isSignId(signId)) return new Response('Not found', { status: 404 });

  const record = await getSign(env, signId);
  if (!record) return new Response('Not found', { status: 404 });

  // The page reports the timezone of the machine it is open on; that is what
  // `/afk 3pm` is resolved against. Written back only when it actually changes,
  // so an open page costs reads and not writes.
  const tz = url.searchParams.get('tz');
  if (tz && isTimeZone(tz) && tz !== record.tz) {
    await putSign(env, signId, { ...record, tz });
  }

  const until = record.until ?? null;
  return json(
    { afk: until !== null, until },
    { 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' },
  );
}

// ── KV helpers ──────────────────────────────────────────────────────────────

async function getSign(env, signId) {
  return env.AFK_KV.get(`sign:${signId}`, { type: 'json' });
}

async function putSign(env, signId, record) {
  await env.AFK_KV.put(`sign:${signId}`, JSON.stringify(record));
}

async function loadOrCreateSign(userId, env) {
  const existingId = await env.AFK_KV.get(`user:${userId}`);
  if (existingId) {
    const record = await getSign(env, existingId);
    if (record) return { signId: existingId, record };
  }
  const signId = newSignId();
  const record = { userId, tz: null, until: null };
  await putSign(env, signId, record);
  await env.AFK_KV.put(`user:${userId}`, signId);
  return { signId, record };
}

// 32 hex characters — long enough that a sign address cannot be found by
// guessing, which is the whole reason addresses aren't readable names.
function newSignId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isSignId(value) {
  return /^[0-9a-f]{32}$/.test(value);
}

function signUrl(origin, signId) {
  return `${origin}/sign/${signId}`;
}

// ── Signature verification ──────────────────────────────────────────────────

async function verifyDiscordSignature(body, signature, timestamp, publicKeyHex) {
  if (!signature || !timestamp || !publicKeyHex) return false;
  if (!/^[0-9a-fA-F]+$/.test(signature) || signature.length !== 128) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      hexToBytes(publicKeyHex),
      { name: 'Ed25519' },
      false,
      ['verify'],
    );
    return await crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      hexToBytes(signature),
      new TextEncoder().encode(timestamp + body),
    );
  } catch {
    return false;
  }
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

// ── Time ────────────────────────────────────────────────────────────────────

// "3pm", "3:30 pm", "15:00", "9", "noon", "midnight" -> { h, m }, else null.
function parseClockTime(input) {
  const text = String(input).trim().toLowerCase();
  if (text === 'noon') return { h: 12, m: 0 };
  if (text === 'midnight') return { h: 0, m: 0 };

  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;

  let h = Number(match[1]);
  const m = match[2] === undefined ? 0 : Number(match[2]);
  const meridiem = match[3];

  if (m > 59) return null;
  if (meridiem) {
    if (h < 1 || h > 12) return null;
    if (meridiem === 'pm' && h !== 12) h += 12;
    if (meridiem === 'am' && h === 12) h = 0;
  } else if (h > 23) {
    return null;
  }
  return { h, m };
}

// How far a zone's wall clock sits ahead of UTC at a given instant.
function zoneOffsetMs(tz, ms) {
  const parts = zoneParts(tz, ms);
  const asUTC = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUTC - ms;
}

function zoneParts(tz, ms) {
  const fields = {};
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  for (const { type, value } of formatter.formatToParts(new Date(ms))) {
    if (type !== 'literal') fields[type] = Number(value);
  }
  return fields;
}

// The instant at which a zone's wall clock reads the given date and time.
function wallClockToMs(tz, year, month, day, h, m) {
  const naive = Date.UTC(year, month - 1, day, h, m, 0);
  let guess = naive;
  // Two passes: the first uses the wrong instant's offset, the second the right
  // one. Only a DST boundary makes them differ.
  for (let i = 0; i < 2; i++) guess = naive - zoneOffsetMs(tz, guess);
  return guess;
}

// The next time that zone's clock reads h:m — today if it hasn't passed,
// otherwise tomorrow. That is what makes `/afk 9am` at 10am mean tomorrow.
function nextOccurrence(tz, h, m, nowMs) {
  const today = zoneParts(tz, nowMs);
  const first = wallClockToMs(tz, today.year, today.month, today.day, h, m);
  if (first > nowMs) return first;

  const tomorrow = zoneParts(tz, nowMs + 24 * 60 * 60 * 1000);
  return wallClockToMs(tz, tomorrow.year, tomorrow.month, tomorrow.day, h, m);
}

function formatInZone(ms, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(ms));
}

function isTimeZone(tz) {
  if (!/^[A-Za-z0-9_+\-/]{1,64}$/.test(tz)) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// ── Misc ────────────────────────────────────────────────────────────────────

function json(body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}
