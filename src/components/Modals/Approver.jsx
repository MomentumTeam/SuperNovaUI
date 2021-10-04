import React, { useState } from 'react';
import { searchApproverByDisplayNameReq } from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';

const Approver = ({ setValue, name, multiple }) => {
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(null);

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
          id='2022'
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
      </div>
    </div>
  );
};

export default Approver;
