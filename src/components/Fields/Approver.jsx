import React, { useState, useEffect, useRef } from 'react';
import {
  searchApproverByDisplayNameReq,
  searchHighApproverByDisplayNameReq,
} from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';
import { Tooltip } from 'primereact/tooltip';
import { debounce } from "lodash";

import { useStores } from '../../context/use-stores';
import { getUserNameFromDisplayName } from '../../utils/user';
import '../../assets/css/local/components/approver.css';
import { useToast } from '../../context/use-toast';
import { USER_TYPE } from '../../constants';

const Approver = ({
  setValue,
  name,
  multiple,
  disabled = false,
  defaultApprovers,
  errors,
  type = USER_TYPE.COMMANDER,
  isHighRank = false,
  tooltip = 'גורם מאשר',
}) => {
  const { actionPopup } = useToast();
  const { userStore } = useStores();
  const [ApproverSuggestions, setApproverSuggestions] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(defaultApprovers);

  const onDisplayNameChange = async (event) => {
    try {
      if (event) {
        const displayNameToSearch = event.query;
        if (displayNameToSearch.length > 1) {
          debouncedApproverName.current(displayNameToSearch);
        } else {
          setApproverSuggestions([]);
        }
      }
    } catch (error) {
      setApproverSuggestions([]);
      actionPopup("הבאת גורמים מאשרים", {message: "לא ניתן כרגע לחפש גורמים מאשרים"})
    }
  };

  const searchApprover = async(displayName) => {
    try {
        const result = await (isHighRank
          ? searchHighApproverByDisplayNameReq(displayName)
          : searchApproverByDisplayNameReq(displayName, type));
        const filteredResult = result.approvers.filter((approvers) => approvers.id !== userStore.user.id);
        setApproverSuggestions(filteredResult);
    } catch (error) {
       setApproverSuggestions([]);
       actionPopup("הבאת גורמים מאשרים", { message: "לא ניתן כרגע לחפש גורמים מאשרים" });
    }
  }

  const debouncedApproverName = useRef(
    debounce(async (approverQuery) => {
      searchApprover(approverQuery);
    }, 200)
  );

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
    <div className="p-field-item" id="approver-field">
      <div className={multiple ? 'AutoCompleteWrap' : ''}>
        <label htmlFor="2022">
          <span className="required-field">*</span>גורם מאשר
        </label>
        <AutoComplete
          disabled={disabled}
          id={`approver-field-input-${name}`}
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
          completeMethod={onDisplayNameChange}
          selectedItemTemplate={multiple && itemSelectedTemplate}
          field="displayName"
          onChange={(e) => {
            if (multiple && Array.isArray(e.value)) {
              const approvers = e.value.map(({ id, displayName, entityId, identityCard, personalNumber }) => ({
                id,
                displayName,
                entityId,
                ...(identityCard && { identityCard }),
                ...(personalNumber && { personalNumber }),
              }));

              setSelectedApprover(approvers);
              setValue(name, approvers);
            }

            if (!multiple) {
              setSelectedApprover(e.value);

              if (e.value?.id) {
                const { id, displayName, entityId, identityCard, personalNumber } = e.value;
               setValue(name, [
                 { id, displayName,entityId, ...(identityCard && { identityCard }), ...(personalNumber && { personalNumber }) },
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
                ? errors.approvers.message
                : 'יש למלא ערך'}
            </small>
          )}
        </label>
      </div>
    </div>
  );
};


export default Approver;
