import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { STATUSES, TYPES } from '../constants/applies';
import { USER_TYPE_TAG } from '../constants';

import {
  getFormattedDate,
  processApprovalTableData,
  exportToExcel,
} from '../utils/approvalTables';
// import MoreItem from '../components/more-item';

import '../assets/css/local/general/table.min.css';

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

  async excelExport(applies) {
    const approvalData = processApprovalTableData(applies);
    exportToExcel(approvalData);
  }

  render() {
    return (
      <>
        {!this.props.approveType === USER_TYPE_TAG.APPROVER ? (
          <div className='display-flex title-wrap'>
            <h2>בקשות לאישורי</h2>
            <h3>{this.props.applies.length} סה"כ</h3>
            {console.log(this.props.applies)}
          </div>
        ) : (
          <div className='display-flex display-flex-start title-wrap'>
            <h2 className={'tabletab'}>בקשות לאישורי</h2>
            <h2 className={'tabletab'}>סל הבקשות</h2>
            {console.log(this.props.applies)}
          </div>
        )}
        <div className='table-wrapper'>
          <div className='tableStyle'>
            <div className='card'>
              <DataTable value={this.props.applies} scrollable lazy>
                <Column selectionMode='multiple' style={{ width: '3em' }} />

                <Column
                  field='reqType'
                  header='סוג בקשה'
                  body={this.requestTypeBodyTemplate}
                  sortable
                ></Column>
                <Column
                  field='requester'
                  header='שם מבקש'
                  body={this.requesterNameBodyTemplate}
                  sortable
                ></Column>
                <Column
                  field='reqDate'
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
                  field='reason'
                  header='סיבה'
                  body={this.requestReasonBodyTemplate}
                  sortable
                ></Column>
                <Column
                  field='status'
                  header='סטטוס'
                  body={this.requestStatusBodyTemplate}
                  sortable
                ></Column>
              </DataTable>

              <div className='display-flex inner-flex'>
                <button
                  className='btn btn-export'
                  title='Export'
                  type='button'
                  onClick={() => this.excelExport(this.props.applies)}
                >
                  <span className='for-screnReader'>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Table;
