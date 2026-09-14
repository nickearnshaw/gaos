# GAOS: Governed Agentic Operating System

[![lint](https://github.com/nickearnshaw/gaos/actions/workflows/lint.yml/badge.svg)](https://github.com/nickearnshaw/gaos/actions/workflows/lint.yml)

A short specification for running one person's work with AI agents such that no agent can take an irreversible action. It is an integration of known patterns, not a new security model: mandatory access control without trusted downgrade, cross-domain rebuild rather than copy, per-item approval bound to a content hash, a closed capability surface, idempotent effects, and read/act separation with the plan fixed before untrusted content is read. The full text is in [`spec/00-gaos-engineering-spec.md`](spec/00-gaos-engineering-spec.md).

## What it claims

1. `unenforceable` is a first-class evidence value. A requirement that no mechanism reaches is labelled so, is barred from using MUST, and is checked mechanically.
2. Every control declares its reach and what happens when it is trusted further, as a mandatory field on the requirement itself.
3. Drafts about a person are unroutable by field absence. The payload and destination fields do not exist on that record type.
4. Every broker operation declares its reversibility, and every irreversible operation exists only behind a per-item human approval. There is no approve-all and nothing sends itself.

## Status

Version 0.2.0-draft. Draft. May change without notice.

## How to cite

Cite an immutable tag, for example `v0.2.0-draft`, never `main`. R-26 of the specification requires that a conformance claim cite an immutable dated snapshot, and a branch is not one.

## Lint

`npm run lint` checks R-24 and R-25 mechanically: every requirement carries an evidence method, every machine-checked control carries a reach statement and a failure mode, MUST and its siblings appear only where the evidence method permits them, identifiers are unique, and no em dashes have crept in. Plain Node, no dependencies.

## Licence

Sections 3 to 6 of the specification are under the Community Specification License 1.0. Everything else in this repository is under CC-BY-4.0. See [`LICENSE.md`](LICENSE.md) for the split and [`Notices.md`](Notices.md) for the Community Specification License acceptance and exclusion register.

## Name

`GAOS` stands for Governed Agentic Operating System: governed, because every irreversible action sits behind a human decision; agentic, because the work is done by agents; operating system, because the specification describes the environment the agents run inside rather than any one agent. It is a working token and may be replaced.
