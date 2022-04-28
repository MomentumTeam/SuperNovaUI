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
import ConfirmRemovalPopUp from "./ConfirmRemovalPopUp";

const FullEntityPremissionsModal = ({
  user,
  isOpen,
  closePremissionsModal,
  userTags,
  updateUserPremissions
}) => {
  const [premissions, setPremissions] = useState({});
  const [approverTypes, setApproverTypes] = useState({});
  const [showModal, setShowModal] = useState({});
  const [currentHierarchyForRemoval, setCurrentHierarchyForRemoval] = useState(
    {}
  );

  const dismissApproverFromHierarchy = async () => {
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

      setApproverTypes(() => {
        return approverTypes.filter((type) => type !== approverType);
      });
      updateUserPremissions();
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
          approverData.types = approverData.types.filter((type) => user.types.includes((type)))
          setApproverTypes(approverData.types);
          const getApproverTypesHandler = (type) => {
            const approverTypeHandler = {
              [USER_TYPE.ADMIN]: () => {
                return approverData.adminGroupsInCharge.length > 0
                  ? setApproverTypeGroups(
                      approverData.adminGroupsInCharge,
                      USER_TYPE.ADMIN
                    )
                  : null;
              },
              [USER_TYPE.SECURITY_ADMIN]: () => {
                return approverData.securityAdminGroupsInCharge.length > 0
                  ? setApproverTypeGroups(
                      approverData.securityAdminGroupsInCharge,
                      USER_TYPE.SECURITY_ADMIN
                    )
                  : null;
              },
              [USER_TYPE.BULK]: () => {
                return setApproverTypeGroups([], USER_TYPE.BULK);
              },
              [USER_TYPE.SECURITY]: () => {
                return setApproverTypeGroups([], USER_TYPE.SECURITY);
              },
              [USER_TYPE.SUPER_SECURITY]: () => {
                return setApproverTypeGroups([], USER_TYPE.SUPER_SECURITY);
              },
              default: () => {},
            };

            return approverTypeHandler[type] || approverTypeHandler["default"];
          };

          Object.values(approverTypes).forEach((type) => {
            getApproverTypesHandler(type)();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!isOpen) {
      closePremissionsModal();
      closeModal();
    }
  }, [approverTypes, closePremissionsModal, isOpen, premissions, user]);

  const getImuteableApproverTypes = () => {
    if (
      Object.values(approverTypes).includes(USER_TYPE.COMMANDER) ||
      Object.values(userTags).includes(getUserTags([USER_TYPE.COMMANDER])[0])
    ) {
      return (
        <dt>
          <p style={{ fontSize: "18px", paddingBottom: "6px" }}>
            {getUserTags([USER_TYPE.COMMANDER])}
          </p>
        </dt>
      );
    }
  };

  const getRemovalButton = (hierarchy, type) => {
    return (
      <Button
        label="הסרה"
        className="p-button-danger p-button-text p-button-sm"
        style={{ height: "15px" }}
        onClick={() => {
          openModal(hierarchy, type);
        }}
      ></Button>
    );
  };
  return (
    <div className="premissionsPopUpWrapper">
      {
        <Dialog
          className={classNames("dialogClass6")}
          header={"הרשאות משתמש"}
          visible={isOpen}
          onHide={closePremissionsModal}
          dismissableMask={true}
          id="premissionsDialog"
        >
          <div style={{ paddingRight: "65px" }}>
            <dl>
              {getImuteableApproverTypes()}
              {Object.keys(premissions).map((key) => (
                <dt>
                  <p style={{ fontSize: "18px" }}>
                    {getUserTags([key])}
                    {premissions[key].length === 0 ? (
                      getRemovalButton("", key)
                    ) : (
                      <></>
                    )}
                  </p>
                  <dl value={premissions} className="hierarchyList">
                    {premissions[key].map((hierarchy) => (
                      <dd>
                        <i class="pi pi-lock" style={{marginLeft: "10px"}}></i>
                        {hierarchy.hierarchy + "/" + hierarchy.name }
                        {getRemovalButton(hierarchy, key)}
                      </dd>
                    ))}
                  </dl>
                </dt>
              ))}
            </dl>

            <ConfirmRemovalPopUp
              showModal={showModal}
              closeModal={closeModal}
              dismissApproverFromHierarchy={dismissApproverFromHierarchy}
            />
          </div>
        </Dialog>
      }
    </div>
  );
};

export default FullEntityPremissionsModal;
