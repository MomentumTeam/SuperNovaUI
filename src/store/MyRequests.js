import { action, makeAutoObservable, observable } from "mobx";
import { STATUSES, TYPES } from "../constants";
import {
  getFormattedMyRequests,
  getMyRequestsByType,
  getMyRequestsByStatus,
  getMyRequestsBySerialNumber,
  getMyRequestsBySearch,
} from "../service/AppliesService";

export default class MyRequestsStore {
  myRequests = [];
  isSearch = false;

  constructor() {
    makeAutoObservable(this, {
      myRequests: observable,

      loadMyRequests: action,

      getMyRequestsByType: action,
      getMyRequestsBySearch: action,
      getMyRequestsByStatus: action,
      setSearch: action,
    });
  }

  setSearch(isSearch) {
    this.isSearch = isSearch;
  }

  async loadMyRequests(from, to, append = false) {
    const myRequests = await getFormattedMyRequests(from, to);
    this.myRequests = append ? [...this.myRequests, ...myRequests] : myRequests;
  }

  async loadMyRequestsBySerialNumber(from, to, append = false, value) {
    let filteredResults;

    if (!value?.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsBySerialNumber(from, to, value);
      this.myRequests = append
        ? [...this.myRequests, ...filteredResults]
        : filteredResults;
    }
  }

  async loadMyRequestsByType(from, to, append = false, value) {
    let filteredResults;
    let type = Object.entries(TYPES).filter(([_, text]) => text === value)[0];

    if (!Array.isArray(type)) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsByType(from, to, type[0]);
      this.myRequests = append
        ? [...this.myRequests, ...filteredResults]
        : filteredResults;
    }
  }

  async loadMyRequestsBySearch(from, to, append = false, value) {
    let filteredResults;

    if (!value?.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsBySearch(from, to, value);
      this.myRequests = append
        ? [...this.myRequests, ...filteredResults]
        : filteredResults;
    }
  }

  async loadMyRequestsByStatus(from, to, append = false, value) {
    let filteredResults;
    let status = Object.entries(STATUSES).filter(
      ([_, text]) => text === value
    )[0];

    if (!Array.isArray(status)) {
      filteredResults = [];
    } else {
      filteredResults = await getMyRequestsByStatus(from, to, status[0]);
      this.myRequests = append
        ? [...this.myRequests, ...filteredResults]
        : filteredResults;
    }
  }
}
