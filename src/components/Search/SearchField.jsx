import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchField = ({ searchFunc, searchField, searchDisplayName, setTable, isSetTable }) => {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (isSetTable && results.length > 0) {
      setTable(results);
    }
  }, [isSetTable]);

  return (
    <div className="autocomplete-wrap">
      <div className="p-fluid">
        <span className="p-float-label">
          <AutoComplete
            value={selected}
            suggestions={results}
            completeMethod={async (e) => {
              const searchResults = await searchFunc(e);
              setResults(searchResults);
            }}
            field={searchField}
            onChange={(e) => {
              setSelected(e.value);

              if (e.originalEvent.type === "click") {
                setTable([e.value]);
              }
            }}
            onKeyUp={(e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                setTable(results);
              }
            }}
          />
          <label htmlFor="autocomplete">{searchDisplayName} </label>
        </span>
      </div>
    </div>
  );
};

export { SearchField };
