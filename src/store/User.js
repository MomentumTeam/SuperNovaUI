import { action, makeAutoObservable, observable } from 'mobx';
import { getUser, getUsers } from '../service/UserService';

export default class UserStore {
    user = null;
    users = null;

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            fetchUserInfo: action,
            loadUsers: action,
        })
    }

    async fetchUserInfo(userID) {
        const userInfo = await getUser(userID);
        this.user = userInfo;
    }

    async loadUsers() {
        this.users = await getUsers();
    }
}