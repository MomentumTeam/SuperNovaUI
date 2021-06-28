
import axios from 'axios'

export const getCountries = async () => {
    const response = await axios({
      method: 'get',
      url: `data/countries.json`,
      headers: {
        'content-type': 'application/json',
      },
    })

    return response.data;
}