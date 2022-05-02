import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { USER_TYPE } from "../../../constants";
import { getUserTags } from "../../../utils/user";
import {
  getAllMyApproverTypes, removeAsApproverFromHierarchy,
} from "../../../service/ApproverService";
import PremissionsRemovalPopUp from "./PremissionsRemovalPopUp";

const FullEntityPremissionsModal = ({
  user,
  isUsePremissionModal,
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

    const setApproverPremissions = (groups, type) => {
      setPremissions(() => {
        premissions[type] = groups;
        return { ...premissions };
      });
    };

    const getApproverTypesHandler = (approverData ,type) => {
      const approverTypeHandler = {
        [USER_TYPE.ADMIN]: () => {
          return approverData.adminGroupsInCharge.length > 0
            ? setApproverPremissions(
                approverData.adminGroupsInCharge,
                USER_TYPE.ADMIN
              )
            : removeAsApproverFromHierarchy(user.id, USER_TYPE.ADMIN);
        },
        [USER_TYPE.SECURITY_ADMIN]: () => {
          return approverData.securityAdminGroupsInCharge.length > 0
            ? setApproverPremissions(
                approverData.securityAdminGroupsInCharge,
                USER_TYPE.SECURITY_ADMIN
              )
            : removeAsApproverFromHierarchy(user.id, USER_TYPE.SECURITY_ADMIN);
        },
        [USER_TYPE.BULK]: () => {
          return setApproverPremissions([], USER_TYPE.BULK);
        },
        [USER_TYPE.SECURITY]: () => {
          return setApproverPremissions([], USER_TYPE.SECURITY);
        },
        [USER_TYPE.SUPER_SECURITY]: () => {
          return setApproverPremissions([], USER_TYPE.SUPER_SECURITY);
        },
        default: () => {},
      };

      return approverTypeHandler[type] || approverTypeHandler["default"];
    };

    if (Object.keys(premissions).length === 0) {
      myApproverTypes(user)
        .then((approverData) => {
          approverData.types = approverData.types.filter((type) => user.types.includes((type)))
          setApproverTypes(approverData.types);

          Object.values(approverTypes).forEach((type) => {
            getApproverTypesHandler(approverData ,type)();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (!isUsePremissionModal) {
      closePremissionsModal();
      closeModal();
    }
  }, [approverTypes, closePremissionsModal, isUsePremissionModal, premissions, user]);

  const getImuteableApproverTypes = () => {
    if (
      Object.values(approverTypes).includes(USER_TYPE.COMMANDER) ||
      Object.values(userTags).includes(getUserTags([USER_TYPE.COMMANDER])[0])
    ) {
      return (
        <li>
          <p style={{ fontSize: "18px", paddingBottom: "6px" }}>
            {getUserTags([USER_TYPE.COMMANDER])}
          </p>
        </li>
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
          visible={isUsePremissionModal}
          onHide={closePremissionsModal}
          dismissableMask={true}
          id="premissionsDialog"
        >
          <div style={{ paddingRight: "61px", width: "80%" }}>
            <ul>
              {getImuteableApproverTypes()}
              {Object.keys(premissions).map((key) => (
                <li >
                  <p className="removalFormat" style={{ fontSize: "18px" }}>
                    {getUserTags([key])}
                    {premissions[key].length === 0 ? (
                      getRemovalButton("", key)
                    ) : (
                      <></>
                    )}
                  </p>
                  <ul value={premissions} className="hierarchyList"  >
                    {premissions[key].map((hierarchy) => (
                      <li className="removalFormat">
                        {hierarchy.hierarchy + "/" + hierarchy.name }
                        {getRemovalButton(hierarchy, key)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <PremissionsRemovalPopUp
              showModal={showModal}
              closeModal={closeModal}
              currentHierarchyForRemoval={currentHierarchyForRemoval}
              user={user}
              premissions={premissions}
              approverTypes={approverTypes}
              setPremissions={setPremissions}
              setApproverTypes={setApproverTypes}
              updateUserPremissions={updateUserPremissions}
            />
          </div>
        </Dialog>
      }
    </div>
  );
};

export default FullEntityPremissionsModal;
