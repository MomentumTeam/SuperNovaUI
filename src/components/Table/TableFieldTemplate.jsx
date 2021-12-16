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

  const getField = (field) => {
    const checkIfFieldExists = (fieldName) => {
      return has(data, fieldName);
    };

    return mapFunc(field, checkIfFieldExists);
  };

  const getValue = ({ field, enumconvert = undefined, formatter = undefined }) => {
    const getDataByField = (fieldName) => {
      return get(data, fieldName);
    };

    const getDataEnumByValue = (value) => {
      return enumconvert[value];
    };

    const getDataFormatterByValue = (value) => {
      return formatter(value);
    };

    let value = mapFunc(field, getDataByField, true);

    if (value) {
      if (enumconvert !== undefined) {
        value = mapFunc(value, getDataEnumByValue, true);
      }

      if (formatter != undefined) {
        value = getDataFormatterByValue(value);
      }

      return value;
    }

    return props.default !== undefined ? props.default : "---";
  };

  let field, value;
  if (props.field != null) {
    field = getField(props.field);
    value = getValue({field, enumconvert: props.enum, formatter: props.formatter});
  } else {
    field = "all";
    value = data;
  }

  let templateParam = props?.templateParam;
  if (props?.templateParam && Array.isArray(props?.templateParam)) {
    templateParam = {};
    props.templateParam.map((param) => {
      const paramValue = typeof param === "string" ? getValue({ field: getField(param) }) : param;
      templateParam[typeof param === "string"? param: "user"] = paramValue;
    });
  }

  return (
    <React.Fragment>
      <span className="p-column-title">{props.header}</span>
      <span className={classNames("customer-badge", "status-" + !Array.isArray(field) ? field : field[0])}>
        {props?.template ? props.template(value, templateParam) : value}
      </span>
    </React.Fragment>
  );
};

export default TableFieldTemplate;
