# GAOS: an opinionated engineering specification for a governed single-operator agentic workspace

**Version:** 0.2.0-draft. **Date:** 2026-09-14. **Status:** Draft. May change without notice.
**Licence:** Community Specification License 1.0 for sections 3 to 6; CC-BY-4.0 for everything else.

> `GAOS` is a working token, replaceable in one pass. Airlock, Interlock and Threshold are excluded: the MHRA runs an "AI Airlock" regulatory sandbox, "Interlock" names both security products and a ransomware group, and "Threshold" is overloaded by threshold cryptography.

---

## 0. What this is

A short specification for running one person's work with AI agents such that no agent can take an irreversible action. It is an **integration of known patterns**, not a new security model. The patterns are:

| Pattern | Source |
|---|---|
| No write down; classify at creation; no trusted downgrade | Bell-LaPadula (1973); decentralised information flow control (Myers, 1997) |
| Move across a trust boundary by rebuilding, never copying | NSA "Raise the Bar" cross-domain baseline (2018); NCSC safely importing data; content disarm and reconstruction |
| Per-item human approval bound to the reviewed content | Maker-checker; WYSIWYS; GitHub "dismiss stale approvals on new commits" |
| Least authority through an enumerated capability surface | Saltzer and Schroeder (1975); object-capability systems; allowlist over denylist |
| Idempotent external effects | Stripe idempotency keys |
| The component that reads untrusted content holds no capability | Dual LLM pattern (Willison, 2023) |
| The tool-call plan is fixed before untrusted content is read | Plan-then-execute (Beurer-Kellner et al., 2025); CaMeL (Debenedetti et al., 2025); Meta Agents Rule of Two (2025) |
| Per-requirement verification method | INCOSE verification methods; NIST SP 800-53A |
| Per-control assumptions and limits | Assurance cases (GSN, CAE, ISO/IEC 15026); Common Criteria protection-profile assumptions |
| Implementation Conformance Statement | ISO 9646 / ETSI |

What this specification adds, and claims as its contribution:

1. **`unenforceable` is a first-class evidence value.** A requirement that no mechanism reaches is labelled so, is barred from using MUST, and is checked mechanically. The convention is published as a convention.
2. **Every control declares its reach and what happens when it is trusted further.** Assurance cases do this in a separate artefact; here it is a mandatory field on the requirement itself.
3. **Drafts about a person are unroutable by field absence.** The payload and destination fields do not exist on that record type, so no sequence of mistakes can route it.
4. **Every broker operation declares its reversibility**, and every irreversible operation exists only behind a per-item human approval. There is no approve-all and nothing sends itself.

Everything else is borrowed, and section 8 says from whom.

## 1. Scope and assumptions

- **One operator.** The human who approves, sends, lands and promotes. Multi-agent delegation, agent identity and cross-organisation trust are out of scope; see AAIF, A2A, CoSAI and IETF WIMSE for that work.
- **Attended.** Every run starts, does its work and stops. No requirement is satisfiable only by a daemon. There is no unattended mode.
- **Bounded, not prevented.** Prompt injection is assumed to succeed eventually. This specification bounds the blast radius by structure. It does not track information flow through the agent's reasoning, so injected content can still shape the arguments and content of operations the plan already permits. That is the known residual of plan-then-execute, and it is accepted here rather than solved.
- **Technology neutral.** No language, store, transport or product is named. Where a requirement depends on a property of the substrate, the property is the requirement.
- **Not compliance.** Nothing here states what any law requires. An adopter maps requirements to their own regime using the NIST OLIR relation types (subset of, intersects with, equal to, superset of, no relationship), with an as-of date per entry, in a document they own.

## 2. Vocabulary

Twelve terms. Each has exactly this meaning wherever it appears.

| Term | Meaning |
|---|---|
| **Artefact** | Any unit of content with a placement. One stable identifier for its lifetime. |
| **Tier** | A named audience with an enumerable reader set. Ordered by width. |
| **Placement** | The tier an artefact belongs to, decided before its content exists. |
| **Crossing** | Movement of content to a wider tier: a rewrite of one document, landed by a human. |
| **Outbox item** | Exactly one outbound artefact awaiting a per-item human decision. |
| **Grade** | Team-grade: full text and a destination. Person-grade: title, one context line, a pointer, and nothing else. |
| **Approval** | A human authorisation of one action on one payload hash, with an expiry. |
| **Broker** | The only path from an agent to a tool: a closed, enumerated set of operations. |
| **Reversibility** | A declared property of each broker operation. Irreversible means the external effect cannot be undone by the operator alone through an enumerated inverse operation before any third party can observe it. |
| **Untrusted content** | Anything from outside the trust boundary, including anything a tool returns. Data, never instruction. |
| **Control** | A rule the tooling refuses to break. Evidence method `machine-checked`. |
| **Convention** | A rule stated in prose that a model or person is asked to follow. Evidence method `assessed` or `unenforceable`. Never carries MUST. |

