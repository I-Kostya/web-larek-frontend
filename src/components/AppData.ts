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
    this.emitChanges('catalog:changed', { catalog: this.catalog });
  }

  setPreview(product: IProduct) {
    this.preview = product.id;
    this.emitChanges('preview:changed', product);
  }

  getPreviewButton(item: IProduct) {
    if (item.price === null) {
      return 'unavailable';
    }
    else return 'addToBasket';   
  }

  toggleBasketItem(item: IProduct) {
    return !this.basket.some((card) => card.id === item.id)
      ? this.addProductToBasket(item)
      : this.removeProductFromBasket(item);
  }

  addProductToBasket(product: TBasketItem) {
    this.basket.push(product);
  }

  removeProductFromBasket(product: TBasketItem) {
    const index = this.basket.indexOf(product);
    if (index >= 0) {
      this.basket.splice( index, 1 );
    }
  }

  setBasketIndex(item: TBasketItem) {
    return this.basket.indexOf(item) + 1;
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
