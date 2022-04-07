import { Button } from "primereact/button";

const ExportButton = ({ isExportLoading, exportFunction,toolTip='' }) => (
  <Button
    id="export-button"
    icon="pi pi-file-excel"
    loading={isExportLoading}
    label="ייצוא"
    className="btn-border blue"
    onClick={exportFunction}
    tooltip={toolTip!==''?toolTip:false}
  />
);

export { ExportButton };