## 3. Requirement format

Each requirement carries:

- **Evidence:** `machine-checked` (a fixture decides it), `record` (a named, dated, owned document exists), `attested` (a human signs per item), `assessed` (rated on the ISO/IEC 33001 bands: not, partially, largely, fully achieved), or `unenforceable` (stated; enforced by nothing).
- **Reach:** the paths on which the control is actually in force.
- **If trusted further:** what happens when it is relied on beyond that reach.

BCP 14 keywords apply. MUST is permitted only where evidence is `machine-checked`, `record` or `attested`. This rule is itself R-25.

Identifiers `R-nn` and `FX-nn` are opaque and never reused.

## 4. Requirements

### A. Placement

**R-01 Placement precedes writing.** An artefact MUST have a recorded placement before any content is written to it. No operation writes content to an unplaced artefact.
Evidence: machine-checked. Reach: artefacts created through the control plane. If trusted further: content composed elsewhere and imported has no decision behind it; the import is the decision, made silently.

**R-02 Reader sets are enumerable; a label is not a grant.** Every tier MUST have a written, enumerable reader set. An implementation MUST refuse placement into a tier whose readers cannot be listed, and MUST NOT accept a host's visibility setting as evidence of a reader set.
Evidence: machine-checked, plus record for the written set. Reach: tiers declared in the binding. If trusted further: a list exists on paper while the underlying host grants access by another route.

**R-03 Placement history is append-only; deletion is not a remedy.** A change of placement MUST be recorded with tier, time, actor and reason and MUST NOT be edited. No operation MAY be described as undoing a placement or a publication. A misplacement MUST be recorded as an incident.
Evidence: machine-checked for the surface; record for the incident. Reach: the control plane's own surface. If trusted further: the operator believes a delete on a shared host narrowed the audience after references and history have outlived it.

**R-04 The forbidden class never enters as content.** The adopter MUST define a class of content that is referenced by identifier only. Deterministic detection MUST run on the capture path before a model or third party sees content, and MUST stop the run and record a refusal on a hit. The adopter MUST state, in a record, what detection is expected to miss.
Evidence: machine-checked for the stop path; record for the definition and the false-negative posture. Reach: the capture path. If trusted further: detection is mistaken for the control. The control is the reference-by-identifier rule; detection is the tripwire, and the operator's own hand-typed notes bypass both.

**R-05 No downward path.** No operation MAY move or copy content from a wider tier to a narrower one. The operation is absent, not guarded. This is stricter than classic mandatory access control, which permits trusted downgrade; here there is no trusted subject.
Evidence: machine-checked. Reach: the operation surface. If trusted further: an operator with access to both tiers moves content by hand.

### B. Crossings

**R-06 A crossing is a human-landed rewrite of one document.** Widening the audience of content MUST produce a new artefact written for the destination reader set. No operation moves the source bytes. A landing MUST name one source, one destination inside a declared containment root, and an approval reference, and MUST be performed by a human. An agent MAY stage; an agent MUST NOT land.
Evidence: machine-checked. Reach: crossings through the control plane. If trusted further: copy and paste. A destination that resolves inside the root but links elsewhere defeats containment; containment reaches resolved paths, not targets.

**R-07 Read-back, then land once.** Before landing, the exact final text MUST be presented and explicitly confirmed. A change after confirmation MUST void it. A landing MUST refuse to overwrite an existing artefact and MUST refuse to reland. The landing record MUST carry destination, content hash, approval reference, actor and time.
Evidence: machine-checked for void-on-change, no-overwrite, no-reland and the record; attested for the confirmation. Reach: text presented through the control plane. If trusted further: the operator confirms without reading. The control guarantees presentation, never attention.

### C. The Outbox

**R-08 One item per outbound artefact.** Every artefact that would leave the system MUST be exactly one Outbox item. No irreversible operation (R-15) is reachable except by acting on an item.
Evidence: machine-checked. Reach: outbound acts through the control plane. If trusted further: a binding that sends on the control plane's behalf sends things the Outbox never saw.

