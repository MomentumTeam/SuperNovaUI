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

    async loadApplies() {
        const newApplies = await getUserApplies();
        this.applies = newApplies.requests;
    }
}