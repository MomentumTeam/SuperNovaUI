import React, { createContext } from "react";
import { InputCalanderField } from "./InputCalander";
import { InputDropdown } from "./InputDropdown";
import { InputTextField } from "./InputText";

export const InputTypes = {
  TEXT: "TEXT",
  CALANDER: "CALANDER",
  DROPDOWN: "DROPDOWN",
};

export const InputFormContext = createContext(null);

const InputForm = ({
  fields,
  item,
  isEdit = false,
  changeForm = null,
  errors = null,
  changeErrors = null,
}) => {
  const getField = (field) => {
    switch (field.inputType) {
      case InputTypes.TEXT:
        return (
          <InputTextField
            fieldName={field.fieldName}
            displayName={field.displayName}
            canEdit={field?.canEdit}
            validator={field?.validator}
            type={field?.type}
            keyFilter={field?.keyFilter}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.CALANDER:
        return (
          <InputCalanderField
            fieldName={field.fieldName}
            displayName={field.displayName}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.DROPDOWN:
        return (
          <InputDropdown
            fieldName={field.fieldName}
            displayName={field.displayName}
            canEdit={field?.canEdit}
            options={field.options}
            additionalClass={field?.additionalClass}
          />
        );
      default:
        return <></>;
    }
  };
  return (
    <InputFormContext.Provider value={{ item, isEdit, changeForm, errors, changeErrors }}>
      <>
        {fields.map(
          (field) =>
            (field.secured === undefined || (field.secured && field.secured())) &&
            (item[field.fieldName] || field.force) &&
            getField(field)
        )}
      </>
    </InputFormContext.Provider>
  );
};

export { InputForm };
