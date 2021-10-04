import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import TableFieldTemplate from './TableFieldTemplate'
import { TableTypes } from "../../constants/table";
import { pageSize } from '../../constants/api';
import '../../assets/css/local/general/table.min.css';

const Table = ({data, tableType, isLoading, onScroll}) => {

  const [selectedItem, setSelectedItem] = useState(null);
  const [totalRecords, setTotalRecords] = useState(pageSize + data.length);
  const rowData = TableTypes[tableType];

  const loadingText = () => {
    return <span className="loading-text"></span>;
  };

  useEffect(() => {
    setTotalRecords((pageSize + data.length)*5); // TODO: check with proper api
  }, [data]);

    return (
      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={data}
              selection={selectedItem}
              selectionMode="single"
              onSelectionChange={(e) => setSelectedItem(e.value)}
              scrollable // scroll start
              scrollHeight="350px"
              lazy
              loading={isLoading}
              rows={pageSize}
              virtualScroll
              totalRecords={totalRecords} // ASK: how to get this???
              onVirtualScroll={onScroll} // scroll finish
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
              <Column loadingBody={loadingText} body={TableFieldTemplate} />
            </DataTable>
          </div>
        </div>
      </div>
    );
};

export default Table;
