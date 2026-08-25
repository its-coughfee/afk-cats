# 1cd6a89 — Kept and cleared the work that keeps `node_modules` and `.wrangler` out of git, after checking neither folder had been committed

The capture claimed `.gitignore` listed neither folder and that the first commit
after the deploy would sweep thousands of files in. Both halves were checked
rather than taken on trust: `.gitignore` holds `.throughliner/` and `INBOX/` and
nothing else, and neither build folder exists on disk yet. So the work is purely
preventive and no git history needs rewriting — a materially different item from
one cleaning up a mess already made.

It was placed first in the cleared run despite being the smallest piece of work.
The reasoning is that the account and deploy work runs an `npm install`, which is
what creates the folder; settling this before that happens costs one line each in
a file, and settling it afterwards means untangling a commit.

**Queue changes:** [ignore-build-dirs] moved from Unprocessed to Processed,
cleared to run, and given a build block.
**Work processed:** kept — [ignore-build-dirs].
