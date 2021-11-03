import { USER_TYPE } from "../constants";

export const transformNode = (node) => {
  return {
    label: node.label,
    expanded: true,
    children: !node.children
      ? []
      : node.children.map((child) => transformNode(child)),
  };
};

export const canEditHierarchy = (user) => {
  return user.types.includes(USER_TYPE.COMMANDER);
};

export const getHierarchy = (hierarchy) => {
  const splitHierarchy = hierarchy.split("/");
  const hierarchyReadOnly = splitHierarchy.slice(0, splitHierarchy.length -1).join('/')
  const hierarchyName = splitHierarchy[splitHierarchy.length-1]

  return { hierarchyReadOnly, hierarchyName };
}