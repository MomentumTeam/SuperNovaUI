import React from "react";
import { classNames } from "primereact/utils";
import { get, has } from "lodash";

const TableFieldTemplate = (data, props) => {
  const mapFunc = (item, func, isReturnFunc = false) => {
    if (!Array.isArray(item)) return isReturnFunc? func(item): item;
    else {
      const items = item
        .filter((currItem) => func(currItem))
        .map((currItem) => {
          return isReturnFunc ? func(currItem) : currItem;
        });

      return items;
    }
  };

  const getField = () => {
    const checkIfFieldExists = (fieldName) => {
      return has(data, fieldName);
    };

    return mapFunc(props.field, checkIfFieldExists);
  };

  const getValue = (field) => {
    const getDataByField = (fieldName) => {
      return get(data, fieldName);
    };

    const getDataEnumByValue = (value) => {
      return props.enum[value];
    };

    const getDataFormatterByValue = (value) => {
      return props.formatter(value);
    };
    
    let value = mapFunc(field, getDataByField, true);

    if (value) {
      if (props.enum !== undefined) {
        value = mapFunc(value, getDataEnumByValue, true);
      }

      if (props.formatter != undefined) {
        value = mapFunc(value, getDataFormatterByValue, true);
      }

      return value;
    }

    return props.default !== undefined ? props.default : "---";
  };

  const field = getField();
  const value = getValue(field);

  return (
    <React.Fragment>
      <span className="p-column-title">{props.header}</span>
      <span className={classNames("customer-badge", "status-" + !Array.isArray(field)? field: field[0])}>
        {props?.template ? props.template(value) : value}
      </span>
    </React.Fragment>
  );
};

export default TableFieldTemplate;
