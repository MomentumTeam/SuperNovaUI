import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useStores } from '../../context/use-stores';
import MyRequests from './MyRequests';

const TableMyRequests = () => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);
  const userId = user?.personalNumber
    ? user.personalNumber
    : user?.identityCard;
  const { trackPageView, pushInstruction } = useMatomo();

  useEffect(() => {
    if (userStore.user) {
      pushInstruction('setUserId', userId);
      trackPageView({ documentTitle: 'הבקשות שלי' });
    }
    userStore.fetchUserNotifications();
  }, [userStore]);

  return <MyRequests />;
};

export default TableMyRequests;
