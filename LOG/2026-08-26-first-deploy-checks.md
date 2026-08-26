# 6ef32df — [first-deploy-checks] retired into [afk-wire-up]: both checks written into the deploy walkthrough's steps 5 and 6 rather than kept as a work item

The item carried two things the 2026-08-25 build could not prove, and asked that
the deploy walkthrough name them as things to look for. Both claims were checked
against the files rather than taken from the capture. `src/index.js` does import
the sign page as a bundled module and `wrangler.toml` does declare the Text rule
that makes that work, so the wiring should survive the split that
[worker-test-suite] made — but only a real `wrangler` build exercises it.
`scripts/register-commands.mjs` does read both credentials from the environment,
and has only ever run with them absent.

It failed the keep-check's second limb in a way worth recording: asked what
changes inside which files, the answer was QUEUE.md and nothing else. That makes
it planning work rather than a build, and /plan resolves what it can in session,
so filing it for a later run would have scheduled a minute's editing into its own
build. Step 5 now says a red error naming the page or the import means the wiring
did not survive the split and is a defect to report; step 6 now says success
prints the four commands back and anything else means the credentials did not
take. [afk-wire-up] carries a dated paragraph recording the amendment and what
was read to justify it.

**Queue changes:** [afk-wire-up] steps 5 and 6 amended and a dated paragraph
added; [first-deploy-checks] removed from Unprocessed.
**Work processed:** deleted after relocation — [first-deploy-checks].
Advisory: not needed — see this session's chat entry.
