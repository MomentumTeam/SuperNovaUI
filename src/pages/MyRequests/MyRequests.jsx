import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";

import Table from "../../components/Table";
import SearchMyRequests from "./SearchMyRequests";
import Header from "./Header";
import { useStores } from "../../context/use-stores";
import { TableNames, TableTypes } from "../../constants/myRequestsTable";

import "../../assets/css/local/pages/listUsersPage.min.css";
import configStore from '../../store/Config';

let defaultSearchFuncName = "loadMyRequests";
let defaultSearchValue = "";

const Requests = observer(() => {
  const { appliesMyStore, userStore } = useStores();
  const [tabId, setTabId] = useState(TableNames.myRequests.tab);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});

  const searchActivate = useCallback(async () => {
    if (searchQuery != {}) await getData({ reset: true });
  }, [searchQuery]);

  const getData = async ({ append = false, reset = false }) => {
    let data = [];
    if (reset) {
      setFirst(0);
      setPage(0);
    }

    const from = reset ? 1 : (page + 1) * configStore.PAGE_SIZE + 1;
    const to = reset ? configStore.PAGE_SIZE : (page + 2) * configStore.PAGE_SIZE;
    const funcName =
      searchQuery?.searchFunc && searchQuery?.searchValue ? searchQuery.searchFunc : defaultSearchFuncName;
    const searchValue = searchQuery?.searchValue ? searchQuery.searchValue : defaultSearchValue;

    switch (tabId) {
      case TableNames.myRequests.tab:
        data = await appliesMyStore[funcName](from, to, append, searchValue);
        break;
      default:
        break;
    }

    return data;
  };

  const onVirtualScroll = async (event) => {
    let getNextPage = true;

    if (event && event.first !== undefined) {
      if (
        tableData.length >= appliesMyStore.totalCount ||
        first >= event.first ||
        tableData.length / (event.page + 1) > configStore.ITEMS_IN_PAGE
      )
        getNextPage = false;
      setFirst(event.first);
    }

    if (getNextPage) {
      setIsLoading(true);
      try {
        await getData({ append: getNextPage });
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTableData(appliesMyStore.myRequests);
  }, [appliesMyStore.myRequests, appliesMyStore.totalCount]);

  useEffect(() => {
    searchActivate();
  }, [searchQuery]);

  return (
    <>
      <div className="main-inner-item main-inner-item2 main-inner-item2-table" id="my-request-table">
        <div className="main-inner-item2-content">
          <Header setTab={setTabId} selectedTab={tabId} />
          <div className="content-unit-wrap">
            <div className="content-unit-inner">
              <div className="display-flex search-row-wrap-flex">
                <SearchMyRequests tableType={tabId} setSearchQuery={setSearchQuery} />
              </div>
              <Table
                data={tableData}
                tableTypes={TableTypes(userStore.user)[tabId]}
                tableType={tabId}
                isLoading={isLoading}
                isPaginator={true}
                isSelectedCol={true}
                onScroll={onVirtualScroll}
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
