import SearchBox from '../../components/Search/SearchBox';
import { TableSearch } from '../../constants/usersTable';
import ModalHierarchy from '../../components/Modals/Hierarchy/ModalHierarchy';
import { useStores } from '../../context/use-stores';
import '../../App.css';

const SearchEntity = ({ tableType, setTableData, getData }) => {
  const searchFields = TableSearch(tableType);
  const { userStore } = useStores();

  return (
    <>
      {tableType === 'hierarchy' && (
        <ModalHierarchy
          isDisplay={true}
          userHierarchy={userStore.user.hierarchy}
        />
      )}

      <div className="search-row">
        <div className="search-row-inner search-row-inner-flex">
          <SearchBox
            searchFields={searchFields}
            setTableData={setTableData}
            getData={getData}
          />

          {/* <button className="btn-underline" type="button" title="חיפוש מורחב">
          חיפוש מורחב
        </button> */}
        </div>
      </div>
    </>
  );
};

export default SearchEntity;
