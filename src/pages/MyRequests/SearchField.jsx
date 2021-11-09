import { AutoComplete } from "primereact/autocomplete";
import { useEffect, useState } from "react";
import { EVENT_KEY_UP_CODE_ENTER, STATUSES, TYPES } from "../../constants";
import "../../assets/css/local/components/myRequestsSearch.css";

const SearchField = ({
  searchField,
  searchFunc,
  currentField,
  setCurrentField,
}) => {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setResults([]);
  }, []);

  const completeFunc = (e) => {
    if (!e) {
      setResults([]);
      return;
    }
    const searchValue = e.query?.trim() || "";
    switch (searchField.searchField) {
      case "serialNumber":
        setResults([]);
        break;
      case "formattedType":
        setResults(
          Object.values(TYPES)
            .filter((type) => type.includes(searchValue))
            .map((formattedType) => ({ formattedType }))
        );
        break;
      case "handler":
        setResults([]);
        break;
      case "status":
        setResults(
          Object.values(STATUSES)
            .filter((status) => status.includes(searchValue))
            .map((status) => ({ status }))
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="autocomplete-wrap" key={searchField.searchField}>
      <div className="p-fluid">
        <span className="p-float-label">
          <AutoComplete
            dropdown={["formattedType", "status"].includes(
              searchField.searchField
            )}
            dropdownMode="current"
            style={{ padding: "0 10px" }}
            value={searchField.searchField === currentField ? selected : ""}
            suggestions={results}
            completeMethod={completeFunc}
            field={searchField.searchField}
            forceSelection={["formattedType", "status"].includes(
              searchField.searchField
            )}
            onChange={async (e) => {
              searchField.searchField !== currentField &&
                setCurrentField(searchField.searchField);
              if (e.originalEvent.type === "click") {
                setSelected(e.value[searchField.searchField]);
                await searchFunc(
                  null,
                  searchField.searchFuncName,
                  e.value[searchField.searchField]
                );
              } else {
                setSelected(e.value);
              }
            }}
            onKeyUp={async (e) => {
              if (e.code === EVENT_KEY_UP_CODE_ENTER) {
                await searchFunc(null, searchField.searchFuncName, selected);
              }
            }}
          />
          <label style={{ padding: "0 10px" }} htmlFor="autocomplete">
            {searchField.searchDisplayName}
          </label>
        </span>
      </div>
    </div>
  );
};

export default SearchField;
