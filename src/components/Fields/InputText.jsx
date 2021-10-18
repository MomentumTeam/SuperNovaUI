import React, { useEffect, useState, useContext } from "react";
import { InputText } from "primereact/inputtext";

import { getLabel, disabledInputStyle } from "./InputCommon";
import { InputFormContext } from './InputForm';

const InputTextField = ({
  fieldName,
  displayName,
  canEdit = false,
  type = "text",
  keyFilter = null,
  additionalClass = "",
  validator = null,
}) => {
  const { item, isEdit, changeForm, errors, changeErrors } = useContext(InputFormContext);
  const [value, setValue] = useState("");
  const disabled = !canEdit || !isEdit;


  useEffect(() => {
    setValue("");
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}

        <InputText
          id="2011"
          className={
            errors === null || errors[fieldName] === undefined || errors[fieldName] === null ? "" : "p-invalid"
          }
          type={type}
          keyfilter={keyFilter}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          placeholder={item[fieldName]}
          onChange={(e) => {
            const errormsg = e.target.value === "" ? null : validator ? validator(e.target.value) : null;
            errormsg ? changeErrors(fieldName, errormsg) : changeErrors(fieldName);
            setValue(e.target.value);
            changeForm(fieldName, e.target.value);
          }}
          value={value}
        />

        {errors !== null && errors[fieldName] !== null && <small className="p-error p-d-block">{errors[fieldName]}</small>}
      </div>
    </div>
  );
};

export { InputTextField };
