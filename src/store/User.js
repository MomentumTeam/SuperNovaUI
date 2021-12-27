import { action, makeAutoObservable, observable } from 'mobx';
import { getPictureByConnectedEntity, getUser } from "../service/UserService";
import { getMyNotifications, markAsRead } from '../service/NotificationService';
import { Base64 } from 'js-base64';
import { tokenName } from '../constants/api';
import cookies from 'js-cookie';

export default class UserStore {
  user = null;
  users = null;
  userNotifications = [];
  userUnreadNotifications = [];

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      userUnreadNotifications: observable,
      fetchUserInfo: action,
      fetchUserNotifications: action,
      getMyPicture: action,
    });

    this.getUserToken();
  }

  async getUserToken() {
    const shragaUser = this.parseToken();
    this.user = shragaUser;
    this.getMyPicture();
  }

  async fetchUserInfo() {
    const kartoffelUser = await getUser();
    if (kartoffelUser.displayName === "") kartoffelUser.displayName = kartoffelUser.fullName;
    this.user = { ...this.user, ...kartoffelUser };
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

  async getMyPicture() {
    const myPicture = await getPictureByConnectedEntity();
    this.user = {...this.user, picture: myPicture.image};
  }
}
