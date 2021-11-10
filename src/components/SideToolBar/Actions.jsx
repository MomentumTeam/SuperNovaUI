import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  createRef,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import CreateRoleForm from "../Modals/Role/CreateRoleForm";
import CreateOGForm from "../Modals/Hierarchy/CreateOGForm";
import RenameOGForm from "../Modals/Hierarchy/RenameOGForm";
import AssignRoleToEntityForm from "../Modals/AssignRoleToEntityForm";
import CreateEntityForm from "../Modals/Entity/CreateEntityForm";
import { Toast } from "primereact/toast";

import "../../assets/css/local/components/modal-item.min.css";
import ApproverForm from "../Modals/ApproverForm";

import InfoPopup from "../InfoPopup";
import "../../assets/css/local/components/dialog.css";

const actions = [
  {
    id: 1,
    className: "btn-actions btn-actions1",
    actionName: "תפקיד חדש",
    infoText: `חיבור משתמש חדש לתפקיד קיים ויצירת אזרח`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass1",
    modalName: CreateRoleForm,
  },
  {
    id: 2,
    className: "btn-actions btn-actions2",
    actionName: "שינוי היררכיה",
    infoText: `העברת תפקיד נבחר להיררכיה ארגונית אחרת`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass2",
    modalName: RenameOGForm,
  },
  {
    id: 3,
    className: "btn-actions btn-actions3",
    actionName: "מעבר תפקיד",
    infoText: `מעבר משתמש בין תפקידים:
    הכנסת פרטי המשתמש שרוצה לעבור תפקיד
    ▼
    בחירת ההיררכיה בה נמצא התפקיד הרצוי
    ▼
    בחירת התפקיד מרשימת התפקידים (ניתן להכניס מזהה תפקיד להשלמה אוטומטית של הערכים)
    ▼
    בחירת גורם מאשר מהיררכית התפקיד לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass3",
    modalName: AssignRoleToEntityForm,
  }, //disconnect true
  {
    id: 4,
    className: "btn-actions btn-actions4",
    actionName: "משתמש חדש",
    infoText: `חיבור משתמש חדש לתפקיד קיים ויצירת אזרח`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass4",
    modalName: CreateEntityForm,
  }, //disconnect false
  {
    id: 5,
    className: "btn-actions btn-actions5",
    actionName: "היררכיה חדשה",
    infoText: `פתיחת היררכיה חדשה תחת היררכית אב:
    בחירת היררכית האב להיררכיה חדשה
    ▼
    הכנסת שם להיררכיה החדשה
    ▼
    בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass5",
    modalName: CreateOGForm,
  },
  {
    id: 6,
    className: "btn-actions btn-actions6",
    actionName: "גורם מאשר",
    infoText: `בקשה לקבלת הרשאות שונות במערכת:
    בחירת סוג הגורם המאשר הרצוי
    ▼
    הכנסת פרטי המשתמש עבורו תינתן ההרשאה
    ▼
    בחירת ההיררכיה שבה יהיה גורם מאשר
    ▼
    בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass6",
    modalName: ApproverForm,
  },
];

const Action = () => {
  const [actionList, setActionList] = useState(actions);
  const [isActionDone, setIsActionDone] = useState(false);
  const [currentActionId, setCurrentActionId] = useState(null);
  const modalRefs = useMemo(
    () =>
      actions.map((i) => {
        return { id: i.id, ref: createRef() };
      }),
    []
  );
  const toast = useRef(null);

  const getRef = useCallback(
    (id) => modalRefs.find((ref) => ref.id === id).ref,
    [modalRefs]
  );

  const onClick = (id) => {
    setActionList(
      actionList.map((action) =>
        action.id === id
          ? { ...action, displayResponsive: true }
          : { ...action }
      )
    );
  };

  const onHide = (id) => {
    setActionList(
      actionList.map((action) =>
        action.id === id
          ? { ...action, displayResponsive: false }
          : { ...action }
      )
    );
  };

  useEffect(() => {
    isActionDone &&
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });

    isActionDone &&
      setActionList(
        actionList.map((action) =>
          action.id === currentActionId
            ? { ...action, displayResponsive: false }
            : { ...action }
        )
      );

    setIsActionDone(false);
  }, [actionList, currentActionId, isActionDone]);

  const handleRequest = useCallback(
    async (id) => {
      setCurrentActionId(id);
      const ref = getRef(id);
      try {
        await ref.current.handleSubmit();
      } catch (e) {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: e.message || "Message Content",
          life: 3000,
        });
      }
    },
    [getRef]
  );

  const renderHeader = (actionName, showInfo, infoText, infoWithTitle) => {
    return (
      <div className="display-flex dialog-header">
        <div className="dialog-header-title">{actionName}</div>
        <InfoPopup
          name={actionName + " dialog"}
          infoText={infoText}
          visible={showInfo}
          withTitle={infoWithTitle}
        ></InfoPopup>
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <div className="display-flex ">
        <div className="display-flex"></div>
        <div className="display-flex ">
          <Button
            label="ביטול"
            onClick={() => onHide(name)}
            className="btn-underline"
          />

          {name === 5 ? (
            <Button
              label=" שליחת בקשה"
              onClick={() => handleRequest(name)}
              className="btn-gradient orange"
            />
          ) : name === 6 ? (
            <Button
              label=" שליחת בקשה"
              onClick={() => handleRequest(name)}
              className="btn-gradient orange"
            />
          ) : (
            <Button
              label="שליחת בקשה"
              onClick={() => handleRequest(name)}
              className="btn-gradient orange"
            />
          )}
        </div>
      </div>
    );
  };

  const renderModalForm = (name, id) => {
    const ref = getRef(id);
    const FormName = name;
    return <FormName ref={ref} setIsActionDone={setIsActionDone} />;
  };

  return (
    <ul className="display-flex units-wrap">
      <Toast ref={toast} />
      {actionList.map(
        ({
          id,
          className,
          actionName,
          infoText,
          infoWithTitle,
          displayResponsive,
          dialogClass,
          modalName,
        }) => (
          <li key={id}>
            <Button
              className={className}
              title={actionName}
              label={actionName}
              onClick={() => onClick(id)}
            />
            <Dialog
              className={dialogClass}
              header={renderHeader(actionName, true, infoText, infoWithTitle)}
              visible={displayResponsive}
              onHide={() => onHide(id)}
              footer={renderFooter(id)}
            >
              {renderModalForm(modalName, id)}
            </Dialog>
          </li>
        )
      )}
    </ul>
  );
};

export default Action;
