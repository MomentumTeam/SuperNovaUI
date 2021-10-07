import { useState, useEffect } from "react";
import PreviewApproverRequest from "./Modals/PreviewApproverRequest";
import { Dialog } from "primereact/dialog";

const PreviewRequestsDialog = ({ request }) => {
  const [isDialogVisible, setDialogVisiblity] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const dialogParams = {
    CREATE_OG: { footer: null, header: '' },
    CREATE_ROLE: { footer: null, header: '' },
    ASSIGN_ROLE_TO_ENTITY: { footer: null, header: '' },
    CREATE_ENTITY: { footer: null, header: '' },
    RENAME_OG: { footer: null, header: '' },
    RENAME_ROLE: { footer: null, header: '' },
    EDIT_ENTITY: { footer: null, header: '' },
    DELETE_OG: { footer: null, header: '' },
    DELETE_ROLE: { footer: null, header: '' },
    DELETE_ENTITY: { footer: null, header: '' },
    DISCONNECT_ROLE: { footer: null, header: '' },
    ADD_APPROVER: { footer: null, header: 'פרטי בקשה גורם מאשר'},
    CHANGE_ROLE_HIERARCHY: { footer: null, header: '' },
    CREATE_ROLE_BULK: { footer: null, header: '' },
    CHANGE_ROLE_HIERARCHY_BULK: { footer: null, header: '' },
    UNRECOGNIZED: { footer: null, header: '' },
  }
  

  useEffect(() => {
    if (request.type) {
      let newDialogContent = null;
      switch (request.type) {
        case "ADD_APPROVER":
          newDialogContent = <PreviewApproverRequest request={request} />;
          break;
        default:
          break;
      }

      if (newDialogContent) {
        setDialogContent(newDialogContent);
        setDialogVisiblity(true);
      };
    }
  }, [JSON.stringify(request)]);

  return (
    <Dialog
      //   className={dialogClass}
      header={dialogParams[request.type]?.header || ''}
      className="btn-actions btn-actions6"
      visible={isDialogVisible}
      onHide={() => setDialogVisiblity(false)}
      footer={dialogParams[request.type]?.footer}
    >
      {dialogContent}
    </Dialog>
  );
};

export default PreviewRequestsDialog;
