import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { toJS } from 'mobx';

import { useStores } from '../../../context/use-stores';
import { canEditEntity } from '../../../utils/entites';
import { ConvertEntityType } from '../../Fields/convertEntityType';
import { USER_ENTITY_TYPE, USER_TYPE } from '../../../constants/user';
import { isUserHoldType } from '../../../utils/user';

const FullEntityInformationFooter = ({
  entity,
  isEdit,
  closeModal,
  setIsEdit,
  handleRequest,
}) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);
  const canConvert =
    (entity.entityType === 'agumon' || entity.entityType === 'digimon')&&isUserHoldType(connectedUser, USER_TYPE.COMMANDER) ;

  const closeThisModal = () => {
    setIsEdit(false);
    closeModal();
  };
  return (
    <>
      <div className="display-flex">
        <div>
          {(canConvert&& !isEdit) && <ConvertEntityType entity={entity} />}
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
