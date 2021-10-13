import SearchBox from './SearchBox';
import { useStores } from '../../context/use-stores';

const SearchRequest = ({ data }) => {
  const { tablesStore } = useStores();

  return (
    <div className="search-row">
      <div className="search-row-inner search-row-inner-flex">
        <SearchBox
          data={data}
          loadDataByEntity={async (entity) => {
            await tablesStore.loadEntitiesByEntity(entity);
          }}
          loadDataByOG={async (entity) => {
            await tablesStore.loadEntitiesByOG(entity);
          }}
        />
      </div>
    </div>
  );
};

export default SearchRequest;
