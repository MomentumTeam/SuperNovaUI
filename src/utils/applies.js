import * as filesaver from 'file-saver';
import * as xlsx from 'xlsx';
import { USER_TYPE } from '../constants';
import { STATUSES, TYPES } from '../constants/applies';
import datesUtil from "../utils/dates";
import { isUserHoldType } from './user';

const fileType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const getFormattedDate = (timestamp) => {
  const newDate = new Date(parseInt(timestamp));
  return datesUtil.formattedDate(newDate);

};

export const getResponsibleFactor = (user) => {
  const fields = [];
  if (isUserHoldType(user, USER_TYPE.SUPER_SECURITY)) fields.push("superSecurityApprovers");
  if (isUserHoldType(user, USER_TYPE.SECURITY)) fields.push("securityApprovers");
  if (isUserHoldType(user, USER_TYPE.ADMIN)) fields.push("commanders");

  return fields;
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


/**
 * Check if d2 is greater than d1
 * @param {String|Object} d1 Datestring or Date object
 * @param {Number} days Optional number of days to add to d1
 */
export const isDateGreater = (d1, days) => {
  d1 = datesUtil.moment(d1);
  const d2 = datesUtil.moment(datesUtil.now());
  return d2.diff(d1, "days") > (days || 0);
}
