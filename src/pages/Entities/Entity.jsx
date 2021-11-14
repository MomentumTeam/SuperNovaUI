import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import Table from "../../components/Table";
import Header from "./Header";
import SearchEntity from "./SearchEntity";
import AddEntity from "./AddEntity";
import { itemsInPage, pageSize } from "../../constants/api";
import { useStores } from "../../context/use-stores";
import { TableDataContext } from ".";
import { TableNames, TableTypes } from "../../constants/table";

import "../../assets/css/local/pages/listUsersPage.min.css";

const Entities = observer(() => {
  const [first, setFirst] = useState(0);
  const { entitiesStore, rolesStore, groupsStore, userStore } = useStores();
  const { tableState, tableDispatch, tabId, setTabId } = useContext(TableDataContext);

  const getData = async (append) => {
    if (userStore.user.directGroup) {
      switch (tabId) {
        case TableNames.entities.tab:
          await entitiesStore.loadEntitiesUnderOG(userStore.user.directGroup, tableState.page, pageSize, append);
          return entitiesStore.entities;
        case TableNames.roles.tab:
          await rolesStore.loadRolesUnderOG(userStore.user.directGroup, tableState.page, pageSize, append);
          return rolesStore.roles;
        case TableNames.hierarchy.tab:
          await groupsStore.loadOGChildren(userStore.user.directGroup, tableState.page, pageSize, append);
          return groupsStore.groups;
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
      
      if (getNextPage && !tableState.isSearch) {
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
    // Get table's data
    const firstData = async () => {
      setFirst(0);
      tableDispatch({ type: "restore" });
      await setData();
    };
    firstData();
  }, [tabId, userStore.user]);
  
  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore.user]);


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
                tableTypes={TableTypes[tabId]}
                tableType={tabId}
                isLoading={tableState.isLoading}
                isPaginator={true}
                isSelectedCol={true}
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
