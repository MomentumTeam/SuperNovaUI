import { action, makeAutoObservable, observable } from 'mobx';
import { getCountries } from '../service/CountryService';
export default class CountriesStore {
  countries = [];

  constructor() {
    makeAutoObservable(this, {
      countries: observable,
      loadContries: action,
    });
  }

  async loadContries() {
    this.countries = await getCountries();
  }
}
