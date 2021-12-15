import { useState } from "react";
import { SearchField } from "./SearchField";

const SearchBox = ({ searchFields, setTableData, getData }) => {
  const [isSetTable, setIsSetTable] = useState(false);

  return (
    <div className="search-item">
      {searchFields &&
        searchFields.map((searchField) => {
          return (
            <SearchField
              searchFunc={async (e) => await searchField.searchFunc(e)}
              searchField={searchField.searchField}
              searchDisplayName={searchField.searchDisplayName}
              searchTemplate={searchField?.searchTemplate}
              isSetTable={isSetTable}
              setIsSetTable={setIsSetTable}
              setTableData={setTableData}
              getData={getData}
            />
          );
        })}
    </div>
  );
};

export default SearchBox;
