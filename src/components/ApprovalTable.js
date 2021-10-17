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

const Table = ({ applies, allApplies, approveType }) => {
  const [selectedTab, setTab] = useState('myreqs');

  const requestTypeBodyTemplate = (rowData) => {
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
  };

  const requesterNameBodyTemplate = (rowData) => {
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
  };

  const requestDateBodyTemplate = (rowData) => {
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
  };

  const requestHierarchyBodyTemplate = (rowData) => {
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
  };

  const requestReasonBodyTemplate = (rowData) => {
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
  };

  const requestStatusBodyTemplate = (rowData) => {
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
  };

  const requestHandlerBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className='p-column-title'>גורם מטפל</span>
        <span
          className={classNames('customer-badge', 'status-' + rowData.status)}
        >
          {STATUSES[rowData.status]}
        </span>
      </React.Fragment>
    );
  };

  const excelExport = async (applies) => {
    const approvalData = processApprovalTableData(applies);
    exportToExcel(approvalData);
  };

  return (
    <>
      {console.log(allApplies)}
      {!approveType === USER_TYPE_TAG.APPROVER ? (
        <div className='display-flex title-wrap'>
          <h2>בקשות לאישורי</h2>
          <h3>{applies.length} סה"כ</h3>
        </div>
      ) : (
        <div className='display-flex display-flex-start title-wrap'>
          <h2
            className={`tabletab ${selectedTab !== 'myreqs' ? 'inactive' : ''}`}
            onClick={() => setTab('myreqs')}
          >
            בקשות לאישורי
          </h2>
          <h2
            className={`tabletab ${
              selectedTab !== 'allreqs' ? 'inactive' : ''
            }`}
            onClick={() => setTab('allreqs')}
          >
            סל הבקשות
          </h2>
        </div>
      )}
      <div className='table-wrapper'>
        <div className='tableStyle'>
          <div className='card'>
            <DataTable
              value={selectedTab === 'myreqs' ? applies : allApplies}
              scrollable
              lazy
            >
              <Column selectionMode='multiple' style={{ width: '3em' }} />

              <Column
                field='reqType'
                header='סוג בקשה'
                body={requestTypeBodyTemplate}
                sortable
              ></Column>
              <Column
                field='requester'
                header='שם מבקש'
                body={requesterNameBodyTemplate}
                sortable
              ></Column>
              {selectedTab === 'allreqs' && (
                <Column
                  field='reqDate'
                  header='גורם מטפל'
                  body={requestHandlerBodyTemplate}
                  sortable
                ></Column>
              )}
              <Column
                field='reqDate'
                header='ת׳ בקשה'
                body={requestDateBodyTemplate}
                sortable
              ></Column>
              <Column
                field='role'
                header='היררכיה'
                body={requestHierarchyBodyTemplate}
                sortable
              ></Column>
              <Column
                field='reason'
                header='סיבה'
                body={requestReasonBodyTemplate}
                sortable
              ></Column>
              <Column
                field='status'
                header='סטטוס'
                body={requestStatusBodyTemplate}
                sortable
              ></Column>
            </DataTable>

            <div className='display-flex inner-flex'>
              <button
                className='btn btn-export'
                title='Export'
                type='button'
                onClick={() =>
                  excelExport(selectedTab === 'myreqs' ? applies : allApplies)
                }
              >
                <span className='for-screnReader'>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
