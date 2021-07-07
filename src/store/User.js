import { action, makeAutoObservable, observable } from 'mobx';
import { getUsers } from '../service/UserService';

export default class UsersStore {
    users = [];

    constructor() {
        makeAutoObservable(this, {
            users: observable,
            loadUsers: action
        })
    }

    async loadUsers() {
        this.users = await getUsers();
    }
}