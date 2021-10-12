import React, { useState } from 'react';
import {
  searchEntitiesByFullName,
  getEntityByIdentifier,
} from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';

const Entity = ({ setValue, name }) => {
  const { userStore } = useStores();
  const [EntitySuggestions, setEntitySuggestions] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const searchEntityByName = async (event) => {
    const result = await searchEntitiesByFullName(event.query);
    setEntitySuggestions(result.entities);
  };

  const searchEntityByNumber = async (event) => {
    setValue(name, '');
    setSelectedEntity(null);
    const result = await getEntityByIdentifier(event.query);
    console.log(result);
    setSelectedEntity(result);
    setValue(name, result);
  };

  const setCurrentUser = () => {
    const user = toJS(userStore.user);
    console.log(user);
    setSelectedEntity(user);
    setValue(name, user);
  };

  const onChange = (e) => {
    setSelectedEntity(e.value);
    setValue(name, e.value);
  };

  return (
    <>
      <div className='p-fluid-item'>
        <button
          className='btn-underline'
          onClick={setCurrentUser}
          type='button'
          title='עבורי'
        >
          עבורי
        </button>
        <div className='p-field'>
          <label htmlFor='2020'>
            {' '}
            <span className='required-field'>*</span>שם משתמש
          </label>
          <AutoComplete
            id='2022'
            value={selectedEntity}
            suggestions={EntitySuggestions}
            completeMethod={searchEntityByName}
            field='displayName'
            onChange={onChange}
          />
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2013'>
            <span className='required-field'>*</span>מ"א
          </label>
          <InputText
            value={selectedEntity?.personalNumber}
            onKeyUp={searchEntityByNumber}
            id='2013'
            type='text'
            required
            placeholder="מ''א"
          />
        </div>
      </div>
    </>
  );
};

export default Entity;
