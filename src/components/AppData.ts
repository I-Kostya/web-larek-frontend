import { FormErrors, IOrderForm, TPreviewItem } from './../types/index';
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
  protected formErrors: FormErrors = {};

  setCatalog(catalog: IProduct[]) {
    this.catalog = catalog;
    this.emitChanges('catalog:changed', { catalog: this.catalog });
  }

  setPreview(product: TPreviewItem) {
    this.preview = product.id;
    this.emitChanges('preview:changed', product);
  }

  getPreviewButton(item: IProduct) {
    if (item.price === null) {
      return 'unavailable';
    } else return 'addToBasket';
  }

  addProductToBasket(product: TBasketItem) {
    this.basket.push(product);
  }

  removeProductFromBasket(product: TBasketItem) {
    const index = this.basket.indexOf(product);
    if (index >= 0) {
      this.basket.splice(index, 1);
    }
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

  getTotal() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }

  updateOrder() {
    this.order.total = this.getTotal();
    this.order.items = this.basket.map((item) => item.id);
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setContactsField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};

    if(!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}
