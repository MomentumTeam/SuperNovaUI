import React, { createContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { getAllMyApproverTypes } from '../../../service/ApproverService';
import { getUserTags } from "../../../utils/user";
import { USER_TYPE } from "../../../constants";
import { getOGByHierarchy } from "../../../service/KartoffelService";

const FullEntityPremissionsModal = ({
  user,
  userTags,
  isOpen,
  closePremissionsModal,
}) => {

  const [userApproverData, setUserApproverData] = useState([])
  const [premissions, setPremissions] = useState({})
  useEffect(() => {
    const myApproverTypes = async (user) => {
       const response =  await getAllMyApproverTypes(user?.id)
       return response.data
    }

    myApproverTypes(user).then((approverData) => {
      if(approverData.types.includes(USER_TYPE.ADMIN) && approverData.adminGroupsInCharge.length > 0) {
        setPremissions(() => {
          const admin = getUserTags([USER_TYPE.ADMIN])
          let groupArray = [];
          approverData.adminGroupsInCharge.forEach(group => {
            groupArray.push(group.hierarchy + '/' + group.name)
          });
          premissions[admin] = groupArray;
          return premissions
        })
      }

      approverData.securityAdminGroupsInCharge = [{"hierarchy": "sf_name/nemo",
      "id": "619e31f5f235dc001846e872",
      "name": "quo"}]
      if(approverData.types.includes(USER_TYPE.SECURITY_ADMIN) && approverData.securityAdminGroupsInCharge.length > 0) {
        setPremissions(() => {
          const securityAdmin = getUserTags([USER_TYPE.SECURITY_ADMIN])
          let groupArray = [];
          approverData.adminGroupsInCharge.forEach(group => {
            groupArray.push(group.hierarchy + '/' + group.name)
          });
          premissions[securityAdmin] = groupArray;
          return premissions
        })
      }
      
      setUserApproverData(approverData)
    }).catch(err => {
      console.log(err)
    })

    if(!isOpen) {
       closePremissionsModal();
    }
  }, [closePremissionsModal, isOpen, premissions, user, userTags]);

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
          <ul>
        {Object.keys(premissions).forEach((key) => {
            <li>
              {key} 
            </li>
        })}
        </ul>
        </div>
      </Dialog>
    </div>
  );
};

export default FullEntityPremissionsModal;
