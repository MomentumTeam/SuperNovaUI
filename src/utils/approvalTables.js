import * as filesaver from 'file-saver';
import * as xlsx from 'xlsx';
import { STATUSES, TYPES } from '../constants/applies';

const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const getFormattedDate = (timestamp) => {
  const newDate = new Date(parseInt(timestamp));

  const dd = String(newDate.getDate()).padStart(2, '0');
  const mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = newDate.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
};

export const exportToExcel = (exportedData) => {
  const ws = xlsx.utils.json_to_sheet(exportedData);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  filesaver.saveAs(data, 'data.xlsx');
};

export const processApprovalTableData = (tableData) => {
  return tableData.map((action) => {
    let newAction = {};

    newAction['שם מבקש'] = action.submittedBy.displayName;
    newAction['מספר אישי'] = action.submittedBy.personalNumber;
    newAction['סוג בקשה'] = TYPES[action.type];
    newAction['תאריך יצירה'] = getFormattedDate(action.createdAt);
    newAction['סיבה'] = action.comments;
    newAction['סטטוס בקשה'] = STATUSES[action.status];

    return newAction;
  });
};
