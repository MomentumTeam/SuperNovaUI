import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  createRef,
  useMemo,
} from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CreateBulkRoleForm from '../Bulk/CreateBulkRoleForm';
import CreateSingleRoleForm from '../Role/CreateSingleRoleForm';
import { useStores } from '../../../context/use-stores';
import { USER_TYPE } from '../../../constants';
import { isUserHoldType } from '../../../utils/user';
import renderHeader from '../accordionTabHeaders';

const CreateRoleForm = forwardRef(({ setIsActionDone, clickTracking }, ref) => {
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
      <AccordionTab header={renderHeader('תפקיד חדש', true)}>
        <CreateSingleRoleForm
          ref={formRefs[0]}
          showJob={false}
          setIsActionDone={setIsActionDone}
          clickTracking={clickTracking}
        />
      </AccordionTab>
      <AccordionTab header={renderHeader('תפקידים חדשים', true, true)}>
        <CreateBulkRoleForm
          ref={formRefs[1]}
          showJob={false}
          setIsActionDone={setIsActionDone}
          clickTracking={clickTracking}
        />
      </AccordionTab>
    </Accordion>
  ) : (
    <CreateSingleRoleForm
      ref={formRefs[0]}
      showJob={false}
      setIsActionDone={setIsActionDone}
      clickTracking={clickTracking}
    />
  );
});

export default CreateRoleForm;
