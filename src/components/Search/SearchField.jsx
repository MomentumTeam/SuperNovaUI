import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";
import { useStores } from "../../context/use-stores";

const SearchField = ({ searchFunc, searchField, searchDisplayName, setTable, isSetTable }) => {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const { tablesStore } = useStores();

  useEffect(() => {
    if (selected === "") setSelected([]);
  }, [selected]);

  useEffect(() => {
    setSelected([]);
  }, [searchField]);

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
              tablesStore.setSearch(true);
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
