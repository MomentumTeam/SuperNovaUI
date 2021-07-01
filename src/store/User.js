import { action, makeAutoObservable, observable } from 'mobx';
import { getUser } from '../service/UserService';

export default class UserStore {
    user = {};

    constructor() {
        makeAutoObservable(this, {
            user: observable,
            setUser: action
        })
    }

    async setUser(userID) {
        console.log('setUserrrrrrrrrrrrrrrrrrrrr')
        this.user = await getUser(userID);
    }
}