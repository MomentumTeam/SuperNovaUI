import React, { createContext, useReducer, useState, useEffect } from "react";

import Entities from "./Entity";
import { firstPage } from "../../constants/api";
import { TableNames } from "../../constants/table";
import { useStores } from '../../context/use-stores';

export const TableDataContext = createContext(null);
 
export const TableDataRecuder = (state, action) => {
  switch (action.type) {
    case "searchResult":
      return { isLoading: false, tableData: action.results, page: firstPage, isSearch:true };
    case "restore":
      return { isLoading: false, tableData: [], page: firstPage, isSearch: false };
    case "loading":
      return { ...state, isLoading: true };
    case "failedLoading":
      return { ...state, isLoading: false };
    case TableNames.entities.tab:
    case TableNames.roles.tab:
    case TableNames.hierarchy.tab:
      return { isLoading: false, tableData: action.results, page: state.page++ };
    default:
      break;
  }
};

const TableEntity = () => {
  const {userStore} = useStores();
  const [tabId, setTabId] = useState(TableNames.entities.tab);
  const [tableState, tableDispatch] = useReducer(TableDataRecuder, {
    tableData: [],
    isLoading: false,
    isSearch: false,
    page: 0,
  });

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return (
    <TableDataContext.Provider value={{ tableState, tableDispatch, tabId, setTabId }}>
      <Entities />
    </TableDataContext.Provider>
  );
};

export default TableEntity;
