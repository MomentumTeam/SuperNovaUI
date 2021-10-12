import React, { createContext, useReducer, useState } from "react";

import Entities from "./Entity";
import { firstPage } from "../../constants/api";
import { TableNames } from "../../constants/table";

export const TableDataContext = createContext(null);

export const TableDataRecuder = (state, action) => {
  switch (action.type) {
    case "searchResult":
      return { isLoading: false, tableData: action.results, page: firstPage };
    case "restore":
      return { isLoading: false, tableData: [], page: firstPage };
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
  const [tabId, setTabId] = useState(TableNames.entities.tab);
  const [tableState, tableDispatch] = useReducer(TableDataRecuder, {
    tableData: [],
    isLoading: false,
    page: 0,
  });

  return (
    <TableDataContext.Provider value={{ tableState, tableDispatch, tabId, setTabId }}>
      <Entities />
    </TableDataContext.Provider>
  );
};

export default TableEntity;
