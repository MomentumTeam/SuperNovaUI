import axios from "axios";

export const getProductsSmall = async () => {
  const response = await axios({
    method: "get",
    url: `data/products-small.json`,
    headers: {
      "content-type": "application/json",
    },
  });

  return response.data;
};

export const getProducts = async () => {
  const response = await axios({
    method: "get",
    url: `data/products-small.json`,
    headers: {
      "content-type": "application/json",
    },
  });

  return response.data;
};

export const getProductsWithOrdersSmall = async () => {
  const response = await axios({
    method: "get",
    url: `data/products-orders-small.json`,
    headers: {
      "content-type": "application/json",
    },
  });

  return response.data;
};
