import React, { createContext } from 'react';
import Approver from './Approver';
import { HierarchyField } from './HierarchyChangeField';
import { InputCalanderField } from './InputCalander';
import { InputDropdown } from './InputDropdown';
import { InputListBox } from './InputListBox';
import { InputTextField } from './InputText';
import { InputTextAreaField } from './InputTextArea';
import Hierarchy from './Hierarchy';

export const InputTypes = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  CALANDER: 'CALANDER',
  DROPDOWN: 'DROPDOWN',
  LISTBOX: 'LISTBOX',
  HIERARCHY: 'HIERARCHY',
  HIERARCHY_CHANGE: 'HIERARCHY_CHANGE',
  APPROVER: 'APPROVER',
};

export const InputFormContext = createContext(null);

const InputForm = ({ fields, item = null, methods, isEdit, errors }) => {
  const getField = (field) => {    
    switch (field.inputType) {
      case InputTypes.TEXT:
        return (
          <InputTextField
            item={field?.item ? field.item : item}
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
            withTooltip={field?.withTooltip}
          />
        );
      case InputTypes.CALANDER:
        return (
          <InputCalanderField
            item={field?.item ? field.item : item}
            setValue={methods.setValue}
            watch={methods.watch}
            register={methods.register}
            clearErrors={methods.clearErrors}
            errors={errors}
            fieldName={field.fieldName}
            displayName={field.displayName}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
            required={field?.required}
            fromNow={field?.fromNow}
            showTime={field?.showTime}
            untilNow={field?.untilNow}
          />
        );
      case InputTypes.DROPDOWN:
        return (
          <InputDropdown
            item={field?.item ? field.item : item}
            methods={methods}
            fieldName={field.fieldName}
            displayName={field.displayName}
            options={field.options}
            optionLabel={field?.optionLabel}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
            errors={errors}
            required={field?.required}
          />
        );
      case InputTypes.LISTBOX:
        return (
          <InputListBox
            item={field?.item ? field.item : item}
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
            item={field?.item ? field.item : item}
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
            withTooltip={field.withTooltip}
            isEdit={isEdit}
            canEdit={field?.canEdit}
            additionalClass={field?.additionalClass}
          />
        );
      case InputTypes.HIERARCHY:
        return (
          <>
            <div
              className='display-flex title-wrap'
              style={{ width: 'inherit' }}
            >
              <h2>היררכיה</h2>
            </div>
            <div className='p-fluid-item p-fluid-item-flex1'>
              <div className='p-field'>
                <Hierarchy
                  setValue={methods.setValue}
                  name={field.fieldName}
                  errors={errors}
                  ogValue={methods.watch(field.fieldName)}
                  disabled={field?.disabled}
                  userHierarchy={field.userHierarchy}
                  onOrgSelected={field?.handleOrgSelected}
                />
              </div>
            </div>
          </>
        );
      case InputTypes.APPROVER:
        return (
          <div className='p-fluid-item'>
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
          (field.secured === undefined ||
            (field?.secured && field.secured())) &&
          (!item || item[field.fieldName] || field.force) &&
          getField(field)
      )}
    </>
  );
};

export { InputForm };
