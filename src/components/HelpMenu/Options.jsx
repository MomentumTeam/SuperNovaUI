import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../../assets/css/local/components/options.css";
import "../../assets/css/local/components/helpHamburgerMenu.css";
import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { ToggleButton } from "primereact/togglebutton";
import { ListBox } from 'primereact/listbox';
import { Dialog } from "primereact/dialog";
import { loadApprovers } from "../../utils";
import Approver from "../Fields/Approver";
import {
  updateUserOptions,
  getUserOptions,
  addFavoriteCommander,
  removeFavoriteCommander,
} from "../../service/OptionsService";

const Options = () => {
  const { setValue, getValues } = useForm();

  const [showPicture, setShowPicture] = useState(true);
  const [getMailNotifications, setGetMailNotifications] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);
  const [approversToRemove, setApproversToRemove] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { toggleProfilePicture, getMailNotifications, showPhoneNumber, favoriteCommanders } =
        await getUserOptions();
      setShowPicture(toggleProfilePicture);
      setGetMailNotifications(getMailNotifications);
      setShowPhoneNumber(showPhoneNumber);

      const approvers = await loadApprovers(favoriteCommanders);
      setApprovers(approvers.map(approver => ({ displayName: approver.displayName, id: approver.id })));
    })();
  }, []);

  return (
    <div>
      <button
        className="pi pi-cog"
        title="Options"
        style={{ border: "0", backgroundColor: "transparent" }}
        onClick={() => setIsOpen(true)}
      ></button>

      <Dialog
        className={classNames("dialogClass7")}
        header={"הגדרות"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={() => setIsOpen(false)}
      >
        <div
          style={{ marginTop: 30 }}
          className="display-flex display-flex-start"
        >
          <p>הצגת תמונה: </p>
          <ToggleButton
            className="toggleButton"
            checked={showPicture}
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            onLabel=""
            offLabel=""
            onChange={(e) => {
              setShowPicture(e.value);
              updateUserOptions("toggleProfilePicture", e.value);
            }}
          />
        </div>

        <div className="option">
          <p>קבלת התראות במייל: </p>
          <ToggleButton
            className="toggleButton"
            checked={getMailNotifications}
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            onLabel=""
            offLabel=""
            onChange={(e) => {
              setGetMailNotifications(e.value);
              updateUserOptions("getMailNotifications", e.value);
            }}
          />
        </div>

        <div className="option">
          <p>הצגת מספר טלפון: </p>
          <ToggleButton
            className="toggleButton"
            checked={showPhoneNumber}
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            onLabel=""
            offLabel=""
            onChange={(e) => {
              setShowPhoneNumber(e.value);
              updateUserOptions("showPhoneNumber", e.value);
            }}
          />
        </div>
        
        <p style={{ marginTop: 25 }}>גורמים מאשרים מועדפים: </p>
        <div style={{ display: "flex" }}>
          <Approver
            setValue={setValue}
            name="approvers"
            tooltip='רס"ן ומעלה בהיררכיה הנבחרת שבה נמצא התפקיד'
            multiple={true}
            />
          <button className="pi pi-user-plus" onClick={async () => {
            const approvers = getValues().approvers;
            if(!approvers) return;
            const approversIds = approvers.map(approver => approver.entityId);
            addFavoriteCommander(approversIds);
          }}>
          </button>
        </div>

        <ListBox value={approversToRemove} options={approvers.map(approver => approver.displayName)} onChange={(e) => {
          setApproversToRemove([...e.value]);
        }}
        multiple filter />
          
        <button className="pi-minus-circle" onClick={() => {
          const approversToRemoveIds = approversToRemove.map(approver => approvers.find(a => a.displayName === approver).id);
          setApprovers(approvers.filter(approver => !approversToRemoveIds.includes(approver.id)));
          removeFavoriteCommander(approversToRemoveIds);
        }}/>

      </Dialog>
    </div>
  );
};

export default Options;
