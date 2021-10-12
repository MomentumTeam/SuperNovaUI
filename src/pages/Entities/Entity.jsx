import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import Table from "../../components/Table";
import Header from "./Header";
import SearchEntity from "./SearchEntity";
import AddEntity from "./AddEntity";
import { itemsInPage, pageSize } from "../../constants/api";
import { useStores } from "../../context/use-stores";
import { TableDataContext } from ".";
import { TableNames } from "../../constants/table";

import "../../assets/css/local/pages/listUsersPage.min.css";

const Entities = observer(() => {
  const [first, setFirst] = useState(0);
  const { tablesStore, userStore } = useStores();
  const { tableState, tableDispatch, tabId, setTabId } = useContext(TableDataContext);

  const getData = async (append) => {
    if (userStore.user.directGroup) {
      switch (tabId) {
        case TableNames.entities.tab:
          await tablesStore.loadEntitiesUnderOG(userStore.user.directGroup, tableState.page, pageSize, append);
          return tablesStore.entities;
        case TableNames.roles.tab:
          await tablesStore.loadRolesUnderOG(userStore.user.directGroup, tableState.page, pageSize, append);
          return tablesStore.roles;
        case TableNames.hierarchy.tab:
          await tablesStore.loadOGChildren(userStore.user.directGroup, tableState.page, pageSize, append);
          return tablesStore.groups;
        default:
          break;
      }
    }

    return [];
  };

  const setData = async (event) => {
    let append;
    let getNextPage = true;

    if (tabId && userStore.user) {
      if (event && event.first !== undefined) {
        append = true;
        setFirst(event.first);
        if (first >= event.first || tableState.tableData.length / (event.page + 1) > itemsInPage) getNextPage = false;
      }

      if (getNextPage && !tablesStore.isSearch) {
        try {
          tableDispatch({ type: "loading" });
          const data = await getData(append);
          tableDispatch({ type: tabId, results: data });
        } catch (error) {
          tableDispatch({ type: "failedLoading" });
          console.log(error); // TODO: popup error
        }
      }
    }
  };

  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore]);

  useEffect(() => {
    // Get table's data
    const firstData = async () => {
      setFirst(0);
      tablesStore.setSearch(false);
      tableDispatch({ type: "restore" });
      await setData();
    };

    firstData();
  }, [tabId, userStore, tablesStore]);

  return (
    <>
      <div className="main-inner-item main-inner-item2 main-inner-item2-table">
        <div className="main-inner-item2-content">
          <Header setTab={setTabId} selectedTab={tabId} />
          <div className="content-unit-wrap">
            <div className="content-unit-inner">
              <div className="display-flex search-row-wrap-flex">
                <SearchEntity tableType={tabId} />
                <AddEntity />
              </div>
              <Table
                data={tableState.tableData}
                tableType={tabId}
                isLoading={tableState.isLoading}
                onScroll={setData}
                first={first}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Entities;
