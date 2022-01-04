import React, { useEffect, useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { getLabel, disabledInputStyle } from './InputCommon';
import '../../assets/css/local/components/listbox.css';

const InputListBox = ({
  item,
  methods,
  fieldName,
  displayName,
  isEdit,
  canEdit = false,
  additionalClass = '',
  validator = null,
}) => {
  const disabled = !canEdit || !isEdit;

  const [listOptions, setListOptions] = useState(item ? item[fieldName] : []);
  const [newOption, setNewOption] = useState('');
  const [validNewOption, setValidNewOption] = useState(true);

  useEffect(() => {
    if (item) {
      setListOptions(item[fieldName]);
      methods.setValue(fieldName, item[fieldName]);
    }
    methods.clearErrors();
  }, [isEdit, item]);

  const removeOption = (option) => {
    const newListOptions = listOptions.filter(
      (listOption) => listOption !== option
    );
    setListOptions(newListOptions);
  };
  const itemTemplate = (option) => {
    return (
      <div className="flex-container listitem">
        <div className="flex-child listitem-name">{option}</div>
        {isEdit && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-info listitem-button"
            onClick={() => {
              removeOption(option);
            }}
          />
        )}
      </div>
    );
  };

  const setOptionAndValidate = (e) => {
    if (validator) setValidNewOption(validator(e.target.value));
    setNewOption(e.target.value);
  };

  const saveOptionInListOptions = () => {
    methods.setValue(fieldName, [...listOptions, newOption], {
      shouldValidate: true,
    });
    setListOptions([...listOptions, newOption]);
    setNewOption('');
  };

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        {listOptions && listOptions.length > 0 && (
          <ListBox
            id="2011"
            {...methods.register(fieldName)}
            className="listbox"
            options={listOptions}
            disabled={disabled}
            itemTemplate={itemTemplate}
            style={disabled ? disabledInputStyle : {}}
          />
        )}

        {(isEdit ||
          (!isEdit && (!listOptions || listOptions.length === 0))) && (
          <div className="p-field p-col-12 p-md-4">
            <span className="p-input-icon-left">
              {validNewOption && newOption && (
                <i
                  className="pi pi-plus listbox-add"
                  onClick={saveOptionInListOptions}
                />
              )}
              <InputText
                className={validNewOption || !newOption ? '' : 'p-invalid'}
                value={newOption}
                disabled={!isEdit}
                placeholder={isEdit ? 'הוסף פריט חדש' : ''}
                onChange={(e) => setOptionAndValidate(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (validNewOption && newOption) {
                      saveOptionInListOptions();
                    }
                  }
                }}
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { InputListBox };
