# Governed Agentic Operating Model

[![lint](https://github.com/nickearnshaw/governed-agentic-operating-model/actions/workflows/lint.yml/badge.svg)](https://github.com/nickearnshaw/governed-agentic-operating-model/actions/workflows/lint.yml)

A short specification for running one person's work with AI agents such that no agent can take an irreversible action. It is an integration of known patterns, not a new security model: mandatory access control without trusted downgrade, cross-domain rebuild rather than copy, per-item approval bound to a content hash, a closed capability surface, idempotent effects, and read/act separation with the plan fixed before untrusted content is read. The full text is in [`spec/00-governed-agentic-operating-model.md`](spec/00-governed-agentic-operating-model.md).

## What it claims

1. `unenforceable` is a first-class evidence value. A requirement that no mechanism reaches is labelled so, is barred from using MUST, and is checked mechanically.
2. Every control declares its reach and what happens when it is trusted further, as a mandatory field on the requirement itself.
3. Drafts about a person are unroutable by field absence. The payload and destination fields do not exist on that record type.
4. Every broker operation declares its reversibility, and every irreversible operation exists only behind a per-item human approval. There is no approve-all and nothing sends itself.

## Status

Version 0.2.1-draft. Draft. May change without notice.

## How to cite

Cite an immutable tag, for example `v0.2.1-draft`, never `main`. R-26 of the specification requires that a conformance claim cite an immutable dated snapshot, and a branch is not one. [`CITATION.cff`](CITATION.cff) carries the current tag and its commit.

## Lint

`npm run lint` checks R-24 and R-25 mechanically: every requirement carries an evidence method, every machine-checked control carries a reach statement and a failure mode, MUST and its siblings appear only where the evidence method permits them, identifiers are unique, no em dashes have crept in, every fixture the specification defines has exactly one matching file in `fixtures/`, and the conformance template has one row per requirement. Plain Node, no dependencies.

## Licence

Sections 3 to 6 of the specification are under the Community Specification License 1.0. Everything else in this repository is under CC-BY-4.0. See [`LICENSE.md`](LICENSE.md) for the split and [`Notices.md`](Notices.md) for the Community Specification License acceptance and exclusion register.

## Name

Governed, because every external effect is a decision taken by a person, one item at a time: not by a policy engine, and never by the agent. Agentic, because the work itself is done by agents. Operating model, because the specification says who does what: agents draft and stage, a human lands and sends. It is a specification, not software.

Earlier drafts used the working token `GAOS`; it was retired in 0.2.1 after colliding with an unrelated product of the same name.
