import React, { createContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

const FullEntityPremissionsModal = ({
  user,
  userTags,
  isOpen,
  closePremissionsModal,
}) => {
  useEffect(() => {});

  return (
    <div style={{ width: "19px", height: "19px", backgroundColor: "white" }}>
      <Dialog
        className={classNames("dialogClass6")}
        header={"הרשאות משתמש"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closePremissionsModal}
        footer={""}
        dismissableMask={true}
      >
        <div style={{padding: "10px"}}>
        {userTags.map((tag, index) => (
          <p>
            <b>
              {index + 1}. {tag}
            </b>
          </p>
        ))}
        </div>
      </Dialog>
    </div>
  );
};

export default FullEntityPremissionsModal;
