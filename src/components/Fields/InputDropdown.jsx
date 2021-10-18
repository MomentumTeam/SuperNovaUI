import React, { useContext, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";

import { getLabel, disabledInputStyle } from "./InputCommon";
import { InputFormContext } from './InputForm';

const InputDropdown = ({ fieldName, displayName, canEdit, options, additionalClass = "" }) => {
  const { item, isEdit, changeForm } = useContext(InputFormContext);
  const disabled = !canEdit || !isEdit;
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [isEdit]);
  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        <Dropdown
          id="2011"
          options={options}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          placeholder={item[fieldName]}
          onChange={(e) => {
            setValue(e.target.value);
            changeForm(fieldName, e.target.value);
          }}
          value={value}
        />
      </div>
    </div>
  );
};

export { InputDropdown };