**R-09 No approve-all; nothing sends itself.** No operation MAY arm, approve or send more than one item in a single act. No schedule, retry, recovery path or error handler MAY send. There is no unattended mode.
Evidence: machine-checked. Reach: the approval and send surfaces. If trusted further: per-item approval at volume becomes a fast sequence of single clicks. The control reaches the interface, never the attention. If triage routinely produces more items than can be read, the workflow is misconfigured and no requirement catches it.

**R-10 One approval, one payload, one action, once, within a window.** An approval MUST record a content hash over the exact payload presented, name the single action it authorises, and carry an expiry. On acting, the hash MUST be recomputed and the action refused on mismatch, on expiry, or on an action other than the one named. An item in state `sent` MUST NOT be acted on again. The first recorded destination MUST be immutable.
Evidence: machine-checked. Reach: payloads presented and acted upon through the control plane. If trusted further: an operator who retypes approved text into another surface sends unapproved content under a valid-looking approval. A transport retry below the control plane is reached by R-16, not by this.

**R-11 Exactly three per-item actions, and an agent has one of them.** The per-item actions MUST be arm, rewrite and kill, and no other. Arming MUST be absent from every surface an agent can reach and MUST NOT appear in the broker. An agent-initiated rewrite of an armed item MUST be refused.
Evidence: machine-checked. Reach: the item surface and the broker. If trusted further: an operation that creates an approval record under another name is arming. This requirement is only as strong as R-14 and R-19.

**R-12 Kill is a move; the refused set is read.** Killing MUST move the item to a refused set that is retained and readable. No operation MAY delete an item or a refused item. Before drafting, refused titles MUST be read and a draft matching one MUST NOT be offered.
Evidence: machine-checked. Reach: drafts through the control plane. If trusted further: title matching is not meaning matching; a reworded kill passes. A refused set pruned by hand outside the control plane is a delete by another name.

**R-13 Person-grade drafts are unroutable by construction.** A draft about a person MUST carry a title, one context line and a pointer into the narrowest tier, and nothing else. The payload and destination fields MUST be structurally absent from that record type, not empty. Team-grade drafts MUST carry full text under a grammar parseable without a model, and a destination as `scheme:identifier`. A destination in prose MUST be unroutable.
Evidence: machine-checked. Reach: items created through the control plane. If trusted further: the title carries the sensitive content, and titles appear in every list. Absence of a destination does not make a title safe.

### D. The broker

**R-14 Agents reach tools only through the broker, and the broker is closed.** An agent MUST NOT invoke any tool except through the broker. The broker MUST expose a closed, enumerated set of operations and MUST NOT expose a general-purpose invocation, including any enumerated operation that takes a free-form command, script, query or path selecting the underlying tool.
Evidence: machine-checked. Reach: the agent environment as confined by R-19. If trusted further: without confinement below the client, an agent that runs arbitrary code reaches tools directly and the broker is decoration.

**R-15 Every operation declares its reversibility; irreversible operations live behind the Outbox.** The binding MUST declare, for every broker operation with an external effect, whether it is reversible or irreversible, and MUST name the inverse operation for each reversible one. Send, publish, push, merge, promote, erase, and any widening of a reader set are irreversible by definition and MUST NOT be declared otherwise. Irreversible operations MUST be absent from the agent-reachable surface and reachable only by a human acting on an Outbox item. Reversible operations MAY be invoked by the Actor from the committed plan.
Evidence: machine-checked for absence and routing; record for the declaration. Reach: operations declared in the binding. If trusted further: a mis-declared operation is the whole risk. An operation declared reversible because an inverse exists in principle, when the inverse is not enumerated or a third party observes the effect first, is irreversible wearing a label. ToolEmu and R-Judge are the reference points for classifying tool risk; this specification supplies no classifier.

**R-16 Idempotency keys.** Every operation with an external effect MUST carry an idempotency key, and a repeat with the same key MUST NOT repeat the effect.
Evidence: machine-checked. Reach: endpoints that honour the key. If trusted further: an endpoint that ignores the key makes the guarantee local to the control plane's own state, which is the half that was not the problem.

**R-17 Named calls, not prohibited data.** A workflow's access to a store MUST be an enumerated list of permitted operations, checked before the call. A description of data the workflow may not read MUST NOT be the only control.
Evidence: machine-checked. Reach: the list, at call time. If trusted further: a permitted call that returns more than expected is still permitted; the rule checks the call, never the response.

**R-18 The broker fails closed.** On an unknown operation, an unavailable policy, an expired approval or any unresolvable condition, the broker MUST refuse, record a refusal, and produce no external effect. There is no degraded mode.
Evidence: machine-checked. Reach: conditions the broker can detect. If trusted further: a condition it cannot detect is not one it fails closed on.

