import { action, makeAutoObservable, observable } from 'mobx';
import { getProducts } from '../service/ProductService';

export default class ProductStore {
    products = [];

    constructor() {
        makeAutoObservable(this, {
            products: observable,
            loadProducts: action
        })
    }

    async loadProducts() {
        this.products = await getProducts();
    }
}