import React, { useState } from 'react';
import ModalHierarchy from '../ModalHierarchy';
import { searchOG } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';

const Hierarchy = ({ ogValue, disabled, setValue, name }) => {

    const [ogSuggestions, setOgSuggestions] = useState([]);
    const [selectedOg, setSelectedOg] = useState(ogValue);

    const searchOg = async (event) => {
        const result = await searchOG(event.query)
        setOgSuggestions(result.groups);
    }

    return (
        <>
            <div className="p-field">
                <label htmlFor="2020"><span className="required-field">*</span>היררכיית אב</label>
                <AutoComplete
                    disabled={disabled || false}
                    value={selectedOg}
                    suggestions={ogSuggestions}
                    completeMethod={searchOg}
                    id="2020"
                    type="text"
                    field="name"
                    onChange={(e) => {
                        setSelectedOg(e.value);
                        setValue(name, e.value);
                    }}
                    required
                    forceSelection
                    placeholder="היררכיה"
                />
            </div>
            {
                (!disabled || true) &&
                <ModalHierarchy onSelectHierarchy={(hierarchySelected) => {
                    setSelectedOg(hierarchySelected.name);
                    setValue(name, hierarchySelected);
                }}
                />      
            }
        </>
    )
}

export default Hierarchy;