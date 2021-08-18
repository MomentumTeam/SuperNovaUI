import { action, makeAutoObservable, observable } from 'mobx';
import { getUser, getUsers, getPictureByEntityId } from '../service/UserService';

export default class UserStore {
    user = null;
    users = null;
    picture = null;

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            fetchUserInfo: action,
            loadUsers: action,
            getMyPicture: action,
        })
    }

    async fetchUserInfo(userID) {
        const userInfo = await getUser(userID);
        this.user = userInfo;
    }

    async loadUsers() {
        this.users = await getUsers();
    }

    async getMyPicture() {
      const myPicture = await getPictureByEntityId();
      this.picture = myPicture;
    }
}
