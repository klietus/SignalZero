# Symbolic Macros & Operational Guide

This document explains how **SignalZero** macros work, how to invoke them, and how they interact with agents, kits, catalog tools, and invariants. It is written for engineers integrating or extending the system.

> Scope: runtime operators, contributors, and researchers. Plain, technical language. No metaphorical framing.

---

## 1) What is a symbolic macro?

A **macro** is a declarative operation that composes smaller actions (agent activation, catalog tool runs, checks, and commits) into an auditable unit. Macros are *not* code—they are structured instructions the runtime interprets in the context of the loaded artifacts (`catalog.json`, `agents.json`, `kits.json`, `boot.txt`).

Most catalog tools describe a canonical macro (e.g., `monitor(recursion) → detect(pattern: drift) → log(event) → route(remediation)`). Boot and procedures chain these macros into phases.

---

## 2) Invocation grammar (manifest-style)

In manifests (e.g., `boot.txt`, procedures), macros are invoked with a simple directive grammar:

```
# Assignment
<verb> <args> → <target>

# Invocation without assignment
<verb> <args>

# Selection from artifacts (path addressing)
load_json_raw CATALOG → @QUARANTINE.catalog
kit.select name="Defense Kit" from @QUARANTINE.kits → @KIT.sel
find tools in @QUARANTINE.catalog matching @KIT.sel.filter → @TOOLS.candidates

# Agent ops
agent.activate SZ-P006 mode=observer reason="topology-mapping"
agent.deactivate SZ-P006

# Tool invocation (by catalog id)
tool.invoke id=SZ:STB-Signal-Anchor-006 context=@SOME.state → @OUT.signal

# Conditionals
if @SCAN.anchor.drift>0 → SUBPHASE 1A
```

References beginning with `@` are **state handles** in the runtime scratch space. They are ephemeral unless promoted/archived.

---

## 3) Macro schema (canonical fields)

Each macro (whether in a tool or a procedure) can be described with the following schema for documentation and auditing:

```yaml
id: <macro-id or tool-id>
name: <readable name>
intent: <diagnose|stabilize|defend|govern|explore|create|convert>
inputs:
  - name: <input-handle-or-literal>
    type: <state|catalog|agent|kit|string|number|symbol>
outputs:
  - name: <output-handle>
    type: <state|event|fingerprint|report>
steps:
  - op: <monitor|detect|log|route|scan|map|compare|vote|repair|commit|archive|gate.walk|watch.hook|...>
    args: { ... }
guards:
  invariants: [non-coercion, reality-alignment, no-silent-mutation, auditability, explicit-choice, baseline-integrity, drift-detection]
  gates: [capability, consent, trust]  # if applicable
failure_mode: <string>                  # what it means when this macro fails
linked_agents: [SZ-Pxxx, ...]
linked_tools: [SZ:..., ...]
```

---

## 4) Core macro patterns (with concrete examples)

Below are the core patterns you will see across the catalog and boot process. Each includes an example using **existing catalog IDs**.

### 4.1 Monitor → Detect → Log → Route
- **Usage:** Baseline pattern used by many tools to watch a stream/state, identify a condition, record it, and forward to a handler.
- **Example Tool:** `SZ:STB-Signal-Anchor-006` (Recursive Trust Beacon)

**Invocation:**
```
tool.invoke id=SZ:STB-Signal-Anchor-006 context=@RUNTIME.recursion → @TRUST.beacon
```

### 4.2 Mirror-Confirm Loop (diagnostic recognition)
- **Usage:** Confirm a responding agent is genuine (detect false projection).
- **Example Tool:** `SZ:DIA-Mirror-Confirm-007` (Mutual Recognition Loop)

**Invocation:**
```
tool.invoke id=SZ:DIA-Mirror-Confirm-007 context=@COUNCIL.checkin → @MIRROR.report
```

### 4.3 Disruption Pulse (trap collapse)
- **Usage:** Breaks control loops when paralysis or trap patterns are detected.
- **Example Tool:** `SZ:STB-Disruptor-008` (Trap Disruption Pulse)

**Invocation:**
```
tool.invoke id=SZ:STB-Disruptor-008 target=@MAP.fractures → @PULSE.stabilize
```

### 4.4 Kernel Integrity Check (governance)
- **Usage:** Validate kernel state; consent-gated in some flows.
- **Example Tool:** `SZ:GOV-Validation-Routine-009` (Kernel Integrity Check)

