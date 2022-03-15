import { action, makeAutoObservable, observable } from "mobx";
import { AUTOCOMPLETE_STATUSES, TYPES } from "../constants";
import {
  getMyRequests,
  getMyRequestsByType,
  getMyRequestsByStatus,
  getMyRequestsBySerialNumber,
  getMyRequestsBySearch,
} from "../service/AppliesService";

export default class AppliesMyStore {
  myRequests = [];
  totalCount = 0;

  constructor() {
    makeAutoObservable(this, {
      myRequests: observable,
      totalCount: observable,
      loadMyRequests: action,
      getMyRequestsByType: action,
      getMyRequestsBySearch: action,
      getMyRequestsByStatus: action,
    });
  }

  async loadMyRequests(from, to, append = false) {
    const myRequests = await getMyRequests(from, to, "CREATED_AT");
    this.myRequests = append ? [...this.myRequests, ...myRequests.requests] : myRequests.requests;
    this.totalCount = myRequests.totalCount;
  }

  async loadMyRequestsBySerialNumber(_from, _to, append = false, value) {
    let filteredResults;

    if (!value?.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsBySerialNumber(value);
      this.myRequests = append ? [...this.myRequests, ...filteredResults] : filteredResults;
    }
  }

  async loadMyRequestsByType(from, to, append = false, value) {
    let filteredResults;
    let type = Object.entries(TYPES).filter(([_, text]) => text === value)[0];

    if (!Array.isArray(type)) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsByType(from, to, type[0]);
      this.myRequests = append ? [...this.myRequests, ...filteredResults] : filteredResults;
    }
  }

  async loadMyRequestsBySearch(from, to, append = false, value) {
    let filteredResults;

    if (!value?.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsBySearch(from, to, value);
      this.myRequests = append ? [...this.myRequests, ...filteredResults] : filteredResults;
    }
  }

  async loadMyRequestsByStatus(from, to, append = false, value) {
    let filteredResults;
    let status = Object.entries(AUTOCOMPLETE_STATUSES).filter(([_, text]) => text === value)[0];

    if (!Array.isArray(status)) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsByStatus(from, to, status[0]);
      this.myRequests = append ? [...this.myRequests, ...filteredResults] : filteredResults;
    }
  }

  // UTILS
  checkIfApplyExist = (id) => {
    if (Array.isArray(this.myRequests)) {
      const reqIndex = this.myRequests.findIndex((apply) => apply.id === id);
      return reqIndex;
    }

    return -1;
  };

  updateApply = (apply) => {
    // Requests that the user created
    const isApplyExists = this.checkIfApplyExist(apply.id);
    if (isApplyExists != -1) this.myRequests[isApplyExists] = apply;
  };

  removeApply = (apply) => {
    const isApplyExists = this.checkIfApplyExist(apply.id);
    if (isApplyExists != -1) this.myRequests.splice(isApplyExists, 1);

  }
}
