// Runs under Node's built-in test runner: `npm test`.
//
// Storage is a plain Map wearing the two methods the Worker calls, so the whole
// bot can be driven end to end without Cloudflare, a network, or a Discord app.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  handleRequest,
  parseClockTime,
  nextOccurrence,
  wallClockToMs,
  formatInZone,
  newSignId,
  isSignId,
} from '../src/worker.js';

// ── Fake KV ─────────────────────────────────────────────────────────────────

function fakeKV(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    async get(key, options) {
      const value = map.get(key);
      if (value === undefined) return null;
      return options?.type === 'json' ? JSON.parse(value) : value;
    },
    async put(key, value) {
      map.set(key, value);
    },
    async delete(key) {
      map.delete(key);
    },
  };
}

// ── Discord signing ─────────────────────────────────────────────────────────

async function makeKeyPair() {
  const pair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const publicKeyHex = [...raw].map((b) => b.toString(16).padStart(2, '0')).join('');
  return { ...pair, publicKeyHex };
}

async function signedInteraction(interaction, keys, { corrupt = false } = {}) {
  const body = JSON.stringify(interaction);
  const timestamp = '1700000000';
  const bytes = new Uint8Array(
    await crypto.subtle.sign(
      { name: 'Ed25519' },
      keys.privateKey,
      new TextEncoder().encode(timestamp + body),
    ),
  );
  let signature = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  if (corrupt) signature = (signature[0] === '0' ? '1' : '0') + signature.slice(1);

  return new Request('https://afk.example/interactions', {
    method: 'POST',
    headers: {
      'x-signature-ed25519': signature,
      'x-signature-timestamp': timestamp,
      'content-type': 'application/json',
    },
    body,
  });
}

const USER = { id: '4242' };

function command(name, options = []) {
  return { type: 2, member: { user: USER }, data: { name, options } };
}

// Drives one command through the Worker and returns the message content Discord
// would show.
async function runCommand(interaction, env, keys) {
  const response = await handleRequest(await signedInteraction(interaction, keys), env, '<html></html>');
  assert.equal(response.status, 200);
  const payload = await response.json();
  return payload.data.content;
}

function makeEnv(kv = fakeKV(), publicKeyHex = '') {
  return { AFK_KV: kv, DISCORD_PUBLIC_KEY: publicKeyHex, SIGN_BASE_URL: 'https://afk.example' };
}

// ── Time parsing ────────────────────────────────────────────────────────────

test('parseClockTime reads the forms people actually type', () => {
  assert.deepEqual(parseClockTime('3pm'), { h: 15, m: 0 });
  assert.deepEqual(parseClockTime('3:30 pm'), { h: 15, m: 30 });
  assert.deepEqual(parseClockTime('15:00'), { h: 15, m: 0 });
  assert.deepEqual(parseClockTime('9'), { h: 9, m: 0 });
  assert.deepEqual(parseClockTime('noon'), { h: 12, m: 0 });
  assert.deepEqual(parseClockTime('midnight'), { h: 0, m: 0 });
  assert.deepEqual(parseClockTime('12am'), { h: 0, m: 0 });
  assert.deepEqual(parseClockTime('12pm'), { h: 12, m: 0 });
});

test('parseClockTime refuses junk rather than guessing', () => {
  for (const junk of ['later', '', '25:00', '3:75', '13pm', '0pm', '3 pm please']) {
    assert.equal(parseClockTime(junk), null, `expected null for ${JSON.stringify(junk)}`);
  }
});

// ── The next-occurrence rule ────────────────────────────────────────────────

test('/afk 9am at 10am means tomorrow', () => {
  const tenAM = Date.parse('2026-06-15T09:00:00Z'); // 10:00 in London, BST
  const until = nextOccurrence('Europe/London', 9, 0, tenAM);
  assert.equal(new Date(until).toISOString(), '2026-06-16T08:00:00.000Z');
});

test('/afk 3pm at 10am means today', () => {
  const tenAM = Date.parse('2026-06-15T09:00:00Z');
  const until = nextOccurrence('Europe/London', 15, 0, tenAM);
  assert.equal(new Date(until).toISOString(), '2026-06-15T14:00:00.000Z');
});

// ── Zone maths across a DST boundary ────────────────────────────────────────

