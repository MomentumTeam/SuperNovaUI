import React, { useState, useRef, useEffect, createContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import TableFieldTemplate from "./TableFieldTemplate";
import PaginatorTemplate from "./TablePaginatorTemplate";
import { itemsInPage } from "../../constants/api";
import { TableActionsMenu } from "./TableActionsMenu";
import { TableFooter } from "./TableFooter";
import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";

import "../../assets/css/local/general/table.min.css";
import { isUserHoldType } from "../../utils/user";

export const TableContext = createContext(null);

const Table = ({
  data,
  tableTypes,
  tableType,
  isLoading = false,
  isPaginator = false,
  isSelectedCol = false,
  onScroll = null,
  first = null,
  selectionMode = "single",
  scrollable = false,
  exportFunction = null,
  disableActions = false,
  isVirtualScrollable = false,
  onVirtualScroll = null,
  totalRecordsScroll = null,
  rows = itemsInPage,
  onSort = null,
  sortField = null,
  sortOrder = null,
  scrollHeight = null,
}) => {
  const contextMenu = useRef(null);
  const { userStore } = useStores();
  const [rowData, setRowData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const user = toJS(userStore.user);

  const isAllowed = (col) => {
    return (
      col.secured === undefined ||
      col.secured.some((allowedType) => isUserHoldType(user, allowedType))
    );
  };

  const loadingText = () => {
    return <span className="loading-text"></span>;
  };

  const openContextMenu = (event) => {
    contextMenu.current.show(event);
  };

  const TableActionsTemplate = (data) => {
    return (
      <Button
        icon="pi pi-ellipsis-h"
        className="p-button-rounded p-button-text p-button-secondary"
        onClick={(e) => {
          setValue(data);
          openContextMenu(e);
        }}
      />
    );
  };

  const setValue = (value) => {
    Array.isArray(value) ? setSelectedItem(value) : setSelectedItem([value]);
  };

  useEffect(() => {
    setSelectedItem([]);
    setRowData(tableTypes.filter((col) => isAllowed(col)));
  }, [tableType]);

  return (
    <>
      <TableContext.Provider value={{ tableType, selectedItem }}>
        <TableActionsMenu ref={contextMenu} />

        <div className="table-wrapper">
          <div className="tableStyle">
            <div className="card">
              <DataTable
                emptyMessage={"אין תוצאות"}
                value={data}
                selection={selectedItem}
                selectionMode={selectionMode}
                onSelectionChange={(e) => setValue(e.value)}
                footer={
                  <TableFooter
                    isSelectedCol={isSelectedCol}
                    setSelectedColumns={setSelectedColumns}
                    selectedColumns={selectedColumns}
                    rowData={rowData}
                    exportFunction={exportFunction}
                    selectedItem={selectedItem}
                  />
                }
                scrollable={scrollable}
                scrollHeight={scrollHeight ? scrollHeight : "500px"}
                loading={isLoading}
                rows={isPaginator || isVirtualScrollable ? rows : null}
                paginator={isPaginator} // paginator start
                paginatorTemplate={PaginatorTemplate}
                first={first}
                onPage={onScroll} // paginator end
                virtualScroll={isVirtualScrollable} // virtual scroll start
                onVirtualScroll={onVirtualScroll}
                virtualRowHeight={isPaginator || isVirtualScrollable ? rows : null}
                lazy={isVirtualScrollable}
                totalRecords={totalRecordsScroll} // virtual scroll end
                contextMenu={!disableActions}
                onContextMenuSelectionChange={!disableActions ? (e) => setValue(e.value) : undefined}
                onContextMenu={!disableActions ? (e) => contextMenu.current.show(e.originalEvent) : undefined}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
              >
                {selectionMode === "multiple" && (
                  <Column
                    selectionMode={selectionMode}
                    headerStyle={{ width: "3em" }}
                    loadingBody={loadingText}
                  ></Column>
                )}

                {selectedColumns.map((col) => (
                  <Column
                    key={col.field}
                    field={col.field}
                    header={col.displayName}
                    formatter={col?.formatter}
                    default={col?.default}
                    enum={col?.enum}
                    loadingBody={loadingText}
                    template={col?.template}
                    templateParam={col?.templateParam}
                    body={TableFieldTemplate}
                    sortable={col?.sortable}
                    sortFields={col?.sortFields}
                    // sortFunction={col?.sortable && onSort !== null ? (e) => onSort(e, col) : undefined}
                  />
                ))}
                {!disableActions && <Column loadingBody={loadingText} body={TableActionsTemplate} />}
              </DataTable>
            </div>
          </div>
        </div>
      </TableContext.Provider>
    </>
  );
};

export default Table;
