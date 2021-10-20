import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import {
  getIsJobTitleAlreadyTaken,
} from "../../service/KartoffelService";
import { disabledInputStyle, getLabel } from "./InputCommon";

const RoleField = ({ role, isEdit, setIsJobTitleFree }) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useFormContext();
  const fieldName = "role";
  const [isJobTitleAlreadyTaken, setIsJobTitleAlreadyTaken] = useState(false);
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);

  const searchRole = async (event) => {
    let isJobTaken = false;
    let suggestions = [];

    if (event.query !== undefined) {
      const result = await getIsJobTitleAlreadyTaken(event.query, role.directGroup);
      isJobTaken = result.isJobTitleAlreadyTaken;
      
      if (isJobTaken) suggestions = result?.suggestions;
    }

    setIsJobTitleAlreadyTaken(isJobTaken);
    setJobTitleSuggestions(suggestions);
    return;
  };

  useEffect(() => {
    setIsJobTitleFree(isJobTitleAlreadyTaken);
  }, [isJobTitleAlreadyTaken]);


  return (
    <div>
      {isEdit&&<div className={`status ${isJobTitleAlreadyTaken ? "" : "available"}`}>
        <p>{isJobTitleAlreadyTaken ? "לא פנוי" : "פנוי"}</p>
      </div>}
      {getLabel({ labelName: "שם תפקיד", canEdit: true, isEdit: isEdit })}
      <AutoComplete
        {...register(fieldName)}
        suggestions={jobTitleSuggestions}
        disabled={!isEdit}
        value={watch(fieldName)}
        completeMethod={searchRole}
        placeholder={role.jobTitle}
        className={!errors[fieldName] ? "" : "p-invalid"}
        style={(isEdit ? {} : disabledInputStyle, { border: "none" })}
        onChange={(e) => {
          setValue(fieldName, e.value);
          if (e.value === "") {
            setIsJobTitleAlreadyTaken(false);
            reset(
              { [fieldName]: role.jobTitle },
              {
                keepDirty: false,
                keepTouched: false,
              }
            );
          }
        }}
      />
      {errors[fieldName] && errors[fieldName].type !== "jobTitle-valid-check" && (
        <small className="p-error p-d-block">{errors[fieldName].message}</small>
      )}
    </div>
  );
};

export { RoleField };
