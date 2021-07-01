import axiosApiInstance from '../config/axios';

export const getUser = (userID) => {
    console.log('userID', userID)
    console.log('getUserFromServer');
    return new Promise((resolve, reject) => {
        axiosApiInstance.get(`http://localhost:2000/api/kartoffel/getEntityByMongoId/5e5688324203fc40043591aa`)
            .then((res) => {
                console.log('res', res.data);
                resolve(res.data);
            })
            .catch((err) => { console.log('err', err); reject(err) });
    });
};