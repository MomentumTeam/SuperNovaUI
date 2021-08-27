import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
// import MoreItem from '../components/more-item';

import '../assets/css/local/general/table.min.css';
class Table extends React.Component {
    firstNameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סוג בקשה:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.firstName)}>{rowData.firstName}</span>
            </React.Fragment>
        );
    }


    lastNameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">שם מבקש:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.lastName)}>{rowData?.submittedBy?.displayName}</span>
            </React.Fragment>
        );
    }

    idNumBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">ת׳ מבקשה:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.idNum)}>{rowData.idNum}</span>
            </React.Fragment>
        );
    }

    roleBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">היררכיה:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.role)}>{rowData.role}</span>
            </React.Fragment>
        );
    }

    userBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סיבה:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.user)}>{rowData.user}</span>
            </React.Fragment>
        );
    }

    statusBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סטטוס:</span>
                <span className={classNames('customer-badge', 'status-' + rowData.status)}>{rowData.status}</span>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="table-wrapper">
                <div className="tableStyle" >
                    <div className="card">
                        <DataTable value={this.props.applies}
                            scrollable
                            lazy
                            >
                            <Column selectionMode="multiple" style={{ width: '3em' }} />

                            <Column field="firstName" header="סוג בקשה" body={this.firstNameBodyTemplate} sortable></Column>
                            <Column field="lastName" header="שם מבקש" body={this.lastNameBodyTemplate} sortable></Column>
                            <Column field="idNum" header='ת׳ מבקש' body={this.idNumBodyTemplate} sortable></Column>
                            <Column field="role" header="היררכיה" body={this.roleBodyTemplate} sortable></Column>
                            <Column field="user" header="סיבה" body={this.userBodyTemplate} sortable></Column>
                            <Column field="unity" header="סטטוס" body={this.statusBodyTemplate} sortable></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    }
}






export default Table