import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { TableTypes, TableIds } from '../../constants/table';

import '../../assets/css/local/general/table.min.css';

const Table = ({ data, tableType }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const idColName = TableIds[tableType];
    const rowData = TableTypes[tableType];

    useEffect(() => {
        setSelectedItem(null);
    }, [tableType]);

    return (
        <div className="table-wrapper">
            <div className="tableStyle">
                <div className="card">
                    <DataTable
                        value={data}
                        scrollable
                        selectionMode="single"
                        selection={selectedItem}
                        onSelectionChange={(e) => setSelectedItem(e.value)}
                        dataKey={idColName}
                    >
                        {rowData.map((col) => (
                            <Column key={col.field} field={col.field} header={col.displayName} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Table;
