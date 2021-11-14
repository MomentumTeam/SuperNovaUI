import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";

import Table from "../../components/Table";
import SearchMyRequests from "./SearchMyRequests";
import Header from "./Header";
import { itemsInPage, pageSize } from "../../constants/api";
import { useStores } from "../../context/use-stores";
import { TableDataContext } from ".";
import { TableNames, TableTypes } from "../../constants/myRequestsTable";

import "../../assets/css/local/pages/listUsersPage.min.css";

let curSearchFuncName = "loadMyRequests";
let curSearchValue = "";

const Requests = observer(() => {
  const [first, setFirst] = useState(0);
  const { myRequestsStore, userStore } = useStores();
  const { tableState, tableDispatch, tabId, setTabId } =
    useContext(TableDataContext);

  const getData = async (append, loadFuncName, searchValue) => {
    switch (tabId) {
      case TableNames.myRequests.tab:
        await myRequestsStore[loadFuncName](
          tableState.page * pageSize + 1,
          (tableState.page + 1) * pageSize + 1,
          append,
          searchValue
        );
        return myRequestsStore.myRequests;
      default:
        return [];
    }
  };

  const setData = async (event, searchFuncName, searchValue) => {
    const firstLoad = searchFuncName || typeof searchValue === "string";
    if (searchFuncName) curSearchFuncName = searchFuncName;
    if (typeof searchValue === "string") {
      curSearchValue = searchValue;
      if (searchValue === "") curSearchFuncName = "loadMyRequests";
    }
    let append;
    let getNextPage = true;
    if (tabId && userStore.user) {
      if (event && event.first !== undefined) {
        append = true;
        setFirst(event.first);
        if (
          first >= event.first ||
          tableState.tableData.length / (event.page + 1) > itemsInPage
        )
          getNextPage = false;
      }

      if (getNextPage) {
        try {
          if (firstLoad) tableDispatch({ type: "restore" });
          tableDispatch({ type: "loading" });
          const data = await getData(append, curSearchFuncName, curSearchValue);
          tableDispatch({
            type: firstLoad ? "searchResult" : tabId,
            results: data,
          });
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
      myRequestsStore.setSearch(false);
      tableDispatch({ type: "restore" });
      await setData({}, "loadMyRequests");
    };
    firstData();
  }, [tabId]);

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
                <SearchMyRequests tableType={tabId} searchFunc={setData} />
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

export default Requests;
