import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  createRef,
} from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useStores } from "../../../context/use-stores";
import RenameBulkOGForm from "../Bulk/RenameBulkOGForm";
import RenameSingleOGForm from "../Hierarchy/RenameSingleOGForm";
import { USER_TYPE } from "../../../constants";
import { isUserHoldType } from '../../../utils/user';
import "../../../assets/css/local/components/rename-og-form.css";

const RenameOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { userStore } = useStores();
  const [activeIndex, setActiveIndex] = useState(0);
  const formRefs = useMemo(() => ({ 0: createRef(), 1: createRef() }), []);
  const isBulkPermitted = isUserHoldType(userStore.user, USER_TYPE.BULK);

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
      <AccordionTab header="שינוי היררכיה לתפקיד">
        <RenameSingleOGForm
          ref={formRefs[0]}
          showJob={false}
          setIsActionDone={setIsActionDone}
        />
      </AccordionTab>
      <AccordionTab header="הגשת בקשה מרובה">
        <RenameBulkOGForm
          ref={formRefs[1]}
          showJob={false}
          setIsActionDone={setIsActionDone}
        />
      </AccordionTab>
    </Accordion>
  ) : (
    <RenameSingleOGForm
      ref={formRefs[0]}
      showJob={false}
      setIsActionDone={setIsActionDone}
    />
  );
});

export default RenameOGForm;
