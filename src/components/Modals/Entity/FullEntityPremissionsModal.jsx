import React, { useEffect, useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { USER_TYPE, USER_TYPE_TAG } from '../../../constants';
import { getUserTags, isUserHoldType } from '../../../utils/user';
import {
  getAllMyApproverTypes,
  removeAsApproverFromHierarchy,
} from '../../../service/ApproverService';
import PremissionsRemovalPopUp from './PremissionsRemovalPopUp';

const FullEntityPremissionsModal = ({
  user,
  isUsePremissionModal,
  closePremissionsModal,
  userTags,
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

    const getApproverTypesHandler = (approverData, type) => {
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

      return approverTypeHandler[type] || approverTypeHandler['default'];
    };

    if (Object.keys(premissions).length === 0) {
      myApproverTypes(user)
        .then((approverData) => {
          approverData.types = approverData.types.filter((type) =>
            user.types.includes(type)
          );
          setApproverTypes(approverData.types);

          Object.values(approverTypes).forEach((type) => {
            getApproverTypesHandler(approverData, type)();
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
  }, [closePremissionsModal, isUsePremissionModal, premissions, user]);

  const getImuteableApproverTypes = () => {
    if (
      isUserHoldType(user) ||
      Object.values(userTags).includes(USER_TYPE_TAG.APPROVER)
    ) {
      return (
        <li>
          <p style={{ fontSize: '18px', paddingBottom: '6px' }}>
            {USER_TYPE_TAG.APPROVER} ראשוני
          </p>
        </li>
      );
    }
  };

  const getRemovalButton = (hierarchy = '', type) => {
    return (
      <button
        className="removalButton"
        onClick={() => {
          openModal(hierarchy, type);
        }}
      >
        <i class="pi pi-trash"></i>
      </button>
    );
  };
  return (
    <div className="premissionsPopUpWrapper">
      {
        <Dialog
          className={classNames('dialogClass6')}
          header={'הרשאות משתמש'}
          visible={isUsePremissionModal}
          onHide={closePremissionsModal}
          dismissableMask={true}
          id="premissionsDialog"
        >
          <div id="premissionsDisplayWrapper">
            <p id="premissionsTitle">ההרשאות שלך במערכת לגו: </p>
            <ul className="premissionsList">
              {getImuteableApproverTypes()}
              {Object.keys(premissions).map((key) => (
                <li className="premissionListItem">
                  <p className="removalFormat">
                    {getUserTags([key])}
                    {premissions[key].length === 0 && getRemovalButton('', key)}
                  </p>
                  <table id="premissionSubHierarchyList">
                    <tr
                      value={premissions}
                      className="hierarchyList"
                      style={{ paddingTop: '10px' }}
                    >
                      {premissions[key].map((hierarchy) => (
                        <td className="removalFormat" id="hierarchyTable">
                          <p id="hierarchyInTable">
                            {hierarchy.hierarchy + '/' + hierarchy.name}
                          </p>
                          {getRemovalButton(hierarchy, key)}
                        </td>
                      ))}
                    </tr>
                  </table>
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
            />
          </div>
        </Dialog>
      }
    </div>
  );
};

export default FullEntityPremissionsModal;
