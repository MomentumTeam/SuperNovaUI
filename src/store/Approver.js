import { action, makeAutoObservable, observable } from 'mobx';
import {
  getAllApproversReq,
  getUserTypeReq,
  searchApproverByDisplayNameReq,
  searchApproverByDomainUserReq,
  updateCommanderDecisionReq,
  updateSecurityDecisionReq,
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
      updateCommanderDecision: action,
      updateSecurityDecision: action,
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

  async updateCommanderDecision(requestId) {
    const res = await updateCommanderDecisionReq(requestId);
  }

  async updateSecurityDecisionReq(requestId) {
    const res = await updateSecurityDecisionReq(requestId);
  }
}
