import { useState } from "react";
import { useStores } from '../../context/use-stores';
import { SearchField } from "./SearchField";

const SearchBox = ({ searchFields, setTableData, getData }) => {
  const [isSetTable, setIsSetTable] = useState(false);
  const { userStore } = useStores();

  return (
    <div className="search-item">
      {searchFields &&
        searchFields.map((searchField) => {
          return (
            <SearchField
              searchFunc={async (e) => await searchField.searchFunc(e, userStore.user)}
              searchField={searchField.searchField}
              searchFieldFunc={searchField?.searchFieldFunc}
              searchDisplayName={searchField.searchDisplayName}
              searchTemplate={searchField?.searchTemplate}
              searchIdField={searchField?.searchIdField}
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
