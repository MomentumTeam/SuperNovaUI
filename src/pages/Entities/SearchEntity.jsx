import SearchBox from "../../components/Search/SearchBox";
import { TableSearch } from "../../constants/usersTable";

const SearchEntity = ({ tableType, setTableData, getData }) => {
  const searchFields = TableSearch(tableType);
  return (
    <div className="search-row">
      <div className="search-row-inner search-row-inner-flex">
        <SearchBox searchFields={searchFields} setTableData={setTableData} getData={getData} />

        {/* <button className="btn-underline" type="button" title="חיפוש מורחב">
          חיפוש מורחב
        </button> */}
      </div>
    </div>
  );
};

export default SearchEntity;
