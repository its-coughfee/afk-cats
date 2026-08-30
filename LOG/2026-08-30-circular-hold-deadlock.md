# 3927d87 — [circular-hold-deadlock] processed and cleared: the deadlock confirmed as a real method gap against the version now installed, and the mail route settled

The item was filed on 2026-08-27 by Claude, not directed by the user, and it left
one question open: is the circular hold a real gap in the method, or a one-off of
this project's shape? A planning run had to settle that before anything could be
sent.

It is a real gap. Three things were checked against version 1.21.1-test2, which
this machine picked up on 2026-08-29 — so this is the version people are running
now, not the one the case was found on. The hold-back rule in done-plan.md still
reads "built only, not enough — keep the dependent below", with no exception for
the case where the held item is itself the only possible verification of what
holds it. The loop check in plan.md still only reaches loops made of blockers
that are themselves queue items, so a loop running through a verification that is
not an item at all is invisible to it by construction. And the shape generalises
well past this project: it is "the only thing that can exercise X is a step
inside an item held on X", which arises whenever a build produces a script, a
deploy or a migration whose first real run happens inside a walkthrough that
depends on it.

The route was settled the same session. The method's first choice is mail to the
project the plugin is developed in, delivered as a file on this machine, and that
is how the walkthrough-heading report went out on 2026-08-26. But delivery works
off an address book at `INBOX/.address-book.md`, and this project has none — the
earlier session evidently found the path some other way and never recorded it,
so this session had to ask for it again. The user gave the folder and it was
confirmed present and confirmed to be the right project by the `plugin/` source
folder inside it. The build will record it in the address book so no later
session has to ask.

Two routes were refused. A GitHub issue on the plugin's repository would publish
this under the user's own account when nothing here needs to be public. The
flintcraft.tech report form does not land in the queue that would fix it — where
mail does both jobs at once.

Because this was Claude-noticed rather than user-raised, the offer to report was
made once and the user took it.

**Queue changes:** [circular-hold-deadlock] rewritten with its build
instructions and moved from Unprocessed into Processed, cleared to run.

**Work processed:** kept — [circular-hold-deadlock].
