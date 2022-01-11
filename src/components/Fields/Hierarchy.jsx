import React, { useState, useEffect } from "react";
import ModalHierarchy from "../Modals/Hierarchy/ModalHierarchy";
import { searchOG } from "../../service/KartoffelService";
import { AutoComplete } from "primereact/autocomplete";
import { hierarchyConverse, hierarchyItemTemplate } from '../../utils/hierarchy';
import { Tooltip } from 'primereact/tooltip';

const Hierarchy = ({ setValue, name, ogValue, onOrgSelected, disabled, labelText = "היררכיה", userHierarchy, errors }) => {
  const [ogSuggestions, setOgSuggestions] = useState([]);
  const [selectedOg, setSelectedOg] = useState(ogValue);

  useEffect(() => {
    setSelectedOg(ogValue);
  }, [ogValue]);

  
  const searchOg = async (event) => {
    if (event.query.length > 1) {
      const result = await searchOG(event.query);
      setOgSuggestions(result);
    } else {
      setOgSuggestions([])
    }
  };

  return (
    <>
      <div className="p-field" id="form-hierarchy">
        {disabled && <Tooltip target={`.hierarchyText`} content={hierarchyConverse(selectedOg)} />}
        <label htmlFor="2020">
          <span className="required-field">*</span>
          {disabled ? labelText : `הכנסת ${labelText}`}
        </label>
        <AutoComplete
          disabled={disabled || false}
          value={selectedOg}
          suggestions={ogSuggestions}
          completeMethod={searchOg}
          id={`form-hierarchy=input-${name}`}
          type="text"
          className="hierarchyText"
          field={hierarchyConverse}
          itemTemplate={hierarchyItemTemplate}
          onSelect={(e) => {
            if (onOrgSelected) {
              onOrgSelected(e.value);
            }
          }}
          onChange={(e) => {
            setSelectedOg(e.value);
            setValue(name, e.value);
          }}
          required
          forceSelection
        />
        <label htmlFor="2020">
          {errors[name] && (
            <small style={{ color: "red" }}>
              {(errors[name].type !== "typeError" && errors[name].message) || "יש לבחור היררכיה"}
            </small>
          )}
        </label>
      </div>
      {(!disabled || true) && (
        <ModalHierarchy
          onSelectHierarchy={(hierarchySelected) => {
            setSelectedOg(hierarchySelected.name);
            setValue(name, hierarchySelected);

            if (onOrgSelected) {
              onOrgSelected(hierarchySelected);
            }
          }}
          userHierarchy={userHierarchy}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default Hierarchy;
