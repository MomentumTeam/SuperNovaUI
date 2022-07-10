import React, { useEffect } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useStores } from '../../context/use-stores';
import MyRequests from './MyRequests';

const TableMyRequests = () => {
  const { userStore } = useStores();

  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return <MyRequests />;
};

export default TableMyRequests;
