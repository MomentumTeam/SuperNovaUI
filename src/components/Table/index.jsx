import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ContextMenu } from "primereact/contextmenu";
import { Toast } from "primereact/toast";

import TableFieldTemplate from "./TableFieldTemplate";
import { TableTypes } from "../../constants/table";
import { itemsInPage } from "../../constants/api";
import "../../assets/css/local/general/table.min.css";
import PaginatorTemplate from "./TablePaginatorTemplate";

import { TableActions } from "./TableActions";
import { useStores } from "../../context/use-stores";
import FullUserInformationModal from "../../components/Modals/FullUserInformationModal";

const Table = ({ data, tableType, isLoading, onScroll, first }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const toast = useRef(null);
  const menu = useRef(null);

  const { userStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);

  const rowData = TableTypes[tableType];

  const openMenu = (e) => menu.current.show(e.originalEvent);

  const loadingText = () => {
    return <span className="loading-text"></span>;
  };

  const TableActionsTemplate = () => {
    return <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text" />;
  };

  const openFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(true);
  };

  const closeFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(false);
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      <ContextMenu
        model={TableActions({ toast, selectedItem, openFullDetailsModal })}
        popup
        ref={menu}
        // onHide={() => setSelectedItem(null)}
      />

      <FullUserInformationModal
        user={selectedItem}
        userPicture={userStore.userPicture}
        isOpen={isFullUserInfoModalOpen}
        closeFullDetailsModal={closeFullDetailsModal}
      />

      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={data}
              selection={selectedItem}
              selectionMode="single"
              onSelectionChange={(e) => setSelectedItem(e.value)}
              paginator // paginator start
              paginatorTemplate={PaginatorTemplate}
              rows={itemsInPage}
              first={first}
              onPage={onScroll}
              loading={isLoading} // paginator end
              onContextMenuSelectionChange={(e) => setSelectedItem(e.value)}
              onContextMenu={(e) => openMenu(e)}
            >
              {rowData.map((col) => (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.displayName}
                  loadingBody={loadingText}
                  body={TableFieldTemplate}
                />
              ))}
              {/* <Column loadingBody={loadingText} body={TableActionsTemplate} /> */}
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
