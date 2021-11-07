import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  createRef,
  useMemo,
} from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import CreateBulkRoleForm from "./CreateBulkRoleForm";
import CreateSingleRoleForm from "./CreateSingleRoleForm";
import { useStores } from "../../context/use-stores";
import { toJS } from "mobx";
import { USER_TYPE } from "../../constants";

const CreateRoleForm = forwardRef(({ setIsActionDone }, ref) => {
  const { userStore } = useStores();
  const [activeIndex, setActiveIndex] = useState(0);
  const formRefs = useMemo(() => ({ 0: createRef(), 1: createRef() }), []);
  const isBulkPermitted = toJS(userStore.user)?.type?.includes(USER_TYPE.BULK);

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: formRefs[activeIndex].current.handleSubmit,
    }),
    [activeIndex, formRefs]
  );

  // TODO: remove !
  return !isBulkPermitted ? (
    <Accordion
      expandIcon="pi pi-chevron-left"
      style={{ marginBottom: "20px" }}
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
      <AccordionTab header="תפקיד חדש">
        <CreateSingleRoleForm
          ref={formRefs[0]}
          showJob={false}
          setIsActionDone={setIsActionDone}
        />
      </AccordionTab>
      <AccordionTab header="הגשת בקשה מרובה">
        <CreateBulkRoleForm
          ref={formRefs[1]}
          showJob={false}
          setIsActionDone={setIsActionDone}
        />
      </AccordionTab>
    </Accordion>
  ) : (
    <CreateSingleRoleForm
      ref={formRefs[0]}
      showJob={false}
      setIsActionDone={setIsActionDone}
    />
  );
});

export default CreateRoleForm;
