import { action, makeAutoObservable, observable } from 'mobx';
import { getUser, getUsers, getPictureByEntityId } from '../service/UserService';
import { getMyNotifications } from '../service/NotificationService';

export default class UserStore {
    user = null;
    users = null;
    picture = null;
    userNotifications = [];

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            userNotifications: observable,
            fetchUserInfo: action,
            fetchUserNotifications: action,
            loadUsers: action,
            getMyPicture: action,
        })
    }

    async fetchUserInfo(userID) {
        const userInfo = await getUser(userID);
        this.user = userInfo;
    }

    async fetchUserNotifications() {
        const userNotifications = await getMyNotifications();
        this.userNotifications = userNotifications.notifications;
    }

    async loadUsers() {
        this.users = await getUsers();
    }

    async getMyPicture() {
      const myPicture = await getPictureByEntityId();
      this.picture = myPicture;
    }
}