test('wall clock times land on the right instant either side of a DST change', () => {
  // London springs forward at 01:00 on 2026-03-29.
  assert.equal(
    new Date(wallClockToMs('Europe/London', 2026, 3, 28, 12, 0)).toISOString(),
    '2026-03-28T12:00:00.000Z',
  );
  assert.equal(
    new Date(wallClockToMs('Europe/London', 2026, 3, 29, 12, 0)).toISOString(),
    '2026-03-29T11:00:00.000Z',
  );
});

test('an /afk that crosses the DST change still lands on the wall clock asked for', () => {
  const nightBefore = Date.parse('2026-03-28T23:00:00Z'); // 23:00 in London, still GMT
  const until = nextOccurrence('Europe/London', 9, 0, nightBefore);
  assert.equal(new Date(until).toISOString(), '2026-03-29T08:00:00.000Z');
});

// ── Zone abbreviations ──────────────────────────────────────────────────────

test('formatInZone prefers a letter abbreviation over a GMT offset', () => {
  const summer = Date.parse('2026-07-15T14:00:00Z');
  assert.equal(formatInZone(summer, 'Europe/London'), '3:00 PM BST');
  assert.equal(formatInZone(summer, 'America/New_York'), '10:00 AM EDT');
  assert.equal(formatInZone(summer, 'Australia/Sydney'), '12:00 AM AEST');
});

test('formatInZone falls back to the offset where no zone has an abbreviation', () => {
  const summer = Date.parse('2026-07-15T14:00:00Z');
  assert.equal(formatInZone(summer, 'Asia/Kolkata'), '7:30 PM GMT+5:30');
});

// ── Sign addresses ──────────────────────────────────────────────────────────

test('sign addresses are 32 hex characters and never repeat', () => {
  const ids = new Set();
  for (let i = 0; i < 100; i++) {
    const id = newSignId();
    assert.match(id, /^[0-9a-f]{32}$/);
    ids.add(id);
  }
  assert.equal(ids.size, 100);
});

test('isSignId refuses anything that is not one', () => {
  assert.equal(isSignId(newSignId()), true);
  for (const bad of ['', 'abc', 'g'.repeat(32), 'A'.repeat(32), '0'.repeat(31), '0'.repeat(33)]) {
    assert.equal(isSignId(bad), false, `expected false for ${JSON.stringify(bad)}`);
  }
});

// ── The signature check ─────────────────────────────────────────────────────

test('a correctly signed ping is answered', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);
  const response = await handleRequest(await signedInteraction({ type: 1 }, keys), env, '');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { type: 1 });
});

test('a bad signature is refused with 401', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);
  const request = await signedInteraction({ type: 1 }, keys, { corrupt: true });
  const response = await handleRequest(request, env, '');
  assert.equal(response.status, 401);
});

test('a request with no signature headers is refused with 401', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);
  const request = new Request('https://afk.example/interactions', { method: 'POST', body: '{}' });
  const response = await handleRequest(request, env, '');
  assert.equal(response.status, 401);
});

// ── The four commands ───────────────────────────────────────────────────────

test('/mysign issues an address, and gives the same one back next time', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);

  const first = await runCommand(command('mysign'), env, keys);
  const match = first.match(/https:\/\/afk\.example\/sign\/([0-9a-f]{32})/);
  assert.ok(match, `expected a sign address in: ${first}`);

  const second = await runCommand(command('mysign'), env, keys);
  assert.ok(second.includes(match[1]));
});

test('the first /afk from someone who has never opened their sign is refused', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);

  const content = await runCommand(command('afk', [{ name: 'time', value: '3pm' }]), env, keys);
  assert.match(content, /Open your sign page once first/);
});

test('/afk sets the sign once the timezone is known, and /back takes it down', async () => {
  const keys = await makeKeyPair();
  const kv = fakeKV();
  const env = makeEnv(kv, keys.publicKeyHex);

  // Opening the sign page is what teaches the bot a timezone; here that state is
  // set directly, which is the same thing the page's poll would have written.
  await runCommand(command('mysign'), env, keys);
  const signId = await kv.get(`user:${USER.id}`);
  const record = await kv.get(`sign:${signId}`, { type: 'json' });
  await kv.put(`sign:${signId}`, JSON.stringify({ ...record, tz: 'Europe/London' }));

  const afk = await runCommand(command('afk', [{ name: 'time', value: '3pm' }]), env, keys);
  assert.match(afk, /^AFK until 3:00 PM (BST|GMT)\. The sign is up\.$/);

  const set = await kv.get(`sign:${signId}`, { type: 'json' });
  assert.equal(typeof set.until, 'number');

  const back = await runCommand(command('back'), env, keys);
  assert.match(back, /Welcome back/);
  const cleared = await kv.get(`sign:${signId}`, { type: 'json' });
  assert.equal(cleared.until, null);
});

