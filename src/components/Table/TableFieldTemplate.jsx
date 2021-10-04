import React from "react";
import { classNames } from "primereact/utils";

const TableFieldTemplate = (data, props) => {
      return (
        <React.Fragment>
          <span className="p-column-title">{props.header}</span>
          <span className={classNames("customer-badge", "status-" + props.field)}>{data[props.field]}</span>
        </React.Fragment>
      );
}

export default TableFieldTemplate;
