# ad30b96 — [sign-address-exposed-in-screenshot] done: the exposed sign address thrown away and confirmed dead by observation, which is also the first real test of SPEC's promise that a leaked address can be discarded

Filed and walked in the same session, alongside [bot-token-exposed-in-screenshot],
which is the same failure in a different window.

The leak: a screenshot of the browser showed the full address bar, putting the
private sign address into the chat as an image. SPEC's reason for that address
being long and random is that nobody should be able to learn whether you are at
your desk by guessing it; anyone reading the transcript afterwards could watch it.
The lower-stakes of the two leaks — it reveals presence, not control.

The fix was already built into the product, which is why it cost one command:
`/newsign` throws the current address away and issues a fresh one.

**The clearing was confirmed by observation rather than by report.** The old
address was still known to this session — the leak itself put it in reach — so it
could be tested directly. Both the sign page and its state endpoint at the old
address now answer 404. It is genuinely dead rather than merely superseded.

That check is also the first real exercise of SPEC's sentence that a leaked address
can be thrown away and the old one stops working the moment it is. It holds.

Worth carrying: the check was only possible because the leak recorded the old value.
A discard whose "before" nobody wrote down would have had to be taken on trust,
which is a weaker close than this one got.

**Red flag: cleared** — designed out by fixing it, not consciously accepted.

**Outcome: done** — the walkthrough named an observable check and that check passed.

The full walkthrough record is in this session's [afk-wire-up] entry.
