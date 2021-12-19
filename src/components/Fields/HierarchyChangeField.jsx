import React, { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { InputText } from "primereact/inputtext";

import { getOGByHierarchy } from "../../service/KartoffelService";
import "../../assets/css/local/components/hierarchyChange.css";
import { getLabel } from "./InputCommon";
import { useFirstRender } from '../../utils/firstrender';

const HierarchyField = ({
  item,
  fieldName,
  displayName,
  methods,
  errors,
  isEdit,
  canEdit = false,
  additionalClass = "",
  setIsHierarchyFree = null,
}) => {
  const firstRender = useFirstRender();
  const [hierarchyFind, setHierarchyFind] = useState(null);

  const searchHierarchy = async (hierarchyName) => {
    let hierarchyResult = null;
    if (hierarchyName !== undefined) {
      try {
        const hierarchyFull = `${item.hierarchy}/${hierarchyName}`;
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
    if (setIsHierarchyFree) setIsHierarchyFree(hierarchyFind === null);
  }, [hierarchyFind]);

  useEffect(() => {
    if (isEdit && firstRender) {
      methods.setValue(fieldName, item.name);
      methods.clearErrors();
      setHierarchyFind(null);
    }
  }, [isEdit, item]);

  return (
    <div className={`p-fluid-item ${additionalClass}`}>
      <div className="p-field">
        {getLabel({ canEdit, isEdit, labelName: displayName })}

        {/* TODO: ADD LIMIT and test in show*/}
        {!isEdit ? (
          <InputText
            disabled={!isEdit}
            className="input"
            placeholder={item.hierarchy !== "" ? `${item.hierarchy}/${item.name}` : item.name}
          />
        ) : (
          <>
            <div class="input-box">
              <InputText
                {...methods.register(fieldName)}
                disabled={!isEdit}
                className={hierarchyFind !== null || errors[fieldName] ? "p-invalid" : "input"}
                value={methods.watch(fieldName)}
                onChange={(e) => {
                  const hierarchyToSearch = e.target.value;
                  methods.setValue(fieldName, hierarchyToSearch, { shouldValidate: true });

                  if (hierarchyToSearch === "") {
                    setHierarchyFind(null);
                    methods.setValue(fieldName, item.name, { shouldValidate: true });
                  } else {
                    debouncedHierarchyName.current(hierarchyToSearch);
                  }
                }}
              />
              <span class="prefix">{item.hierarchy !== "" ? `/${item.hierarchy}` : ""}</span>
            </div>
            <span className="hinthierarchy cut-text">
              {item.hierarchy !== "" ? `${item.hierarchy}/${methods.watch(fieldName)}` : methods.watch(fieldName)}
            </span>
          </>
        )}

        {errors[fieldName] && <small className="p-error p-d-block">{errors[fieldName].message}</small>}
        {isEdit && !errors[fieldName] && hierarchyFind !== null && methods.watch(fieldName) !== item.name && (
          <small className="p-error p-d-block">{"היררכיה קיימת"}</small>
        )}
      </div>
    </div>
  );
};

export { HierarchyField };
