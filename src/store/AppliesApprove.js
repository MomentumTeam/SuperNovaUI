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
import { isApproverAndCanEdit } from '../utils/applies';

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

  async removeApproverFromApprovers({ user, reqId, approverId, approversType}) {
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
      removeApply: true,
    });
  }

  // UTILS
  updateApplyAndCount = ({ user, reqId, apply, removeApply = false }) => {
    const myApplyIndex = this.getApplyIndexById("approveMyApplies", reqId);
    const allApplyIndex = this.getApplyIndexById("approveAllApplies", reqId);

    const myApplyResponsibleBefore =
      myApplyIndex != -1 ? isApproverAndCanEdit(this.approveMyApplies.requests[myApplyIndex], user) : false;

    const allApplyResponsibleBefore =
      allApplyIndex != -1 ? isApproverAndCanEdit(this.approveAllApplies.requests[allApplyIndex], user) : false;

    if (myApplyIndex != -1) this.updateApply("approveMyApplies", myApplyIndex, apply);
    if (allApplyIndex != -1) this.updateApply("approveAllApplies", allApplyIndex, apply);

    const responsibleAfter = !checkIfRequestIsDone(apply) && isApproverAndCanEdit(apply, user);
    if (!responsibleAfter && myApplyResponsibleBefore && removeApply) {
      this.approveMyApplies.requests.splice(myApplyIndex, 1);
      this.approveMyApplies.waitingForApproveCount = this.approveMyApplies.waitingForApproveCount - 1;
      this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
    }
    if (!responsibleAfter && allApplyResponsibleBefore && removeApply) {
      this.approveAllApplies.waitingForApproveCount = this.approveAllApplies.waitingForApproveCount - 1;
      this.approveAllAppliesCount = this.approveAllAppliesCount - 1;
    }
    if (responsibleAfter && !myApplyResponsibleBefore) {
      this.approveMyApplies.requests.unshift(apply);
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

  addApply = (apply) => {
    apply.newApply = true;
    // this.approveAllApplies.requests? this.approveAllApplies.requests = [apply, ...this.approveAllApplies.requests];
    this.approveMyApplies.requests = [apply, ...this.approveMyApplies.requests];

    // TODO: update apply and count
  }
}