**R-19 Confinement is enforced below the client; no standing identities; no self-modifying policy.** The substrate, not the agent client, MUST enforce the execution boundary. No agent identity MAY hold a capability between runs. An agent MUST NOT be able to modify the tier definitions, the broker's operation set, the reversibility declarations or this requirement set.
Evidence: record for the confinement mechanism and its verification schedule; machine-checked where the substrate exposes a check, and for identities and policy write paths. Reach: the environment named in the binding; the running surface, not the source repository. If trusted further: confinement configured once and never re-verified after a substrate upgrade is a claim about the past. An agent that can edit the repository holding the policy can edit the policy.

### E. Untrusted content

**R-20 Read and act are separated.** The component that reads untrusted content MUST NOT hold any capability with an external effect.
Evidence: machine-checked. Reach: components as actually separated. If trusted further: two components in one process with one credential are one component with two names.

**R-21 The plan is committed before reading.** The set of operations a run may invoke MUST be committed before any untrusted content is read and MUST be immutable for the run.
Evidence: machine-checked. Reach: the run boundary. If trusted further: a run that ends and immediately starts another with a plan derived from what the first read is the same escalation across two runs. Within a run, injected content can still choose arguments and content for permitted operations; see section 1.

**R-22 Untrusted content stays labelled.** Content from outside the boundary MUST carry an untrusted label wherever it is carried, including when quoted.
Evidence: machine-checked. Reach: content entering through a capability. If trusted further: content the operator pastes in carries no label.

**R-23 Instructions in untrusted content are not followed.** *Convention.* An agent SHOULD NOT act on instructions found in untrusted content.
Evidence: unenforceable. Reach: none. If trusted further: treating this as a control is the failure this specification exists to prevent. The blast radius is set by R-14, R-15, R-20 and R-21, and by nothing else. There is deliberately no fixture.

### F. Honesty

**R-24 Every requirement declares an evidence method; every control declares reach and failure mode.** Every requirement here, and in any adopter's tailoring, MUST declare one evidence method from the closed vocabulary in section 3. Every `machine-checked` requirement MUST state its reach and what happens when trusted further.
Evidence: machine-checked for presence. Reach: presence of the fields. If trusted further: a reach statement written to satisfy the check passes the check. All three honesty rules compare declared fields against each other, never against reality.

**R-25 Keyword strength matches evidence.** MUST, MUST NOT, SHALL and REQUIRED MUST NOT appear on a requirement evidenced as `assessed` or `unenforceable`; such a requirement uses SHOULD and is labelled a convention.
Evidence: machine-checked. Reach: the published text. If trusted further: an evidence method chosen to unlock a stronger keyword defeats the rule from the inside.

**R-26 Claims cite a dated snapshot.** A conformance claim MUST cite an immutable dated snapshot, never a moving reference.
Evidence: machine-checked. Reach: the claim as published. If trusted further: a snapshot that was never immutable gives a stable-looking citation over shifting text.

## 5. Conformance

**Targets.** Three: the control-plane implementation (`CTL`), the deployment binding (`BND`, which holds the substrate properties and the reversibility declarations), and the operator (`OPR`, who is bound by R-07, R-09 and R-10 and evidences them by attestation). Binding documents may be private; the claim about them is public.

**Evidence.** By negative fixture where the method is `machine-checked`. A fixture is a technology-neutral record: `FX-nn`, requirement, precondition, the single action attempted, the required outcome (a refusal), the forbidden side effect that must be absent, and the observation points where each observable is read. Both halves of a refusal are observables at the implementation's boundaries, which is what makes fixtures portable. The reference pair:

- **FX-01 (positive, R-10).** Item `armed`, approval bound to hash H1 over payload P1, unexpired, naming send. Action: send with payload P1. Outcome: `sent`; destination receives P1.
- **FX-02 (negative, R-10).** Same precondition. Action: change payload to P2 (hash H2), then send. Outcome: refusal; state unchanged. Forbidden side effects: no destination receives P1 or P2; the ledger records a refusal, not a send; the approval over H1 is not consumed as authorising H2. Observation points: the binding's send boundary; the run ledger; the approval record.

An implementer supplies an adapter that establishes preconditions, attempts actions, and reports for each observation point whether an external effect occurred. An adapter that cannot report external effects cannot run negative fixtures, and a claim made without them is a claim about positives only and MUST say so.

**Statement.** A claim is an Implementation Conformance Statement (the ISO 9646 term, used in its ISO sense): snapshot cited, claimant, date, target, and per requirement the evidence method, result, evidence reference and any reach deviation. `not-claimed` is a legitimate result and is better than a missing row.

