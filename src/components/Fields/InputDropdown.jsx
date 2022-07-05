import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputDropdown = ({
  item,
  methods,
  fieldName,
  displayName,
  options,
  isEdit,
  canEdit = false,
  additionalClass = "",
  errors,
  required = true,
}) => {
  const disabled = !canEdit || !isEdit;

  useEffect(() => {
    if (item) methods.setValue(fieldName, item[fieldName]);
    methods.clearErrors();
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        <Dropdown
          id={`field-${fieldName}`}
          {...methods.register(fieldName)}
          options={options}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          optionLabel={optionLabel}
          onChange={(e) => {
            methods.setValue(fieldName, e.target.value, { shouldValidate: true });
          }}
          value={methods.watch(fieldName)}
        />
        {errors[fieldName] && <small className="p-error p-d-block">{errors[fieldName].message}</small>}
      </div>
    </div>
  );
};

export { InputDropdown };
