import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";

export default function SearchableFilter({ filter, selected, onChange }) {
  const [query, setQuery] = useState(selected?.name || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (selected && selected.name !== query) {
      setQuery(selected.name);
    }
  }, [selected]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = filter.options.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  console.log("filteredOptions", filteredOptions);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Label className="block text-sm font-medium text-blue-900 mb-1">
        {filter.label}
      </Label>

      {/* Input with clear button */}
      <div className="relative">
        <input
          type="text"
          className="border border-blue-200 bg-white rounded px-2 py-2 w-full text-sm pr-8"
          placeholder={`Search ${filter.label}...`}
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setShowSuggestions(true);

            // if user starts typing again, clear selected filter
            if (selected) onChange(filter.key, null);
          }}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
            onClick={() => {
              setQuery("");
              setShowSuggestions(true);
              onChange(filter.key, null);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div key={query} className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto">
          {filteredOptions.length === 0 && (
            <div className="px-2 py-2 text-sm text-gray-400">
              No results found
            </div>
          )}

          {filteredOptions.map((opt) => (
            <div
              key={opt.id}
              className="px-2 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              onMouseDown={() => {
                onChange(filter.key, opt.id);
                setQuery(opt.name);
                setShowSuggestions(false);
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}