import React, { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import datesUtil from "../../utils/dates";

import { getLabel, disabledInputStyle } from "./InputCommon";

const InputCalanderField = ({
  item = null,
  setValue,
  watch,
  register,
  clearErrors,
  fieldName,
  displayName,
  isEdit,
  errors,
  canEdit = false,
  additionalClass = "",
  fromNow= false,
  untilNow = false,
  required= true,
  showTime=false
}) => {
  const disabled = !canEdit || !isEdit;

  let nowDate = new Date();

  useEffect(() => {
    clearErrors();
  }, [isEdit]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit: required && canEdit, isEdit, labelName: displayName })}
        <Calendar
          id={`field-${fieldName}`}
          {...register(fieldName)}
          inputStyle={{ direction: "ltr" }}
          onChange={(e) => {
            if (e.value) setValue(fieldName, new Date(e.value), { shouldValidate: true });
          }}
          value={watch(fieldName)? watch(fieldName): "---"}
          placeholder={watch(fieldName) ? datesUtil.formattedDate(watch(fieldName), showTime) : "---"}
          showIcon
          showTime={showTime}
          mask={datesUtil.mask}
          dateFormat={datesUtil.lowerFormat}
          {...(fromNow && { minDate: nowDate })}
          {...(untilNow && {maxDate: nowDate})}
          disabled={disabled}
          style={(disabled ? disabledInputStyle : {}, { border: "none" })}
        />
        {errors && errors[fieldName] && (
          <small className="p-error p-d-block">
            {errors[fieldName]?.message ? errors[fieldName].message : "יש למלא ערך"}
          </small>
        )}
      </div>
    </div>
  );
};

export { InputCalanderField };
