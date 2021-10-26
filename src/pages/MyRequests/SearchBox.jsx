import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { STATUSES, TYPES } from '../../constants/applies';
import {
  searchEntitiesByFullName,
  getEntityByIdentifier,
  searchOG,
} from '../../service/KartoffelService';
import { useStores } from '../../context/use-stores';

const SearchBox = ({ loadDataByEntity, loadDataByOG }) => {
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedRequestType, setSelectedRequestType] = useState([]);
  const [filteredOGs, setFilteredOGs] = useState([]);
  const [selectedOG, setSelectedOG] = useState([]);
  const { appliesStore } = useStores();

  const searchEntity = async (event) => {
    let filteredResults;
    const query = event.query;
    if (!query.trim().length) {
      filteredResults = [];
    } else if (query.match('[0-9]+') && query.length >= 6) {
      filteredResults = await getEntityByIdentifier(event.query);
      filteredResults = [filteredResults];
    } else {
      filteredResults = await searchEntitiesByFullName(event.query);
      filteredResults = filteredResults.entities;
    }
    setFilteredEntities(filteredResults);
  };

  const searchHierarchy = async (event) => {
    let filteredResults;
    const query = event.query;
    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await searchOG(event.query);
      filteredResults = filteredResults.groups;
      filteredResults = filteredResults.map((group) => ({
        hierarchy: `${group.name}/${group.hierarchy}`,
        id: group.id,
      }));
    }
    setFilteredOGs(filteredResults);
  };

  const statuses = () => {
    const arr = [];
    for (const key in STATUSES) {
      arr.push({ 
        value: key,
        label: STATUSES[key] 
      });
    }

    return arr;
  }

  const requestTypes = () => {
    const arr = [];
    for (const key in TYPES) {
      arr.push({ 
        value: key,
        label: TYPES[key] 
      });
    }

    return arr;
  }

  return (
    <div className='search-item'>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <Dropdown
              value={selectedRequestType}
              options={requestTypes()}
              onChange={e => setSelectedRequestType(e.value)}
            />
            <label htmlFor='autocomplete'>סוג בקשה </label>
          </span>
        </div>
      </div>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={selectedOG}
              suggestions={filteredOGs}
              completeMethod={searchHierarchy}
              field='hierarchy'
              onChange={(e) => {
                setFilteredEntities([]);
                setSelectedEntity([]);
                setSelectedOG(e.value);
                if (e.originalEvent.type === 'click') {
                  loadDataByOG(selectedOG);
                }
              }}
            />
            <label htmlFor='autocomplete2'>גורם מטפל</label>
          </span>
        </div>
      </div>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <Dropdown 
              value={selectedStatus}
              options={statuses()}
              onChange={(e) => setSelectedStatus(e.value)}
            />
            <label htmlFor='autocomplete3'>סטטוס</label>
          </span>
        </div>
      </div>
      <button className='btn btn-search-wite' title='Print' type='button' onClick={async()=>await appliesStore.searchByStatus(selectedStatus)}>
        <span className='for-screnReader'>Print</span>
      </button>
    </div>
  );
};

export default SearchBox;
