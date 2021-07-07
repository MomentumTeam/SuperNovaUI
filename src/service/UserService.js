
import axios from 'axios';

// export const getProductsSmall = async () => {
//     const response = await axios({
//       method: 'get',
//       url: `data/products-small.json`,
//       headers: {
//         'content-type': 'application/json',
//       },
//     })

//     return response.data;
// }

export const getUsers = async () => {
    const response = await axios({
      method: 'get',
      url: `localhost:2000/api/kartoffel/searchOG`,
      headers: {
        'content-type': 'application/json',
      },
    })
    console.log(response.data)
    return response.data;
}

// export const getProductsWithOrdersSmall = async () => {
//     const response = await axios({
//       method: 'get',
//       url: `data/products-orders-small.json`,
//       headers: {
//         'content-type': 'application/json',
//       },
//     })

//     return response.data;
// }