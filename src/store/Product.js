import { makeAutoObservable } from 'mobx';
import { getProducts } from '../service/ProductService';

export default class ProductStore {
    products = [];

    constructor() {
        makeAutoObservable(this)
    }

    async loadProducts() {
        this.products = await getProducts();
    }
}