import React, { useState } from 'react';
import ModalHierarchy from '../ModalHierarchy';
import { searchOG } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';

const Hierarchy = ({setValue, name, initialValue, fieldName = 'היררכיה'}) => {

    const [ogSuggestions, setOgSuggestions] = useState([]);
    const [selectedOg, setSelectedOg] = useState(null);

    const searchOg = async (event) => {
        const result = await searchOG(event.query)
        setOgSuggestions(result.groups);
    }

    return (
        <>
            {/* <ModalHierarchy /> */}
                <div className="p-field">
                    <label htmlFor="2020"> <span className="required-field">*</span>{fieldName}</label>
                    <AutoComplete
                        value={initialValue || selectedOg}
                        suggestions={ogSuggestions}
                        completeMethod={searchOg}
                        id="2020" type="text" field="name"
                        onChange={(e) => {
                            setSelectedOg(e.value.name)
                            setValue(name, e.value )
                        }}
                        required
                        placeholder={fieldName} />
                </div>
        </>
    )
}

export default Hierarchy;