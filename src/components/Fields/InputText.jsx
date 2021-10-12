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
  keyFilter,
  additionalClass = "",
  errorMsg = "error",
}) => {
  const disabled = !canEdit || !isEdit;

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        <InputText
          id="2011"
          className={errorMsg !== null ? "p-invalid" : ""}
          type={type}
          keyfilter={keyFilter ? keyFilter : /^[a-z\u0590-\u05fe\s]+$/i}
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

        {errorMsg !== null && (
          <small className="p-error p-d-block">
            {errorMsg}
          </small>
        )}
      </div>
    </div>
  );
};

export { InputTextField };