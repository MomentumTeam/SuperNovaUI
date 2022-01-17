import { action, makeAutoObservable, observable } from "mobx";
import { isAPIAlive } from "../service/HealthService";

class HealthStore {
  isApiHealthy = true;
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {
      isApiHealthy: observable,
      isLoading: observable,
      loadHealth: action,
    });
  }

  async loadHealth() {
    console.log("loadhealth, is loading: ", this.isLoading, " health: ", this.isApiHealthy);
    if (!this.isLoading) {
      this.isLoading = true;
      const isAlive = await isAPIAlive();
      console.log(isAlive)
      if (!isAlive) {
        this.isLoading = false;
        this.isApiHealthy = false;
        if (window.location.pathname !== "/503") window.location.replace("/503");
      } else {
        this.isApiHealthy = true;
      }

      console.log("res loadhealth,  health res: ", isAlive);
      this.isLoading = false;
    }
  }
}

const healthStore = new HealthStore();
export default healthStore;
