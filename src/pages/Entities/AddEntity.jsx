import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import InfoPopup from '../../components/InfoPopup';
import { TableAdd } from '../../constants/usersTable';
import { useToast } from '../../context/use-toast';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import '../../assets/css/local/pages/dashboard.css';

const AddEntity = ({ tableType }) => {
  const { trackEvent } = useMatomo();
  const { actionPopup } = useToast();
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isActionDone, setIsActionDone] = useState(false);

  const addFields = TableAdd[tableType];

  const renderHeader = (actionName, showInfo, infoText, infoWithTitle) => {
    return (
      <div className="display-flex dialog-header">
        <div className="dialog-header-title">{actionName}</div>
        <InfoPopup
          name={actionName + ' dialog'}
          infoText={infoText}
          visible={showInfo}
          withTitle={infoWithTitle}
        ></InfoPopup>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className="display-flex ">
        <div className="display-flex"></div>
        <div className="display-flex ">
          <Button
            label="ביטול"
            onClick={() => setIsVisible(false)}
            className="btn-underline"
          />
          <Button
            label="שליחת בקשה"
            onClick={() => handleRequest()}
            className="btn-gradient orange"
          />
        </div>
      </div>
    );
  };

  const sendTrack = (type, action) => {
    trackEvent({
      category: type,
      action: action,
    });
  };

  const renderModalForm = () => {
    const FormName = addFields.modalName;
    return (
      <FormName
        ref={modalRef}
        setIsActionDone={setIsActionDone}
        sendTrack={sendTrack}
      />
    );
  };

  const handleRequest = async () => {
    try {
      await modalRef.current.handleSubmit();
    } catch (e) {
      actionPopup(addFields?.actionName, e.message || 'Message Content');
    }
  };

  useEffect(() => {
    if (isActionDone) {
      actionPopup(addFields?.actionName);
      setIsVisible(false);
      setIsActionDone(false);
    }
  }, [isActionDone]);

  return (
    <>
      <button
        className={addFields.addClass}
        title={addFields.actionName}
        type="button"
        onClick={() => setIsVisible(true)}
      >
        <div className="decoration">
          <div className="img"></div>
        </div>
        <p>{addFields.actionName}</p>
      </button>
      <Dialog
        className={addFields.dialogClass}
        header={renderHeader(
          addFields.actionName,
          true,
          addFields.infoText,
          addFields.infoWithTitle
        )}
        visible={isVisible}
        onHide={() => setIsVisible(false)}
        footer={renderFooter()}
        dismissableMask={true}
      >
        {renderModalForm()}
      </Dialog>
    </>
  );
};

export default AddEntity;
