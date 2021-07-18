import { action, makeAutoObservable, observable } from 'mobx';
import { getUser, getPictureByEntityId } from '../service/UserService';

export default class UserStore {
  user = null;
  picture = null;

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      fetchUserInfo: action,
      getMyPicture: action,
    });
  }

  async fetchUserInfo(userID) {
    const userInfo = await getUser(userID);
    this.user = userInfo;
  }

  async getMyPicture() {
    const myPicture = await getPictureByEntityId();
    this.picture = myPicture;
  }
}
