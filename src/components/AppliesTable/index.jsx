import React, { useState, useEffect } from "react";

import Table from "../Table";
import { processApprovalTableData, exportToExcel } from "../../utils/applies";
import { HeaderTable } from "./HeaderTable";
import { TableNames, TableTypes, itemsPerRow, pageSize } from "../../constants/applies";
import { isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from "../../utils/user";
import { useStores } from "../../context/use-stores";

import "../../assets/css/local/general/table.min.css";
import { toJS } from 'mobx';

const AppliesTable = () => {
  const { appliesStore, userStore } = useStores();

  const user = toJS(userStore.user);
  const [selectedTab, setTab] = useState(
    isUserCanSeeAllApproveApplies(user) ? TableNames.allreqs.tab : TableNames.myreqs.tab
  );
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchFields, setSearchFields] = useState({});
  const handleFieldChange = (fieldId, value) => {
    if (value !== '' || value === undefined) {
      setSearchFields({ ...searchFields, [fieldId]: value });
    } else {
      delete searchFields[fieldId]
      setSearchFields(searchFields);
    }
  };
  
  const columns = TableTypes(selectedTab, user);

  const excelExport = async (data) => {
    const approvalData = processApprovalTableData(data);
    exportToExcel(approvalData);
  };

  const getData = async ({ saveToStore = true, append = false, reset = false }) => {
    let data = [];
    let searchquery = reset
      ? { from: 1, to: pageSize, saveToStore: saveToStore }
      : { from: (page + 1) * pageSize + 1, to: (page + 2) * pageSize, append: append, saveToStore };
    searchquery = { ...searchquery, ...searchFields };

    switch (selectedTab) {
      case TableNames.allreqs.tab:
        data = await appliesStore.getAllApproveRequests(searchquery);
        break;
      case TableNames.myreqs.tab:
        data = await appliesStore.getMyApproveRequests(searchquery);
      default:
        break;
    }

    return data;
  };

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
        await getData({append:getNextPage});
        setPage(page + 1);
      } catch (error) {
        console.log(error)
      }

      setIsLoading(false)
    }
  };
  
  useEffect(() => {
    setTableData(
      selectedTab === TableNames.myreqs.tab ? appliesStore.approveMyApplies : appliesStore.approveAllApplies
    );
  }, [selectedTab, appliesStore.approveMyApplies, appliesStore.approveAllApplies]);

  useEffect(() => {
    if (user) {
      if (isUserCanSeeMyApproveApplies(user)) {
        appliesStore.getMyApproveRequests(1, pageSize);
      }
      if (isUserCanSeeAllApproveApplies(user)) {
        appliesStore.getAllApproveRequests(1, pageSize);
      }
    }
  },[userStore.user])

  return (
    <>
      <HeaderTable
        user={user}
        myApplies={appliesStore.approveMyApplies}
        allApplies={appliesStore.approveAllApplies}
        selectedTab={selectedTab}
        setTab={setTab}
        setSearchFields={handleFieldChange}
        getData={getData}
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
