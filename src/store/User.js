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
    userUnreadNotifications = [];

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            userUnreadNotifications: observable,
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
        const userUnreadNotifications = await getMyNotifications(false);
        this.userUnreadNotifications.replace(userUnreadNotifications.notifications);
    }

    async markNotificationsAsRead(ids) {
        await markAsRead(ids);
        this.userUnreadNotifications.clear();
    }

    async loadUsers() {
        // this.users = await getUsers();
    }

    async getMyPicture() {
        const myPicture = await getPictureByEntityId();
        this.userPicture = myPicture.image;
    }
}
