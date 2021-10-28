import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const BulkRowsPopup = ({ rows, columns }) => {
  return (
    <div className="table-wrapper">
      <div className="tableStyle">
        <div className="card">
          <DataTable value={rows} scrollable lazy>
            {columns.map((column) => <Column field={column.field} header={column.header} style={{ textAlignLast: "right" }} /> )}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default BulkRowsPopup;
