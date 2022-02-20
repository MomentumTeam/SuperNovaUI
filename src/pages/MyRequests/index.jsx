import React, { useEffect } from "react";
import { useStores } from "../../context/use-stores";
import MyRequests from "./MyRequests";

const TableMyRequests = () => {
  const { userStore, notificationStore } = useStores();

  useEffect(() => {
    notificationStore.fetchUserUnreadNotifications();
  }, [userStore]);

  return <MyRequests />
};

export default TableMyRequests;
