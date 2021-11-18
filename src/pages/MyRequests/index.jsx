import React, { createContext, useReducer, useState, useEffect } from "react";

import MyRequests from "./MyRequests";
import { firstPage } from "../../constants/api";
import { TableNames } from "../../constants/myRequestsTable";
import { useStores } from "../../context/use-stores";

export const TableDataContext = createContext(null);

export const TableDataRecuder = (state, action) => {
  switch (action.type) {
    case "searchResult":
      return { isLoading: false, tableData: action.results, page: firstPage };
    case "restore":
      return { isLoading: false, tableData: [], page: firstPage };
    case "loading":
      return { ...state, isLoading: true };
    case "loadingSearch":
      return { ...state, isLoading: true, page: firstPage };
    case "failedLoading":
      return { ...state, isLoading: false };
    case TableNames.myRequests.tab:
      return {
        isLoading: false,
        tableData: action.results,
        page: state.page + 1,
      };
    default:
      break;
  }
};

const TableEntity = () => {
  const { userStore } = useStores();
  const [tabId, setTabId] = useState(TableNames.myRequests.tab);
  const [tableState, tableDispatch] = useReducer(TableDataRecuder, {
    tableData: [],
    isLoading: false,
    page: 0,
  });

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return (
    <TableDataContext.Provider
      value={{ tableState, tableDispatch, tabId, setTabId }}
    >
      <MyRequests />
    </TableDataContext.Provider>
  );
};

export default TableEntity;
