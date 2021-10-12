import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { STATUSES, TYPES } from '../constants/applies';
// import MoreItem from '../components/more-item';

import '../assets/css/local/general/table.min.css';

const getFormattedDate = (timestamp) => {
  const newDate = new Date(parseInt(timestamp));

  const dd = String(newDate.getDate()).padStart(2, '0');
  const mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = newDate.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
};

class Table extends React.Component {
  requestTypeBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>סוג בקשה</span>
        <span
          className={classNames(
            'customer-badge',
            'status-' + rowData.firstName,
          )}
        >
          {TYPES[rowData.type]}
        </span>
      </React.Fragment>
    );
  }

  requesterNameBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>שם מבקש</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.lastName)}
        >
          {rowData?.submittedBy?.displayName}
        </span>
      </React.Fragment>
    );
  }

  requestDateBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>ת׳ בקשה</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.idNum)}
        >
          {getFormattedDate(rowData.createdAt)}
        </span>
      </React.Fragment>
    );
  }

  requestHierarchyBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>היררכיה</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.role)}
        >
          {rowData.role}
        </span>
      </React.Fragment>
    );
  }

  requestReasonBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>סיבה</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.user)}
        >
          {rowData.comments}
        </span>
      </React.Fragment>
    );
  }

  requestStatusBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className='p-column-title'>סטטוס</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.status)}
        >
          {STATUSES[rowData.status]}
        </span>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className='table-wrapper'>
        <div className='tableStyle'>
          <div className='card'>
            <DataTable value={this.props.applies} scrollable lazy>
              <Column selectionMode='multiple' style={{ width: '3em' }} />

              <Column
                field='firstName'
                header='סוג בקשה'
                body={this.requestTypeBodyTemplate}
                sortable
              ></Column>
              <Column
                field='lastName'
                header='שם מבקש'
                body={this.requesterNameBodyTemplate}
                sortable
              ></Column>
              <Column
                field='idNum'
                header='ת׳ בקשה'
                body={this.requestDateBodyTemplate}
                sortable
              ></Column>
              <Column
                field='role'
                header='היררכיה'
                body={this.requestHierarchyBodyTemplate}
                sortable
              ></Column>
              <Column
                field='user'
                header='סיבה'
                body={this.requestReasonBodyTemplate}
                sortable
              ></Column>
              <Column
                field='unity'
                header='סטטוס'
                body={this.requestStatusBodyTemplate}
                sortable
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
