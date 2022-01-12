import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { EVENT_KEY_UP_CODE_ENTER } from "../../constants/general";

const SearchField = ({
  searchFunc,
  searchField,
  searchFieldFunc,
  searchDisplayName,
  searchTemplate,
  searchIdField,
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
  }, [searchField, searchFieldFunc]);

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
            field={searchFieldFunc ? searchFieldFunc : searchField}
            onChange={async (e) => {
              setSelected(e.value);

              if (e.originalEvent.type === "click") {
                let filteredResults = results.filter((r) => r[searchField] === e.value[searchField]);

                if (searchIdField) {
                  let newData = [...results];
                  newData = newData.filter(
                    (v, i, a) => a.findIndex((t) => t[searchIdField] === v[searchIdField]) === i
                  );
                  setTableData(newData);
                } else {
                  setTableData(filteredResults);
                }
              }
            }}
            onKeyUp={async (e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                if (selected === "" || Array.isArray(selected) && selected.length === 0) {
                  await getData({ reset: true });
                } else {
                  if (selected.length > 1) {
                    const searchResults = await searchFunc({query: selected});
                    setResults(searchResults);
                    
                    if (searchIdField) {
                      let filteredResults = [...searchResults];
                      filteredResults = filteredResults.filter(
                        (v, i, a) => a.findIndex((t) => t[searchIdField] === v[searchIdField]) === i
                      );
                      setTableData(filteredResults);
                    } else {
                      setTableData(searchResults);
                    }
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
