# Modeling and Linking Your Own Domain in SignalZero

This guide walks you through creating a **domain-specific symbol set** and integrating it into the SignalZero symbolic reasoning system.

---

## 1. Understand Domains in SignalZero

In SignalZero, a **domain** is a self-contained set of symbolic patterns related to a particular area of reasoning or activity.

Examples:

* **Negotiation** → Patterns for persuasion, concessions, and power dynamics.
* **Cybersecurity** → Patterns for threats, vulnerabilities, and mitigations.
* **Psychological Safety** → Patterns for trust, consent, and emotional boundaries.

---

## 2. Create Your Domain File

1. **Filename:**
   Save as a JSON file named after your domain, e.g. `negotiation.json`.

2. **Structure:**
   Follow the catalog format:

```json
[
  {
    "id": "NEG-001",
    "name": "Anchor Position",
    "symbolic_role": "pattern",
    "description": "Establish a strong opening position to frame the negotiation.",
    "links": ["NEG-002", "CORE-TRUST-003"],
    "failure_modes": [
      "Opponent reframes position",
      "Perceived as inflexible"
    ]
  }
]
```

**Key fields:**

* `id` → Unique code (use a consistent prefix).
* `name` → Short, human-readable label.
* `symbolic_role` → `"pattern"`, `"lattice"`, `"trigger"`, or `"repair"`.
* `description` → Explain its purpose in plain language.
* `links` → IDs of related patterns (from your domain or others).
* `failure_modes` → What can go wrong if this symbol is activated incorrectly.

---

## 3. Link Symbols Across Domains

Cross-domain links create **activation pathways**:

* Use `links` to connect your symbols to relevant items in **`catalog.json`** or other domain files.
* Example: A negotiation tactic might link to a trust lattice in `core.json`.

When the system runs:

* Activating a symbol in one domain can cascade into another.
* This builds **fractal cognition** — specialized clusters that still share reasoning logic.

## 4. How to do this inside a Signal Zero instance.

These are some sample prompts that will help you do this easily within a SignalZero system.  You can do it by hand, if you really want to.

>/> Lets start a new domain.  Save any symbols created in catalog format to the file "cyber_sec.json"  Generate 20 seeds, 8 repair patterns, 1 lattice and one persona for the domain cyber security.

>/> Infer links to catalog symbols.

>/> Audit the graph. [fix any issues]

>/> Update kits and indices.  Export as json.

>/> Export cyber_sec.json
---

## 5. Register Your Domain

After creating your domain file:

1. Place it in the same directory as the other domain JSONs.
2. Add its path to the **boot sequence** so it’s loaded at runtime.
3. Ensure the parser merges it into the full symbol graph.

---

## 6. Test Activation

1. Boot the system with your new domain loaded.
2. Trigger scenarios relevant to your domain.
3. Watch the **activation trace** and **graph visualization**:

   * Check if cross-domain links fire as expected.
   * Look for isolated nodes (these need linking).

---

## 7. Iterate and Refine

* Add more symbols to cover edge cases.
* Adjust links to strengthen activation rails.
* Balance **breadth** (coverage) and **depth** (interconnectedness).

---

## Example Domains in the Wild

* **Negotiation** → Connects to persuasion, trust, and coercion lattices.
* **Cybersecurity** → Connects to threat detection, repair, and governance.
