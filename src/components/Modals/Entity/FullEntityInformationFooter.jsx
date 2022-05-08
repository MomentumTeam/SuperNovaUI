import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { toJS } from 'mobx';

import { useStores } from '../../../context/use-stores';
import { canEditEntity } from '../../../utils/entites';
import { ConvertEntityType } from '../../Fields/convertEntityType';
import { USER_ENTITY_TYPE, USER_TYPE } from '../../../constants/user';
import { isUserHoldType } from '../../../utils/user';
import { getUserRelevantIdentity } from '../../../utils/fields';

const FullEntityInformationFooter = ({
  entity,
  isEdit,
  closeModal,
  setIsEdit,
  handleRequest,
}) => {
  const { userStore, configStore } = useStores();
  const connectedUser = toJS(userStore.user);
  const entityDi = getUserRelevantIdentity(entity);
  const canConvert =
    (entity.entityType === configStore.KARTOFFEL_SOLDIER ||
      entity.entityType === configStore.KARTOFFEL_CIVILIAN) &&
    isUserHoldType(connectedUser, USER_TYPE.ADMIN) &&
    entityDi;
  
  
  const closeThisModal = () => {
    setIsEdit(false);
    closeModal();
  };

  return (
    <>
      <div className="display-flex">
        <div>
          {canConvert && !isEdit && (
            <ConvertEntityType entity={entity} entityDi={entityDi} />
          )}
        </div>

        <div className="display-flex display-flex-end">
          {canEditEntity(entity, connectedUser) && (
            <>
              <Button
                id="fullEntityInfo-editOrCancel"
                label={isEdit ? 'ביטול' : 'עריכה'}
                className={isEdit ? 'btn-underline' : 'btn-border orange'}
                onClick={() => setIsEdit(!isEdit)}
              />
              <Button
                id="fullEntityInfo-closeOrSave"
                label={isEdit ? 'שליחת בקשה' : 'סגור'}
                className="btn-orange-gradient"
                onClick={() => {
                  isEdit ? handleRequest() : closeThisModal();
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { FullEntityInformationFooter };
