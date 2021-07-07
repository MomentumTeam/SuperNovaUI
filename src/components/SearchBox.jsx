import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import {
  searchEntitiesByFullName,
  getEntityByIdNumber,
  searchOG,
} from '../service/SearchService';
import { useStores } from '../hooks/use-stores';

const SearchBox = ({ loadDataByEntity, loadDataByOG }) => {
  const { treeStore } = useStores();
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState([]);

  const [filteredOGs, setFilteredOGs] = useState([]);
  const [selectedOG, setSelectedOG] = useState([]);

  const searchEntity = async (event) => {
    let filteredResults;
    const query = event.query;
    if (!query.trim().length) {
      filteredResults = [];
    } else if (query.match('[0-9]+') && query.length >= 6) {
      filteredResults = await getEntityByIdNumber(event.query);
      filteredResults = [
        {
          displayName: filteredResults.displayName,
          id: filteredResults.id,
          directGroup: filteredResults.directGroup,
        },
      ];
    } else {
      filteredResults = await searchEntitiesByFullName(event.query);
      filteredResults = filteredResults.entities;
      filteredResults = filteredResults.map((entity) => ({
        displayName: entity.displayName,
        id: entity.id,
      }));
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

  return (
    <div className='search-item'>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={selectedEntity}
              suggestions={filteredEntities}
              completeMethod={searchEntity}
              field='displayName'
              onChange={(e) => {
                setFilteredOGs([]);
                setSelectedOG([]);
                setSelectedEntity(e.value);
                if (e.originalEvent.type === 'click') {
                  loadDataByEntity(selectedEntity);
                }
              }}
            />
            <label htmlFor='autocomplete'>שם/מ"א/ת"ז </label>
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
            <label htmlFor='autocomplete2'>היררכיה</label>
          </span>
        </div>
      </div>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={selectedEntity}
              suggestions={filteredEntities}
              completeMethod={searchEntity}
              field='displayName'
              onChange={(e) => {
                setFilteredOGs([]);
                setSelectedOG([]);
                setSelectedEntity(e.value);
                if (e.originalEvent.type === 'click') {
                  loadDataByEntity(selectedEntity);
                }
              }}
            />
            <label htmlFor='autocomplete3'>חיפוש לפי תפקיד</label>
          </span>
        </div>
      </div>
      <button className='btn btn-search-wite' title='Print' type='button'>
        <span className='for-screnReader'>Print</span>
      </button>
    </div>
  );
};

export default SearchBox;
