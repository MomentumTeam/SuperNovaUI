import React, { useState } from 'react';
import { searchApproverByDisplayNameReq } from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';
import '../../assets/css/local/components/approver.css';

const Approver = ({ setValue, name, multiple, disabled, defaultApprovers, errors }) => {
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(defaultApprovers);

  const searchApprover = async (event) => {
    const result = await searchApproverByDisplayNameReq(
      event.query,
      'COMMANDER'
    );
    setApproverSuggestions(result.approvers);
  };

  return (
    <div className='p-field-item'>
      <div className={multiple ? 'AutoCompleteWrap' : ''}>
        <label htmlFor='2022'>
          <span className='required-field'>*</span>גורם מאשר
        </label>
        <AutoComplete
          disabled={disabled}
          id='2022'
          className={`approver-selection-${multiple === true ? 'multiple' : 'single'} ${disabled ? 'disabled' : ''}`}
          multiple={multiple}
          value={selectedApprover}
          suggestions={ApproverSuggestions}
          completeMethod={searchApprover}
          field='displayName'
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
            }

            if (!multiple) {
              const { id, displayName, identityCard, personalNumber } = e.value;
              setSelectedApprover(displayName);
              setValue(name, { id, displayName, identityCard, personalNumber });
            }
          }}
        />
        <label htmlFor="2020">
          {errors?.approvers && <small style={{ color: "red" }}>יש למלא ערך</small>}
        </label>
      </div>
    </div>
  );
};

Approver.defaultProps = {
    disabled: false
}

export default Approver;
