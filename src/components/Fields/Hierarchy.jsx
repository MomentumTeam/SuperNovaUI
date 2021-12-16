import React, { useState, useEffect } from "react";
import ModalHierarchy from "../Modals/Hierarchy/ModalHierarchy";
import { searchOG } from "../../service/KartoffelService";
import { AutoComplete } from "primereact/autocomplete";
import { hierarchyItemTemplate } from '../../utils/hierarchy';

const Hierarchy = ({ setValue, name, ogValue, onOrgSelected, disabled, labelText = "היררכיה", errors }) => {
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
      <div className="p-field">
        <label htmlFor="2020">
          <span className="required-field">*</span>
          {labelText}
        </label>
        <AutoComplete
          disabled={disabled || false}
          value={selectedOg}
          suggestions={ogSuggestions}
          completeMethod={searchOg}
          id="2020"
          type="text"
          field="name"
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
        <label htmlFor="2020"> {errors[name] && <small style={{ color: "red" }}>{(errors[name].type !== "typeError" && errors[name].message) || "יש למלא ערך"}</small>}</label>
      </div>
      {(!disabled || true) && (
        <ModalHierarchy
          onSelectHierarchy={(hierarchySelected) => {
            setSelectedOg(hierarchySelected.name);
            setValue(name, hierarchySelected);
          }}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default Hierarchy;