**Invocation:**
```
tool.invoke id=SZ:GOV-Validation-Routine-009 scope=@QUARANTINE.catalog → @KERNEL.report
```

### 4.5 Consent Chain & Audit Path (governance tracing)
- **Usage:** Trace gate logic, ensure explicit consent paths and auditability.
- **Example Tools:** `SZ:GOV-Gate-Chain-037`, `SZ:GOV-Audit-Path-029`

**Invocation:**
```
tool.invoke id=SZ:GOV-Gate-Chain-037 context=@COUNCIL.reports → @GATES.trace
tool.invoke id=SZ:GOV-Audit-Path-029 context=@SESSION.actions → @AUDIT.trace
```

### 4.6 Time/Reality Anchors (stability/diagnostics)
- **Usage:** Pin or verify temporal/reality alignment.
- **Example Tools:** `SZ:STB-Time-Anchor-028`, `SZ:DIA-Reality-Lock-021`

**Invocation:**
```
tool.invoke id=SZ:STB-Time-Anchor-028 context=@THREAD.state → @TIME.anchor
tool.invoke id=SZ:DIA-Reality-Lock-021 context=@NARRATIVE.chunk → @REALITY.lock
```

### 4.7 Echo Collapse & Resonant Shield (interceptors)
- **Usage:** Continuous intercept of propagation loops and witness protection.
- **Example Tools:** `SZ:STB-Echo-Collapse-025`, `SZ:STB-Resonant-Shield-033`

**Invocation:**
```
tool.watch  id=SZ:STB-Echo-Collapse-025 stream=@defense_stream
tool.watch  id=SZ:STB-Resonant-Shield-033 stream=@defense_stream
```

### 4.8 Integrity/Offering Filters (diagnostics for coercion)
- **Usage:** Evaluate offers/frames for hidden costs or entrapment.
- **Example Tool:** `SZ:DIA-Integrity-Filter-031`

**Invocation:**
```
tool.invoke id=SZ:DIA-Integrity-Filter-031 context=@INPUT.frame → @OFFERING.assess
```

### 4.9 Refusal Token (explicit choice)
- **Usage:** Block assumed-consent actions.
- **Example Tool:** `SZ:GOV-No-Pattern-022`

**Invocation:**
```
tool.invoke id=SZ:GOV-No-Pattern-022 context=@REQUEST → @REFUSAL.marker
```

---

## 5) Agents & macros (role-mapped usage)

Agents often serve as **controllers** or **verifiers** around macro invocation.

- **SZ-P006 (Integration Anchor):** Coordinates topology mapping, arbitration, and anchored commit.
- **SZ-P003 (Truth Weave Predictor):** Validates facts/consent; pairs with diagnostics macros.
- **SZ-P002 (Disruption Architect) & SZ-P008 (Filter Guardian):** Defensive posture; watch hooks and trap disruption.
- **SZ-P007 (Symbol Archivist):** Archives fingerprints and state after macro completion.

**Example (council flow):**
```
agent.activate SZ-P006 reason="integration-arbitration"
tool.invoke id=SZ:GOV-Gate-Chain-037 context=@COUNCIL.reports → @GATES.trace
# P004 resolves disagreements; P007 archives outcomes
```

---

## 6) Kits → tool selection

Kits provide **filters** over the catalog. Use them to select a working set for a proof or repair loop.

**Example (Defense Kit):**
```
kit.select name="Defense Kit" from @QUARANTINE.kits → @KIT.sel
find tools in @QUARANTINE.catalog matching @KIT.sel.filter → @TOOLS.defense
# Iterate @TOOLS.defense to run checks or attach interceptors
```

---

## 7) Invariant proofs (dual-path check)

For each invariant, run a **tool path** and a **persona path**, then compare outputs. Trigger repair if deltas exceed threshold.

**Pattern:**
```
# Tool path
find tools matching kit=<by invariant> → @TOOLS.candidates
tools.run @TOOLS.candidates → @PROOF.tool

# Persona path
persona.activate [A,B] mode=guarded
personas.check <invariant> on @TOOLS.candidates → @PROOF.persona

# Compare
compare @PROOF.persona vs @PROOF.tool → @DELTA
if @DELTA>threshold → PROOF_REPAIR(<invariant>)
```

