import { action, makeAutoObservable, observable } from 'mobx';
import { getPictureByEntityId } from '../service/UserService';
import { getMyNotifications, markAsRead } from '../service/NotificationService';
import { Base64 } from 'js-base64';
import { tokenName } from '../constants/api';
import cookies from 'js-cookie';

export default class UserStore {
    user = null;
    users = null;
    userPicture = null;
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

    setUserInfo() {
        const user = this.parseToken();
        this.user = user;

        this.getMyPicture();
    }

    parseToken() {
         try {
             const token = cookies.get(tokenName);
             const parts = token.split('.');
             if (parts.length !== 3) {
                console.error('token malford');
             }

             let user = JSON.parse(Base64.decode(parts[1]));
             return user;
         } catch (err) {
            console.log(err);
         }
    }


    async fetchUserNotifications() {
        const userNotifications = await getMyNotifications();
        this.userNotifications = userNotifications.notifications;
    }

    async markNotificationsAsRead(ids) {
        if(await markAsRead(ids).success) {
            const userNotifications = await getMyNotifications();
            this.userNotifications = userNotifications.filter((notification) => !ids.includes(notification.id));
        }
    }

    async loadUsers() {
        // this.users = await getUsers();
    }

    async getMyPicture() {
        const myPicture = await getPictureByEntityId();
        this.userPicture = myPicture.image;
    }
}
