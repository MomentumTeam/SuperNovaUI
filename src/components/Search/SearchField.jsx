import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchField = ({ searchFunc, searchField, searchDisplayName, isSetTable, setTableData }) => {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (selected === "") setSelected([]);
  }, [selected]);

  useEffect(() => {
    setSelected([]);
  }, [searchField]);

  useEffect(() => {
    if (isSetTable && results.length > 0) {
      setTableData(results);
    }
  }, [isSetTable]);

  return (
    <div className="autocomplete-wrap">
      <div className="p-fluid">
        <span className="p-float-label">
          <AutoComplete
            value={selected}
            suggestions={[...new Map(results.map((item) => [item[searchField], item])).values()]}
            completeMethod={async (e) => {
              const searchResults = await searchFunc(e);
              setResults(searchResults);
            }}
            field={searchField}
            onChange={async (e) => {
              setSelected(e.value);

              if (e.originalEvent.type === "click") {
                const filteredResults = results.filter((r) => r[searchField] === e.value[searchField]);
                setTableData(filteredResults);
              }
            }}
            onKeyUp={async (e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                setTableData(results);
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
