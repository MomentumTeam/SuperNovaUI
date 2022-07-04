import React, { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { DisconnectRoleFromEntityFooter } from './DisconnectRoleFromEntityFooter';
import { disconectRoleFromEntityRequest } from '../../../service/AppliesService';

const DisconnectRoleFromEntityPopup = ({
  user,
  role,
  entity,
  samAccountName,
  showModal,
  closeModal,
  actionPopup,
}) => {
  const [actionIsDone, setActionIsDone] = useState(false);

  useEffect(() => {
    if (actionIsDone) {
      actionPopup();
      setActionIsDone(false);
    }
  }, [actionIsDone]);

  const handleRequest = async () => {
    try {
      // const disconnectRole = async () => {
      const req = {
        submittedBy: { id: user.id, displayName: user.displayName },
        kartoffelParams: {
          id: entity.id,
          uniqueId: role.roleId,
        },
        adParams: {
          samAccountName,
        },
      };

      const res = await disconectRoleFromEntityRequest(req);
      setActionIsDone(true);
      closeModal();
    } catch (e) {
      actionPopup('ניתוק משתמש', e);
    }
  };

  return (
    <div>
      <Dialog
        className={`${classNames('dialogClass5')} dialogdelete`}
        id="disconnectRoleFromEntityDialog"
        header="ניתוק משתמש מתפקיד"
        footer={
          <DisconnectRoleFromEntityFooter
            user={user}
            role={role}
            entity={entity}
            samAccountName={samAccountName}
            disconnectRole={handleRequest}
          />
        }
        visible={showModal}
        modal
        onHide={closeModal}
        closable={false}
        style={{ height: '310px', width: '30vw' }}
      >
        <p
          className="container display-flex display-flex-center"
          style={{ textAlign: 'center', fontSize: '18px', padding: '10px' }}
        >
          האם את\ה בטוח\ה?
          <br></br>
          ניתוק המשתמש מהתפקיד ימנע ממנו להתחבר לעמדה ולהמשיך בעבודתו
          <br></br>
          התפקיד הנבחר ישאר ריק(פנוי) לאחר הניתוק
        </p>
      </Dialog>
    </div>
  );
};

export default DisconnectRoleFromEntityPopup;
