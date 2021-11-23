import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import PreviewRequestWrapper from './PreviewRequestWrapper';
import ApproverForm from '../ApproverForm';
import CreateOGForm from '../Hierarchy/CreateOGForm';
import CreateSingleRoleForm from '../Role/CreateSingleRoleForm';
import RenameSingleOGForm from '../Hierarchy/RenameSingleOGForm';
import CreateSpecialEntityForm from '../Entity/CreateSpecialEntityForm';
import AssignRoleToEntityForm from '../AssignRoleToEntityForm';
import CreateBulkRoleForm from '../Bulk/CreateBulkRoleForm';
import RenameBulkOGForm from '../Bulk/RenameBulkOGForm';
import { TYPES, assignRoleToEntityHeader } from '../../../constants/applies';

const PreviewRequestsDialog = ({ request, isDialogVisible, setDialogVisiblity }) => {
  const [dialogContent, setDialogContent] = useState(null);

  const dialogParams = {
    CREATE_OG: {
      footer: null,
      header: `פרטי בקשה ל${TYPES.CREATE_OG}`,
      component: CreateOGForm,
      classDialog: 'dialogClass5',
    },
    CREATE_ROLE: {
      footer: null,
      header: `פרטי בקשה ל${TYPES.CREATE_ROLE}`,
      component: CreateSingleRoleForm,
      dialogClass: 'dialogClass1',
    },
    ASSIGN_ROLE_TO_ENTITY: {
      footer: null,
      // header: `פרטי בקשה ל${TYPES.ASSIGN_ROLE_TO_ENTITY}`,
      component: AssignRoleToEntityForm,
      dialogClass: 'dialogClass3',
    },
    CREATE_ENTITY: {
      footer: null,
      header: `פרטי בקשה ל${TYPES.CREATE_ENTITY}`,
      component: CreateSpecialEntityForm,
      dialogClass: 'dialogClass3',
    },
    ADD_APPROVER: {
      footer: null,
      header: `פרטי בקשה ל${TYPES.ADD_APPROVER}`,
      component: ApproverForm,
      dialogClass: 'dialogClass6',
    },
    CHANGE_ROLE_HIERARCHY: {
      footer: null,
      header: `פרטי בקשה ל${TYPES.CHANGE_ROLE_HIERARCHY}`,
      component: RenameSingleOGForm,
      dialogClass: 'dialogClass2',
    },
    CREATE_ROLE_BULK: {
      footer: null,
      header: `פרטי בקשה מרובה ל${TYPES.CREATE_ROLE_BULK}`,
      component: CreateBulkRoleForm,
      dialogClass: 'dialogClass1',
    },
    CHANGE_ROLE_HIERARCHY_BULK: {
      footer: null,
      header: `פרטי בקשה מרובה ל${TYPES.CHANGE_ROLE_HIERARCHY_BULK}`,
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
        setDialogContent(
          <PreviewRequestWrapper
            request={request}
            showJob={request.kartoffelParams.needDisconnect} //relevant only to ASSIGN_ROLE_TO_ENTITY requests (מעבר תפקיד או חיבור משתמש חדש לתפקיד)
            ModalComponent={dialogParams[request.type].component}
            setDialogVisiblity={setDialogVisiblity}
          />
        );
        setDialogVisiblity(true);
      }
    }
  }, [JSON.stringify(request)]);

  const setHeader = (request) => {
    if (request.type === "ASSIGN_ROLE_TO_ENTITY") {
      if (request.kartoffelParams.needDisconnect) {
        return `פרטי בקשה ל${assignRoleToEntityHeader[0]}`;
      } else {
        return `פרטי בקשה ל${assignRoleToEntityHeader[1]}`;
      }
    }
    return '';
  }

  return (
    <Dialog
      className={dialogParams[request.type]?.dialogClass || ''}
      header={dialogParams[request.type]?.header || setHeader(request)}
      visible={isDialogVisible}
      onHide={() => setDialogVisiblity(false)}
      footer={dialogParams[request.type]?.footer}
      dismissableMask={true}
    >
      {dialogContent}
    </Dialog>
  );
};

export default PreviewRequestsDialog;
