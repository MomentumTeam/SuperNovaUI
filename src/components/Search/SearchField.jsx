import React, { useState, useEffect, useContext } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";
import { TableDataContext } from "../../pages/Entities/index";

const SearchField = ({ searchFunc, searchField, searchDisplayName, isSetTable }) => {
  const { tableDispatch } = useContext(TableDataContext);

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
      tableDispatch({ type: "searchResult", results });
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
            onChange={async (e) => {
              setSelected(e.value);

              if (e.originalEvent.type === "click") {
                await tableDispatch({ type: "searchResult", results: [e.value] });
              }
            }}
            onKeyUp={async (e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                await tableDispatch({ type: "searchResult", results });
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
