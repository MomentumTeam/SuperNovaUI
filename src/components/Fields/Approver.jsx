import React, { useState, useEffect} from 'react';
import { searchApproverByDisplayNameReq } from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';
import { Tooltip } from "primereact/tooltip";

import '../../assets/css/local/components/approver.css';

const Approver = ({ setValue, name, multiple, disabled, defaultApprovers, errors, trigger =null, type="COMMANDER" }) => {
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(defaultApprovers);

  const searchApprover = async (event) => {
    const result = await searchApproverByDisplayNameReq(
      event.query,
      type
    );
    setApproverSuggestions(result.approvers);
  };

  const itemSelectedTemplate = (item) => {
    const id = Math.random().toString(36).slice(2);

    return (
      <>
        <Tooltip target={`.approver-name-${id}`} content={item.displayName} position="top" />
        <div className={`approver-name approver-name-${id}`}>{item.displayName}</div>
      </>
    );
  }

  useEffect(() => {
    setSelectedApprover(defaultApprovers);
    setApproverSuggestions([]);
  }, [type]);

  return (
    <div className="p-field-item">
      <div className={multiple ? "AutoCompleteWrap" : ""}>
        <label htmlFor="2022">
          <span className="required-field">*</span>גורם מאשר
        </label>
        <AutoComplete
          disabled={disabled}
          id="2022"
          className={`approver-selection-${multiple === true ? "multiple" : "single"} ${disabled ? "disabled" : ""}`}
          multiple={multiple}
          value={multiple? Array.isArray(selectedApprover)? selectedApprover: []: selectedApprover}
          suggestions={ApproverSuggestions}
          completeMethod={searchApprover}
          selectedItemTemplate={multiple && itemSelectedTemplate}
          field="displayName"
          onChange={(e) => {
            if (multiple && Array.isArray(e.value)) {
              const approvers = e.value.map(({ id, displayName, identityCard, personalNumber }) => ({
                id,
                displayName,
                identityCard,
                personalNumber,
              }));

              setSelectedApprover(approvers);
              setValue(name, approvers);
              if (trigger) trigger(name);
            }

            if (!multiple) {
              setSelectedApprover(e.value);
              
              if (e.value?.id) {
                const { id, displayName, identityCard, personalNumber } = e.value;
                setValue(name, [{ id, displayName, identityCard, personalNumber }]);
              } else {
                setValue(name, [])
              }
              
              if (trigger) trigger(name);
            }
          }}
        />
        <label htmlFor="2020">
          {errors?.approvers && (
            <small style={{ color: "red" }}>
              {errors.approvers?.message ? errors.approvers?.message : "יש למלא ערך"}
            </small>
          )}
        </label>
      </div>
    </div>
  );
};

Approver.defaultProps = {
    disabled: false
}

export default Approver;
