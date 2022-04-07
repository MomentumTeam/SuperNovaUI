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
  const [showModal, setShowModal] = useState({});
  const [currentHierarchyForRemoval, setCurrentHierarchyForRemoval] = useState({})
  const onHide = () => {
    setShowModal(false);
  };

  const dismissApproverFromHierarchy = async () => {
    console.log(currentHierarchyForRemoval)
    let { hierarchyToRemove, approverType } = currentHierarchyForRemoval;
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
        
      } catch (err) {
        console.log(err);
      }
      closeModal();
  };

  const openModal = (hierarchyToRemove, approverType) => {
    setShowModal(true);
    setCurrentHierarchyForRemoval(() => {
      return {
        hierarchyToRemove: hierarchyToRemove,
        approverType: approverType,
      };
    });
  };
  const closeModal = () => {
    console.log("here")
    setShowModal(false);
    setCurrentHierarchyForRemoval(() => {
      return {};
    });
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
      setShowModal(false);
    }
  }, [closePremissionsModal, isOpen, premissions, user, userTags]);

  return (
    <div style={{ width: "19px", height: "19px", backgroundColor: "white" }}>
      <Dialog
        className={classNames("dialogClass6")}
        header={"הרשאות משתמש"}
        visible={isOpen}
        style={{ paddingTop: "0px", borderRadius: "30px", minHeight: "370px" }}
        onHide={closePremissionsModal}
        footer={""}
        dismissableMask={true}
        id="premissionsDialog"
      >
        <div style={{ paddingRight: "65px" }}>
          {premissions && (
            <ul>
              {userTags.map((tag) => {
                if (
                  getUserTags(Object.keys(premissions)).includes(tag) === false
                ) {
                  return <li><p style={{fontSize: "18px"}}>{tag}</p></li>;
                }
              })}
              {Object.keys(premissions).map((key) => (
                <li>
                  <p style={{fontSize: "18px", paddingTop: "3px"}}>{getUserTags([key])}</p>
                  <ul value={premissions}>
                    {premissions[key].map((hierarchy) => (
                      <li>
                        {hierarchy.hierarchy + "/" + hierarchy.name}{" "}
                        <Button
                          label="הסרה"
                          className="p-button-danger p-button-text p-button-sm"
                          style={{ height: "15px" }}
                          onClick={() => {
                            openModal(hierarchy, key);
                          }}
                        ></Button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <div>
            <div>
              <Dialog
                id="confirmDialog"
                className={classNames("dialogClassConfirm")}
                visible={showModal}
                style={{ width: "35vw", height: "270px" }}
                onHide={() => onHide()}
                header="האם אתה בטוח?"
                showHeader={false}
              >
                <h3>האם אתה בטוח?</h3>
                <p>הסרת השראות מסוג זה יורידו לך יכולות במערכת לגו</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "30px",
                  }}
                >
                  <Button className="p-button-raised p-button-danger" onClick={dismissApproverFromHierarchy}>
                    כן, הסר לי את ההרשאה
                  </Button>
                  <Button onClick={() => {closeModal()}}>לא, תשאיר לי את ההרשאה</Button>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default FullEntityPremissionsModal;
