import { action, makeAutoObservable, observable } from 'mobx';
import {
  addCommanderApproverReq,
  addSecurityApproverReq,
  addSuperSecurityApproverReq,
  getUserTypeReq,
  searchApproverByDisplayNameReq,
  searchApproverByDomainUserReq,
  getAllSecurityApproversReq,
  getAllSuperSecurityApproversReq,
  getAllCommanderApproversReq,
  updateCommanderDecisionReq,
  updateSecurityDecisionReq,
} from '../service/ApproverService';

export default class ApproverStore {
  //   toApprove = [];

  constructor() {
    makeAutoObservable(this, {
      // toApprove: observable,
      addCommanderApprover: action,
      addSecurityApprover: action,
      addSuperSecurityApprover: action,
      getUserType: action,
      searchApproverByDisplayName: action,
      searchApproverByDomainUser: action,
      getAllSecurityApprovers: action,
      getAllSuperSecurityApprovers: action,
      getAllCommanderApprovers: action,
      updateCommanderDecision: action,
      updateSecurityDecision: action,
    });
  }

  async addCommanderApprover(newApproverInfo) {
    const res = await addCommanderApproverReq(newApproverInfo);
  }

  async addSecurityApprover(newApproverInfo) {
    const res = await addSecurityApproverReq(newApproverInfo);
  }

  async addSuperSecurityApprover(newApproverInfo) {
    const res = await addSuperSecurityApproverReq(newApproverInfo);
  }

  async getUserType(id) {
    const userType = await getUserTypeReq(id);
    return userType;
  }

  async searchApproverByDisplayName(displayName, type, from, to) {
    const approvers = await searchApproverByDisplayNameReq(
      displayName,
      type,
      from,
      to
    );
    return approvers;
  }

  async searchApproverByDomainUser(domainUser, type) {
    const approvers = await searchApproverByDomainUserReq(domainUser, type);
    return approvers;
  }

  async getAllSecurityApprovers() {
    const securityApprovers = await getAllSecurityApproversReq();
    return securityApprovers;
  }

  async getAllSuperSecurityApprovers() {
    const superSecurityApprovers = await getAllSuperSecurityApproversReq();
    return superSecurityApprovers;
  }

  async getAllCommanderApprovers() {
    const commanderApprovers = await getAllCommanderApproversReq();
    return commanderApprovers;
  }

  async updateCommanderDecision(requestId) {
    const res = await updateCommanderDecisionReq(requestId);
  }

  async updateSecurityDecisionReq(requestId) {
    const res = await updateSecurityDecisionReq(requestId);
  }
}
