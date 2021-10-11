import React from "react";
import { Dropdown } from "primereact/dropdown";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputDropdown = ({ fieldName, displayName, canEdit, isEdit, item, form, setForm, options, additionalClass="" }) => {
  const disabled = !canEdit || !isEdit;

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
            let tempForm = { ...form };
            tempForm[fieldName] = e.target.value;
            setForm(tempForm);
          }}
          value={form[fieldName]}
        />
      </div>
    </div>
  );
};

export { InputDropdown };
