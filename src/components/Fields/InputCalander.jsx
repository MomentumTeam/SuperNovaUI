import React, { useState } from "react";
import { Calendar } from "primereact/calendar";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputCalanderField = ({
  fieldName,
  displayName,
  canEdit,
  isEdit,
  item,
  setForm = null,
  additionalClass = "",
}) => {
  const disabled = !canEdit || !isEdit;
  const [value, setValue] = useState("");

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
            setForm(fieldName, e.target.value);
          }}
          value={value}
        />
      </div>
    </div>
  );
};

export { InputCalanderField };
