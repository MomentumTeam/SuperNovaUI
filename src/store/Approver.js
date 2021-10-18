import { action, makeAutoObservable, observable } from 'mobx';
import {
  getAllApproversReq,
  getUserTypeReq,
  searchApproverByDisplayNameReq,
  searchApproverByDomainUserReq,
  updateDecisionReq,
} from '../service/ApproverService';

export default class ApproverStore {
  //   toApprove = [];

  constructor() {
    makeAutoObservable(this, {
      // toApprove: observable,
      getUserType: action,
      getAllApprovers: action,
      searchApproverByDisplayName: action,
      searchApproverByDomainUser: action,
      updateDecision: action,
    });
  }

  async getUserType(entityId) {
    const userType = await getUserTypeReq(entityId);
    return userType;
  }

  async searchApproverByDisplayName(displayName, from, to) {
    const approvers = await searchApproverByDisplayNameReq(
      displayName,
      from,
      to
    );
    return approvers;
  }

  async searchApproverByDomainUser(domainUser, type) {
    const approvers = await searchApproverByDomainUserReq(domainUser, type);
    return approvers;
  }

  async getAllApprovers(type) {
    const approvers = await getAllApproversReq(type);
    return approvers;
  }

  async updateDecision(requestId) {
    const res = await updateDecisionReq(requestId);
  }
}
