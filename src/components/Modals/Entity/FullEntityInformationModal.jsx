import React, { createContext, useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import blankProfilePic from '../../../assets/images/blankProfile.png';
import { getPictureByEntityIdentifier } from '../../../service/UserService';
import { FullEntityInformationFooter } from './FullEntityInformationFooter';

import '../../../assets/css/local/general/buttons.css';
import '../../../assets/css/local/components/modal-item.css';
import { FullEntityInformationForm } from './FullEntityInformationForm';
import { ProgressSpinner } from 'primereact/progressspinner';
import configStore from '../../../store/Config';

export const FullEntityInformationModalContext = createContext(null);

const FullEntityInformationModal = ({
  user,
  isOpen,
  closeFullDetailsModal,
  edit,
  actionPopup,
}) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [userPic, setUserPic] = useState(undefined);
  const [isActionDone, setIsActionDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { trackEvent } = useMatomo();
  const ref = useRef(null);

  const handleRequest = async () => {
    try {
      await ref.current.handleSubmit();
    } catch (e) {
      actionPopup('עריכת משתמש', e.message || 'Message Content');
    }
  };

  const clickTracking = (action) => {
    trackEvent({
      category: 'עריכה',
      action: action,
    });
  };

  useEffect(() => {
    if (isActionDone) {
      actionPopup();
      closeFullDetailsModal();
    }
  }, [isActionDone]);

  useEffect(() => {
    async function getUserPic() {
      try {
        if (
          user &&
          (user.picture === '' ||
            user.picture === configStore.USER_NO_PICTURE ||
            !user.picture)
        ) {
          if (user?.personalNumber || user?.identityCard) {
            const pic = await getPictureByEntityIdentifier(
              user?.personalNumber || user?.identityCard
            );
            setUserPic(pic.image);
          }
        } else {
          setUserPic(user.picture);
        }
      } catch (error) {}

      setIsLoading(false);
    }

    setIsLoading(true);
    // When user changes, retrive new photo
    getUserPic();
  }, [user, isOpen]);

  return (
    <Dialog
      className={classNames('dialogClass7')}
      header={isEdit ? 'עריכת משתמש/ת' : 'פרטי משתמש/ת'}
      visible={isOpen}
      style={{ borderRadius: '30px' }}
      onHide={closeFullDetailsModal}
      footer={
        <FullEntityInformationFooter
          entity={user}
          isEdit={isEdit}
          closeModal={closeFullDetailsModal}
          setIsEdit={setIsEdit}
          handleRequest={handleRequest}
        />
      }
      dismissableMask={true}
    >
      {isLoading ? (
        <ProgressSpinner className="tree-loading-spinner" />
      ) : (
        <div>
          <div className="userpic-wrap">
            <img
              style={{ borderRadius: '50%', width: '142px' }}
              src={
                user && userPic && userPic !== configStore.USER_NO_PICTURE
                  ? `data:image/jpeg;base64,${userPic}`
                  : blankProfilePic
              }
              alt="userpic"
            />
          </div>
          <FullEntityInformationForm
            ref={ref}
            reqView={false}
            requestObject={user}
            setIsActionDone={setIsActionDone}
            onlyForView={!isEdit}
            setIsEdit={setIsEdit}
            clickTracking={clickTracking}
          />
        </div>
      )}
    </Dialog>
  );
};

export default FullEntityInformationModal;
