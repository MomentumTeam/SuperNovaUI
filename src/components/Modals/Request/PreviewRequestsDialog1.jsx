import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import PreviewRequestWrapper from "./PreviewRequestWrapper";
import ApproverForm from "../ApproverForm";
import CreateOGForm from "../Hierarchy/CreateOGForm";
import CreateSingleRoleForm from "../Role/CreateSingleRoleForm";
import RenameSingleOGForm from "../Hierarchy/RenameSingleOGForm";
import CreateSpecialEntityForm from "../Entity/CreateSpecialEntityForm";
import AssignRoleToEntityForm from "../AssignRoleToEntityForm";
import CreateBulkRoleForm from "../Bulk/CreateBulkRoleForm";
import RenameBulkOGForm from "../Bulk/RenameBulkOGForm";

const PreviewRequestsDialog = ({ request, isDialogVisible, setDialogVisiblity }) => {
  const [dialogContent, setDialogContent] = useState(null);

  const dialogParams = {
    CREATE_OG: {
      footer: null,
      header: 'פרטי בקשה ליצירת היררכיה חדשה',
      component: CreateOGForm,
      classDialog: 'dialogClass5',
    },
    CREATE_ROLE: {
      footer: null,
      header: 'פרטי בקשה ליצירת תפקיד חדש',
      component: CreateSingleRoleForm,
      dialogClass: 'dialogClass1',
    },
    ASSIGN_ROLE_TO_ENTITY: {
      footer: null,
      header: 'פרטי בקשה לחיבור משתמש חדש לתפקיד',
      component: AssignRoleToEntityForm,
      dialogClass: 'dialogClass3',
    },
    CREATE_ENTITY: {
      footer: null,
      header: 'פרטי בקשה ליצירת משתמש מיוחד',
      component: CreateSpecialEntityForm,
      dialogClass: 'dialogClass3',
    },
    ADD_APPROVER: {
      footer: null,
      header: 'פרטי בקשה ליצירת גורם מאשר',
      component: ApproverForm,
      dialogClass: 'dialogClass6',
    },
    CHANGE_ROLE_HIERARCHY: {
      footer: null,
      header: 'פרטי בקשה לשינוי היררכיה לתפקיד',
      component: RenameSingleOGForm,
      dialogClass: 'dialogClass2',
    },
    CREATE_ROLE_BULK: {
      footer: null,
      header: 'פרטי בקשה מרובה ליצירת תפקידים חדשים',
      component: CreateBulkRoleForm,
      dialogClass: 'dialogClass1',
    },
    CHANGE_ROLE_HIERARCHY_BULK: {
      footer: null,
      header: 'פרטי בקשה מרובה לשינוי היררכיה לתפקידים',
      component: RenameBulkOGForm,
      dialogClass: 'dialogClass2',
    },
    // RENAME_OG: { footer: null, header: '' },
    // RENAME_ROLE: { footer: null, header: '' },
    // EDIT_ENTITY: { footer: null, header: '' },
    // DELETE_OG: { footer: null, header: '' },
    // DELETE_ROLE: { footer: null, header: '' },
    // DELETE_ENTITY: { footer: null, header: '' },
    // DISCONNECT_ROLE: { footer: null, header: '' },
    // UNRECOGNIZED: { footer: null, header: '' },
  };

  useEffect(() => {
    if (request.type) {
      // TODO: handle UNRECOGNIZED
      if (dialogParams[request.type]) {
        setDialogContent(<PreviewRequestWrapper request={request} ModalComponent={dialogParams[request.type].component} setDialogVisiblity={setDialogVisiblity} />);
        setDialogVisiblity(true);
      }
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
