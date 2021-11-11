import { action, makeAutoObservable, observable } from 'mobx';
import { updateDecisionReq } from "../service/ApproverService";
import { canEditApply } from "../utils/applies";
import { getMyApproveRequests, getAllApproveRequests, transferApproverRequest } from "../service/AppliesService";

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
      transferApprovers:action,
    });
  }

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
    const myApplies = await getMyApproveRequests({ from, to, searchQuery, status, type, sortField, sortOrder });

    if (saveToStore) {
      if (append) {
        this.approveMyApplies.requests = [...this.approveMyApplies.requests, ...myApplies.requests];
      } else {
        this.approveMyApplies = myApplies;
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
    const allApplies = await getAllApproveRequests({ from, to, searchQuery, status, type, sortField, sortOrder });

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

  async transferApprovers({ user, reqId, approvers, approversType, comment }) {
    const apply = await transferApproverRequest({ reqId, approvers, approversType, comment });

    this.updateApplyAndCount({ user, reqId, apply, removeApply: true });
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
  updateApplyAndCount = ({ user, reqId, apply, removeApply = false }) => {
    const myApplyIndex = this.getApplyIndexById("approveMyApplies", reqId);
    const allApplyIndex = this.getApplyIndexById("approveAllApplies", reqId);

    const myApplyResponsibleBefore =
      myApplyIndex != -1 ? canEditApply(this.approveMyApplies.requests[myApplyIndex], user) : false;

    if (myApplyIndex != -1) this.updateApply("approveMyApplies", myApplyIndex, apply);
    if (allApplyIndex != -1) this.updateApply("approveAllApplies", allApplyIndex, apply);

    const responsibleAfter = canEditApply(apply, user);

    if (!responsibleAfter && myApplyResponsibleBefore) {
      if (removeApply) {
        this.approveMyApplies.requests.splice(myApplyIndex, 1);
        this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
      }

      this.approveMyApplies.waitingForApproveCount = this.approveMyApplies.waitingForApproveCount - 1;
    }
    if (responsibleAfter && !myApplyResponsibleBefore) {
      this.approveMyApplies.requests.push(apply);
      this.approveMyAppliesCount = this.approveMyAppliesCount + 1;
      this.approveMyApplies.waitingForApproveCount = this.approveMyApplies.waitingForApproveCount + 1;
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
}

