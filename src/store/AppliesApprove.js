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
import { isDirectApproverAndCanEdit, canEditApply, isSubmitter, isDirectApprover, isUndirectApprover } from "../utils/applies";
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
        if (!(searchQuery === null && type === null && status === null))
          this.approveMyApplies.totalCount = previousTotalCount;
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
            this.addOrUpdateApply({ user, apply });
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
        this.addOrUpdateApply({ user, apply });
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
            this.addOrUpdateApply({ user, apply });
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
        this.addOrUpdateApply({ user, apply });
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
    this.addOrUpdateApply({
      user,
      apply: updatedRequest,
      removeApply: false,
    });
  }

  // UTILS
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

  addOrUpdateApply = ({ user, apply, removeApply = true }) => {
    if (isUserCanSeeMyApproveApplies(user) && this.approveMyApplies.requests) {
      const myApplyIndex = this.getApplyIndexById("approveMyApplies", apply.id);
      const isApproverNewReq = isDirectApprover(apply, user);
      const isCanEditNewReq = canEditApply(apply, user);
      const isNotifyUpdate = !isSubmitter(apply, user) && isApproverNewReq && isCanEditNewReq;
      const isRequestDone = checkIfRequestIsDone(apply);
      const responsibleAfter = !isRequestDone && isApproverNewReq && isCanEditNewReq;

      // Add request to approveMyApplies
      if (myApplyIndex === -1) {
        if (isNotifyUpdate) apply.newApply = true;

        if (isApproverNewReq) {
          this.approveMyApplies.totalCount = this.approveMyApplies.totalCount + 1;
        }
        if (responsibleAfter) {
          this.approveMyApplies.requests.unshift(apply);
          this.approveMyAppliesCount = this.approveMyAppliesCount + 1;
        }
      } else {
        // Update request
        const myApplyResponsibleBefore =
          myApplyIndex != -1 ? isDirectApproverAndCanEdit(this.approveMyApplies.requests[myApplyIndex], user) : false;

        this.updateApply("approveMyApplies", myApplyIndex, apply);

        if (!responsibleAfter && myApplyResponsibleBefore && removeApply) {
          if (!isApproverNewReq) {
            this.approveMyApplies.requests.splice(myApplyIndex, 1);
            this.approveMyApplies.totalCount = this.approveMyApplies.totalCount - 1;
          }
          this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
        } else if (responsibleAfter && !myApplyResponsibleBefore) {
          this.approveMyApplies.requests.unshift(apply);
          this.approveMyAppliesCount = this.approveMyAppliesCount + 1;
        }
      }

      this.addOrUpdateApplyAll({ user, apply });
    }
  };

  addOrUpdateApplyAll = ({ user, apply }) => {
    if (isUserCanSeeAllApproveApplies(user) && this.approveAllApplies.requests) {
      const allApplyIndex = this.getApplyIndexById("approveAllApplies", apply.id);
      const isCanEdit = canEditApply(apply, user);
      const isNotifyUpdate = !isSubmitter(apply, user) && isCanEdit;
      const isReqDone = checkIfRequestIsDone(apply);
      const responsibleAfter = !isReqDone && isCanEdit;
      const isApproverNewReq = isUndirectApprover(apply, user);

      // Add request to approveAllApplies
      if (allApplyIndex === -1) {
        if (isNotifyUpdate) apply.newApply = true;

        // add to all applies
        if (isApproverNewReq && !responsibleAfter) this.approveAllAppliesCount = this.approveAllAppliesCount - 1;
        if (responsibleAfter) {
          this.approveAllApplies.requests.unshift(apply);
          this.approveAllAppliesCount = this.approveAllAppliesCount + 1
        }
      } else {
        // update request
        const allApplyResponsibleBefore =
          allApplyIndex != -1 ? canEditApply(this.approveAllApplies.requests[allApplyIndex], user) : false;

        this.updateApply("approveAllApplies", allApplyIndex, apply);

        if (!responsibleAfter && allApplyResponsibleBefore) {
          this.approveAllAppliesCount = this.approveAllAppliesCount - 1;
          if (!isApproverNewReq) this.approveAllApplies.requests.splice(allApplyIndex, 1); 
        } else if (responsibleAfter && !allApplyResponsibleBefore) {
          this.approveAllAppliesCount = this.approveAllAppliesCount + 1;
        }
      }
    }
  };

  removeApply = (apply, user) => {
    const allApplyIndex = this.getApplyIndexById("approveAllApplies", apply.id);
    const myApplyIndex = this.getApplyIndexById("approveMyApplies", apply.id);
    
    if (myApplyIndex != -1) {
      const isApproverAndEdit = isDirectApproverAndCanEdit(apply, user);
      this.approveMyApplies.requests.splice(myApplyIndex, 1);
      if (isApproverAndEdit) this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
      this.approveMyApplies.totalCount = this.approveMyApplies.totalCount - 1;
    }

    if (allApplyIndex != -1) {
      this.approveAllAppliesCount = this.approveAllAppliesCount - 1;
      this.approveAllApplies.requests.splice(allApplyIndex, 1);
    }
  };
}
