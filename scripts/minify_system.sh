#!/bin/bash

# minify catalog
python3 precompile_minimal_catalog.py ../symbolic_system/symbol_catalog.json ../symbolic_system/symbol_catalog.min.json

# minify kits
jq -c . ../symbolic_system/kits.json > ../symbolic_system/kits.min.json

echo "Before:"
./count_tokens.sh --file ../symbolic_system/symbol_catalog.json

./count_tokens.sh --file ../symbolic_system/kits.json

echo "After:"
./count_tokens.sh --file ../symbolic_system/symbol_catalog.min.json

./count_tokens.sh --file ../symbolic_system/kits.min.json