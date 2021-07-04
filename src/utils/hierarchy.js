export const transformNode = (node) => {
  return {
    label: node.name,
    children: !node.children
      ? []
      : node.children.map((child) => transformNode(child)),
    expanded: false,
  };
};
