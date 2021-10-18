import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { TYPES, STATUSES } from '../../constants/applies';
// import MoreItem from '../components/more-item';

import '../../assets/css/local/general/table.min.css';
class Table extends React.Component {
    firstNameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סוג בקשה</span>
                <span className={classNames('customer-badge', 'status-' + rowData.type)}>{TYPES[rowData.type]}</span>
            </React.Fragment>
        );
    }


    lastNameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">מספר סריאלי</span>
                <span className={classNames('customer-badge', 'status-' + rowData.lastName)}>{rowData.serialNumber}</span>
            </React.Fragment>
        );
    }

    idNumBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">ת׳ בקשה</span>
                <span className={classNames('customer-badge', 'status-' + rowData.createdAt)}>{new Date(+rowData.createdAt).toLocaleString("en-GB")}</span>
            </React.Fragment>
        );
    }

    roleBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">היררכיה</span>
                <span className={classNames('customer-badge', 'status-' + rowData.role)}>{rowData?.directGroup}</span>
            </React.Fragment>
        );
    }

    userBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סיבה</span>
                <span className={classNames('customer-badge', 'status-' + rowData.comments)}>{
                    rowData.comments.substring(20) === rowData.comments ? rowData.comments : rowData.comments.substring(0,20)+'...'
                }</span>
            </React.Fragment>
        );
    }

    statusBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">סטטוס</span>
                <span className={classNames('customer-badge', 'status-' + rowData.status)}>{
                    
                    <div className={'btn-status ' + (rowData.status === STATUSES.SENT ? 'btn-sent' : ' btn-rejected')} type="button" title={rowData.status}>
                        {STATUSES[rowData.status]}
                    </div>

                }</span>
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
                            <Column field="firstName" header="סוג בקשה" body={this.firstNameBodyTemplate}></Column>
                            <Column field="lastName" header="מספר סידורי" body={this.lastNameBodyTemplate}></Column>
                            <Column field="idNum" header='תאריך בקשה' body={this.idNumBodyTemplate}></Column>
                            {/* <Column field="role" header="היררכיה" body={this.roleBodyTemplate}></Column> */}
                            <Column field="user" header="סיבה" body={this.userBodyTemplate}></Column>
                            <Column field="unity" header="סטטוס" body={this.statusBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        );
    }
}






export default Table