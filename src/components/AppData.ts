import { FormErrors } from './../types/index';
import { IAppState, IOrder, IProduct, TBasketItem } from '../types';
import { Model } from './base/Model';

export class AppState extends Model<IAppState> {
  catalog: IProduct[];
  preview: string;
  basket: TBasketItem[] = [];
  order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: [],
  };
  protected FormErrors: FormErrors = {};

  setCatalog(catalog: IProduct[]) {
    this.catalog = catalog;
  }

  setPreview(product: IProduct) {
    this.preview = product.id;
    this.emitChanges('product:select', product);
  }

  addProductToBasket(product: IProduct) {
    this.basket.push(product);
  }

  removeProductFromBasket(product: IProduct) {
    this.basket = this.basket.filter((item) => item.id !== product.id);
  }

  clearBasket() {
    this.basket = [];
  }

  clearOrder() {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: [],
    };
  }

  setOrderPayment(value: string) {
    this.order.payment = value;
  }

  setOrderAddress(value: string) {
    this.order.address = value;
  }

  setOrderEmail(value: string) {
    this.order.email = value;
  }

  setOrderPhone(value: string) {
    this.order.phone = value;
  }

  getTotal() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }

  updateOrder() {
    this.order.total = this.getTotal();
    this.order.items = this.basket.map((item) => item.id);
  }
}
