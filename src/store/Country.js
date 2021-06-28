import { makeAutoObservable } from 'mobx';
import { getCountries } from '../service/CountryService';

export default class CountriesStore {
    countries = [];

    constructor() {
        makeAutoObservable(this)
    }

    bla() {
        alert('hi');
    }

    async loadContries() {
        this.countries = await getCountries();
    }
}