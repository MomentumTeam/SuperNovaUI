import React, { forwardRef, useState, useImperativeHandle, useMemo, createRef } from 'react';
import AssignRoleToEntityForm from './AssignRoleToEntityForm';
import CreateSpecialEntityForm from './CreateSpecialEntityForm';
import { Accordion, AccordionTab } from "primereact/accordion";

const CreateEntityForm = forwardRef((props, ref) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const formRefs = useMemo(
        () => ({ 0: createRef(), 1: createRef() }),
        []
    );

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit: formRefs[activeIndex].current.handleSubmit,
        }),
        [activeIndex, formRefs]
    );

    return (
        <Accordion
            expandIcon="pi pi-chevron-left"
            style={{ "marginBottom": "20px" }}
            activeIndex={activeIndex}
            onTabChange={({ index }) => setActiveIndex(index)}
        >
            <AccordionTab header="משתמש חדש">
                <AssignRoleToEntityForm ref={formRefs[0]} showJob={false} />
            </AccordionTab>
            <AccordionTab header="משתמש מיוחד">
                <CreateSpecialEntityForm ref={formRefs[1]} />
            </AccordionTab>
        </Accordion>)
});

export default CreateEntityForm;
