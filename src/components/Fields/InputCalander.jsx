import React, { useContext, useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";

import { getLabel, disabledInputStyle } from "./InputCommon";
import { InputFormContext } from './InputForm';

const InputCalanderField = ({
  fieldName,
  displayName,
  canEdit = false,
  additionalClass = "",
}) => {
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
        <Calendar
          id="2011"
          disabled={disabled}
          style={(disabled ? disabledInputStyle : {}, { border: "none" })}
          placeholder={new Date(item[fieldName]).toDateString()}
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

export { InputCalanderField };
