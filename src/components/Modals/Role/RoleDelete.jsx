import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import { RoleDeleteFooter } from './RoleDeleteFooter';

import '../../../assets/css/local/components/modal-item.css';
import { getSamAccountNameFromUniqueId } from '../../../utils/fields';
import {
  getEntityByRoleId,
  getLastTimeConnectionBySamAccountName,
} from '../../../service/KartoffelService';
import { useStores } from '../../../context/use-stores';
import { ProgressSpinner } from 'primereact/progressspinner';
import { isDateGreater } from '../../../utils/applies';

const RoleDelete = ({
  role,
  isDialogVisible,
  setDialogVisiblity,
  actionPopup,
  sendTrack,
}) => {
  const { appliesStore } = useStores();
  const [entity, setEntity] = useState(null);
  const [disabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [actionIsDone, setActionIsDone] = useState(false);
  const [lastTimeConnection, setLastTimeConnection] = useState(null);

  useEffect(() => {
    if (actionIsDone) {
      actionPopup();
      setActionIsDone(false);
      setDialogVisiblity(false);
    }
  }, [actionIsDone]);

  useEffect(() => {
    const getEntity = async () => {
      try {
        setIsLoading(true);
        const entityRes = await getEntityByRoleId(role?.roleId);
        setEntity(entityRes);
      } catch (error) {
        setEntity(null);
      }
      setIsLoading(false);
    };

    getEntity();
  }, [role]);

  const ldapDateToJs = (ldapDate) => {
    return new Date(parseInt(ldapDate) / 1e4 - 1.16444736e13);
  };

  useEffect(() => {
    const getLastTimeConnection = async () => {
      try {
        const samAccountName = getSamAccountNameFromUniqueId(role.roleId);
        const res = await getLastTimeConnectionBySamAccountName(samAccountName);

        const date =
          res?.lastLogonTimestamp && res?.lastLogonTimestamp !== 'unknown'
            ? ldapDateToJs(res.lastLogonTimestamp)
            : null;
        setLastTimeConnection(date);
      } catch (error) {
        setLastTimeConnection(null);
      }
    };

    entity ? getLastTimeConnection() : setLastTimeConnection(null);
  }, [entity]);

  useEffect(() => {
    lastTimeConnection
      ? setIsDisabled(!isDateGreater(lastTimeConnection, 14))
      : setIsDisabled(false);
  }, [lastTimeConnection]);

  const handleRequest = async () => {
    try {
      const req = {
        kartoffelParams: {
          roleId: role.roleId,
          uniqueId: role?.digitalIdentityUniqueId,
          jobTitle: role.jobTitle,
          ...(entity?.firstName && { firstName: entity.firstName }),
          ...(entity?.lastName && { lastName: entity.lastName }),
          ...(entity?.personalNumber && {
            personalNumber: entity.personalNumber,
          }),
          ...(entity?.identityCard && { identityCard: entity.identityCard }),
        },
        adParams: {
          samAccountName: getSamAccountNameFromUniqueId(role.roleId),
        },
      };

      await appliesStore.deleteRoleApply(req);
      sendTrack('מחיקה', 'מחיקת תפקיד');
      setActionIsDone(true);
    } catch (e) {
      actionPopup('מחיקת תפקיד', e);
    }
  };

  return (
    <div>
      <Dialog
        className={`${classNames('dialogClass12')} dialogdelete ${
          entity && 'dialogdeleteentity'
        }`}
        header="מחיקת תפקיד"
        visible={isDialogVisible}
        footer={
          <RoleDeleteFooter
            closeModal={() => setDialogVisiblity(false)}
            deleteHierarchy={handleRequest}
            disabled={disabled}
          />
        }
        onHide={() => setDialogVisiblity(false)}
        dismissableMask={true}
      >
        {isLoading ? (
          <ProgressSpinner className="tree-loading-spinner" />
        ) : (
          <div className="container display-flex display-flex-center delete-container">
            <div>
              <p>האם את/ה בטוח/ה שברצונך למחוק תפקיד זה? </p>
              <p>
                מחיקת תפקיד תגרום לאובדן הT הנבחר,
                {!entity ? ' ו' : ' '}
                למחיקת כל המידע שנמצא תחת הT
                {entity ? ' ולניתוק המשתמש הנמצא עליו.' : '.'}
              </p>

              <p style={{ fontWeight: 'bold' }}>
                לאחר המחיקה, אין אופציה לשחזור המידע שהיה לT!
              </p>
              <p>(הרשאות, תיקיות, קבצים שמורים, תיבת מייל וכו')</p>

              {entity && (
                <p style={{ fontWeight: 'bold' }}>
                  <br />
                  <p
                    style={{
                      color: 'red',
                      textDecoration: 'underline',
                      marginBottom: '5px',
                    }}
                  >
                    שימו לב- לתפקיד זה יש משתמש מקושר
                  </p>
                  {disabled ? (
                    <>
                      המשתמש היה פעיל בשבועיים האחרונים ולכן לא ניתן למחוק אותו.
                    </>
                  ) : (
                    <>
                      לא ניתן למחוק תפקידים של משתמשים שהתחברו בשבועיים האחרונים{' '}
                      <br />
                      (בקשות אלו יכשלו באופן אוטומטי)
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export { RoleDelete };
