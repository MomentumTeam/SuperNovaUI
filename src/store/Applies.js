import { action, makeAutoObservable, observable } from "mobx";
import {
  getMyRequests,
  getRequestById,
  getRequestsByPerson,
  getRequestBySerialNumber,
  getMyApproveRequests,
  getAllApproveRequests,
  searchRequestsBySubmitterDisplayName,
  createRoleRequest,
  assignRoleToEntityRequest,
  createOGRequest,
  createNewApproverRequest,
  createEntityRequest,
  renameOGRequest,
  renameRoleRequest,
  editEntityRequest,
  deleteRoleRequest,
  deleteOGRequest,
  disconectRoleFromEntityRequest,
  changeRoleHierarchyRequest,
  changeRoleHierarchyBulkRequest,
  createRoleBulkRequest,
  transferApproverRequest,
} from "../service/AppliesService";
import { updateDecisionReq } from '../service/ApproverService';
import { isApproverAndCanEdit } from "../utils/applies";

export default class AppliesStore {
  myApplies = [];
  approveMyApplies = [];
  approveMyAppliesCount = 0;
  approveAllApplies = [];
  approveAllAppliesCount = 0;

  constructor() {
    makeAutoObservable(this, {
      myApplies: observable,
      approveMyApplies: observable,
      approveMyAppliesCount: observable,
      approveAllApplies: observable,
      approveAllAppliesCount: observable,
      loadMyApplies: action,
      getAllApplies: action,
      getAppliesByPerosn: action,
      getApplyById: action,
      getApplyBySerialNumber: action,
      searchAppliesBySubmitterDisplayName: action,
      createRoleApply: action,
      createOGApply: action,
      assignRoleToEntityApply: action,
      createNewApproverApply: action,
      createEntityApply: action,
      renameOGApply: action,
      renameRoleApply: action,
      editEntityApply: action,
      deleteRoleApply: action,
      deleteOGApply: action,
      disconectRoleFromEntityApply: action,
      transferApprovers: action,
    });

    this.loadMyApplies(1, 20);
  }

  // GET

  async loadMyApplies(from, to) {
    // Requests that the user created
    const myApplies = await getMyRequests(from, to);
    this.myApplies = myApplies.requests;
  }

  async getApplyById(id) {
    const myApplies = await getRequestById(id);
    // this.applies = myApplies.requests;
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

  async getAppliesByPerosn(id, personType, personInfoType, from, to) {
    const myApplies = await getRequestsByPerson(id, personType, personInfoType, from, to);

    // this.applies = myApplies.requests;
  }

  async getApplyBySerialNumber(serialNumber) {
    const myApplies = await getRequestBySerialNumber(serialNumber);
    // this.applies = myApplies.requests;
  }

  async searchAppliesBySubmitterDisplayName(displayName, from, to) {
    const myApplies = await searchRequestsBySubmitterDisplayName(displayName, from, to);
    // this.applies = myApplies.requests;
  }

  // POST

  async createRoleApply(applyProperties) {
    const newRoleApply = await createRoleRequest(applyProperties);
    this.myApplies.unshift(newRoleApply);
  }

  async createOGApply(applyProperties) {
    const newOGApply = await createOGRequest(applyProperties);
    this.myApplies.unshift(newOGApply);
  }

  async assignRoleToEntityApply(applyProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(applyProperties);
    this.myApplies.unshift(newAssignRoleToEntityApply);
  }

  async createNewApproverApply(applyProperties) {
    const newApproverApply = await createNewApproverRequest(applyProperties);
    this.myApplies.unshift(newApproverApply);
  }

  async createEntityApply(applyProperties) {
    const newEntityApply = await createEntityRequest(applyProperties);
    this.myApplies.unshift(newEntityApply);
  }

  async renameOGApply(applyProperties) {
    console.log("applyProperties", applyProperties);
    const newRenameOGApply = await renameOGRequest(applyProperties);
    this.myApplies.unshift(newRenameOGApply);
  }

  async renameRoleApply(applyProperties) {
    const newRenameRoleApply = await renameRoleRequest(applyProperties);
    this.myApplies.unshift(newRenameRoleApply);
  }

  async editEntityApply(applyProperties) {
    const newEditEntityApply = await editEntityRequest(applyProperties);
    this.myApplies.unshift(newEditEntityApply);
  }

  async deleteRoleApply(applyProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(applyProperties);
    this.myApplies.unshift(newDeleteRoleApply);
  }

  async deleteOGApply(applyProperties) {
    const newDeleteOGApplyApply = await deleteOGRequest(applyProperties);
    this.myApplies.unshift(newDeleteOGApplyApply);
  }

  async disconectRoleFromEntityApply(applyProperties) {
    const newDisconectRoleFromEntityApply = await disconectRoleFromEntityRequest(applyProperties);
    this.myApplies.unshift(newDisconectRoleFromEntityApply);
  }

  async createRoleBulk(applyProperties) {
    const createRoleBulkApply = await createRoleBulkRequest(applyProperties);
    this.myApplies.unshift(createRoleBulkApply);
  }

  // PUT
  async changeRoleHierarchy(applyProperties) {
    const changeRoleHierarchyApply = await changeRoleHierarchyRequest(applyProperties);
    this.myApplies.unshift(changeRoleHierarchyApply);
  }

  async changeRoleHierarchyBulk(applyProperties) {
    const changeRoleHierarchyBulkApply = await changeRoleHierarchyBulkRequest(applyProperties);
    this.myApplies.unshift(changeRoleHierarchyBulkApply);
  }

  async transferApprovers({ user, reqId, approvers, approversType, comment }) {
    const apply = await transferApproverRequest({ reqId, approvers, approversType, comment });

    this.updateApplyAndCount({ user, reqId, apply, removeApply:true });
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
  updateApplyAndCount = ({
    user,
    reqId,
    apply,
    removeApply = false
  }) => {
    const myApplyIndex = this.getApplyIndexById("approveMyApplies", reqId);
    const allApplyIndex = this.getApplyIndexById("approveAllApplies", reqId);

    const myApplyResponsibleBefore =
      myApplyIndex != -1 ? isApproverAndCanEdit(this.approveMyApplies.requests[myApplyIndex], user) : false;

    if (myApplyIndex != -1) this.updateApply("approveMyApplies", myApplyIndex, apply);
    if (allApplyIndex != -1) this.updateApply("approveAllApplies", allApplyIndex, apply);

    const responsibleAfter = isApproverAndCanEdit(apply, user);
    if (!responsibleAfter && myApplyResponsibleBefore && removeApply) {
      this.approveMyApplies.requests.splice(myApplyIndex, 1);
      this.approveMyApplies.waitingForApproveCount = this.approveMyApplies.waitingForApproveCount - 1;
      this.approveMyAppliesCount = this.approveMyAppliesCount - 1;
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
