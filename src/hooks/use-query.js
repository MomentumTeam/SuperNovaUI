import { useLocation } from 'react-router-dom';

export const useQuery = (param) => {
    const queryParams = new URLSearchParams(useLocation().search);
    return queryParams.get(param);
}