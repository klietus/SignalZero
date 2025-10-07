"""Utility helpers for routing model calls to OpenAI or a local endpoint.

The module reads configuration from environment variables at runtime so that
callers can decide which backend to use without changing the code.  The
configuration intentionally mirrors the schema of OpenAI's Chat Completions API
so that a locally hosted model that implements the same contract (for example an
Ollama or LM Studio proxy) can be swapped in transparently.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Any, Dict, Iterable, Mapping, MutableMapping, Optional
from urllib import error, request

__all__ = ["ModelConfig", "call_model"]


@dataclass(frozen=True)
class ModelConfig:
    """Runtime configuration for selecting the model backend."""

    provider: str
    openai_api_key: Optional[str]
    openai_model: str
    openai_api_base: str
    local_endpoint: str
    local_model: str
    local_api_key: Optional[str]
    request_timeout: float

    @classmethod
    def from_env(cls) -> "ModelConfig":
        """Build the configuration from environment variables.

        Environment variables
        ---------------------
        MODEL_PROVIDER
            Either ``"openai"`` (default) or ``"local"``.
        OPENAI_API_KEY
            Secret token for authenticating against OpenAI.
        OPENAI_MODEL
            Model identifier to use when MODEL_PROVIDER is ``"openai"``.
        OPENAI_API_BASE
            Optional base URL override for OpenAI-compatible deployments.
        LOCAL_MODEL_ENDPOINT
            Full URL to a local OpenAI-compatible chat completions endpoint.
        LOCAL_MODEL_NAME
            Model identifier to send to the local endpoint.
        LOCAL_MODEL_API_KEY
            Optional header token for authenticating against the local server.
        MODEL_REQUEST_TIMEOUT
            Timeout (seconds) applied to outbound HTTP requests. Defaults to 60.
        """

        provider = os.getenv("MODEL_PROVIDER", "openai").strip().lower()
        if provider not in {"openai", "local"}:
            raise ValueError(
                "MODEL_PROVIDER must be either 'openai' or 'local', "
                f"got: {provider!r}"
            )

        timeout = float(os.getenv("MODEL_REQUEST_TIMEOUT", "60"))

        return cls(
            provider=provider,
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            openai_model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            openai_api_base=os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
            local_endpoint=os.getenv(
                "LOCAL_MODEL_ENDPOINT", "http://127.0.0.1:11434/v1/chat/completions"
            ),
            local_model=os.getenv("LOCAL_MODEL_NAME", "local-model"),
            local_api_key=os.getenv("LOCAL_MODEL_API_KEY"),
            request_timeout=timeout,
        )


def call_model(
    messages: Iterable[Mapping[str, Any]],
    *,
    extra_params: Optional[MutableMapping[str, Any]] = None,
    config: Optional[ModelConfig] = None,
) -> Dict[str, Any]:
    """Call the configured model provider.

    Parameters
    ----------
    messages:
        An iterable of chat messages compatible with the OpenAI Chat Completions
        schema (each item should contain a ``"role"`` and ``"content"`` field).
    extra_params:
        Additional payload values that should be forwarded to the backend.
    config:
        Optionally pass a pre-constructed :class:`ModelConfig` instance. When not
        provided the configuration is loaded from the environment.

    Returns
    -------
    dict
        The JSON response decoded into a Python dictionary.
    """

    config = config or ModelConfig.from_env()
    payload: Dict[str, Any] = {
        "messages": list(messages),
    }

    if config.provider == "openai":
        payload["model"] = config.openai_model
        return _call_openai(payload, config, extra_params)
    else:  # provider == "local"
        payload["model"] = config.local_model
        return _call_local(payload, config, extra_params)


def _call_openai(
    payload: Dict[str, Any],
    config: ModelConfig,
    extra_params: Optional[MutableMapping[str, Any]],
) -> Dict[str, Any]:
    if not config.openai_api_key:
        raise RuntimeError(
            "OPENAI_API_KEY must be set when MODEL_PROVIDER='openai'."
        )

    url = _join_url(config.openai_api_base, "chat/completions")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.openai_api_key}",
    }
    if extra_params:
        payload.update(extra_params)
    return _post_json(url, payload, headers=headers, timeout=config.request_timeout)


def _call_local(
    payload: Dict[str, Any],
    config: ModelConfig,
    extra_params: Optional[MutableMapping[str, Any]],
) -> Dict[str, Any]:
    headers = {
        "Content-Type": "application/json",
    }
    if config.local_api_key:
        headers["Authorization"] = f"Bearer {config.local_api_key}"

    if extra_params:
        payload.update(extra_params)

    return _post_json(
        config.local_endpoint,
        payload,
        headers=headers,
        timeout=config.request_timeout,
    )


def _join_url(base: str, path: str) -> str:
    base = base.rstrip("/")
    path = path.lstrip("/")
    return f"{base}/{path}"


def _post_json(
    url: str,
    payload: Mapping[str, Any],
    *,
    headers: Optional[Mapping[str, str]] = None,
    timeout: float,
) -> Dict[str, Any]:
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=data, method="POST")

    for key, value in (headers or {}).items():
        req.add_header(key, value)

    try:
        with request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except error.HTTPError as exc:
        message = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Model request failed with status {exc.code}: {message}"
        ) from exc
    except error.URLError as exc:  # pragma: no cover - network errors are runtime issues
        raise RuntimeError(f"Failed to reach model endpoint {url!r}: {exc.reason}") from exc
