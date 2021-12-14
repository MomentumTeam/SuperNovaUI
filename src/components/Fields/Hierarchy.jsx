import React, { useState, useEffect } from "react";
import ModalHierarchy from "../Modals/Hierarchy/ModalHierarchy";
import { searchOG } from "../../service/KartoffelService";
import { AutoComplete } from "primereact/autocomplete";

const Hierarchy = ({ setValue, name, ogValue, onOrgSelected, disabled, labelText = "היררכיה", errors }) => {
  const [ogSuggestions, setOgSuggestions] = useState([]);
  const [selectedOg, setSelectedOg] = useState(ogValue);

  useEffect(() => {
    setSelectedOg(ogValue);
  }, [ogValue]);

  const itemTemplate = (item) => {
    return <>{item.hierarchy != "" && item.hierarchy+'/'}{item.name}</>
  };

  
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
          itemTemplate={itemTemplate}
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
        <label htmlFor="2020"> {errors?.hierarchy && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
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
