import React, { createContext } from "react";
import Approver from './Approver';
import { HierarchyField } from './HierarchyChangeField';
import { InputCalanderField } from "./InputCalander";
import { InputDropdown } from "./InputDropdown";
import { InputListBox } from './InputListBox';
import { InputTextField } from "./InputText";
import { InputTextAreaField } from './InputTextArea';

export const InputTypes = {
  TEXT: "TEXT",
  TEXTAREA: "TEXTAREA",
  CALANDER: "CALANDER",
  DROPDOWN: "DROPDOWN",
  LISTBOX: "LISTBOX",
  HIERARCHY_CHANGE: "HIERARCHY_CHANGE",
  APPROVER: "APPROVER"
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
            placeholder={field?.placeholder}
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
      case InputTypes.LISTBOX:
        return (
          <InputListBox
            item={item}
            methods={methods}
            fieldName={field.fieldName}
            displayName={field.displayName}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
            validator={field?.validator}
          />
        );
      case InputTypes.TEXTAREA:
        return (
          <InputTextAreaField
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
            placeholder={field?.placeholder}
            required={field?.required}
          />
        );
      case InputTypes.HIERARCHY_CHANGE:
        return (
          <HierarchyField
            item={field?.item ? field.item : item}
            setIsHierarchyFree={field?.setFunc}
            methods={methods}
            errors={errors}
            fieldName={field.fieldName}
            displayName={field.displayName}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.APPROVER:
        return (
          <div className="p-fluid-item">
            <Approver
              setValue={methods.setValue}
              name={field.fieldName}
              tooltip={field?.tooltip}
              multiple={true}
              errors={errors}
              defaultApprovers={field?.default}
              disabled={field?.disabled}
            />
          </div>
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
