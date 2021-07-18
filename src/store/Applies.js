import { action, makeAutoObservable, observable } from 'mobx';
import {
  getMyApplies,
  createRoleRequest,
  createOGRequest,
  createEntityRequest,
  assignRoleToEntityRequest,
  editEntityRequest,
  disconectRoleFromEntityRequest,
  deleteRoleRequest,
  deleteOGRequest,
  renameOGRequest,
  renameRoleRequest
} from '../service/AppliesService';

export default class AppliesStore {
  applies = [];

  constructor() {
    makeAutoObservable(this, {
      applies: observable,
      loadApplies: action,
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
    });
  }

  async loadApplies() {
    const myApplies = await getMyApplies();
    this.applies = myApplies.requests;
  }

  async createRoleApply(requestProperties) {
    const newRoleApply = await createRoleRequest(requestProperties);
    this.applies.push(newRoleApply);
  }

  async createOGApply(requestProperties) {
    const newOGApply = await createOGRequest(requestProperties);
    this.applies.push(newOGApply);
  }

  async createEntityApply(requestProperties) {
    const newEntityApply = await createEntityRequest(requestProperties);
    this.applies.push(newEntityApply);
  }

  async assignRoleToEntityApply(requestProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(
      requestProperties
    );
    this.applies.push(newAssignRoleToEntityApply);
  }

  async editEntityApply(requestProperties) {
    const newEditEntityApply = await editEntityRequest(requestProperties);
    this.applies.push(newEditEntityApply);
  }

  async disconectRoleFromEntityApply(requestProperties) {
    const newDisconectRoleFromEntityApply =
      await disconectRoleFromEntityRequest(requestProperties);
    this.applies.push(newDisconectRoleFromEntityApply);
  }

  async deleteRoleApply(requestProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(requestProperties);
    this.applies.push(newDeleteRoleApply);
  }

  async deleteOGApply(requestProperties) {
    const newDeleteOGApply = await deleteOGRequest(requestProperties);
    this.applies.push(newDeleteOGApply);
  }

  async renameOGApply(requestProperties) {
    const newRenameOGApply = await renameOGRequest(requestProperties);
    this.applies.push(newRenameOGApply);
  }

  async renameRoleApply(requestProperties) {
    const newRenameRoleApply = await renameRoleRequest(requestProperties);
    this.applies.push(newRenameRoleApply);
  }


  

}
