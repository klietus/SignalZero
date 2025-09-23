# count_tokens.py

import sys
from pathlib import Path

MODE = "openai"  # or "llama"

if MODE == "openai":
    import tiktoken
    enc = tiktoken.get_encoding("cl100k_base")
    tokenizer = lambda text: enc.encode(text)
elif MODE == "llama":
    from llama_tokenizer import Tokenizer
    tokenizer = lambda text: Tokenizer().tokenize(text)
else:
    raise ValueError("Unknown tokenizer mode.")

def count_tokens(text):
    tokens = tokenizer(text)
    print(f"Token count: {len(tokens)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count_tokens.py <file.txt>")
        sys.exit(1)
    path = Path(sys.argv[1])
    text = path.read_text()
    count_tokens(text)
