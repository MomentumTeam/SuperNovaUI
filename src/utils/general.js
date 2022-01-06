import * as filesaver from "file-saver";
import * as xlsx from "xlsx";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

export const exportToExcel = (exportedData, fileName = "data") => {
  const ws = xlsx.utils.json_to_sheet(exportedData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  filesaver.saveAs(data, `${fileName}.xlsx`);
};