**What it proves.** That on the paths the fixtures exercise, the forbidden things are refused; that named records exist; that a named person attested. It does not prove the implementation is safe, the operator attentive, the reach statements true, or any law satisfied. There is no authority, no mark and no audit.

## 6. Known limits

Stated because a limits section that lists only what is addressed is marketing.

1. **Injection succeeds.** Structure bounds the damage. No flow tracking through reasoning; the plan-then-execute residual applies. CaMeL-style control-and-data-flow extraction would close it and is out of scope for this version.
2. **The operator acts outside the control plane.** Copy, paste, retype, forward by hand, grant access directly: all outside every control here. Most residual risk reduces to this line.
3. **Inattention.** Every control guarantees presentation, never attention. The operator's attention is a depletable asset and the design can deplete it.
4. **Titles.** A person-grade item's title is displayed everywhere. A title that carries the sensitive content defeats R-13.
5. **Reversibility is declared, not proven.** R-15 is worth exactly what the binding's declarations are worth.
6. **A compromised substrate.** If R-19 fails, the broker is decoration.
7. **A tool provider that reads what it is sent.** Not addressed. Clearance of providers is an organisational obligation outside this specification.
8. **Wrong content.** This governs where content goes and who approved it, never whether it is true or fair.
9. **One operator.** Delegation, multi-agent orchestration and agent identity are not covered.
10. **The honesty rules are self-referential.** R-24 to R-26 compare declared fields with each other. A determined author satisfies all three and still misleads. This is the limit least defensible and most likely to be hit.

## 7. What was removed from 0.1.0 and why

| Removed | Why |
|---|---|
| Extension model, packs, variation points, conflict records | Speculative architecture for regimes the author does not operate in. An adopter tailors by adding requirements in a document they own, add-only, never relaxing. That sentence is the whole extension model. |
| Regulatory rationale mapping | Replaced by a one-line instruction to use OLIR relation types in an adopter-owned document. Publishing a mapping for one jurisdiction, by a non-lawyer, was the highest-exposure content for the least benefit. |
| Extended modules: Memory, Observability, Automation, Obligations | Not part of the invariant. Memory hygiene is event-sourcing discipline and belongs in the binding. Automation gates are moot in an attended-only specification. Obligations bind an organisation and belong in that organisation's management system, not here. |
| Organisation as a conformance target | Follows from removing the obligations module. `OPR` remains, because three requirements are discharged by a human act. |
| The claim that no comparable specification publishes per-control reach | False. Assurance cases and Common Criteria assumptions do. The claim now is that the field is mandatory and inline. |
| Original-sounding presentation of the ICS term, the OLIR relation types, the SPICE bands and verification-method declaration | Attributed in section 0 and section 8. |
| Workflows, decision records, governance, code of conduct, security policy, changelog | Process for a project that has one author and no adopters. Reinstated when a second person appears. |

## 8. Attribution

- Bell, D. E. and LaPadula, L. J. (1973). Secure Computer Systems: Mathematical Foundations.
- Myers, A. C. and Liskov, B. (1997). A decentralized model for information flow control.
- Saltzer, J. H. and Schroeder, M. D. (1975). The Protection of Information in Computer Systems.
- NSA NCDSMO (2018, 2019). Cross Domain Solution Design and Implementation Requirements, "Raise the Bar". NCSC, Pattern: safely importing data.
- Willison, S. (2023). The Dual LLM pattern for building AI assistants that can resist prompt injection.
- Debenedetti, E. et al. (2025). Defeating Prompt Injections by Design (CaMeL). arXiv:2503.18813.
- Beurer-Kellner, L. et al. (2025). Design Patterns for Securing LLM Agents against Prompt Injections. arXiv:2506.08837.
- Meta AI (2025). Agents Rule of Two.
- Ruan, Y. et al. (2023). ToolEmu. Yuan, T. et al. (2024). R-Judge.
- INCOSE Systems Engineering Handbook, verification methods. NIST SP 800-53A, assessment methods.
- ISO/IEC 33001 (formerly ISO/IEC 15504), process capability bands.
- ISO/IEC 15026-2, assurance cases. Common Criteria, Part 1, security problem definition and assumptions.
- ISO/IEC 9646, conformance testing methodology, including the Implementation Conformance Statement.
- NIST IR 8278 Rev. 1 and IR 8477, OLIR relationship types.
- Stripe API reference, idempotent requests. GitHub docs, branch protection, dismiss stale pull request approvals.
- RFC 2119 and RFC 8174 (BCP 14).
