import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { TableTypes } from '../../constants/table'

import "../../assets/css/local/general/table.min.css";

const Table = ({data, tableType}) => {

  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const rowData = TableTypes[tableType];

    return (
      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={data}
              scrollable
              selection={selectedCustomers}
              onSelectionChange={(e) => setSelectedCustomers(e.value)}
            >
              <Column selectionMode="multiple" style={{ width: "3em" }} />

              {rowData.map((col) => (
                    <Column
                      key={col.field}
                      field={col.field}
                      header={col.displayName}
                    />
                ))
              }
            </DataTable>
          </div>
        </div>
      </div>
    );
}

export default Table;
