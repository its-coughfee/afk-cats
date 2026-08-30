# ad30b96 — [bot-icon] built: the avatar, its credits file, and the sign page's standing artist credit — with the item's "solid silhouette" premise found wrong about the source file and the treatment re-decided live

The item existed because you wanted every bot you run on the server to read as one
family, so this avatar was built to a recipe read off your existing chat bot's icon
rather than designed fresh. That recipe — a circle filling the square, a thin dark
outline, a gradient running deep red at the lower left to steel blue at the upper
right and darkest through the middle — was reproduced by sampling the reference
image's own pixels along that diagonal rather than by matching it from description,
which is why the five gradient stops are the numbers they are.

**The item's premise about the source file was wrong, and it had to be settled with
you rather than around you.** The item says the cat "is a solid filled silhouette".
It is not: the Noun Project file is line-work, a stretching cat drawn as filled
contour paths, with falling leaves around it. That matters because "the solid
silhouette" then names two different pictures. Both were rendered at the real 512
pixels over the real gradient and put in front of you together — the drawing as the
file draws it, and its outer contour filled solid. You picked the drawing as drawn.
The solid fill lost for a reason worth keeping: at the scale the item calls for, it
stops reading as a cat at all and becomes a white shape.

This also settles what the item's rejected option was about. It records that
converting the cat to line-work produced "thin doubled outlines", which is exactly
what tracing the edge of an already-outline drawing does — so the earlier session
was looking at the same artwork and describing its paths as fills, not claiming the
picture was a silhouette.

**You then removed the leaves.** The item had said to leave the drawing's smaller
pieces in place; on seeing the render you asked for every white object that is not
part of the cat to go. The four leaf paths were dropped and the two remaining small
paths kept, since those are the cat's own eye and nose marks. Your instruction
supersedes the item's line, and both are recorded so the change does not read later
as the build ignoring its instructions.

On attribution, nothing was re-decided: the free CC BY 3.0 licence and a credit on
the sign page were settled at planning, and the research behind that is in
`resources/research/noun-project-icon-licence.md`. What the build could not do was
invent the link the item asked for — the drawing's own page URL was nowhere in the
project — so rather than guess one it asked, and you supplied it.

The credit was placed under the photo credit rather than above it, which meant
lifting the photo credit clear of the bottom edge. The photo credit could not carry
the artist line itself: the page rewrites that element's contents on every photo
change, so anything put inside it is destroyed within twenty minutes.

Depth: full — an alternative was seriously weighed, and the losing one is recorded
above with why it lost.

**Tick:** done, confirmed.

**Checked against SPEC:** agrees. SPEC's "the photo is the point" principle already
says the sign page carries a standing credit to the cat drawing's artist, and this
build is what makes that sentence true.

**Files touched:**
- `assets/bot-icon.svg` — new. A 512-unit square holding a circle of radius 248
  filled with the sampled five-stop gradient, a 4-unit `#151013` outline, and the
  cat in white scaled 9.38x (about 1.55x a fit-in-circle) and clipped by the circle
  so its lower body is cropped by the circle's edge. The source file's two `<text>`
  elements carrying the baked-in credit are dropped from the artwork; the four leaf
  paths are dropped at your instruction.
- `assets/bot-icon.png` — new, 512x512, exported with Inkscape 1.4.4.
- `assets/CREDITS.md` — new. Records the CC BY 3.0 obligation, the exact credit
  wording and the drawing's page URL, citing the research file.
- `afk-sign_1.html` — a second `.attribution` element carrying the artist credit
  with the artist's name linked to the drawing's page, plus a CSS rule lifting
  `#attribution` to `bottom: 2.1em` so the new static line sits under it at
  `bottom: 0`.

**Confirmed by:** the PNG header reading 512 by 512; the sign page opened in a
browser showing the artist credit under the photo credit, in the same type, clear
of the cats; and `npm test` passing 24 of 24. The credit was later seen again on the
deployed page during [afk-wire-up]'s walkthrough, which is the same check in
production.

**Routed to Captures:** none from this item.
