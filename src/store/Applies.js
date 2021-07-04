import { action, makeAutoObservable, observable } from 'mobx';
import { getUserApplies } from '../service/AppliesService';

export default class AppliesStore {
    applies = [];

    constructor() {
        makeAutoObservable(this, {
            applies: observable,
            loadApplies: action
        })
    }

    async loadApplies(userId) {
        const newApplies = await getUserApplies(userId);
        this.applies = newApplies.requests;
    }
}