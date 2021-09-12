import React, { useState } from 'react';
import { searchApproverByDisplayNameReq } from '../../service/ApproverService';
import { AutoComplete } from 'primereact/autocomplete';

const Approver = ({ setValue, name }) => {

    const [ApproverSuggestions, setApproverSuggestions] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState(null);

    const searchApprover = async (event) => {
        const result = await searchApproverByDisplayNameReq(event.query)
        setApproverSuggestions(result.approvers);
    }

    return (
        <div className="p-field">
            <label htmlFor="2022"><span className="required-field">*</span>גורם מאשר</label>
            <AutoComplete id="2022"
                value={selectedApprover}
                suggestions={ApproverSuggestions}
                completeMethod={searchApprover}
                field="displayName"
                onChange={(e) => {
                    const { id, displayName } = e.value
                    setSelectedApprover(displayName)
                    setValue(name, { id, displayName })
                }
                } />
        </div>
    )
}

export default Approver;