import React, { useEffect } from "react";
import { Calendar } from "primereact/calendar";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputCalanderField = ({
  item,
  methods,
  fieldName,
  displayName,
  isEdit,
  canEdit = false,
  additionalClass = "",
}) => {
  const disabled = !canEdit || !isEdit;

  useEffect(() => {
    methods.setValue(fieldName, item[fieldName]);
    methods.clearErrors();
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}
        <Calendar
          id="2011"
          {...methods.register(fieldName)}
          disabled={disabled}
          style={(disabled ? disabledInputStyle : {}, { border: "none" })}
          placeholder={new Date(methods.watch(fieldName)).toDateString()}
          onChange={(e) => {
            methods.setValue(fieldName, e.target.value, { shouldValidate: true });
          }}
          value={methods.watch(fieldName)}
        />
      </div>
    </div>
  );
};

export { InputCalanderField };