test('/afk with junk time explains itself and changes nothing', async () => {
  const keys = await makeKeyPair();
  const kv = fakeKV();
  const env = makeEnv(kv, keys.publicKeyHex);

  const content = await runCommand(command('afk', [{ name: 'time', value: 'later' }]), env, keys);
  assert.match(content, /couldn't read "later" as a time/);
  assert.equal(kv.map.size, 0);
});

test('/back when you were never AFK says so', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);
  const content = await runCommand(command('back'), env, keys);
  assert.match(content, /weren't marked AFK/);
});

test('/newsign issues a fresh address, keeps the timezone, and kills the old one', async () => {
  const keys = await makeKeyPair();
  const kv = fakeKV();
  const env = makeEnv(kv, keys.publicKeyHex);

  await runCommand(command('mysign'), env, keys);
  const oldId = await kv.get(`user:${USER.id}`);
  const record = await kv.get(`sign:${oldId}`, { type: 'json' });
  await kv.put(`sign:${oldId}`, JSON.stringify({ ...record, tz: 'Europe/London' }));

  const content = await runCommand(command('newsign'), env, keys);
  const newId = await kv.get(`user:${USER.id}`);
  assert.notEqual(newId, oldId);
  assert.ok(content.includes(newId));
  assert.equal(await kv.get(`sign:${oldId}`), null);
  assert.equal((await kv.get(`sign:${newId}`, { type: 'json' })).tz, 'Europe/London');
});

test('an unknown command is answered rather than crashing', async () => {
  const keys = await makeKeyPair();
  const env = makeEnv(fakeKV(), keys.publicKeyHex);
  const content = await runCommand(command('brunch'), env, keys);
  assert.match(content, /don't know the command/);
});

// ── The sign page and its state endpoint ────────────────────────────────────

test('a dead address gets a 404 from both the page and the state endpoint', async () => {
  const env = makeEnv();
  const gone = '0'.repeat(32);
  assert.equal((await handleRequest(new Request(`https://afk.example/sign/${gone}`), env, '')).status, 404);
  assert.equal((await handleRequest(new Request(`https://afk.example/api/sign/${gone}`), env, '')).status, 404);
});

test('the sign page carries its own id and refuses to be cached or indexed', async () => {
  const kv = fakeKV();
  const env = makeEnv(kv);
  const signId = newSignId();
  await kv.put(`sign:${signId}`, JSON.stringify({ userId: USER.id, tz: null, until: null }));

  const response = await handleRequest(
    new Request(`https://afk.example/sign/${signId}`),
    env,
    '<html><head></head><body></body></html>',
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.match(await response.text(), new RegExp(`window.__SIGN_ID__ = "${signId}"`));
});

test('the state endpoint records the timezone the page reports, and reports AFK state', async () => {
  const kv = fakeKV();
  const env = makeEnv(kv);
  const signId = newSignId();
  const until = Date.parse('2026-06-15T14:00:00Z');
  await kv.put(`sign:${signId}`, JSON.stringify({ userId: USER.id, tz: null, until }));

  const response = await handleRequest(
    new Request(`https://afk.example/api/sign/${signId}?tz=Europe/London`),
    env,
    '',
  );
  assert.deepEqual(await response.json(), { afk: true, until });
  assert.equal((await kv.get(`sign:${signId}`, { type: 'json' })).tz, 'Europe/London');
});

test('a nonsense timezone from the page is ignored rather than stored', async () => {
  const kv = fakeKV();
  const env = makeEnv(kv);
  const signId = newSignId();
  await kv.put(`sign:${signId}`, JSON.stringify({ userId: USER.id, tz: null, until: null }));

  const response = await handleRequest(
    new Request(`https://afk.example/api/sign/${signId}?tz=Mars/Olympus_Mons`),
    env,
    '',
  );
  assert.deepEqual(await response.json(), { afk: false, until: null });
  assert.equal((await kv.get(`sign:${signId}`, { type: 'json' })).tz, null);
});
