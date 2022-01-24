import React, { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';

import { getLabel, disabledInputStyle } from './InputCommon';
import { Tooltip } from 'primereact/tooltip';

const InputTextField = ({
  item,
  fieldName,
  displayName,
  methods,
  errors,
  isEdit,
  canEdit = false,
  type = 'text',
  keyFilter = null,
  additionalClass = '',
  placeholder = '',
  withTooltip = false,
}) => {
  const disabled = !canEdit || !isEdit;
  const id = Math.random().toString(36).slice(2);

  useEffect(() => {
    if (item) methods.setValue(fieldName, item[fieldName]);
    methods.clearErrors();
  }, [isEdit, item]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className='p-field'>
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        {withTooltip && disabled && (
          <Tooltip
            position='top'
            target={`.hierarchyText-${id}`}
            content={methods.watch(fieldName)}
          />
        )}

        <div className={`hierarchyText-${id}`}>
          <InputText
            id={`field-${fieldName}`}
            {...methods.register(fieldName)}
            className={errors[fieldName] ? 'p-invalid' : ''}
            disabled={disabled}
            style={disabled ? disabledInputStyle : {}}
            value={methods.watch(fieldName)}
            type={type}
            keyfilter={keyFilter}
            onChange={(e) => {
              methods.setValue(fieldName, e.target.value, {
                shouldValidate: true,
              });
            }}
            placeholder={placeholder}
          />
        </div>

        {errors[fieldName] && (
          <small className='p-error p-d-block'>
            {errors[fieldName].message}
          </small>
        )}
      </div>
    </div>
  );
};

export { InputTextField };
