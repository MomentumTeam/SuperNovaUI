import { Badge } from "primereact/badge";

import {getUserNameFromDisplayName} from '../../utils/user';

const ResponsibleFactorFieldTemplate = (responsibles) => {
  let names = [];
  responsibles.map(
    (responsibleType) =>
      (names = [...names, ...responsibleType.map((person) => getUserNameFromDisplayName(person.displayName))])
  );

  const getFormatted = () => {
    if (names.length === 0) return "---";
    if (names.length === 1) return names[0];
    if (names)
      return (
        <div>
          {/* TODO: change to classname */}
          <span style={{ padding: "2px", display: "inline-block" }}>{names[0]}</span>
          <Badge
            value={`${names.length - 1}+`}
            style={{ backgroundColor: "#A7ABBD", padding: "2px", display: "inline-block" }}
          ></Badge>
        </div>
      );
  };
  return <div>{getFormatted()}</div>;
};

export { ResponsibleFactorFieldTemplate };
