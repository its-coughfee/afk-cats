// Registers the four slash commands with Discord.
//
// Discord doesn't learn a command from the Worker's code — the definitions have
// to be PUT to its API once, and again whenever they change. A PUT replaces the
// whole global command list, so this file is the single source of truth for what
// the bot answers to.
//
//   DISCORD_APPLICATION_ID=... DISCORD_TOKEN=... npm run register

const STRING_OPTION = 3;

const COMMANDS = [
  {
    name: 'afk',
    description: 'Put your sign up, counting down to when you are back.',
    options: [
      {
        type: STRING_OPTION,
        name: 'time',
        description: 'When you are back, in your own timezone — 3pm, 3:30pm, 15:00, noon.',
        required: true,
      },
    ],
  },
  {
    name: 'back',
    description: 'Take your sign down.',
  },
  {
    name: 'mysign',
    description: 'Show the private address of your sign page.',
  },
  {
    name: 'newsign',
    description: 'Throw away your sign address and be issued a fresh one.',
  },
];

const applicationId = process.env.DISCORD_APPLICATION_ID;
const token = process.env.DISCORD_TOKEN;

const missing = [
  !applicationId && 'DISCORD_APPLICATION_ID',
  !token && 'DISCORD_TOKEN',
].filter(Boolean);

if (missing.length > 0) {
  console.error(
    `Nothing was sent to Discord. ${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} not set in the environment.\n` +
      'Both come from your Discord application: the application id from its General Information page, the token from its Bot page.',
  );
  process.exit(1);
}

const response = await fetch(
  `https://discord.com/api/v10/applications/${applicationId}/commands`,
  {
    method: 'PUT',
    headers: {
      authorization: `Bot ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(COMMANDS),
  },
);

const body = await response.text();

if (!response.ok) {
  console.error(`Discord refused the commands (HTTP ${response.status}):\n${body}`);
  process.exit(1);
}

const registered = JSON.parse(body);
console.log(`Registered ${registered.length} commands with Discord:`);
for (const command of registered) console.log(`  /${command.name} — ${command.description}`);
