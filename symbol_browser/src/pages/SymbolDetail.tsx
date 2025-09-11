import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SymbolDetail() {
  const { id } = useParams();
  const [symbol, setSymbol] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://qnw96whs57.execute-api.us-west-2.amazonaws.com/prod/symbol/${id}`)
      .then((res) => setSymbol(res.data))
      .catch(() => setError("Symbol not found."));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!symbol) return <p>Loading...</p>;

  const handleDomainClick = () => {
    if (symbol.symbol_domain) {
      navigate(`/?domain=${symbol.symbol_domain}`);
    }
  };

  const handleTagClick = () => {
    if (symbol.symbol_domain && symbol.symbol_tag) {
      navigate(`/?domain=${symbol.symbol_domain}&tag=${symbol.symbol_tag}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 underline mb-4 block">← Back to List</Link>

      <h1 className="text-3xl font-bold mb-2">{symbol.name || symbol.id}</h1>
      <p className="text-sm text-gray-600 mb-1">ID: {symbol.id}</p>
      <p className="text-sm text-gray-600 mb-1">Triad: {symbol.triad}</p>
      <p className="text-sm text-gray-600 mb-1">Symbolic Role: {symbol.symbolic_role || "n/a"}</p>
      <p className="text-sm text-gray-600 mb-1">Function: {symbol.facets.function}</p>
      <p className="text-sm text-gray-600 mb-1">Topology: {symbol.facets.topology}</p>
      <p className="text-sm text-gray-600 mb-1">Version: {symbol.version}</p>
      <div className="mt-6 text-xs text-gray-400">
        <p><strong>Macro:</strong> {symbol.macro}</p>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        Domain: {symbol.symbol_domain ? (
          <button onClick={handleDomainClick} className="text-blue-600 underline">
            {symbol.symbol_domain}
          </button>
        ) : "n/a"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Tag: {symbol.symbol_tag ? (
          <button onClick={handleTagClick} className="text-blue-600 underline">
            {symbol.symbol_tag}
          </button>
        ) : "n/a"}
      </p>
      <p className="text-sm text-gray-600 mb-1">Failure Mode: {symbol.failure_mode || "n/a"}</p>
      <p className="text-sm text-gray-600 mb-1">Commit: {symbol.facets.commit}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Linked Symbols</h2>
        {(symbol.linked_patterns && symbol.linked_patterns.length > 0) ? (
          <ul className="list-disc ml-6">
            {symbol.linked_patterns.map((linkedId: string) => (
              <li key={linkedId}>
                <Link to={`/symbol/${linkedId}`} className="text-blue-600 underline">
                  {linkedId}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">None</p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Invariants</h2>
        <ul className="list-disc ml-6">
          {(symbol.facets.invariants || []).map((inv: string) => (
            <li key={inv}>{inv}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Invocations</h2>
        <ul className="list-disc ml-6">
          {(symbol.invocations || []).map((line: string) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
