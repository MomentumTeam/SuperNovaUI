import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchField = ({
  searchFunc,
  searchField,
  searchDisplayName,
  searchTemplate,
  searchRemoveField,
  isSetTable,
  setTableData,
  getData,
}) => {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (selected === "") setSelected([]);
  }, []);

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
              try {
                if (e.query.length > 1) {
                  const searchResults = await searchFunc(e);

                  setResults(searchResults);
                } else {
                  setResults([]);
                }
              } catch (error) {
                setResults([]);
              }
            }}
            itemTemplate={searchTemplate}
            field={searchField}
            onChange={async (e) => {
              setSelected(e.value);

              if (e.originalEvent.type === "click") {
                let filteredResults = results.filter((r) => r[searchField] === e.value[searchField]);

                if (searchRemoveField) {
                  const newData = filteredResults.map(({searchRemoveField, ...keepAttrs}) => keepAttrs)
                  filteredResults = [...new Set(newData)];
                }
                setTableData(filteredResults);
              }
            }}
            onKeyUp={async (e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                if (Array.isArray(selected) && selected.length === 0) {
                 await getData({ reset: true })
                } else {
                  
                  if (searchRemoveField) {
                    let filteredResults;
                    const newData = results.map(({ searchRemoveField, ...keepAttrs }) => keepAttrs);
                    filteredResults = [...new Set(newData)];

                    setTableData(filteredResults);
                  } else {
                    setTableData(results);

                  }
                  
                }
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
