import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../../assets/css/local/components/options.css";
import "../../assets/css/local/components/helpHamburgerMenu.css";
import { useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { ToggleButton } from "primereact/togglebutton";
import { React, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import Approver from "../Fields/Approver";
import {
  updateUserOptions,
  getUserOptions,
  addFavoriteCommander,
} from "../../service/OptionsService";
import { ListBox } from 'primereact/listbox';

const Options = () => {
  const [showPicture, setShowPicture] = useState(true);
  const [getMailNotifications, setGetMailNotifications] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const { setValue, getValues } = useForm();

  useEffect(() => {
    (async () => {
      const { toggleProfilePicture, getMailNotifications, showPhoneNumber } =
        await getUserOptions();
      setShowPicture(toggleProfilePicture);
      setGetMailNotifications(getMailNotifications);
      setShowPhoneNumber(showPhoneNumber);
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
          <button className="pi pi-user-plus" onClick={() => {
            const approvers = getValues().approvers;
            const approversIds = approvers.map(approver => approver.entityId);
            addFavoriteCommander(approversIds);
          }}>
          </button>
        </div>

        <ListBox
        style={{marginTop: 50}}
        
        />

        <button></button>

      </Dialog>
    </div>
  );
};

export default Options;
