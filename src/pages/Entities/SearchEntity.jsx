import SearchBox from '../../components/SearchBox';
import { useStores } from '../../context/use-stores';

const SearchEntity = ({ data }) => {
    const { entityStore } = useStores();

    return (
        <div className='search-row'>
            <div className='search-row-inner search-row-inner-flex'>
                <button className='btn btn-change-view-chart' title='Change View to Chart' type='button'>
                    <span className='for-screnReader'>Change View to Chart</span>
                </button>
                <SearchBox
                    data={data}
                    loadDataByEntity={async (entity) => {
                        await entityStore.loadEntitiesByEntity(entity);
                    }}
                    loadDataByOG={async (entity) => {
                        await entityStore.loadEntitiesByOG(entity);
                    }}
                />
                <button className='btn-underline' type='button' title='חיפוש מורחב'>
                    חיפוש מורחב
                </button>
            </div>
        </div>
    );
};

export default SearchEntity;
