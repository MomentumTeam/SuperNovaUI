import React from "react";
import { InputText } from "primereact/inputtext";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputTextField = ({
  fieldName,
  displayName,
  item,
  form,
  setForm,
  isEdit = false,
  canEdit = false,
  type = "text",
  keyFilter = "alpha",
  additionalClass =""
}) => {
  const disabled = !canEdit || !isEdit;

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        <InputText
          id="2011"
          type={type}
          keyfilter={keyFilter}
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

export { InputTextField };
