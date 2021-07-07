import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';

const SearchBox = ({ data }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCountry1, setSelectedCountry1] = useState([]);
  const [role, setRole] = useState('');
  const [selectedResults, setSelectedResults] = useState([]);

  const search = (event) => {
    setTimeout(() => {
      let filteredResults;
      if (!event.query.trim().length) {
        filteredResults = [...data];
      } else {
        // filteredResults = data.filter((country) => {
        //     return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        // });
      }

      setFilteredResults(filteredResults);
    }, 250);
  };

  return (
    <div className='search-item'>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={selectedCountry1}
              suggestions={filteredResults}
              completeMethod={search}
              field='name'
              onChange={(e) => setSelectedCountry1(e.value)}
            />
            <label htmlFor='autocomplete'>שם/מ"א/ת"ז </label>
          </span>
        </div>
      </div>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={selectedResults}
              suggestions={filteredResults}
              completeMethod={search}
              field='name'
              multiple
              onChange={(e) => setSelectedResults(e.value)}
            />
            <label htmlFor='autocomplete2'>היררכיה</label>
          </span>
        </div>
      </div>
      <div className='autocomplete-wrap'>
        <div className='p-fluid'>
          <span className='p-float-label'>
            <AutoComplete
              value={role}
              suggestions={filteredResults}
              completeMethod={search}
              field='name'
              onChange={(e) => setRole(e.value)}
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
