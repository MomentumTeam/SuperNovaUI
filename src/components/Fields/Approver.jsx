import React, { useState, useEffect } from 'react';
import {
  searchApproverByDisplayNameReq,
  searchHighApproverByDisplayNameReq,
} from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';
import { Tooltip } from 'primereact/tooltip';

import { useStores } from '../../context/use-stores';
import { getUserNameFromDisplayName } from '../../utils/user';
import '../../assets/css/local/components/approver.css';

const Approver = ({
  setValue,
  name,
  multiple,
  disabled = false,
  defaultApprovers,
  errors,
  type = 'COMMANDER',
  isHighRank = false,
  tooltip = 'גורם מאשר',
}) => {
  const { userStore } = useStores();
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(defaultApprovers);

  const searchApprover = async (event) => {
    if (event) {
      if (event.query.length > 1) {
        const result = await (isHighRank
          ? searchHighApproverByDisplayNameReq(event.query)
          : searchApproverByDisplayNameReq(event.query, type));
        const filteredResult = result.approvers.filter((approvers) => approvers.id !== userStore.user.id);
        setApproverSuggestions(filteredResult);
      } else {
        setApproverSuggestions([]);
      }

    }
  };

  const itemSelectedTemplate = (item) => {
    const id = Math.random().toString(36).slice(2);
    const userFullName = getUserNameFromDisplayName(item.displayName);
    return (
      <>
        <Tooltip
          target={`.approver-name-${id}`}
          content={item.displayName}
          position="top"
        />
        <div className={`approver-name approver-name-${id}`}>
          {userFullName}
        </div>
      </>
    );
  };

  useEffect(() => {
    setSelectedApprover(defaultApprovers);
    setApproverSuggestions([]);
  }, [type, defaultApprovers]);


  return (
    <div className="p-field-item">
      <div className={multiple ? 'AutoCompleteWrap' : ''}>
        <label htmlFor="2022">
          <span className="required-field">*</span>גורם מאשר
        </label>
        <AutoComplete
          disabled={disabled}
          id="2022"
          className={`approver-selection-${
            multiple === true ? 'multiple' : 'single'
          } ${disabled ? 'disabled' : ''}`}
          multiple={multiple}
          tooltip={disabled ? '' : tooltip}
          tooltipOptions={{ position: 'top' }}
          value={
            multiple
              ? Array.isArray(selectedApprover)
                ? selectedApprover
                : []
              : selectedApprover
          }
          suggestions={ApproverSuggestions}
          completeMethod={searchApprover}
          selectedItemTemplate={multiple && itemSelectedTemplate}
          field="displayName"
          onChange={(e) => {
            console.log(e)
            if (multiple && Array.isArray(e.value)) {
              const approvers = e.value.map(({ id, displayName, identityCard, personalNumber }) => ({
                id,
                displayName,
                ...(identityCard && { identityCard }),
                ...(personalNumber && { personalNumber }),
              }));

              setSelectedApprover(approvers);
              setValue(name, approvers);
            }

            if (!multiple) {
              setSelectedApprover(e.value);

              if (e.value?.id) {
                const { id, displayName, identityCard, personalNumber } =
                  e.value;
               setValue(name, [
                 { id, displayName, ...(identityCard && { identityCard }), ...(personalNumber && { personalNumber }) },
               ]);
              } else {
                setValue(name, []);
              }
            }
          }}
        />
        <label htmlFor="2020">
          {errors?.approvers && (
            <small style={{ color: 'red' }}>
              {errors.approvers?.message
                ? errors.approvers?.message
                : 'יש למלא ערך'}
            </small>
          )}
        </label>
      </div>
    </div>
  );
};


export default Approver;
