import React, { useEffect } from "react";
import Entities from "./Entity";
import { useStores } from "../../context/use-stores";

const TableEntity = () => {
  const { userStore, notificationStore } = useStores();

  useEffect(() => {
    notificationStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore.user]);


  return <Entities />
};

export default TableEntity;
