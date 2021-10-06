import { action, makeAutoObservable, observable } from 'mobx';
import {
  getMyRequests,
  getRequestById,
  getAllRequests,
  getRequestsByPerson,
  getRequestBySerialNumber,
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
  updateApproverDecision,
  changeRoleHierarchyRequest,
  changeRoleHierarchyBulkRequest
} from '../service/AppliesService';

export default class AppliesStore {
  applies = [];
  myApplies = [];

  constructor() {
    makeAutoObservable(this, {
      myApplies: observable,
      applies: observable,
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
      updateApplyDecision: action,
    });
  }

  // GET

  async loadMyApplies(from, to) {
    const myApplies = await getMyRequests(1, 6);
    this.myApplies = myApplies.requests;
  }

  async getAllApplies(approvementStatus, from, to) {
    const myApplies = await getAllRequests(approvementStatus, from, to);
    // this.applies = myApplies.requests;
  }

  async getApplyById(id) {
    const myApplies = await getRequestById(id);
    // this.applies = myApplies.requests;
  }

  async getAppliesByPerosn(id, personType, personInfoType, from, to) {
    const myApplies = await getRequestsByPerson(
      id,
      personType,
      personInfoType,
      from,
      to
    );

    this.myApplies = myApplies.requests;
  }

  async getApplyBySerialNumber(serialNumber) {
    const myApplies = await getRequestBySerialNumber(serialNumber);
    // this.applies = myApplies.requests;
  }

  async searchAppliesBySubmitterDisplayName(displayName, from, to) {
    const myApplies = await searchRequestsBySubmitterDisplayName(
      displayName,
      from,
      to
    );
    // this.applies = myApplies.requests;
  }

  // POST

  async createRoleApply(applyProperties) {
    const newRoleApply = await createRoleRequest(applyProperties);
    this.applies.push(newRoleApply);
  }

  async createOGApply(applyProperties) {
    const newOGApply = await createOGRequest(applyProperties);
    this.applies.push(newOGApply);
  }

  async assignRoleToEntityApply(applyProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(
      applyProperties
    );
    this.applies.push(newAssignRoleToEntityApply);
  }

  async createNewApproverApply(applyProperties) {
    const newApproverApply = await createNewApproverRequest(applyProperties);
    this.applies.push(newApproverApply);
  }

  async createEntityApply(applyProperties) {
    const newEntityApply = await createEntityRequest(applyProperties);
    this.applies.push(newEntityApply);
  }

  async renameOGApply(applyProperties) {
    const newRenameOGApply = await renameOGRequest(applyProperties);
    this.applies.push(newRenameOGApply);
  }

  async renameRoleApply(applyProperties) {
    const newRenameRoleApply = await renameRoleRequest(applyProperties);
    this.applies.push(newRenameRoleApply);
  }

  async editEntityApply(applyProperties) {
    const newEditEntityApply = await editEntityRequest(applyProperties);
    this.applies.push(newEditEntityApply);
  }

  async deleteRoleApply(applyProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(applyProperties);
    this.applies.push(newDeleteRoleApply);
  }

  async deleteOGApply(applyProperties) {
    const newDeleteOGApplyApply = await deleteOGRequest(applyProperties);
    this.applies.push(newDeleteOGApplyApply);
  }

  async disconectRoleFromEntityApply(applyProperties) {
    const newDisconectRoleFromEntityApply =
      await disconectRoleFromEntityRequest(applyProperties);
    this.applies.push(newDisconectRoleFromEntityApply);
  }

  // PUT
  async changeRoleHierarchy(applyProperties) {
    const changeRoleHierarchyApply =
      await changeRoleHierarchyRequest(applyProperties);
    this.applies.push(changeRoleHierarchyApply);
  }

  async changeRoleHierarchyBulk(applyProperties) {
    const changeRoleHierarchyBulkApply =
      await changeRoleHierarchyBulkRequest(applyProperties);
    this.applies.push(changeRoleHierarchyBulkApply);
  }

  async updateApplyDecision(applyProperties) {
    const updatedRequest = await updateApproverDecision(applyProperties);
    //TODO- update Decision in state
  }
}
