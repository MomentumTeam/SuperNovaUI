import React, { useState, useEffect } from 'react';
import ModalHierarchy from '../ModalHierarchy';
import { searchOG } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';

const Hierarchy = ({ setValue, name, onOrgSelected, value, errors }) => {
  const [ogSuggestions, setOgSuggestions] = useState([]);
  const [selectedOg, setSelectedOg] = useState(null);

  useEffect(() => {
    setSelectedOg(value);
  }, [value]);

  const searchOg = async (event) => {
    const result = await searchOG(event.query);
    setOgSuggestions(result.groups);
  };

  return (
    <>
      {/* <ModalHierarchy /> */}
      <div className='p-field'>
        <label htmlFor='2020'>
          {' '}
          <span className='required-field'>*</span>היררכיה
        </label>
        <AutoComplete
          value={selectedOg}
          suggestions={ogSuggestions}
          completeMethod={searchOg}
          id='2020'
          type='text'
          field='name'
          onSelect={(e) => {
            if (onOrgSelected) {
              onOrgSelected(e.value);
            }
          }}
          onChange={(e) => {
            setSelectedOg(e.value);
            setValue(name, e.value);
          }}
          required
          placeholder='היררכיה'
        />
        <label htmlFor='2020'>
          {' '}
          {errors?.hierarchy && <small>יש למלא ערך</small>}
        </label>
      </div>
    </>
  );
};

export default Hierarchy;
