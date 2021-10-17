import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import PreviewRequestWrapper from "./PreviewRequestWrapper";
import ApproverForm from "./Modals/ApproverForm";
import CreateOGForm from "./Modals/CreateOGForm";
import CreateSingleRoleForm from "./Modals/CreateSingleRoleForm";
import RenameSingleOGForm from "./Modals/RenameSingleOGForm";
import CreateSpecialEntityForm from "./Modals/CreateSpecialEntityForm";
import AssignRoleToEntityForm from "./Modals/AssignRoleToEntityForm";
import CreateBulkRoleForm from "./Modals/CreateBulkRoleForm";
import RenameBulkOGForm from "./Modals/RenameBulkOGForm";

const PreviewRequestsDialog = ({ request }) => {
  const [isDialogVisible, setDialogVisiblity] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const dialogParams = {
    CREATE_OG: { footer: null, header: 'פרטי בקשה יצירת היררכיה', component: CreateOGForm, classDialog: 'dialogClass5' },
    CREATE_ROLE: { footer: null, header: 'פרטי בקשה יצירת תפקיד', component: CreateSingleRoleForm, dialogClass: 'dialogClass1'  },
    ASSIGN_ROLE_TO_ENTITY: { footer: null, header: 'פרטי בקשה יצירת משתמש', component: AssignRoleToEntityForm, dialogClass: 'dialogClass3'  },
    CREATE_ENTITY: { footer: null, header: 'פרטי בקשה יצירת ישות', component: CreateSpecialEntityForm, dialogClass: 'dialogClass3'  },
    ADD_APPROVER: { footer: null, header: 'פרטי בקשה גורם מאשר', component: ApproverForm, dialogClass: 'dialogClass6' },
    CHANGE_ROLE_HIERARCHY: { footer: null, header: 'פרטי בקשה שינוי היררכיה', component: RenameSingleOGForm, dialogClass: 'dialogClass2'   },
    CREATE_ROLE_BULK: { footer: null, header: 'פרטי בקשת תפקידים חדשים', component: CreateBulkRoleForm, dialogClass: 'dialogClass1'  },
    CHANGE_ROLE_HIERARCHY_BULK: { footer: null, header: 'פרטי בקשת שינוי היררכיות', component: RenameBulkOGForm, dialogClass: 'dialogClass2' },
    // RENAME_OG: { footer: null, header: '' },
    // RENAME_ROLE: { footer: null, header: '' },
    // EDIT_ENTITY: { footer: null, header: '' },
    // DELETE_OG: { footer: null, header: '' },
    // DELETE_ROLE: { footer: null, header: '' },
    // DELETE_ENTITY: { footer: null, header: '' },
    // DISCONNECT_ROLE: { footer: null, header: '' },
    // UNRECOGNIZED: { footer: null, header: '' },
  }
  

  useEffect(() => {
    if (request.type) {
      // TODO: handle UNRECOGNIZED
      if (dialogParams[request.type]) {
        setDialogContent(<PreviewRequestWrapper request={request} ModalComponent={dialogParams[request.type].component} setDialogVisiblity={setDialogVisiblity} />);
        setDialogVisiblity(true);
      };
    }
  }, [JSON.stringify(request)]);

  return (
    <Dialog
        className={dialogParams[request.type]?.dialogClass || ''}
      header={dialogParams[request.type]?.header || ''}
      visible={isDialogVisible}
      onHide={() => setDialogVisiblity(false)}
      footer={dialogParams[request.type]?.footer}
    >
      {dialogContent}
    </Dialog>
  );
};

export default PreviewRequestsDialog;
