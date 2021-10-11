import { useState } from "react";
import { SearchField } from "./SearchField";

const SearchBox = ({ setTableData, searchFields }) => {
  const [isSetTable, setIsSetTable] = useState(false);

  return (
    <div className="search-item">
      {searchFields.map(searchField => {
         return <SearchField
           searchFunc={searchField.searchFunc}
           searchField={searchField.searchField}
           searchDisplayName={searchField.searchDisplayName}
           setTable={setTableData}
           isSetTable={isSetTable}
           setIsSetTable={setIsSetTable}
         />;
      })}

      <button
        className="btn btn-search-wite"
        title="Print"
        type="button"
        onClick={() => {
          setIsSetTable(true);
        }}
      >
        <span className="for-screnReader">Print</span>
      </button>
    </div>
  );
};

export default SearchBox;
