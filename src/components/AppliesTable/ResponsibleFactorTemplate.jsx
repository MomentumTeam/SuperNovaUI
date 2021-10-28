import { Badge } from "primereact/badge";
import { Tooltip } from "primereact/tooltip";

const ResponsibleFactorFieldTemplate = (responsibles) => {
  let displayNames = [];
  responsibles.map(
    (responsibleType) => (displayNames = [...displayNames, ...responsibleType.map((person) => person.displayName)])
  );

  const getFormatted = () => {
    if (displayNames.length === 0) return "---";
    if (displayNames.length === 1) return displayNames[0];
    if (displayNames) return (
      <div>
          {/* TODO: change to classname */}
        <span style={{ padding: "2px", display: "inline-block" }}>{displayNames[0]}</span>
        <Badge
          value={`${displayNames.length - 1}+`}
          style={{ backgroundColor: "#A7ABBD", padding: "2px", display: "inline-block" }}
        ></Badge>
      </div>
    );
  };
  return <div>{getFormatted()}</div>;
};

export { ResponsibleFactorFieldTemplate };
