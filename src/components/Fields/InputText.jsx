import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputTextField = ({
  item,
  fieldName,
  displayName,
  methods,
  errors,
  isEdit,
  canEdit = false,
  type = "text",
  keyFilter = null,
  additionalClass = "",
}) => {
  const disabled = !canEdit || !isEdit;

  useEffect(() => {
    methods.setValue(fieldName, item[fieldName]);
    methods.clearErrors();
  }, [isEdit, item]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}

        <InputText
          id="2011"
          {...methods.register(fieldName)}
          className={errors[fieldName] ? "p-invalid" : ""}
          disabled={disabled}
          style={disabled ? disabledInputStyle : {}}
          value={methods.watch(fieldName)}
          type={type}
          keyfilter={keyFilter}
          onChange={(e) => {
            methods.setValue(fieldName, e.target.value, { shouldValidate: true });
          }}
        />

        {errors[fieldName] && <small className="p-error p-d-block">{errors[fieldName].message}</small>}
      </div>
    </div>
  );
};

export { InputTextField };
