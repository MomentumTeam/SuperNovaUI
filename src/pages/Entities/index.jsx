import React, { useEffect } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Entities from './Entity';
import { useStores } from '../../context/use-stores';

const TableEntity = () => {
  const { userStore } = useStores();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView({
      documentTitle: 'טבלאות',
    });
  }, []);

  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore.user]);

  return <Entities />;
};

export default TableEntity;
