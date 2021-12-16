import React, { createContext, useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import blankProfilePic from "../../../assets/images/blankProfile.png";
import { getPictureByEntityId } from "../../../service/UserService";
import { FullEntityInformationFooter } from "./FullEntityInformationFooter";
import { USER_NO_PICTURE } from "../../../constants";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { FullEntityInformationForm } from "./FullEntityInformationForm";

export const FullEntityInformationModalContext = createContext(null);

const FullEntityInformationModal = ({ user, isOpen, closeFullDetailsModal, edit, actionPopup }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [userPic, setUserPic] = useState(undefined);
  const [isActionDone, setIsActionDone] = useState(false);
  const ref = useRef(null);

  const handleRequest = async () => {
    try {
      await ref.current.handleSubmit();
    } catch (e) {
      actionPopup("עריכת משתמש", e.message || "Message Content");
    }
  };
    

  useEffect(() => {
    if (isActionDone) {
      actionPopup();
      closeFullDetailsModal();
    }
  }, [isActionDone]);

  useEffect(() => {
    async function getUserPic() {
      if (user && user.picture && user.picture === USER_NO_PICTURE) {
        const pic = await getPictureByEntityId(user.id);
        setUserPic(pic.image);
      } else {
        setUserPic(user.picture);
      }
    }

    // When user changes, retrive new photo
    getUserPic();
  }, [user, isOpen]);

  return (
    <Dialog
      className={classNames("dialogClass7")}
      header={isEdit ? "עריכת משתמש/ת" : "פרטי משתמש/ת"}
      visible={isOpen}
      style={{ borderRadius: "30px" }}
      onHide={closeFullDetailsModal}
      footer={
        <FullEntityInformationFooter
          entity={user}
          isEdit={isEdit}
          closeModal={closeFullDetailsModal}
          setIsEdit={setIsEdit}
          handleRequest={handleRequest}
        />
      }
      dismissableMask={true}
    >
      <div>
        <div className="userpic-wrap">
          <img
            style={{ borderRadius: "50%", width: "142px" }}
            src={user && userPic && userPic !== USER_NO_PICTURE ? `data:image/jpeg;base64,${userPic}` : blankProfilePic}
            alt="userpic"
          />
        </div>
        <FullEntityInformationForm
          ref={ref}
          reqView={false}
          requestObject={user}
          setIsActionDone={setIsActionDone}
          onlyForView={!isEdit}
        />
      </div>
    </Dialog>
  );
};

export default FullEntityInformationModal;
