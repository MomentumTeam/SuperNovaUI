import { action, makeAutoObservable, observable } from 'mobx';
import { APPROVER_TRANSFER_TYPE, checkIfRequestIsDone } from '../constants';
import {
  getMyApproveRequests,
  getAllApproveRequests,
  transferApproverRequest,
  updateApproversCommentsRequest,
  removeApproverFromApproversRequest,
} from '../service/AppliesService';
import { updateDecisionReq } from '../service/ApproverService';
import { isApproverAndCanEdit, isApprover, canEditApply } from "../utils/applies";
import { isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from '../utils/user';

export default class AppliesApproveStore {
  approveMyApplies = [];
  approveMyAppliesCount = 0;
  approveAllApplies = [];
  approveAllAppliesCount = 0;

  constructor() {
    makeAutoObservable(this, {
      approveMyApplies: observable,
      approveMyAppliesCount: observable,
      approveAllApplies: observable,
      approveAllAppliesCount: observable,
      getMyApproveRequests: action,
      getAllApproveRequests: action,
      transferApprovers: action,
      removeApproverFromApprovers: action,
      updateApproversComments: action,
      updateApplyDecision: action,
      updateApplyAndCount: action,
      getApplyIndexById: action,
      updateApply: action,
    });
  }

  // GET
  async getMyApproveRequests({
    from,
    to,
    searchQuery = null,
    status = null,
    type = null,
    sortField = null,
    sortOrder = null,
    append = false,
    saveToStore = true,
  }) {
    const myApplies = await getMyApproveRequests({
      from,
      to,
      searchQuery,
      status,
      type,
      sortField,
      sortOrder,
    });

    if (saveToStore) {
      if (append) {
        this.approveMyApplies.requests = [...this.approveMyApplies.requests, ...myApplies.requests];
      } else {
        let previousTotalCount = this.approveMyApplies.totalCount;
        this.approveMyApplies = myApplies;
        if (!(searchQuery === null && type === null && status === null)) this.approveMyApplies.totalCount = previousTotalCount;
      }
    }

    if (searchQuery === null && type === null && status === null) {
      this.approveMyAppliesCount = myApplies.waitingForApproveCount;
    }

    return myApplies;
  }

  async getAllApproveRequests({
    from,
    to,
    searchQuery = null,
    status = null,
    type = null,
    sortField = null,
    sortOrder = null,
    append = false,
    saveToStore = true,
  }) {
    const allApplies = await getAllApproveRequests({
      from,
      to,
      searchQuery,
      status,
      type,
      sortField,
      sortOrder,
    });

    if (saveToStore) {
      if (append) {
        this.approveAllApplies.requests = [...this.approveAllApplies.requests, ...allApplies.requests];
      } else {
        this.approveAllApplies = allApplies;
      }
    }

    if (searchQuery === null && type === null && status === null) {
      this.approveAllAppliesCount = allApplies.waitingForApproveCount;
    }

    return allApplies;
  }

  // PUT
  async transferApprovers({ user, reqId, approvers, approversType, comment, overrideApprovers = false }) {
    if (Array.isArray(approversType)) {
      await Promise.all(
        approversType.map(async (approverType) => {
          if (APPROVER_TRANSFER_TYPE.includes(approverType)) {
            const apply = await transferApproverRequest({
              reqId,
              approvers,
              type: approverType,
              comment,
              overrideApprovers,
            });
            this.updateApplyAndCount({ user, reqId, apply, removeApply: true });
          }
        })
      );
    } else {
      if (APPROVER_TRANSFER_TYPE.includes(approversType)) {
        const apply = await transferApproverRequest({
          reqId,
          approvers,
          type: approversType,
          comment,
          overrideApprovers,
        });
        this.updateApplyAndCount({ user, reqId, apply, removeApply: true });
      } else {
        throw new Error("לא ניתן להעביר לסוג משתמש זה");
      }
    }
  }

  async removeApproverFromApprovers({ user, reqId, approverId, approversType }) {
    if (Array.isArray(approversType)) {
      await Promise.all(
        approversType.map(async (approverType) => {
          if (APPROVER_TRANSFER_TYPE.includes(approverType)) {
            const apply = await removeApproverFromApproversRequest({
              reqId,
              approverId,
              type: approverType,
            });
            this.updateApplyAndCount({ user, reqId, apply, removeApply: true });
          }
        })
      );
    } else {
      if (APPROVER_TRANSFER_TYPE.includes(approversType)) {
        const apply = await removeApproverFromApproversRequest({
          reqId,
          approverId,
          type: approversType,
        });
        this.updateApplyAndCount({ user, reqId, apply, removeApply: true });
      } else {
        throw new Error("בעיה בהחזרה לסל");
      }
    }
  }

  async updateApproversComments({ requestId, approversType, comment }) {
    const updateReq = await updateApproversCommentsRequest({
      requestId,
      approversType,
      comment,
    });

    const myApplyIndex = this.getApplyIndexById("approveMyApplies", requestId);
    const allApplyIndex = this.getApplyIndexById("approveAllApplies", requestId);

    if (myApplyIndex != -1) this.updateApply("approveMyApplies", myApplyIndex, updateReq);
    if (allApplyIndex != -1) this.updateApply("approveAllApplies", allApplyIndex, updateReq);
  }

  async updateApplyDecision({ user, requestId, decision }) {
    const updatedRequest = await updateDecisionReq(requestId, decision);
    this.updateApplyAndCount({
      user,
      reqId: requestId,
      apply: updatedRequest,
    });
  }

  // UTILS
  updateApplyAndCount = ({ user, reqId, apply, removeApply = false, updateMyApply = true, updateAllApply = true }) => {
    const isReqDone = checkIfRequestIsDone(apply);
    const isApproverNewReq = isApprover(apply, user);
    const isCanEditNewReq = canEditApply(apply, user);

    if (updateMyApply) {
      const myApplyIndex = this.getApplyIndexById("approveMyApplies", reqId);

      // check if the user responsible
      const myApplyResponsibleBefore =
        myApplyIndex != -1 ? isApproverAndCanEdit(this.approveMyApplies.requests[myApplyIndex], user) : false;
      const responsibleAfter = !isReqDone && isApproverNewReq && isCanEditNewReq;

      // update request
      if (myApplyIndex != -1) this.updateApply("approveMyApplies", myApplyIndex, apply);

      if (!responsibleAfter && myApplyResponsibleBefore && removeApply) {
        this.approveMyApplies.requests.splice(myApplyIndex, 1);
        this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
      }
      if (responsibleAfter && !myApplyResponsibleBefore) {
        this.approveMyApplies.requests.unshift(apply);
        this.approveMyAppliesCount = this.approveMyAppliesCount + 1;
      }
    }

    if (updateAllApply) {
      const allApplyIndex = this.getApplyIndexById("approveAllApplies", reqId);

      // check if the user responsible
      const allApplyResponsibleBefore =
        allApplyIndex != -1 ? canEditApply(this.approveAllApplies.requests[allApplyIndex], user) : false;
      const responsibleAfter = !isReqDone && isCanEditNewReq;

      // update request
      if (allApplyIndex != -1) this.updateApply("approveAllApplies", allApplyIndex, apply);

      if (!responsibleAfter && allApplyResponsibleBefore)
        this.approveAllAppliesCount = this.approveAllAppliesCount - 1;
      if (responsibleAfter && !allApplyResponsibleBefore) this.approveAllAppliesCount = this.approveAllAppliesCount + 1;
    }
  };

  getApplyIndexById = (appliesArr, id) => {
    if (Array.isArray(this[appliesArr].requests)) {
      const reqIndex = this[appliesArr].requests.findIndex((apply) => apply.id === id);
      return reqIndex;
    }

    return -1;
  };

  updateApply = (appliesArr, reqIndex, updateReq) => {
    if (reqIndex != -1) this[appliesArr].requests[reqIndex] = updateReq;
  };

  addOrUpdateApplyMy = ({ user, apply }) => {
    if (isUserCanSeeMyApproveApplies(user) && this.approveMyApplies.requests) {
      const myApplyIndex = this.getApplyIndexById("approveMyApplies", apply.id);

      // Add request to approveMyApplies
      if (myApplyIndex === -1) {
        apply.newApply = true;

        // add to my applies
        this.approveMyApplies.requests.unshift(apply);
        this.approveMyApplies.totalCount = this.approveMyApplies.totalCount + 1;

        const responsibleAfter = !checkIfRequestIsDone(apply) && isApproverAndCanEdit(apply, user);
        if (responsibleAfter) this.approveMyAppliesCount = this.approveMyAppliesCount + 1;
      } else {
        this.updateApplyAndCount({ user, reqId: apply.id, apply, updateAllApply: false });
      }

      this.addOrUpdateApplyAll({ user, apply });
    }
  };

  addOrUpdateApplyAll = ({ user, apply }) => {
    if (isUserCanSeeAllApproveApplies(user) && this.approveAllApplies.requests) {
      const allApplyIndex = this.getApplyIndexById("approveAllApplies", apply.id);

      // Add request to approveAllApplies
      if (allApplyIndex === -1) {
        apply.newApply = true;

        // add to all applies
        this.approveAllApplies.requests.unshift(apply);

        const responsibleAfter = !checkIfRequestIsDone(apply) && canEditApply(apply, user);
        if (responsibleAfter) this.approveAllAppliesCount = this.approveAllAppliesCount + 1;
      } else {
        this.updateApplyAndCount({ user, reqId: apply.id, apply, updateMyApply: false });
      }
    }
  };
}
