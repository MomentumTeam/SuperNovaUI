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
}) => {
  const disabled = !canEdit || !isEdit;

  useEffect(() => {
    methods.setValue(fieldName, item[fieldName]);
    methods.clearErrors();
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        <Dropdown
          id="2011"
          {...methods.register(fieldName)}
          options={options}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          onChange={(e) => {
            methods.setValue(fieldName, e.target.value, { shouldValidate: true });
          }}
          value={methods.watch(fieldName)}
        />
      </div>
    </div>
  );
};

export { InputDropdown };
