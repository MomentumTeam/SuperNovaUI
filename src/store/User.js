import { action, makeAutoObservable, observable } from 'mobx';
import { getUser } from '../service/UserService';

export default class UserStore {
    user = null;

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            fetchUserInfo: action
        })
    }

    async fetchUserInfo(userID) {
        const userInfo = await getUser(userID);
        this.user = userInfo;
    }
}