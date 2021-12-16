import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchField = ({
  searchFunc,
  searchField,
  searchDisplayName,
  searchTemplate,
  isSetTable,
  setTableData,
  getData,
}) => {
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
              if (e.query.length > 1) {
                const searchResults = await searchFunc(e);
                setResults(searchResults);
              } else {
                setResults([]);
              }
            }}
            itemTemplate={searchTemplate}
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
                Array.isArray(selected) && selected.length === 0
                  ? await getData({ reset: true })
                  : setTableData(results);
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
