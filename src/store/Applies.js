import { action, makeAutoObservable, observable } from 'mobx';
import { getMyApplies } from '../service/AppliesService';

export default class AppliesStore {
  applies = [];

  constructor() {
    makeAutoObservable(this, {
      applies: observable,
      loadApplies: action,
    });
  }

  async loadApplies() {
    const newApplies = await getMyApplies();
    this.applies = newApplies.requests;
  }
}
