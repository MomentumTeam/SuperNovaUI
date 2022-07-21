import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import '../../../assets/css/local/general/buttons.css';
import '../../../assets/css/local/components/modal-item.css';

import { FullRoleInformationFooter } from './FullRoleInformationFooter';
import { FullRoleInformationForm } from './FullRoleInformationForm';

const FullRoleInformation = ({
  role,
  isOpen,
  closeModal,
  edit,
  actionPopup,
}) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [isActionDone, setIsActionDone] = useState(false);
  const { trackEvent } = useMatomo();
  const ref = useRef(null);

  const handleRequest = async () => {
    try {
      await ref.current.handleSubmit();
    } catch (e) {
      actionPopup('עריכת תפקיד', e.message || 'Message Content');
    }
  };

  const sendTrack = (action) => {
    trackEvent({
      category: 'עריכה',
      action,
    });
  };

  const resetForm = () => ref.current.resetForm();

  useEffect(() => {
    if (isActionDone) {
      actionPopup();
      closeModal();
    }
  }, [isActionDone]);
  return (
    <Dialog
      className={classNames('dialogClass12')}
      header={isEdit ? 'עריכת תפקיד' : 'פרטי תפקיד'}
      visible={isOpen}
      style={{ borderRadius: '30px' }}
      onHide={closeModal}
      dismissableMask={true}
      footer={
        <FullRoleInformationFooter
          role={role}
          isEdit={isEdit}
          closeModal={closeModal}
          setIsEdit={setIsEdit}
          handleRequest={handleRequest}
          resetForm={resetForm}
        />
      }
    >
      <FullRoleInformationForm
        ref={ref}
        reqView={false}
        requestObject={role}
        actionPopup={actionPopup}
        setIsActionDone={setIsActionDone}
        onlyForView={!isEdit}
        sendTrack={sendTrack}
      />
    </Dialog>
  );
};

export { FullRoleInformation };
