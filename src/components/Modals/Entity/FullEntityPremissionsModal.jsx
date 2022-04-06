import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import {
  getAllMyApproverTypes,
  removeAsApproverFromHierarchy,
} from "../../../service/ApproverService";
import { getUserTags } from "../../../utils/user";
import { USER_TYPE } from "../../../constants";
import { Button } from "primereact/button";

const FullEntityPremissionsModal = ({
  user,
  userTags,
  isOpen,
  closePremissionsModal,
}) => {
  const [premissions, setPremissions] = useState({});

  const removeHierarchyFromPremissions = async (
    hierarchyToRemove,
    approverType
  ) => {
    console.log(hierarchyToRemove, approverType);
    try {
      const response = await removeAsApproverFromHierarchy(
        user.id,
        approverType,
        hierarchyToRemove.id
      );
      setPremissions(() => {
        premissions[approverType] = premissions[approverType].filter(
          (premission) => premission.id !== hierarchyToRemove.id
        );
        if (premissions[approverType].length === 0)
          delete premissions[approverType];
        return { ...premissions };
      });
      console.log(premissions);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const myApproverTypes = async (user) => {
      const response = await getAllMyApproverTypes(user?.id);
      return response.data;
    };

    const setApproverTypeGroups = (groups, type) => {
      setPremissions(() => {
        premissions[type] = groups;
        return { ...premissions };
      });
    };

    if (Object.keys(premissions).length === 0) {
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
    }

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
        style={{ paddingTop: "0px", borderRadius: "30px"}}
        onHide={closePremissionsModal}
        footer={""}
        dismissableMask={true}
      >
        <div style={{ paddingRight: "65px" }}>
          {premissions && (
            <ul>
              {userTags.map((tag) => {
                console.log(Object.keys(premissions), tag, getUserTags([tag]), getUserTags(Object.keys(premissions)))
                if (getUserTags(Object.keys(premissions)).includes(tag) === false) {
                  return <li>{tag}</li>;
                } 
              })}
              {Object.keys(premissions).map((key) => (
                <li>
                  {getUserTags([key])}
                  <ul style={{ paddingTop: "5px" }} value={premissions}>
                    {premissions[key].map((hierarchy) => (
                      <li>
                        {hierarchy.hierarchy + "/" + hierarchy.name}{" "}
                        <Button
                          label="הסרה"
                          className="p-button-danger p-button-text p-button-sm"
                          style={{ height: "15px" }}
                          onClick={() => {
                            console.log(key)
                            removeHierarchyFromPremissions(hierarchy, key);
                          }}
                        ></Button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default FullEntityPremissionsModal;
