import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../../../context/use-toast';
import { deleteRequest } from '../../../service/AppliesService';
import { useStores } from '../../../context/use-stores';
import {
  cantBeDeletedByStatus,
  isAutomaticallyApproved,
} from '../../../utils/applies';

const DeleteSection = ({ request, setDialogVisiblity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { actionPopup } = useToast();
  const { appliesStore, userStore } = useStores();
  const enabledDelete =
    cantBeDeletedByStatus(request, userStore.user) &&
    !isAutomaticallyApproved(request, userStore.user);

  return (
    <>
      <Dialog
        className="dialogClass8"
        header="מחיקה"
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        dismissableMask={true}
        style={{ width: '20vw' }}
        footer={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                label="כן, תמחק"
                onClick={async () => {
                  try {
                    await deleteRequest(request.id);
                    actionPopup('מחיקה');
                    await appliesStore.removeApplyById(request.id);
                  } catch (err) {
                    actionPopup('מחיקה', {});
                  }

                  setDialogVisiblity(false);
                  setIsOpen(false);
                }}
              />
              <Button
                label="לא, אל תמחק"
                className="p-button-danger"
                onClick={() => setIsOpen(false)}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div>
            <p style={{ fontWeight: 'bold' }}>האם את/ה בטוח/ה?</p>
          </div>
        </div>
      </Dialog>
      <div>
        {enabledDelete && (
          <Button
            label="מחיקה "
            className={'btn-gradient red'}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>
    </>
  );
};

export { DeleteSection };
