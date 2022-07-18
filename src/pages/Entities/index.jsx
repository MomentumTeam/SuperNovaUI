import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useStores } from '../../context/use-stores';
import Entities from './Entity';

const TableEntity = () => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);
  const userId = user?.personalNumber
    ? user.personalNumber
    : user?.identityCard;
  const { trackPageView, pushInstruction } = useMatomo();

  useEffect(() => {
    if (userStore.user) {
      trackPageView({ documentTitle: 'טבלאות' });
      pushInstruction('setUserId', userId);
      console.log('here');
    }
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore.user]);

  return <Entities />;
};

export default TableEntity;
