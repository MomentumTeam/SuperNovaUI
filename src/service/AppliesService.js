
import axios from 'axios';
import { apiBaseUrl } from '../constants/api';

export const getUserApplies = async (userId = '41224d776a326fb40f000002', rangeStart = 1, rangeEnd = 2) => {
    const response = await axios({
      method: 'get',
      url: `${apiBaseUrl}/api/requests/getRequestsSubmittedBy/${userId}/${rangeStart}/${rangeEnd}`,
      headers: {
        'content-type': 'application/json',
      },
    })

    return response.data;
}