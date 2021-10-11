import React from "react";
import { Calendar } from "primereact/calendar";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputCalanderField = ({ fieldName, displayName, canEdit, isEdit, item, form, setForm, additionalClass = "" }) => {
  const disabled = !canEdit || !isEdit;

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

export { InputCalanderField };
