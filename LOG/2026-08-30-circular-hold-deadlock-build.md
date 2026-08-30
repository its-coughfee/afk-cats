# 69e18ab — [circular-hold-deadlock] sent: the deadlock reported to the plugin's own project, and this project's first address book written so no later session has to ask where that project is

The report exists because of what [afk-wire-up] ran into on 2026-08-27. The method
holds back work whose foundation the record shows built but not verified. Applied
literally, that rule would have held [afk-wire-up] forever: the registration script
it waited on could only ever be verified by step 6 of that same walkthrough, so the
blocker could not resolve until the held item ran and the held item could not run
until the blocker resolved.

What made it worth reporting rather than just working around is the second half:
it cannot be seen from the queue. The queue digest reported the blocker as
absent-and-built, which reads like a resolved reference rather than an unresolvable
one, and the planning procedure's loop check only covers blockers that are
themselves queue items — this loop runs through a verification, which is not an item
at all. It surfaced only because someone read the record behind the slug by hand.

The message was shown in full and approved before anything was written outside this
project, which is the rule for anything leaving the machine. One editorial decision
inside it is worth recording: the return path is written as `Desktop/AFK-cats`
rather than in full, because the full path carries your name into a document that
gets committed in another repository, and the scrub checklist bars that.

The address book was the other half of the job, and it answers a complaint this
session inherited: a message went to that project on 2026-08-26 and nothing recorded
where it went, so this session had to ask for the folder again. The file records the
folder, how it was identified — it holds the plugin's own `plugin/` source, which is
what distinguishes it from the surrounding planning projects — what belongs there
and what does not, and the filename convention. The general version of that
complaint is still open as [send-does-not-record-correspondent].

**This session then confirmed the deadlock's own premise, from the other end.**
[afk-wire-up]'s step 6 ran for the first time with real credentials and printed all
four commands back. So the script that could not be verified is now verified, by the
step that was the only thing capable of verifying it — which is exactly the shape
the report describes.

Depth: short.

**Tick:** done, confirmed.

**Checked against SPEC:** no interaction. The work touches correspondence and
records rather than the product.

**Files touched:**
- The plugin's development project gained
  `INBOX/2026-08-30-from-afk-cats-circular-hold-deadlock.md`, new.
- `INBOX/sent.md` — gained its line for the send.
- `INBOX/.address-book.md` — new.

**Confirmed by:** the message file present in that project's inbox, `sent.md`
naming it, and the address book existing.

**Not carried by this commit, and worth knowing:** `INBOX/` is gitignored in this
project, so neither `sent.md` nor the new address book is under version control.
They are local records by design, but it means git holds no previous version of
either — an edit to them cannot be reverted from history, and a later session
reading this entry should not expect to find them in the repository.

**Routed to Captures:** none from this item.
