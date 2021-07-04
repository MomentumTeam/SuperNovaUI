import axios from "axios";

const transformNode = (node) => {
  return {
    label: node.name,
    children: !node.children
      ? []
      : node.children.map((child) => transformNode(child)),
    expanded: false,
  };
};

export const getTree = async (rootId) => {
  const response = await axios({
    method: "get",
    url: `http://localhost:2000/api/kartoffel/getOGTree/1111`,
    headers: {
      "content-type": "application/json",
    },
  });

  const ogTree = [transformNode(response.data)];
  return ogTree;
};
