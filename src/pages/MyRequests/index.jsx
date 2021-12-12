import React, { useEffect } from "react";
import { useStores } from "../../context/use-stores";
import MyRequests from "./MyRequests";


const TableMyRequests = () => {
  const { userStore } = useStores();

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return <MyRequests />
};

export default TableMyRequests;
