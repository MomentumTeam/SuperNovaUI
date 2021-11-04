import { useRef, useState,useEffect} from "react";
import { PassRequestForm } from "./PassRequestForm";
import { Dialog } from "primereact/dialog";
import { toJS } from 'mobx';
import { useStores } from '../../../context/use-stores';

const PassRequestDialog = ({ request, isDialogVisible, setDialogVisiblity, actionPopup }) => {
  const [actionIsDone, setActionIsDone] = useState(false);
  const {appliesStore} = useStores();

  const footer = (
    <div className="display-flex display-flex-end">
      <button className="btn-underline" type="button" title="ביטול" onClick={() => setDialogVisiblity(false)}>
        ביטול
      </button>
      <button className="btn-orange-gradient" type="button" title="אישור" onClick={() => handleRequest()}>
        אישור
      </button>
    </div>
  );

  const passForm = useRef(null);

  useEffect(() => {
    if (actionIsDone) {
      actionPopup();
      setActionIsDone(false);
      setDialogVisiblity(false);
      
    }
  }, [actionIsDone]);

  const handleRequest = async () => {
    try {
      await passForm.current.handleSubmit();

    } catch (e) {
      actionPopup(e);
    }
    
  };

  return (
    <Dialog
      className="dialogPass"
      visible={isDialogVisible}
      showHeader={false}
      modal={false}
      footer={footer}
      closeOnEscape
      onHide={() => setDialogVisiblity(false)}
    >
      <PassRequestForm request={toJS(request)} ref={passForm} setActionIsDone={setActionIsDone}/>
    </Dialog>
  );
};

export { PassRequestDialog };
