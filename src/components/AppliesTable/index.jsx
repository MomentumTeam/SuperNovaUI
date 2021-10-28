import React, { useState, useEffect } from "react";

import Table from "../Table";
import { processApprovalTableData, exportToExcel } from "../../utils/applies";
import { HeaderTable } from "./HeaderTable";
import { TableNames, TableTypes, itemsPerRow, pageSize } from "../../constants/applies";
import { isUserCanSeeAllApproveApplies } from "../../utils/user";
import { useStores } from "../../context/use-stores";

import "../../assets/css/local/general/table.min.css";

const AppliesTable = ({ user, myApplies, allApplies }) => {
  const { appliesStore } = useStores();
  const [selectedTab, setTab] = useState(
    isUserCanSeeAllApproveApplies(user) ? TableNames.allreqs.tab : TableNames.myreqs.tab
  );
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const columns = TableTypes(selectedTab, user);

  const excelExport = async (data) => {
    const approvalData = processApprovalTableData(data);
    exportToExcel(approvalData);
  };

  const getData = async ()=> {
    switch (selectedTab) {
      case TableNames.allreqs.tab:
        await appliesStore.getAllApproveRequests((page + 1) * pageSize + 1, (page + 2) * pageSize, true);
        break;
      case TableNames.myreqs.tab:
        await appliesStore.getMyApproveRequests((page + 1) * pageSize + 1, (page + 2) * pageSize, true);
      default:
        break;
    }
  }
  const onVirtualScroll = async(event) => {
    let getNextPage = true;

    if (event && event.first !== undefined) {
      if (
        tableData.requests.length >= tableData.totalCount ||
        first >= event.first ||
        tableData.requests.length / (event.page + 1) > itemsPerRow
      )
        getNextPage = false;
      setFirst(event.first);
    }

    if (getNextPage) {
      setIsLoading(true);
      try {
        await getData();
        setPage(page + 1);
      } catch (error) {
        console.log(error)
      }

      setIsLoading(false)
    }
  };
  
  useEffect(() => {
    setTableData(selectedTab === TableNames.myreqs.tab ? myApplies : allApplies);
  }, [selectedTab, myApplies, allApplies]);

  return (
    <>
      <HeaderTable
        user={user}
        myApplies={myApplies}
        allApplies={allApplies}
        selectedTab={selectedTab}
        setTab={setTab}
      />

      <Table
        data={tableData.requests}
        tableTypes={columns}
        tableType={selectedTab}
        scrollable={true}
        selectionMode="multiple"
        disableActions={TableNames[selectedTab]?.disableActions}
        exportFunction={excelExport}
        onScroll={onVirtualScroll}
        isPaginator={true}
        totalRecordsScroll={tableData.totalCount}
        rows={itemsPerRow}
        first={first}
        isLoading={isLoading}
      />
    </>
  );
};

export { AppliesTable };
