import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputDropdown = ({ fieldName, displayName, canEdit, isEdit, item, setForm, options, additionalClass = "" }) => {
  const disabled = !canEdit || !isEdit;
  const [value, setValue] = useState("");

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
            setForm(fieldName, e.target.value);
          }}
          value={value}
        />
      </div>
    </div>
  );
};

export { InputDropdown };
