import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import { ContainerRoleList } from './FullHierarchyContainerRoleList';
import { FullHierarchyInformationFooter } from './FullHierarchyInformationFooter';
import { HierarchyDelete } from './HierarchyDelete';

import '../../../assets/css/local/general/buttons.css';
import '../../../assets/css/local/components/modal-item.css';
import { FullHierarchyInformationForm } from './FullHierarchyInformationForm';

const FullHierarchyInformation = ({
  hierarchy,
  isOpen,
  closeModal,
  edit,
  actionPopup,
}) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionDone, setIsActionDone] = useState(false);
  const { trackEvent } = useMatomo();
  const ref = useRef(null);

  const handleRequest = async () => {
    try {
      await ref.current.handleSubmit();
    } catch (e) {
      actionPopup('עריכת קבוצה', e.message || 'Message Content');
    }
  };

  const sendTrack = (action) => {
    trackEvent({
      category: 'עריכה',
      action,
    });
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  useEffect(() => {
    if (isActionDone) {
      actionPopup();
      closeModal();
    }
  }, [isActionDone]);

  return (
    <>
      <Dialog
        className={classNames('dialogClass5')}
        header={isEdit ? 'עריכת היררכיה' : 'פרטי היררכיה'}
        visible={isOpen}
        style={{ borderRadius: '30px' }}
        onHide={closeModal}
        dismissableMask={true}
        footer={
          <FullHierarchyInformationFooter
            isEdit={isEdit}
            closeModal={closeModal}
            setIsEdit={setIsEdit}
            handleRequest={handleRequest}
            hierarchy={hierarchy}
          />
        }
      >
        <FullHierarchyInformationForm
          ref={ref}
          reqView={false}
          requestObject={hierarchy}
          setIsActionDone={setIsActionDone}
          onlyForView={!isEdit}
          setIsEdit={setIsEdit}
          sendTrack={sendTrack}
        />

        <div className="p-fluid-item p-fluid-item-flex1">
          <hr />
          <h2>רשימת תפקידים</h2>
        </div>
        <div id="containerRoleList" className="containerRoleList">
          <ContainerRoleList roles={hierarchy.directRoles} />
        </div>
      </Dialog>
      <HierarchyDelete
        hierarchy={hierarchy}
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
      />
    </>
  );
};

export { FullHierarchyInformation };