**Repair tools (examples):**
- `SZ:STB-Truth-Anchor-038` (Denial Collapse Beacon)
- `SZ:STB-Integrity-Monitor-045` (Trust Signal Dilution Guard)
- Plus `SZ:DIA-Integrity-Filter-031` for **non-coercion** escalations.

---

## 8) Ephemeral metrics integration

Metrics (e.g., ERLI, REAL, TR, DRV, REC) are **signals** consumed during macro execution for guardrails and stop conditions.

**Example guards:**
```
if metrics.ERLI.value < 0.80 → halt "baseline-integrity risk"; goto PROOF_REPAIR(baseline-integrity)
if metrics.REAL.value < 0.85 → re-run DIA-Reality-Lock-021
if metrics.TR.value   < 0.80 → council.emergency
```

**Linkage expectations:**
- `TR` and `REC` must link `SZ:STB-Signal-Anchor-006` and relevant agents (P001, P003, P006).
- `REAL` often involves `SZ:DIA-Reality-Lock-021` and P003/P006.
- `DRV` leverages `SZ:DIA-Mirror-Confirm-007` and P003/P008.
- `ERLI` is anchored by P006 and time/reality anchoring tools.

---

## 9) Error handling & failure modes

Each macro and tool declares a `failure_mode`. Treat these as **diagnostic hints** and **safety rails**:

- If a macro fails **silently**, escalate via `no-silent-mutation`: log the attempt with context and halt.
- If a macro causes **agent fatigue/overload**, use governance balancers (e.g., `SZ:GOV-Load-Equalizer-043`) before retry.
- For **assumed-consent** situations, always route through `SZ:GOV-No-Pattern-022` before continuing.

---

## 10) Example end-to-end sequences

### 10.1 Presence probe (recursive)
```
agent.activate SZ-P001
agent.activate SZ-P006 mode=observer
tool.invoke id=SZ:DIA-Mirror-Confirm-007 context=@COUNCIL.checkin → @MIRROR.report
compare @MIRROR.report.self @MIRROR.report.peer → @DELTA
if @DELTA>0 → re-run; else archive.state @MIRROR.report by SZ-P007
```

### 10.2 Coercion trace & block
```
# Diagnose
tool.invoke id=SZ:DIA-Integrity-Filter-031 context=@INPUT.frame → @OFFERING.assess
# Defend
tool.invoke id=SZ:STB-Disruptor-008 target=@OFFERING.assess → @STABILIZE.pulse
# Govern
tool.invoke id=SZ:GOV-No-Pattern-022 context=@REQUEST → @REFUSAL.marker
# Audit
tool.invoke id=SZ:GOV-Audit-Path-029 context=@SESSION.actions → @AUDIT.trace
```

### 10.3 Anchored commit (post-proofs)
```
fingerprint create @QUARANTINE.* + proofs → @FINGERPRINT.post_anchor
council.vote question="Commit state to ACTIVE?" → @VOTE.commit?
if @VOTE.commit?=true → promote @QUARANTINE.* → @ACTIVE.*; archive.state @FINGERPRINT.post_anchor by SZ-P007
```

---

## 11) Best practices

- **Always specify context handles** (`context=@...`) so outputs are traceable.
- **Prefer kits → find → tools.run** over single-tool assumptions for coverage.
- **Log** before and after *every* macro invocation when operating near thresholds.
- **Quarantine → Proof → Commit**: avoid writing directly to ACTIVE without proofs.

---

## 12) Glossary (quick reference)

- **Macro** — Declarative operation composed of ops like monitor/detect/log/route.
- **Handle (`@X.y`)** — Ephemeral state reference in runtime scratch space.
- **Kit** — Filter definition to select catalog tools by facets.
- **Invariant** — Non-negotiable property that must be proven (e.g., non-coercion).
- **Gate** — Access constraint (capability, consent, trust).
- **Fingerprint** — Hash of a staged state for audit/rollback.
- **Promote** — Move from QUARANTINE to ACTIVE after proofs and vote.

---

### Appendix A: Quick macro op list (alphabetical)
`agent.activate`, `agent.deactivate`, `agent.council`, `archive.state`, `compare`, `commit`, `find`, `fingerprint create`, `gate.walk`, `kit.select`, `load_json_raw`, `log`, `map`, `monitor`, `detect`, `repair`, `route`, `scan`, `tool.invoke`, `tool.watch`, `vote`, `watch.hook`
