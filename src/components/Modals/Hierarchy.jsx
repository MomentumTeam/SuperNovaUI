import React, { useState } from 'react';
import ModalHierarchy from '../ModalHierarchy';
import { searchOG } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';

const Hierarchy = ({setValue, name}) => {

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
                    <label htmlFor="2020"> <span className="required-field">*</span>היררכיה</label>
                    <AutoComplete
                        value={selectedOg}
                        suggestions={ogSuggestions}
                        completeMethod={searchOg}
                        id="2020" type="text" field="name"
                        onChange={(e) => {
                            setSelectedOg(e.value.name)
                            setValue(name, e.value )
                        }}
                        required
                        placeholder="היררכיה" />
                </div>
        </>
    )
}

export default Hierarchy;