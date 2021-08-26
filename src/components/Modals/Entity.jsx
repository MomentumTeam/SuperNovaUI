import React, { useState } from 'react';
import { searchEntitiesByFullName, getEntityByIdNumber } from '../../service/KartoffelService';
import { AutoComplete } from 'primereact/autocomplete';

const Entity = ({ setValue, name }) => {

    const [EntitySuggestions, setEntitySuggestions] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);

    const searchEntityByName = async (event) => {
        const result = await searchEntitiesByFullName(event.query)
        setEntitySuggestions(result);
        setValue("entity", user)
    }

    const searchEntityByNumber = async (event) => {
        const result = await getEntityByIdNumber(event.query)
        setSelectedEntity(result);
        setValue("entity", user)
    }

    const setCurrentUser = () => {
        const user = toJS(userStore.user);
        setValue("entity", user)
    }

    const onChange = (e) => {
            const { displayName } = e.value
            setSelectedEntity(displayName)
            setValue(name, e.value)
    }

    return (
        <>
            <div className="p-fluid-item">
                <button className="btn-underline left19" onClick={setCurrentUser} type="button" title="עבורי">עבורי</button>
                <div className="p-field">
                    <label htmlFor="2020"> <span className="required-field">*</span>שם משתמש</label>
                    <AutoComplete id="2022"
                        value={selectedEntity}
                        suggestions={EntitySuggestions}
                        completeMethod={searchEntityByName}
                        field="displayName"
                        onChange={onChange} />
                </div>
            </div>
            <div className="p-fluid-item">
                <div className="p-field">
                    <label htmlFor="2021"> <span className="required-field">*</span>מ"א/ת"ז</label>
                    <AutoComplete id="2022"
                        value={selectedEntity}
                        suggestions={EntitySuggestions}
                        completeMethod={searchEntityByName}
                        field="displayName"
                        onChange={onChange} />
                </div>
            </div>
        </>
    )
}

export default Entity;