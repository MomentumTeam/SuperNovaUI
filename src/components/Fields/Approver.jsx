import React, { useState } from "react";
import { searchApproverByDisplayNameReq } from "../../service/ApproverService";
import { AutoComplete } from "primereact/autocomplete";
import "../../assets/css/local/components/approver.css";
import { getIn } from "yup/lib/util/reach";

const Approver = ({
  setValue,
  name,
  multiple,
  disabled,
  defaultApprovers,
  errors,
  trigger = null,
}) => {
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(defaultApprovers);

  const searchApprover = async (event) => {
    const result = await searchApproverByDisplayNameReq(
      event.query,
      "COMMANDER"
    );
    setApproverSuggestions(result.approvers);
  };

  return (
    <div className="p-field-item">
      <div className={multiple ? "AutoCompleteWrap" : ""}>
        <label htmlFor="2022">
          <span className="required-field">*</span>גורם מאשר
        </label>
        <AutoComplete
          disabled={disabled}
          id="2022"
          className={`approver-selection-${
            multiple === true ? "multiple" : "single"
          } ${disabled ? "disabled" : ""}`}
          multiple={multiple}
          value={selectedApprover}
          suggestions={ApproverSuggestions}
          completeMethod={searchApprover}
          tooltip={selectedApprover.map(
            (approver) => `${approver.displayName}\n`
          )}
          tooltipOptions={{
            disabled: selectedApprover.length > 0 ? false : true,
            style: { direction: "ltr" },
          }}
          field="displayName"
          onChange={(e) => {
            if (multiple) {
              const approvers = e.value.map(
                ({ id, displayName, identityCard, personalNumber }) => ({
                  id,
                  displayName,
                  identityCard,
                  personalNumber,
                })
              );

              setSelectedApprover(approvers);
              setValue(name, approvers);
              if (trigger) trigger(name);
            }

            if (!multiple) {
              const { id, displayName, identityCard, personalNumber } = e.value;
              setSelectedApprover(displayName);
              setValue(name, { id, displayName, identityCard, personalNumber });
              if (trigger) trigger(name);
            }
          }}
        />
        <label htmlFor="2020">
          {errors?.approvers && (
            <small style={{ color: "red" }}>
              {errors.approvers?.message
                ? errors.approvers?.message
                : "יש למלא ערך"}
            </small>
          )}
        </label>
      </div>
    </div>
  );
};

Approver.defaultProps = {
  disabled: false,
};

export default Approver;
