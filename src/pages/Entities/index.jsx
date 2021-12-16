import React, { useEffect } from "react";

import Entities from "./Entity";
import { useStores } from "../../context/use-stores";

const TableEntity = () => {
  const { userStore } = useStores();

  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore.user]);


  return <Entities />
};

export default TableEntity;
