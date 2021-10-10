import React, { useState, useEffect } from "react";
import { searchUnits } from "../../service/KartoffelService";
import { AutoComplete } from "primereact/autocomplete";

const Unit = ({ setValue, name, onOrgSelected, value, errors }) => {
  const [unitSuggestions, setUnitSuggestions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    setSelectedUnit(value);
  }, [value]);

  const searchUnit = async (event) => {
    const result = await searchUnits(event.query);
    setUnitSuggestions(result.units);
  };

  return (
    <div className="p-field">
      <label>
        <span className="required-field">*</span>יחידה
      </label>
      <AutoComplete
        value={selectedUnit}
        suggestions={unitSuggestions}
        completeMethod={searchUnit}
        type="text"
        field="hierarchy"
        onSelect={(e) => {
          if (onOrgSelected) {
            onOrgSelected(e.value);
          }
        }}
        onChange={(e) => {
          setSelectedUnit(e.value);
          setValue(name, e.value);
        }}
        required
      />
      <label>{errors?.unit && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
    </div>
  );
};

export default Unit;
