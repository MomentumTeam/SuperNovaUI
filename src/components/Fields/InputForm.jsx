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

const InputForm = ({ fields, item, methods, isEdit, errors }) => {
  const getField = (field) => {
    switch (field.inputType) {
      case InputTypes.TEXT:
        return (
          <InputTextField
            item={item}
            methods={methods}
            errors={errors}
            fieldName={field.fieldName}
            displayName={field.displayName}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            type={field?.type}
            keyFilter={field?.keyFilter}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.CALANDER:
        return (
          <InputCalanderField
            item={item}
            methods={methods}
            fieldName={field.fieldName}
            displayName={field.displayName}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.DROPDOWN:
        return (
          <InputDropdown
            item={item}
            methods={methods}
            fieldName={field.fieldName}
            displayName={field.displayName}
            options={field.options}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
          />
        );
      default:
        return <></>;
    }
  };
  return (
    <>
      {fields.map(
        (field) =>
          (field.secured === undefined || (field?.secured && field.secured())) &&
          (item[field.fieldName] || field.force) &&
          getField(field)
      )}
    </>
  );
};

export { InputForm };
