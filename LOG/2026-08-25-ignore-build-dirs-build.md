# ac4cbc2 — `node_modules/` and `.wrangler/` added to `.gitignore` before either folder exists

Built exactly as planned: two lines, nothing else touched, no git history rewritten.
The item was placed first in the run because the account and deploy work runs an
`npm install`, which is what creates the folder — settling this beforehand costs
two lines, and settling it afterwards means untangling a commit.

The acceptance asked for a check after an `npm install` and a `wrangler` run, and
neither has happened yet. `git check-ignore` was used instead: it reports both
folder names as matched by the new rules, which is the same question answered
without creating the folders. Nothing about the build is unconfirmed by that
substitution.

**Files touched:** `.gitignore`.
**Routed to Captures:** none.
