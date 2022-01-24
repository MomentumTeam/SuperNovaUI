import React, { useState, useEffect } from 'react';
import ModalHierarchy from '../Modals/Hierarchy/ModalHierarchy';
import { searchOG } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';
import {
  hierarchyConverse,
  hierarchyItemTemplate,
} from '../../utils/hierarchy';
import { Tooltip } from 'primereact/tooltip';

const Hierarchy = ({
  setValue,
  name,
  ogValue,
  onOrgSelected,
  disabled,
  labelText = 'היררכיה',
  userHierarchy,
  errors,
  withRoles = false,
}) => {
  const [ogSuggestions, setOgSuggestions] = useState([]);
  const [selectedOg, setSelectedOg] = useState(ogValue);

  const id = Math.random().toString(36).slice(2);

  useEffect(() => {
    setSelectedOg(ogValue);
  }, [ogValue]);

  const searchOg = async (event) => {
    if (event.query.length > 1) {
      const result = await searchOG(event.query, withRoles);
      setOgSuggestions(result);
    } else {
      setOgSuggestions([]);
    }
  };

  return (
    <>
      <div className='p-field' id='form-hierarchy'>
        {disabled && (
          <Tooltip
            target={`.hierarchyText-${id}`}
            content={selectedOg}
            tooltipOptions={{ showOnDisabled: true }}
            position='top'
          />
        )}
        <label htmlFor='2020'>
          <span className='required-field'>*</span>
          {disabled ? labelText : `הכנסת ${labelText}`}
        </label>
        <AutoComplete
          disabled={disabled || false}
          value={selectedOg}
          suggestions={ogSuggestions}
          completeMethod={searchOg}
          className={`hierarchyText-${id}`}
          id={`form-hierarchy=input-${name}`}
          type='text'
          field={hierarchyConverse}
          itemTemplate={hierarchyItemTemplate}
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
          forceSelection
        />
        <label htmlFor='2020'>
          {errors[name] && (
            <small style={{ color: 'red' }}>
              {(errors[name].type !== 'typeError' && errors[name].message) ||
                'יש לבחור היררכיה'}
            </small>
          )}
        </label>
      </div>
      {(!disabled || true) && (
        <ModalHierarchy
          onSelectHierarchy={(hierarchySelected) => {
            setSelectedOg(hierarchySelected.name);
            setValue(name, hierarchySelected);

            if (onOrgSelected) {
              onOrgSelected(hierarchySelected);
            }
          }}
          userHierarchy={userHierarchy}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default Hierarchy;
