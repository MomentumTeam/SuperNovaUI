import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { getAllMyApproverTypes } from "../../../service/ApproverService";
import { getUserTags } from "../../../utils/user";
import { USER_TYPE } from "../../../constants";

const FullEntityPremissionsModal = ({
  user,
  userTags,
  isOpen,
  closePremissionsModal,
}) => {
  const [premissions, setPremissions] = useState({});
  
  const removeHierarchyFromPremissions = (hierarchyToRemove) => {
  }
  
  useEffect(() => {
    const myApproverTypes = async (user) => {
      console.log(user)
      const response = await getAllMyApproverTypes(user?.id);
      return response.data;
    };

    const setApproverTypeGroups = (groups, type) => {
      setPremissions(() => {
        premissions[type] = groups;
        console.log(premissions)
        return premissions;
      });
    };


    // Handle Approver Data
    myApproverTypes(user)
      .then((approverData) => {
        if (
          approverData.types.includes(USER_TYPE.ADMIN) &&
          approverData.adminGroupsInCharge.length > 0
        ) {
          setApproverTypeGroups(
            approverData.adminGroupsInCharge,
            USER_TYPE.ADMIN
          );
        }

        // TODO: remove
        approverData.securityAdminGroupsInCharge = [
          {
            hierarchy: "sf_name/nemo",
            id: "619e31f5f235dc001846e872",
            name: "quo",
          },
        ];

        if (
          approverData.types.includes(USER_TYPE.SECURITY_ADMIN) &&
          approverData.securityAdminGroupsInCharge.length > 0
        ) {
          setApproverTypeGroups(
            approverData.securityAdminGroupsInCharge,
            USER_TYPE.SECURITY_ADMIN
          );
        }


      })
      .catch((err) => {
        console.log(err);
      });


    if (!isOpen) {
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
        <div style={{ padding: "10px" }}>
          {Object.keys(premissions).map((key) => (
            <ul>
              <li>
                {getUserTags(key)}
                <ul style={{ paddingTop: "5px" }}>
                  {premissions[key].map((hierarchy) => (
                    <li>
                      {hierarchy.hierarchy + '/' + hierarchy.name} <button onClick={(e) => {removeHierarchyFromPremissions(hierarchy.id)}}>הסרה</button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default FullEntityPremissionsModal;
