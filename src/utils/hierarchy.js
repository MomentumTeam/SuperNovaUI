export const transformNode = (node) => {
  return {
    label: node.label,
    expanded: true,
    children: !node.children
      ? []
      : node.children.map((child) => transformNode(child)),
  };
};
