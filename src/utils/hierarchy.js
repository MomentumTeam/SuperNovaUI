import { USER_TYPE } from "../constants";
import { isUserHoldType } from "./user";

export const transformNode = (node) => {
  return {
    label: node.label,
    expanded: true,
    children: !node.children ? [] : node.children.map((child) => transformNode(child)),
  };
};

export const canEditHierarchy = (user) => {
  return isUserHoldType(user, USER_TYPE.COMMANDER);
};

export const getHierarchy = (hierarchy) => {
  const splitHierarchy = hierarchy.split("/");
  const hierarchyReadOnly = splitHierarchy.slice(0, splitHierarchy.length - 1).join("/");
  const hierarchyName = splitHierarchy[splitHierarchy.length - 1];

  return { hierarchyReadOnly, hierarchyName };
};

export const concatHierarchy = (hierarchy) => {
  return hierarchy[1] != undefined ? `${hierarchy[0]}/${hierarchy[1]}` : hierarchy[0];
};

export const hierarchyItemTemplate = (item) => {
  return (
    <>
      {item.hierarchy != "" && item.hierarchy + "/"}
      {item.name}
    </>
  );
};
