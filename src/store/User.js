import { action, makeAutoObservable, observable } from 'mobx';
import { getUser, getUsers, getPictureByEntityId, getUserType } from '../service/UserService';
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
        });
    }

    async fetchUserInfo() {
        const userInfo = await getUser();
        this.user = userInfo;
    }

    async fetchUserNotifications() {
        const userNotifications = await getMyNotifications();
        this.userNotifications = userNotifications.notifications;
    }

    async loadUsers() {
        // this.users = await getUsers();
    }

    async getMyPicture() {
        const myPicture = await getPictureByEntityId();
        this.picture = myPicture;
    }
}
