import React, { forwardRef, useState, useImperativeHandle, useMemo, createRef } from 'react';
import AssignRoleToEntityForm from './AssignRoleToEntityForm';
import CreateSpecialEntityForm from './CreateSpecialEntityForm';
import { Accordion, AccordionTab } from "primereact/accordion";

const CreateEntityForm = forwardRef(({ setIsActionDone }, ref) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const formRefs = useMemo(
        () => ({ 0: createRef(), 1: createRef() }),
        []
    );

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit: formRefs[activeIndex].current.handleSubmit
        }),
        [activeIndex, formRefs]
    );

    return (
        <Accordion
            expandIcon="pi pi-chevron-left"
            style={{ "marginBottom": "20px" }}
            activeIndex={activeIndex}
            onTabChange={({ index }) => {
                setActiveIndex((currentIndex) => {
                  if (index !== null) {
                    return index;
                  } else {
                    return currentIndex === 0 ? 1 : 0;
                  }
                });
            }}
        >
            <AccordionTab header="משתמש חדש">
                <AssignRoleToEntityForm ref={formRefs[0]} showJob={false} setIsActionDone={setIsActionDone} />
            </AccordionTab>
            <AccordionTab header="משתמש מיוחד">
                <CreateSpecialEntityForm ref={formRefs[1]} setIsActionDone={setIsActionDone} />
            </AccordionTab>
        </Accordion>)
});

export default CreateEntityForm;
