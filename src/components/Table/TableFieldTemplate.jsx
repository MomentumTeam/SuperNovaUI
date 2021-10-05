import React from "react";
import { classNames } from "primereact/utils";

const TableFieldTemplate = (data, props) => {
  const getValue = () => {
    return props.field === "directRoles" ? (data[props.field] ? data[props.field].length : 0) : data[props.field];
  };
  return (
    <React.Fragment>
      <span className="p-column-title">{props.header}</span>
      <span className={classNames("customer-badge", "status-" + props.field)}>{getValue()}</span>
    </React.Fragment>
  );
};

export default TableFieldTemplate;
