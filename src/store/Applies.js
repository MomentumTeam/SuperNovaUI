import { action, makeAutoObservable, observable } from 'mobx';
import { getUserApplies, createRoleRequest } from '../service/AppliesService';

export default class AppliesStore {
  applies = [];

  constructor() {
    makeAutoObservable(this, {
      applies: observable,
      loadApplies: action,
      createRoleApply: action,
    });
  }

  async loadApplies(userId) {
    const newApplies = await getUserApplies(userId);
    this.applies = newApplies.requests;
  }

  async createRoleApply(requestProperties) {
    const newRoleRequest = await createRoleRequest(requestProperties);
    this.applies.push(newRoleRequest);
  }
}
