import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

interface Symbol {
  id: string;
  name?: string;
  macro: string;
  triad: string;
  facets: {
    function: string;
    topology: string;
    commit: string;
    gate: string[];
    substrate: string[];
    temporal: string;
    invariants: string[];
  };
  failure_mode?: string;
  symbol_domain?: string;
  symbol_tag?: string;
  symbolic_role: string;
}

export default function SymbolList() {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const domain = searchParams.get("domain") || "";
  const tag = searchParams.get("tag") || "";
  const cursor = searchParams.get("cursor") || "";
  const direction = searchParams.get("direction") || "next";
  const limit = 50;

  useEffect(() => {
    axios
      .get("https://qnw96whs57.execute-api.us-west-2.amazonaws.com/prod/domains")
      .then((res) => {
        setDomains(res.data);
        if (!domain && res.data.length > 0) {
          setSearchParams({ domain: res.data[Math.floor(Math.random() * res.data.length)], tag });
        }
      })
      .catch(() => setError("Failed to fetch domains."));
  }, []);

  useEffect(() => {
    if (!domain) return;

    setLoading(true);
    const params: any = { limit };
    if (domain) params.symbol_domain = domain;
    if (tag) params.symbol_tag = tag;
    if (cursor) params.last_symbol_id = cursor;
    if (direction) params.direction = direction;

    axios
      .get("https://qnw96whs57.execute-api.us-west-2.amazonaws.com/prod/symbol", {
        params,
      })
      .then((res) => {
        if (res.data.items) {
          setSymbols(res.data.items);
        } else {
          setSymbols(res.data);
        }
      })
      .catch(() => setError("Failed to fetch symbols."))
      .finally(() => setLoading(false));
  }, [domain, tag, cursor, direction]);

  const goToNext = () => {
    if (symbols.length > 0) {
      const lastId = symbols[symbols.length - 1].id;
      setSearchParams({ domain, tag, cursor: lastId, direction: "next" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">SignalZero Symbol Browser</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={domain}
          onChange={(e) => setSearchParams({ domain: e.target.value, tag })}
          className="border rounded px-3 py-2"
        >
          <option value="">Select domain</option>
          {domains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by tag"
          value={tag}
          onChange={(e) => setSearchParams({ domain, tag: e.target.value })}
          className="border rounded px-3 py-2"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="space-y-3">
            {symbols.map((sym) => (
              <div
                key={sym.id}
                className="rounded-lg shadow bg-white border hover:border-blue-500 transition p-3"
              >
                <Link to={`/symbol/${sym.id}`} className="block">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {sym.id} ({sym.name})
                  </h2>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Domain: {sym.symbol_domain || "n/a"}</span>
                    <span>Topology: {sym.facets.topology}</span>
                    <span>Triad: {sym.triad}</span>
                    <span>Tag: {sym.symbol_tag || "n/a"}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Symbolic Role: {sym.symbolic_role || "n/a"}</p>

                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={goToNext}
              className="px-4 py-2 border rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
