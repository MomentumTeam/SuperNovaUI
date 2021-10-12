import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputTextField = ({
  fieldName,
  displayName,
  item,
  setForm = null,
  isEdit = false,
  canEdit = false,
  type = "text",
  keyFilter = null,
  additionalClass = "",
  validator = null,
  errors = {},
  changeErrors = null,
}) => {
  const disabled = !canEdit || !isEdit;
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}

        <InputText
          id="2011"
          className={errors[fieldName] === undefined || errors[fieldName] === null ? "" : "p-invalid"}
          type={type}
          keyfilter={keyFilter}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          placeholder={item[fieldName]}
          onChange={(e) => {
            const errormsg = e.target.value === "" ? null : validator ? validator(e.target.value) : null;
            errormsg ? changeErrors(fieldName, true, errormsg) : changeErrors(fieldName, false);
            setValue(e.target.value);
            setForm(fieldName, e.target.value);
          }}
          value={value}
        />

        {errors[fieldName] !== null && <small className="p-error p-d-block">{errors[fieldName]}</small>}
      </div>
    </div>
  );
};

export { InputTextField };
