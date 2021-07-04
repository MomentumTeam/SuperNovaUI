import { action, makeAutoObservable, observable } from 'mobx';
import { getUser } from '../service/UserService';

export default class UserStore {
    user = null;

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            setUser: action
        })
    }

    async setUser(userID) {
        const userInfo = await getUser(userID);
        this.user = userInfo;
    }
}