import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  createRef,
} from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useStores } from '../../../context/use-stores';
import RenameBulkOGForm from '../Bulk/RenameBulkOGForm';
import RenameSingleOGForm from '../Hierarchy/RenameSingleOGForm';
import { USER_TYPE } from '../../../constants';
import { isUserHoldType } from '../../../utils/user';
import '../../../assets/css/local/components/rename-og-form.css';
import renderHeader from '../accordionTabHeaders';

const RenameOGForm = forwardRef(({ setIsActionDone, clickTracking }, ref) => {
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

  return isBulkPermitted ? (
    <Accordion
      expandIcon="pi pi-chevron-left"
      style={{ marginBottom: '20px' }}
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
      <AccordionTab header={renderHeader('מעבר היררכיה לתפקיד', true)}>
        <RenameSingleOGForm
          ref={formRefs[0]}
          showJob={false}
          setIsActionDone={setIsActionDone}
          clickTracking={clickTracking}
        />
      </AccordionTab>
      <AccordionTab header={renderHeader('מעבר היררכיה לתפקידים', true, true)}>
        <RenameBulkOGForm
          ref={formRefs[1]}
          showJob={false}
          setIsActionDone={setIsActionDone}
          clickTracking={clickTracking}
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
