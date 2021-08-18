import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "../../assets/css/local/general/table.min.css";

const Table = ({data}) => {

  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const rowData = [
    { field: "firstName", displayName: "שם פרטי" },
    { field: "lastName", displayName: "שם משפחה" },
    { field: "personalNumber", displayName: "מספר אישי/תעודת זהות" },
    { field: "clearance", displayName: "סיווג" },
    { field: "jobTitle", displayName: "תפקיד" },
    { field: "displayName", displayName: "יוזר" },
    { field: "rank", displayName: "דרגה" },
    { field: "akaUnit", displayName: "יחידה" },
    { field: "serviceType", displayName: "סוג שירות" },
  ];

    return (
      <div className="table-wrapper">
        <div className="tableStyle">
          <div className="card">
            <DataTable
              value={data.entities}
              scrollable
              selection={selectedCustomers}
              onSelectionChange={(e) => setSelectedCustomers(e.value)}
            >
              <Column selectionMode="multiple" style={{ width: "3em" }} />

              {rowData.map((col, i) => {
                  return (
                    <Column
                      key={col.field}
                      field={col.field}
                      header={col.displayName}
                    ></Column>
                  );
                })
              }
            </DataTable>
          </div>
        </div>
      </div>
    );
}

export default Table;
