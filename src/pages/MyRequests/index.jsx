import React, { useEffect } from "react";
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useStores } from "../../context/use-stores";
import MyRequests from "./MyRequests";

const TableMyRequests = observer(() => {
  const { userStore, notificationStore, appliesMyStore } = useStores();
  const myRequests = toJS(appliesMyStore.myRequests);

  useEffect(() => {
    notificationStore.fetchUserUnreadNotifications();
  }, [userStore]);

  return <MyRequests myRequests={myRequests}/>;
});

export default TableMyRequests;
