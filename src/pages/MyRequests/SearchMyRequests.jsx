import { useState } from "react";
import { TableSearch } from "../../constants/myRequestsTable";
import SearchField from "./SearchField";

const SearchMyRequests = ({ tableType, setSearchQuery }) => {
  const searchFields = TableSearch(tableType);
  const [currentField, setCurrentField] = useState(null);

  return (
    <div className="search-row">
      <div className="search-row-inner search-row-inner-flex">
        <div className="search-item">
          {searchFields &&
            searchFields.map((searchField) => {
              return (
                <SearchField
                  searchField={searchField}
                  setSearchQuery={setSearchQuery}
                  currentField={currentField}
                  setCurrentField={setCurrentField}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SearchMyRequests;
