# Fixture format

A fixture is the technology-neutral record described in section 5 of the specification. Each fixture is one file in this folder, named `FX-nn-<slug>.md`, and carries the fields below.

- `id`: the fixture identifier, `FX-nn`. Opaque and never reused, even after a fixture is withdrawn.
- `requirement`: the `R-nn` the fixture evidences.
- `kind`: `positive` (the permitted action succeeds) or `negative` (the forbidden action is refused).
- `precondition`: the state the adapter establishes before acting.
- `action`: the single action attempted. Exactly one.
- `required outcome`: what the implementation is required to do in response; for a negative fixture, a refusal.
- `forbidden side effects`: negative fixtures only. The external effects that must be absent. Each one must be an observable.
- `observation points`: where each observable is read, at the implementation's boundaries.

Both halves of a refusal are observables at the implementation's boundaries, which is what makes fixtures portable.

An adapter that cannot report external effects cannot run negative fixtures, and a claim made without them is a claim about positives only and MUST say so.
