import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";

import PreviewApproverRequest from "../PreviewApproverRequest";

const PreviewApproverRequestsDialog = ({
  request,
  isDialogVisible,
  setDialogVisiblity,
}) => {
  const [dialogContent, setDialogContent] = useState(null);

  const dialogParams = {
    CREATE_OG: { footer: null, header: "", dialogClass: "" },
    CREATE_ROLE: { footer: null, header: "", dialogClass: "" },
    ASSIGN_ROLE_TO_ENTITY: { footer: null, header: "", dialogClass: "" },
    CREATE_ENTITY: { footer: null, header: "", dialogClass: "" },
    RENAME_OG: { footer: null, header: "", dialogClass: "" },
    RENAME_ROLE: { footer: null, header: "", dialogClass: "" },
    EDIT_ENTITY: { footer: null, header: "", dialogClass: "" },
    DELETE_OG: { footer: null, header: "", dialogClass: "" },
    DELETE_ROLE: { footer: null, header: "", dialogClass: "" },
    DELETE_ENTITY: { footer: null, header: "", dialogClass: "" },
    DISCONNECT_ROLE: { footer: null, header: "", dialogClass: "" },
    ADD_APPROVER: {
      footer: null,
      header: "פרטי בקשה גורם מאשר",
      dialogClass: "dialogClass6",
    },
    CHANGE_ROLE_HIERARCHY: { footer: null, header: "", dialogClass: "" },
    CREATE_ROLE_BULK: { footer: null, header: "", dialogClass: "" },
    CHANGE_ROLE_HIERARCHY_BULK: { footer: null, header: "", dialogClass: "" },
    UNRECOGNIZED: { footer: null, header: "", dialogClass: "" },
  };

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

      setDialogContent(newDialogContent);
      if (!newDialogContent) {
        setDialogVisiblity(false);
      }
    }
  }, [JSON.stringify(request)]);

  return (
    <>
      {dialogContent ? (
        <Dialog
          className={`${dialogParams[request.type]?.dialogClass} previewRequest`}
          header={dialogParams[request.type]?.header || ""}
          visible={isDialogVisible}
          onHide={() => setDialogVisiblity(false)}
          footer={dialogParams[request.type]?.footer}
        >
          {dialogContent}
        </Dialog>
      ) : null}
    </>
  );
};

export default PreviewApproverRequestsDialog;
