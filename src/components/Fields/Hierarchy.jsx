import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { getOGByHierarchy } from "../../service/KartoffelService";
import { getHierarchy } from "../../utils/hierarchy";
import { AutoComplete } from "primereact/autocomplete";
import { disabledInputStyle } from "./InputCommon";

const HierarchyField = ({ hierarchy, isEdit, setIsHierarchyFree }) => {
  const {
    register,
    formState: { errors },
    setValue,
    reset,
    watch,
    getValues
  } = useFormContext();
  const [hierarchyFind, setHierarchyFind] = useState(null);
  const [oldHierarchy, setOldHierarchy] = useState("");
  const fieldName = "hierarchyName";

  const searchHierarchy = async (event) => {
    let hierarchyResult = null;
    if (event.query !== undefined) {
      const hierarchyName = `${oldHierarchy.hierarchyPrefix}/${event.query}`;
      hierarchyResult = await getOGByHierarchy(hierarchyName);
    }
    setHierarchyFind(hierarchyResult);
    return;
  };

  useEffect(() => {
    const { hierarchyReadOnly, hierarchyName } = getHierarchy(hierarchy.hierarchy);
    const hierarchyold = {};
    hierarchyold.oldName = hierarchyName;
    hierarchyold.hierarchyPrefix = hierarchyReadOnly;

    setOldHierarchy(hierarchyold);
  }, [isEdit]);

  useEffect(() => {
    setIsHierarchyFree(hierarchyFind === null);
  }, [hierarchyFind]);

  return (
    <div>
      <AutoComplete
        {...register(fieldName)}
        suggestions={[]}
        disabled={!isEdit}
        value={watch(fieldName)}
        completeMethod={searchHierarchy}
        placeholder={oldHierarchy.oldName}
        className={!errors[fieldName] ? "" : "p-invalid"}
        style={(isEdit ? {} : disabledInputStyle, { border: "none" })}
        onChange={(e) => {
          setValue(fieldName, e.value);
          if (e.value === "") {
            setHierarchyFind(null);
            reset(
              { [fieldName]: oldHierarchy.oldName },
              {
                keepDirty: false,
                keepTouched: false,
              }
            );
          }
        }}
      />
      {errors[fieldName] && <small className="p-error p-d-block">{errors[fieldName].message}</small>}
      <label htmlFor="hierarchyInput" style={{ paddingTop: "3px" }}>{`${oldHierarchy.hierarchyPrefix}/${
        getValues(fieldName) ? getValues(fieldName) : oldHierarchy.oldName
      }`}</label>
    </div>
  );
};

export { HierarchyField };
