import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { debounce } from "lodash";
import { InputText } from "primereact/inputtext";

import { getOGByHierarchy } from "../../service/KartoffelService";
import "../../assets/css/local/components/hierarchyChange.css";

const HierarchyField = ({ hierarchy, isEdit, setIsHierarchyFree }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const [hierarchyFind, setHierarchyFind] = useState(null);
  const fieldName = "hierarchyName";

  const searchHierarchy = async (hierarchyName) => {
    let hierarchyResult = null;
    if (hierarchyName !== undefined) {
      try {
        const hierarchyFull = `${hierarchy.hierarchy}/${hierarchyName}`;
        hierarchyResult = await getOGByHierarchy(hierarchyFull);
      } catch (error) {}
    }
    setHierarchyFind(hierarchyResult);
    return;
  };

  const debouncedHierarchyName = useRef(
    debounce(async (hierarchyQuery) => {
      searchHierarchy(hierarchyQuery);
    }, 100)
  );

  useEffect(() => {
    setIsHierarchyFree(hierarchyFind === null);
  }, [hierarchyFind]);

  return (
    <>
      {/* TODO: ADD LIMIT and test in show*/}
      {!isEdit ? (
        <InputText
          {...register(fieldName)}
          disabled={!isEdit}
          className="input"
          value={`${hierarchy.hierarchy}/${hierarchy.name}`}
        />
      ) : (
        <>
          <div class="input-box">
            <InputText
              {...register(fieldName)}
              disabled={!isEdit}
              className="input"
              value={watch(fieldName)}
              onChange={(e) => {
                const hierarchyToSearch = e.target.value;
                setValue(fieldName, hierarchyToSearch);

                if (hierarchyToSearch === "") {
                  setHierarchyFind(null);
                  setValue(fieldName, hierarchy.name);
                } else {
                  debouncedHierarchyName.current(hierarchyToSearch);
                }
              }}
            />
            <span class="prefix">/{hierarchy.hierarchy}</span>
          </div>
          <span className="hinthierarchy cut-text">
            {hierarchy.hierarchy}/{watch(fieldName)}
          </span>
        </>
      )}

      {errors[fieldName] && <small className="p-error p-d-block">{errors[fieldName].message}</small>}
      {hierarchyFind !== null && watch(fieldName) !== hierarchy.name && (
        <small className="p-error p-d-block">{"היררכיה קיימת"}</small>
      )}
    </>
  );
};

export { HierarchyField };
