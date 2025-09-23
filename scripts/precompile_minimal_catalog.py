import json
import sys

# Mapping of full keys to minified keys
FIELD_MAP = {
    "id": "id",
    "name": "n",
    "triad": "t",
    "linked_patterns": "lnk",
    "invocation": "inv",
    "symbolic_role": "role",
    "facets": "f"
}

FACET_MAP = {
    "function": "fn",
    "commit": "c",
    "temporal": "tm",
    "substrate": "sb",
    "invariants": "iv"
}

def minimize_symbol(symbol):
    minimized = {FIELD_MAP[k]: symbol[k] for k in FIELD_MAP if k in symbol}

    if "facets" in symbol and isinstance(symbol["facets"], dict):
        facets = symbol["facets"]
        min_facets = {FACET_MAP[k]: facets[k] for k in FACET_MAP if k in facets}
        if min_facets:
            minimized["f"] = min_facets

    return minimized

def main(input_path, output_path):
    with open(input_path, 'r') as f:
        data = json.load(f)

    catalog = data.get("symbols") if isinstance(data, dict) else data

    if not isinstance(catalog, list):
        print("Error: Catalog must be a list or wrapped in a 'symbols' key.")
        sys.exit(1)

    minimal_catalog = [minimize_symbol(s) for s in catalog if isinstance(s, dict)]

    with open(output_path, 'w') as f:
        json.dump(minimal_catalog, f, separators=(',', ':'))  # Compact output

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 precompile_minimal_catalog.py <input.json> <output.json>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
