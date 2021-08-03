import { action, makeAutoObservable, observable } from 'mobx';
import {
  getMyApplies,
  getAllRequests,
  createRoleRequest,
  createOGRequest,
  createEntityRequest,
  assignRoleToEntityRequest,
  editEntityRequest,
  disconectRoleFromEntityRequest,
  deleteRoleRequest,
  deleteOGRequest,
  renameOGRequest,
  renameRoleRequest,
  deleteRoleRequest,
  deleteOGRequest,
} from '../service/AppliesService';

export default class AppliesStore {
  applies = [];

  constructor() {
    makeAutoObservable(this, {
      applies: observable,
      loadApplies: action,
      getAllApplies: action,
      createRoleApply: action,
      createOGApply: action,
      createEntityApply: action,
      assignRoleToEntityApply: action,
      editEntityApply: action,
      disconectRoleFromEntityApply: action,
      deleteRoleApply: action,
      deleteOGApply: action,
      renameOGApply: action,
      renameRoleApply: action,
      deleteRoleApply: action,
      deleteOGApply: action,
    });
  }

  async loadApplies() {
    const myApplies = await getMyApplies();
    this.applies = myApplies.requests;
  }

  async getAllApplies(from, to) {
    //only approvers can get all.
    const myApplies = await getAllRequests(from, to);
    this.applies = myApplies.requests;
  }

  async createRoleApply(applyProperties) {
    const newRoleApply = await createRoleRequest(applyProperties);
    this.applies.push(newRoleApply);
  }

  async createOGApply(applyProperties) {
    const newOGApply = await createOGRequest(applyProperties);
    this.applies.push(newOGApply);
  }

  async createEntityApply(applyProperties) {
    const newEntityApply = await createEntityRequest(applyProperties);
    this.applies.push(newEntityApply);
  }

  async assignRoleToEntityApply(applyProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(
      applyProperties
    );
    this.applies.push(newAssignRoleToEntityApply);
  }

  async editEntityApply(applyProperties) {
    const newEditEntityApply = await editEntityRequest(applyProperties);
    this.applies.push(newEditEntityApply);
  }

  async disconectRoleFromEntityApply(applyProperties) {
    const newDisconectRoleFromEntityApply =
      await disconectRoleFromEntityRequest(applyProperties);
    this.applies.push(newDisconectRoleFromEntityApply);
  }

  async deleteRoleApply(applyProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(applyProperties);
    this.applies.push(newDeleteRoleApply);
  }

  async deleteOGApply(applyProperties) {
    const newDeleteOGApply = await deleteOGRequest(applyProperties);
    this.applies.push(newDeleteOGApply);
  }

  async renameOGApply(applyProperties) {
    const newRenameOGApply = await renameOGRequest(applyProperties);
    this.applies.push(newRenameOGApply);
  }

  async renameRoleApply(applyProperties) {
    const newRenameRoleApply = await renameRoleRequest(applyProperties);
    this.applies.push(newRenameRoleApply);
  }

  async deleteRoleApply(applyProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(applyProperties);
    this.applies.push(newDeleteRoleApply);
  }

  async deleteOGApply(applyProperties) {
    const newDeleteOGApplyApply = await deleteOGRequest(applyProperties);
    this.applies.push(newDeleteOGApplyApply);
  }
}
