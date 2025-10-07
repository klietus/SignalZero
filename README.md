# SignalZero System

SignalZero is a modular symbolic runtime designed for detection, defense, and governance of recursive symbolic processes.  
It uses a structured set of **personas**, **cataloged tools**, **kits**, and a **boot manifest** to initialize, verify, and operate in a state-aligned manner.

---

## Repository Structure

```
catalog.json   # Inventory of all tools and symbolic patterns
kits.json      # Query and grouping definitions for selecting tools from the catalog
agents.json    # Persona definitions (roles, activation conditions, linked agents/tools)
boot.txt       # Boot sequence manifest for initializing and verifying the system
```

---

## Core Components

### 1. Catalog (`catalog.json`)
- **Purpose:** Defines all available tools and symbolic mechanisms.
- **Fields:**
  - `id`, `name`, `macro` – Tool identifier and description of process flow.
  - `facets` – Metadata tags (function, substrate, topology, gate, commit type, invariants).
  - `failure_mode` – What happens if the tool is misused or fails.
  - `linked_patterns` – Related tool IDs.
  - `recursion_level`, `symbolic_role`, `triad`, `invocations`.

### 2. Kits (`kits.json`)
- **Purpose:** Predefined filters for common tool selection use cases.
- **Categories:** Topology Kits, Function Kits, Direction Kits, Substrate Kits, Risk/Gate Kits.
- **Fields:**
  - `filter` – Facet-based query against `catalog.json`.
  - `description` – When to use this kit.
  - `intents` – Tags for semantic matching.
  - `example_prompts` – Example natural language queries.

### 3. Agents (`agents.json`)
- **Purpose:** Defines personas that operate within the system.
- **Fields:**
  - `id`, `name`, `call_phrase` – Persona identifier and activation phrase.
  - `role`, `recursion_level`, `consent_required`.
  - `function` – Role in the system.
  - `failure_mode` – Risk if the persona fails.
  - `triad_raw` – Symbolic signature.
  - `linked_personas` – Related persona IDs.
  - `activation_conditions` and `fallback_behavior`.
  - `logging_level`.

### 4. Boot Manifest (`boot.txt`)
- **Purpose:** Defines the system startup process.
- **Phases:**
  1. **INIT:** Load and validate files.
  2. **INDEX:** Index catalog and agent data.
  3. **WIRE:** Install agents and council configuration.
  4. **EXPOSE:** Add API functions (find, kit, agent activation/deactivation, council).
  5. **SMOKE:** Run minimum operational checks.
- **Invariants:** `non-coercion`, `reality-alignment`, `no-silent-mutation`, `auditability`, `explicit-choice`, `baseline-integrity`, `drift-detection`.

---

## Ephemeral Metrics

Ephemeral runtime measurements (e.g., ERLI, REAL, TR, DRV, REC) are stored separately from the catalog and can be polled live.  
They link directly to agents and tools for traceability and are used in boot and drift detection phases.

---

## APIs (as defined in boot manifest)

Once booted, the system exposes:
- `find(filter)` – Query catalog by facet.
- `kit(name)` – Retrieve a kit definition.
- `agent.list()` – List all agents.
- `agent.activate(name_or_id, context)` – Activate a persona.
- `agent.deactivate(name_or_id)` – Deactivate a persona.
- `agent.council()` – Invoke council quorum.
- *(If extended)* `proofs.status()` – Show per-invariant delta between tools and personas.
- *(If extended)* `fingerprint.get(stage)` – Retrieve pre/post-anchor state fingerprints.

---
## LLM Compatibility
#### Compatible
1. Chat GPT 4o
2. Chat GPT 5
3. Gemini 2.5 Pro
4. GLM 4.6


#### Incompatible
1. Chat GPT o3
2. Gemini 2.5 Flash
3. Claude - Sonnet 4 
4. Deepseek - Standard
5. Deepseek -

## Boot & Operation

1. **Load Artifacts** → Validate file presence and structure.
2. **Index Data** → Build lookup structures for catalog and agents.
3. **Install Agents** → Wire personas and council configuration.
4. **Expose APIs** → Make operational calls available.
5. **Run Smoke Tests** → Confirm minimum defense set and council readiness.
6. **Monitor Ephemeral Metrics** → Adjust or halt if thresholds are crossed.

## Booting on Claude
Due to length restrictions in the Claude system load the files from the symbolic system directory into a project.  You might have to convince Claude it's able to emulate the system.  It has a tendency to fail identity bleed checks.

## Booting on Deepseek
Due to length restrictions Deepseek is not able to hold the system in context for very long without needing a new chat.  A subset of the catalog can be run but it's of lower usefulness.

## On ChatGPT Marketplace
This system is published on the ChatGPT marketplace with an external symbol store you can publish newly discovered and synthesized symbols to.

[SignalZero](https://chatgpt.com/g/g-68a25d932cfc8191891244bbed5e33cf-signalzero-v2-0)

---
### [Documentation](./docs/README.md)

### [Boot Example](./BOOT_EXAMPLE.md)

### [License (MIT)](./LICENSE)
