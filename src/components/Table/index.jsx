import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import TableFieldTemplate from "./TableFieldTemplate";
import PaginatorTemplate from "./TablePaginatorTemplate";
import { TableTypes } from "../../constants/table";
import { itemsInPage } from "../../constants/api";
import { TableContextMenu } from "./TableContextMenu";

import "../../assets/css/local/general/table.min.css";
import { TableFooter } from "./TableFooter";
import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";

const Table = ({ data, tableType, isLoading, onScroll, first }) => {
  const contextMenu = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const { userStore } = useStores();
  const user = toJS(userStore.user);

  const rowData = TableTypes[tableType];

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
          setSelectedItem(data);
          openContextMenu(e);
        }}
      />
    );
  };

  const isAllowed = (col) => {
    return col.secured === undefined || col.secured.some((allowedType) => user.types.includes(allowedType));
  };

  useEffect(() => {
    setSelectedItem(null);
  }, [tableType]);

  return (
    <>
      <TableContextMenu
        ref={contextMenu}
        tableType={tableType}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={data}
              selection={selectedItem}
              selectionMode="single"
              onSelectionChange={(e) => setSelectedItem(e.value)}
              footer={
                <TableFooter
                  setSelectedColumns={setSelectedColumns}
                  selectedColumns={selectedColumns}
                  rowData={rowData}
                />
              }
              paginator // paginator start
              paginatorTemplate={PaginatorTemplate}
              rows={itemsInPage}
              first={first}
              onPage={onScroll}
              loading={isLoading} // paginator end
              onContextMenuSelectionChange={(e) => setSelectedItem(e.value)}
              onContextMenu={(e) => contextMenu.current.show(e.originalEvent)}
            >
              {selectedColumns.map(
                (col) =>
                  isAllowed(col) && (
                    <Column
                      key={col.field}
                      field={col.field}
                      header={col.displayName}
                      loadingBody={loadingText}
                      body={TableFieldTemplate}
                    />
                  )
              )}
              <Column loadingBody={loadingText} body={TableActionsTemplate} />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
