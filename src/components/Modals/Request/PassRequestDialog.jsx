import { useRef } from "react";
import { PassRequestForm } from "./PassRequestForm";
import { Dialog } from "primereact/dialog";

const PassRequestDialog = ({ request, isDialogVisible, setDialogVisiblity, actionPopup }) => {
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
      <PassRequestForm ref={passForm} />
    </Dialog>
  );
};

export { PassRequestDialog };
