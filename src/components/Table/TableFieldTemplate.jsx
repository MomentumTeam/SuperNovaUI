import React, { Component } from "react";
import { classNames } from "primereact/utils";

export class TableFieldTemplate extends Component {
  render(displayName, field) {
    return (
      <React.Fragment>
        <span className="p-column-title">{displayName}</span>
        <span
          className={classNames(
            "customer-badge",
            "status-" + field
          )}
        >
          {field}
        </span>
      </React.Fragment>
    );
  }
}

export default TableFieldTemplate;
