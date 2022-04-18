import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useToast } from '../../context/use-toast';
import React, { useState } from 'react';

const ConvertEntityType = ({  entity = {} }) => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isSoldier = entity.entityType === 'agumon'; //true=soldier , false=civilian
  const { actionPopup } = useToast();

  const openDialog = async () => {
    setIsMainOpen(true);
  };

  const closeDialog = async () => {
    setIsMainOpen(false);
    setIsOpen(false);

  };

  return (
    <>
      <Dialog
        className="dialogClass7"
        header="השלמת פרטים חסרים"
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        dismissableMask={true}
        style={{ width: '25vw', minHeight: '250px' }}
        footer={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <InputText
                // id=""
                type="text"
                required
                onInput={() => {
              
                }}
                // onBlur=
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                  }
                }}
                // disabled=
              />
              <Button
                label="אישור"
                id="fullEntityInfo-closeOrSave"
                className="btn-orange-gradient"
                onClick={async () => {}}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div style={{ margin: '2vw' }}>
            <p style={{ fontWeight: 'bold' }}>
              {isSoldier ? 'הכנס תעודת זהות:' : 'הכנס מספר אישי:'}
            </p>
          </div>
        </div>
      </Dialog>
      <Dialog
        className="dialogClass7"
        header="המרת סוג ישות"
        visible={isMainOpen}
        onHide={() => setIsMainOpen(false)}
        dismissableMask={true}
        style={{ width: '25vw', minHeight: '250px' }}
        footer={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                style={{ marginLeft: '20px' }}
                className="btn-border blue"
                label={
                  isSoldier
                    ? 'כן, הפוך את החייל לאזרח'
                    : 'כן, הפוך את האזרח לחייל'
                }
                onClick={async () => {
                  if (
                    (isSoldier && !entity.identityCard) ||
                    (!isSoldier && !entity.personalNumber)
                  ) {
                    setIsOpen(true);
                  }
                }}
              />
              <Button
                label={
                  isSoldier
                    ? 'לא, השאר את החייל כחייל'
                    : 'לא, השאר את האזרח כאזרח'
                }
                className="btn-border red"
                onClick={async () => {}}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div style={{ margin: '2vw' }}>
            <p style={{ fontWeight: 'bold' }}>
              {isSoldier
                ? 'האם את/ה בטוח/ה שתרצה/י להפוך את החייל לאזרח?'
                : 'האם את/ה בטוח/ה שתרצה/י להפוך את האזרח לחייל?'}
            </p>

            <p>
              {isSoldier
                ? 'המשמעות- שינוי מזהה הכרטיס מתעודת זהות C למספר אישי S'
                : 'המשמעות- שינוי מזהה הכרטיס ממספר אישי S לתעודת זהות C'}
            </p>
          </div>
        </div>
      </Dialog>
      <div>
        <Button
          id="export-button"
          icon="pi pi-user-edit"
          label={isSoldier ? ' הפוך מחייל לאזרח' : '  הפוך מאזרח לחייל '}
          className="btn-border blue"
          onClick={openDialog}
        />
      </div>
    </>
  );
};

export { ConvertEntityType };
