import { action, makeAutoObservable, observable } from "mobx";
import {
  getMyRequests,
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
  convertEntityTypeRequest,
} from '../service/AppliesService';


export default class AppliesStore {
  myApplies = [];

  constructor() {
    makeAutoObservable(this, {
      myApplies: observable,
      loadMyApplies: action,
      removeApplyById: action,
      createRoleApply: action,
      createOGApply: action,
      assignRoleToEntityApply: action,
      createNewApproverApply: action,
      createEntityApply: action,
      renameOGApply: action,
      renameRoleApply: action,
      editEntityApply: action,
      convertEntityTypeApply: action,
      deleteRoleApply: action,
      deleteOGApply: action,
      disconectRoleFromEntityApply: action,
      createRoleBulk: action,
      changeRoleHierarchy: action,
      changeRoleHierarchyBulk: action,
    });

    this.loadMyApplies(1, 20);
  }

  // GET
  async loadMyApplies(from, to) {
    // Requests that the user created
    const myApplies = await getMyRequests(from, to);
    this.myApplies = myApplies.requests;
  }

  async removeApplyById(id) {
    this.myApplies = this.myApplies.filter((apply) => apply.id !== id);
  }

  // POST
  async createRoleApply(applyProperties) {
    const newRoleApply = await createRoleRequest(applyProperties);
    this.updateApply(newRoleApply);
  }

  async createOGApply(applyProperties) {
    const newOGApply = await createOGRequest(applyProperties);
    this.updateApply(newOGApply);
  }

  async assignRoleToEntityApply(applyProperties) {
    const newAssignRoleToEntityApply = await assignRoleToEntityRequest(applyProperties);
    this.updateApply(newAssignRoleToEntityApply);
  }

  async createNewApproverApply(applyProperties) {
    const newApproverApply = await createNewApproverRequest(applyProperties);
    this.updateApply(newApproverApply);
  }

  async createEntityApply(applyProperties) {
    const newEntityApply = await createEntityRequest(applyProperties);
    this.updateApply(newEntityApply);
  }

  async renameOGApply(applyProperties) {
    const newRenameOGApply = await renameOGRequest(applyProperties);
    this.updateApply(newRenameOGApply);
  }

  async renameRoleApply(applyProperties) {
    const newRenameRoleApply = await renameRoleRequest(applyProperties);
    this.updateApply(newRenameRoleApply);
  }

  async editEntityApply(applyProperties) {
    const newEditEntityApply = await editEntityRequest(applyProperties);
    this.updateApply(newEditEntityApply);
  }

  async convertEntityTypeApply(applyProperties) {
    const newConvertEntityTypeApply = await convertEntityTypeRequest(
      applyProperties
    );
    this.myApplies.unshift(newConvertEntityTypeApply);
  }

  async deleteRoleApply(applyProperties) {
    const newDeleteRoleApply = await deleteRoleRequest(applyProperties);
    this.updateApply(newDeleteRoleApply);
  }

  async deleteOGApply(applyProperties) {
    const newDeleteOGApplyApply = await deleteOGRequest(applyProperties);
    this.updateApply(newDeleteOGApplyApply);
  }

  async disconectRoleFromEntityApply(applyProperties) {
    const newDisconectRoleFromEntityApply = await disconectRoleFromEntityRequest(applyProperties);
    this.updateApply(newDisconectRoleFromEntityApply);
  }

  async createRoleBulk(applyProperties) {
    const createRoleBulkApply = await createRoleBulkRequest(applyProperties);
    this.updateApply(createRoleBulkApply);
  }

  // PUT
  async changeRoleHierarchy(applyProperties) {
    const changeRoleHierarchyApply = await changeRoleHierarchyRequest(applyProperties);
    this.updateApply(changeRoleHierarchyApply);
  }

  async changeRoleHierarchyBulk(applyProperties) {
    const changeRoleHierarchyBulkApply = await changeRoleHierarchyBulkRequest(applyProperties);
    this.updateApply(changeRoleHierarchyBulkApply);
  }

  // UTILS
  checkIfApplyExist = (id) => {
    if (Array.isArray(this.myApplies)) {
      const reqIndex = this.myApplies.findIndex((apply) => apply.id === id);
      return reqIndex;
    }
    return -1;
  }

  updateApply = (apply) => {
    // Requests that the user created
    const isApplyExists = this.checkIfApplyExist(apply.id);
    if (isApplyExists !== -1) this.myApplies.splice(isApplyExists, 1);
    this.myApplies.unshift(apply);
  }
}
