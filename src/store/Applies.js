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
  changeRoleHierarchyBulkRequest,
  createRoleBulkRequest
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
    this.myApplies.unshift(newRoleApply);
  }

  async createOGApply(applyProperties) {
    const newOGApply = await createOGRequest(applyProperties);
    this.myApplies.unshift(newOGApply);
  }

  async assignRoleToEntityApply(applyProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(
      applyProperties
    );
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
    const newDisconectRoleFromEntityApply =
      await disconectRoleFromEntityRequest(applyProperties);
    this.myApplies.unshift(newDisconectRoleFromEntityApply);
  }


  async createRoleBulk(applyProperties) {
    const createRoleBulkApply =
      await createRoleBulkRequest(applyProperties);
    this.myApplies.unshift(createRoleBulkApply);
  }


  // PUT
  async changeRoleHierarchy(applyProperties) {
    const changeRoleHierarchyApply =
      await changeRoleHierarchyRequest(applyProperties);
    this.myApplies.unshift(changeRoleHierarchyApply);
  }

  async changeRoleHierarchyBulk(applyProperties) {
    const changeRoleHierarchyBulkApply =
      await changeRoleHierarchyBulkRequest(applyProperties);
    this.myApplies.unshift(changeRoleHierarchyBulkApply);
  }

  async updateApplyDecision(applyProperties) {
    const updatedRequest = await updateApproverDecision(applyProperties);
    //TODO- update Decision in state
  }
}
