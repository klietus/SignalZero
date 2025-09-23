#!/bin/bash

# Usage: ./count_tokens.sh --file file.txt [--mode openai|llama]
# Defaults: mode=openai

FILE=""
MODE="openai"

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --file) FILE="$2"; shift ;;
        --mode) MODE="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

if [ -z "$FILE" ]; then
    echo "Error: --file parameter is required."
    exit 1
fi

if [ ! -f "$FILE" ]; then
    echo "File not found: $FILE"
    exit 1
fi

MODE=$MODE python count_tokens.py "$FILE"
